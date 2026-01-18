import { useState, useEffect, useCallback, useRef } from "react";
import { AudioStreamer } from "../lib/audio-streamer";

export function useLiveAPI() {
  const [connected, setConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const ws = useRef(null);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const audioStreamer = useRef(null);

  // Initialize Audio Context & Streamer
  useEffect(() => {
    if (!audioContext.current) {
      // Browsers require a user interaction to start audio, but we init the context here.
      // We will "resume" it later just to be safe.
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext.current = new AudioContextClass({
        sampleRate: 24000, // Match Gemini's output rate
      });
      audioStreamer.current = new AudioStreamer(audioContext.current);
    }
  }, []);

  const connect = useCallback(() => {
    // 1. Establish WebSocket Connection
    ws.current = new WebSocket("ws://localhost:8000/api/v1/test/gemini-live");

    ws.current.onopen = () => {
      setConnected(true);
      console.log("WS: Connected to Gemini Bridge");
    };

    ws.current.onmessage = async (event) => {
      // 2. Handle Incoming Audio
      if (event.data instanceof Blob) {
        // Log the size to confirm we are actually getting data
        console.log("WS: Received Audio Blob", event.data.size, "bytes");

        // CRITICAL FIX: Browsers often suspend AudioContext if no user interaction happened.
        // We force it to resume whenever we receive audio.
        if (audioContext.current.state === 'suspended') {
            console.warn("WS: AudioContext is suspended. Attempting to resume...");
            await audioContext.current.resume();
        }

        const arrayBuffer = await event.data.arrayBuffer();
        
        // Pass to our AudioStreamer to schedule playback
        audioStreamer.current.addPCM16(arrayBuffer);
      } else {
        console.log("WS: Received Non-Audio Message:", event.data);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log("WS: Connection Closed");
    };

    ws.current.onerror = (err) => {
      console.error("WS: Error", err);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }
    setConnected(false);
  }, []);

  const startRecording = async () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("Cannot record: WebSocket is not open");
      return;
    }

    try {
      // 3. Capture Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use "audio/webm" - this is what our FFmpeg backend expects
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.current.readyState === WebSocket.OPEN) {
          // Send raw WebM chunk to backend
          ws.current.send(event.data);
        }
      };

      // Start recording, sending chunks every 100ms
      mediaRecorder.current.start(100); 
      setIsRecording(true);
      console.log("Mic: Recording started");
    } catch (err) {
      console.error("Mic: Error accessing microphone", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      console.log("Mic: Recording stopped");
    }
  };

  return {
    connect,
    disconnect,
    connected,
    isRecording,
    startRecording,
    stopRecording,
  };
}