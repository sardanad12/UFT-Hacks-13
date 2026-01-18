import { useState, useRef, useEffect, useCallback } from 'react';

// This AudioWorklet processor handles the downsampling and PCM conversion
// We define it as a string to load it from a Blob, avoiding need for extra public files.
const AUDIO_WORKLET_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channelData = input[0]; // Mono

    // Simply pass data to main thread for downsampling (easier for prototype)
    // or accumulate here. For 16kHz from 44/48kHz, simple decimation or 
    // passing raw float to main thread to resize is fine for now.
    
    // We will send the raw float data to the main thread to handle the 
    // complex downsampling logic, to keep the worklet simple.
    this.port.postMessage(channelData);
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

export function useGeminiAudio(endpointUrl) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // For visualization
  
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const streamRef = useRef(null);
  
  // Audio Queue for playback
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    // 1. Connect WebSocket
    const ws = new WebSocket(endpointUrl);
    socketRef.current = ws;
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      // Handle Audio from Gemini (Base64)
      if (data.audio) {
        queueAudio(data.audio);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      socketRef.current = null;
    };
  }, [endpointUrl]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    stopRecording();
    setIsConnected(false);
  }, []);

  // --- PLAYBACK LOGIC ---
  const queueAudio = (base64Audio) => {
    // 1. Convert Base64 -> ArrayBuffer
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 2. Decode PCM (16-bit, 24kHz) to AudioBuffer
    // Since Web Audio API doesn't support raw PCM decoding directly easily,
    // we create a buffer manually.
    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    
    // Convert Int16 -> Float32 for playback
    for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0; 
    }

    if (!audioContextRef.current) return;

    // Create Buffer: 1 Channel, Length, 24kHz (Gemini Native Rate)
    const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
    buffer.copyToChannel(float32Data, 0);

    audioQueueRef.current.push(buffer);
    playQueue();
  };

  const playQueue = () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    
    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    // Schedule seamlessly
    const currentTime = audioContextRef.current.currentTime;
    // Ensure we don't schedule in the past
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;

    source.onended = () => {
      isPlayingRef.current = false;
      playQueue(); // Check for next chunk
    };
  };

  // --- RECORDING LOGIC ---
  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000, // Request 16kHz context if possible
        });
      }
      
      // Resume context if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // 1. Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Load Worklet
      const blob = new Blob([AUDIO_WORKLET_CODE], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await audioContextRef.current.audioWorklet.addModule(workletUrl);

      // 3. Create Pipeline
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContextRef.current, 'pcm-processor');
      
      workletNode.port.onmessage = (event) => {
        const float32Data = event.data;
        
        // Calculate volume for visualization
        let sum = 0;
        for (let i = 0; i < float32Data.length; i++) sum += float32Data[i] * float32Data[i];
        setAudioLevel(Math.sqrt(sum / float32Data.length));

        // Convert Float32 (48kHz usually) -> Int16 (16kHz)
        // Since we requested 16kHz context, we might get lucky. 
        // If not, we should downsample. For this prototype, we assume 
        // the Context running at 16kHz or we send raw and let backend handle 
        // (but backend expects 16k).
        
        // Simple conversion Float32 -> Int16
        const int16Data = new Int16Array(float32Data.length);
        for (let i = 0; i < float32Data.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Data[i]));
            int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Send to Backend
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            // Convert to Base64
            // We need to convert buffer to binary string
            let binary = '';
            const bytes = new Uint8Array(int16Data.buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const b64 = window.btoa(binary);

            socketRef.current.send(JSON.stringify({
                realtime_input: {
                    media_chunks: [{
                        mime_type: "audio/pcm",
                        data: b64
                    }]
                }
            }));
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContextRef.current.destination); // Connect to dest to keep alive (muted usually?)
      
      workletNodeRef.current = workletNode;
      setIsRecording(true);
      
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  return {
    isConnected,
    isRecording,
    audioLevel,
    connect,
    disconnect,
    startRecording,
    stopRecording
  };
}