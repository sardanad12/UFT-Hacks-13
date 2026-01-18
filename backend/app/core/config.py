from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LinguaLearn Microservice"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Example of a secure setting (reads from env var or defaults to localhost)
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    
    MONGODB_URL: str
    GEMINI_API_KEY: str
    
    class Config:
        env_file = ".env"

settings = Settings()