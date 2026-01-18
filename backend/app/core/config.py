from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "LinguaLearn Microservice"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Example of a secure setting (reads from env var or defaults to localhost)
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    
    MONGODB_URL: str
    
    # Allow extra fields like GOOGLE_API_KEY without validation errors
    model_config = ConfigDict(extra='ignore', env_file=".env")

settings = Settings()
