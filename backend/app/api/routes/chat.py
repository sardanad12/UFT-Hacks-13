import asyncio
import json
import base64
import os
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from google import genai
from google.genai import types
from app.core.config import settings

router = APIRouter()

# --- CONFIGURATION FROM YOUR SNIPPET ---
MODEL = "models/gemini-2.0-flash-exp"  # Updated to latest valid ID for 2.0 Flash
# Note: "native-audio-preview" is often an alias; "gemini-2.0-flash-exp" is the standard experimental endpoint.

# Initialize Client
client = genai.Client(
    http_options={"api_version": "v1beta"},
    api_key=settings.GEMINI_API_KEY
)

# Configuration from your snippet
GEMINI_CONFIG = types.LiveConnectConfig(
    response_modalities=["AUDIO"],  # We want audio back
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Orus")
        )
    ),
)

@router.websocket("/ws")
async def websocket_endpoint(client_ws: WebSocket):
    await client_ws.accept()
    print("Frontend connected.")

    try:
        # Connect to Gemini using the SDK's async context manager
        async with client.aio.live.connect(model=MODEL, config=GEMINI_CONFIG) as session:
            print("Connected to Gemini Live API")

            # --- 1. SEND HIDDEN TRIGGER (To make Gemini speak first) ---
            # We treat this as a "client_content" turn to wake it up.
            await session.send(
                input="The user has connected. Say 'Hello, I am Orus. Ready to start?'",
                end_of_turn=True
            )

            # --- 2. DEFINE BACKGROUND TASKS ---
            
            # Task A: Receive from Frontend -> Send to Gemini
            async def receive_from_frontend():
                try:
                    while True:
                        # Expecting JSON: { "realtime_input": { "media_chunks": [...] } }
                        data = await client_ws.receive_json()
                        
                        # Just pass the whole payload directly to Gemini
                        # The SDK's 'send' method is smart, but for raw JSON passing, 
                        # we might need to parse. 
                        
                        # If the frontend sends raw PCM base64, we wrap it:
                        if "realtime_input" in data:
                            for chunk in data["realtime_input"]["media_chunks"]:
                                # Send audio chunk to Gemini
                                await session.send(
                                    input={"data": chunk["data"], "mime_type": "audio/pcm"},
                                    end_of_turn=False # Keep channel open
                                )
                                
                except WebSocketDisconnect:
                    print("Frontend disconnected")
                except Exception as e:
                    print(f"Error receiving from frontend: {e}")

            # Task B: Receive from Gemini -> Send to Frontend
            async def receive_from_gemini():
                try:
                    while True:
                        async for response in session.receive():
                            # The SDK returns a 'LiveConnectResponse' object
                            server_content = response.server_content
                            
                            if server_content is None:
                                continue

                            model_turn = server_content.model_turn
                            
                            if model_turn:
                                for part in model_turn.parts:
                                    # Handle Audio
                                    if part.inline_data:
                                        # Send Base64 Audio to Frontend
                                        await client_ws.send_json({
                                            "audio": base64.b64encode(part.inline_data.data).decode("utf-8")
                                        })
                                    
                                    # Handle Text (if any)
                                    if part.text:
                                        print(f"Gemini: {part.text}")

                            if server_content.turn_complete:
                                print("Gemini finished speaking.")
                                
                except Exception as e:
                    print(f"Error receiving from Gemini: {e}")

            # Run both tasks indefinitely
            await asyncio.gather(receive_from_frontend(), receive_from_gemini())

    except Exception as e:
        print(f"Connection Error: {e}")
    finally:
        await client_ws.close()