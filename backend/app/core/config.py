from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "LinguaLearn Microservice"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Example of a secure setting (reads from env var or defaults to localhost)
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    GEMINI_API_KEY: str
    MONGODB_URL: str
    
    # Load backend/.env reliably regardless of current working directory
    model_config = ConfigDict(
        extra='ignore',
        env_file=str(Path(__file__).resolve().parents[2] / ".env")
    )

settings = Settings()
