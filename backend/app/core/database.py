from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.schemas.user import User
from app.core.config import settings
import certifi

async def init_db():
    # Create the Async Motor Client
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tlsCAFile=certifi.where() # <--- Add this argument
    )
    
    # Initialize Beanie with the database and the Document models
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User]
    )