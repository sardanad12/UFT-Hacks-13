"""
Real-time Speaking Practice with Gemini 2.5 Flash Live Audio API
This uses WebSocket for bidirectional audio streaming - like a real conversation!

Key Configuration:
- MODEL: gemini-2.5-flash (supports native audio I/O)
- VOICE_CONFIG: How Gemini speaks back to you
- SYSTEM_INSTRUCTIONS: Customize AI tutor personality per language
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from google import genai
import json
import base64
import asyncio
from app.core.config import settings

router = APIRouter()

# ============================================
# CONFIGURATION - Customize AI behavior here
# ============================================

# Gemini model with Live API support
MODEL = "models/gemini-2.5-flash"

# Voice configuration - customize how AI speaks
# Options: Monst, Peach, Puck, Alloy, Charon, Coral, Echo, Kore, Orbit, Sage, Verse
VOICE_NAME = "Puck"  # Change to your preferred voice

# System instructions per language
# Modify these to change tutor personality and teaching style
LANGUAGE_INSTRUCTIONS = {
    "Spanish": """You are a friendly Spanish tutor from Spain or Latin America. 
    Speak naturally in Spanish with a conversational tone. 
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "French": """You are a friendly French tutor from France.
    Speak naturally in French with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "German": """You are a friendly German tutor from Germany.
    Speak naturally in German with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "Italian": """You are a friendly Italian tutor from Italy.
    Speak naturally in Italian with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "Portuguese": """You are a friendly Portuguese tutor from Brazil or Portugal.
    Speak naturally in Portuguese with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "Hindi": """You are a friendly Hindi tutor. Speak in a natural Mumbai/Delhi dialect.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "Chinese": """You are a friendly Mandarin Chinese tutor.
    Speak naturally in Mandarin with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "Japanese": """You are a friendly Japanese tutor from Japan.
    Speak naturally in Japanese with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
    
    "Korean": """You are a friendly Korean tutor from South Korea.
    Speak naturally in Korean with a conversational tone.
    Keep responses brief (2-3 sentences) so the conversation flows naturally.
    In ASSISTED mode: gently correct mistakes and offer tips.
    In NON-ASSISTED mode: just have a natural conversation.""",
}

# Get API key from environment (.env via Settings)
API_KEY = settings.GEMINI_API_KEY
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not set - WebSocket audio will not work!")

# ============================================
# HELPER FUNCTIONS
# ============================================

def build_system_instruction(language: str, topic: str, mode: str) -> str:
    """
    Builds the system instruction for Gemini based on user settings.
    
    Args:
        language: Target language (Spanish, French, etc.)
        topic: Conversation topic (Greetings, Travel, etc.)
        mode: Assisted or Non-Assisted
        
    Returns:
        Complete system instruction string
    """
    base = LANGUAGE_INSTRUCTIONS.get(language, "You are a friendly language tutor.")
    topic_instruction = f"\nFocus the conversation on: {topic}. Use relevant vocabulary naturally."
    return base + topic_instruction


def create_gemini_config(language: str, topic: str, mode: str) -> dict:
    """
    Creates configuration for Gemini Live API.
    
    Customize these settings to change AI behavior:
    - voice_name: Which voice to use (Puck, Alloy, etc.)
    - response_modalities: ["AUDIO"] for voice responses
    - system_instruction: AI personality and behavior
    
    Args:
        language, topic, mode: User conversation settings
        
    Returns:
        Configuration dictionary for Gemini
    """
    return {
        "generation_config": {
            "response_modalities": ["AUDIO"],  # AI responds with audio
            "speech_config": {
                "voice_config": {"prebuilt_voice_config": {"voice_name": VOICE_NAME}}
            }
        },
        "system_instruction": build_system_instruction(language, topic, mode)
    }


# ============================================
# WEBSOCKET ENDPOINT - Real-time Audio Chat
# ============================================

@router.websocket("/ws/audio-chat")
async def websocket_audio_chat(websocket: WebSocket):
    """
    WebSocket endpoint for real-time bidirectional audio chat with Gemini.
    
    Flow:
    1. Client connects and sends initial settings (language, topic, mode)
    2. Backend establishes Gemini Live API connection
    3. Client streams audio chunks → sent to Gemini
    4. Gemini streams audio responses → sent back to client
    5. Client plays audio in browser
    
    Message Format from Client:
    - {"type": "config", "language": "Spanish", "topic": "Travel", "mode": "Assisted"}
    - {"type": "audio", "data": "base64_encoded_audio_chunk"}
    - {"type": "end_turn"}  # User finished speaking
    - {"type": "close"}  # End conversation
    
    Message Format to Client:
    - {"type": "audio", "data": "base64_encoded_audio"}
    - {"type": "text", "data": "transcript_text"}  # Optional
    - {"type": "error", "message": "error_description"}
    """
    await websocket.accept()
    print("✅ WebSocket connected - ready for audio chat")
    
    gemini_session = None
    
    try:
        # Wait for initial configuration from client
        config_message = await websocket.receive_text()
        config_data = json.loads(config_message)
        
        if config_data.get("type") != "config":
            await websocket.send_json({"type": "error", "message": "First message must be config"})
            return
        
        language = config_data.get("language", "Spanish")
        topic = config_data.get("topic", "Greetings")
        mode = config_data.get("mode", "Assisted")
        
        print(f"📝 Config: {language} | {topic} | {mode}")
        
        # Initialize Gemini client
        if not API_KEY:
            await websocket.send_json({"type": "error", "message": "API key not configured"})
            return
            
        client = genai.Client(
            api_key=API_KEY,
            http_options={'api_version': 'v1alpha'}
        )
        
        # Create Gemini configuration
        gemini_config = create_gemini_config(language, topic, mode)
        
        # Open connection to Gemini Live API
        async with client.aio.live.connect(model=MODEL, config=gemini_config) as session:
            gemini_session = session
            print("🚀 Connected to Gemini Live API")
            
            # Send ready signal to client
            await websocket.send_json({"type": "ready"})
            
            # Create tasks for bidirectional streaming
            async def receive_from_client():
                """Receives audio from client and sends to Gemini"""
                try:
                    while True:
                        message = await websocket.receive_text()
                        data = json.loads(message)
                        
                        if data.get("type") == "audio":
                            # Decode base64 a audio and send to Gemini
                            audio_bytes = base64.b64decode(data["data"])
                            await session.send(audio_bytes, end_of_turn=False)
                            
                        elif data.get("type") == "end_turn":
                            # User stopped speaking - signal end of turn
                            await session.send(b"", end_of_turn=True)
                            print("🎤 User finished speaking")
                            
                        elif data.get("type") == "close":
                            print("👋 Client requested close")
                            break
                            
                except WebSocketDisconnect:
                    print("❌ Client disconnected")
                except Exception as e:
                    print(f"❌ Error receiving from client: {e}")
            
            async def send_to_client():
                """Receives responses from Gemini and sends to client"""
                try:
                    async for response in session.receive():
                        if response.server_content and response.server_content.model_turn:
                            # Gemini is speaking - extract audio
                            for part in response.server_content.model_turn.parts:
                                if hasattr(part, 'inline_data') and part.inline_data:
                                    # Get audio bytes from Gemini
                                    audio_data = part.inline_data.data
                                    
                                    # Encode as base64 and send to client
                                    audio_b64 = base64.b64encode(audio_data).decode('utf-8')
                                    await websocket.send_json({
                                        "type": "audio",
                                        "data": audio_b64
                                    })
                                    print("🔊 Sent audio chunk to client")
                                    
                        # You can also extract text transcripts if needed
                        # if response.server_content.model_turn.text:
                        #     await websocket.send_json({
                        #         "type": "text",
                        #         "data": response.server_content.model_turn.text
                        #     })
                            
                except Exception as e:
                    print(f"❌ Error sending to client: {e}")
                    await websocket.send_json({"type": "error", "message": str(e)})
            
            # Run both directions concurrently
            await asyncio.gather(
                receive_from_client(),
                send_to_client()
            )
    
    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
    finally:
        # Cleanup
        print("🧹 Closing WebSocket connection")
        try:
            await websocket.close()
        except:
            pass
