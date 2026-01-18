import os
import asyncio
import subprocess
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from google import genai
from app.core.config import settings

router = APIRouter()

GEMINI_MODEL = "gemini-2.0-flash-exp"

# Validate Key
if not settings.GEMINI_API_KEY:
    print("CRITICAL: GEMINI_API_KEY is missing in .env")

client = genai.Client(api_key=settings.GEMINI_API_KEY, http_options={"api_version": "v1alpha"})

@router.websocket("/gemini-live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WS: Client connected")

    # 1. Start FFmpeg (Persistent)
    # Added '-f webm' to explicitly tell FFmpeg the input format
    # Added stderr=asyncio.subprocess.PIPE to capture errors
    ffmpeg_cmd = [
        'ffmpeg',
        '-f', 'webm',               # Force input format
        '-i', 'pipe:0',             # Read from stdin
        '-f', 's16le',              # Output format
        '-acodec', 'pcm_s16le',     # Audio codec
        '-ac', '1',                 # Channels
        '-ar', '16000',             # Sample Rate
        'pipe:1'                    # Write to stdout
    ]
    
    process = await asyncio.create_subprocess_exec(
        *ffmpeg_cmd,
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE  # Capture stderr for debugging
    )
    
    print(f"FFMPEG: Started PID {process.pid}")

    config = {"response_modalities": ["AUDIO"]}
    
    try:
        async with client.aio.live.connect(model=GEMINI_MODEL, config=config) as session:
            print("GEMINI: Connected to Live API")

            # --- TASK 1: Browser -> FFmpeg ---
            async def receive_from_browser():
                try:
                    while True:
                        message = await websocket.receive()
                        if "bytes" in message:
                            data = message["bytes"]
                            # print(f"INPUT: Received {len(data)} bytes from Browser") # Uncomment if spammy
                            
                            process.stdin.write(data)
                            await process.stdin.drain()
                        elif "text" in message:
                            print(f"INPUT: Text message: {message['text']}")
                except WebSocketDisconnect:
                    print("WS: Disconnected")
                except Exception as e:
                    print(f"INPUT ERROR: {e}")
                finally:
                    process.stdin.close()

            # --- TASK 2: FFmpeg -> Gemini ---
            async def send_to_gemini():
                try:
                    while True:
                        # Read larger chunks (4KB) to ensure valid PCM frames
                        data = await process.stdout.read(4096)
                        if not data:
                            print("FFMPEG: Output stream ended")
                            break
                        
                        # print(f"TRANSCODE: Sending {len(data)} PCM bytes to Gemini") # Uncomment if spammy
                        await session.send(input={"data": data, "mime_type": "audio/pcm"}, end_of_turn=False)
                except Exception as e:
                    print(f"TRANSCODE ERROR: {e}")

            # --- TASK 3: Gemini -> Browser ---
            async def receive_from_gemini():
                try:
                    while True:
                        async for response in session.receive():
                            if response.server_content and response.server_content.model_turn:
                                for part in response.server_content.model_turn.parts:
                                    if part.inline_data:
                                        audio = part.inline_data.data
                                        print(f"OUTPUT: Gemini sent {len(audio)} bytes audio")
                                        await websocket.send_bytes(audio)
                except Exception as e:
                    print(f"OUTPUT ERROR: {e}")

            # --- TASK 4: Monitor FFmpeg Errors ---
            async def monitor_ffmpeg_errors():
                while True:
                    line = await process.stderr.readline()
                    if not line: break
                    # Only print actual errors/warnings, skip routine info
                    line_str = line.decode().strip()
                    if "Error" in line_str or "Invalid" in line_str:
                         print(f"FFMPEG LOG: {line_str}")

            await asyncio.gather(
                receive_from_browser(),
                send_to_gemini(),
                receive_from_gemini(),
                monitor_ffmpeg_errors()
            )

    except Exception as e:
        print(f"SESSION ERROR: {e}")
    finally:
        if process.returncode is None:
            process.terminate()
        await websocket.close()
        print("CLEANUP: Connection closed")