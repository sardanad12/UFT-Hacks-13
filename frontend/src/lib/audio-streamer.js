/**
 * Handles playing raw PCM audio chunks smoothly using the Web Audio API.
 */
export class AudioStreamer {
  constructor(context) {
    this.context = context;
    this.audioQueue = [];
    this.isPlaying = false;
    this.sampleRate = 24000; // Gemini 2.0 Flash usually defaults to 24kHz
    this.scheduledTime = 0;
  }

  /**
   * Adds raw PCM data (ArrayBuffer) to the queue.
   */
  addPCM16(chunk) {
    const float32Array = this.convertPCM16ToFloat32(chunk);
    const buffer = this.context.createBuffer(1, float32Array.length, this.sampleRate);
    buffer.getChannelData(0).set(float32Array);
    
    this.audioQueue.push(buffer);
    this.scheduleNextBuffer();
  }

  scheduleNextBuffer() {
    if (this.audioQueue.length === 0) return;

    // Ensure we don't schedule in the past
    const currentTime = this.context.currentTime;
    if (this.scheduledTime < currentTime) {
      this.scheduledTime = currentTime;
    }

    const buffer = this.audioQueue.shift();
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    
    source.start(this.scheduledTime);
    this.scheduledTime += buffer.duration;
  }

  convertPCM16ToFloat32(buffer) {
    const dataView = new DataView(buffer);
    const float32 = new Float32Array(buffer.byteLength / 2);
    
    for (let i = 0; i < float32.length; i++) {
      // Convert int16 to float32 (-1.0 to 1.0)
      const int16 = dataView.getInt16(i * 2, true); // Little-endian
      float32[i] = int16 / 32768;
    }
    return float32;
  }
}