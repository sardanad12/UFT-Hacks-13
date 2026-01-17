from typing import List, Optional
from pydantic import BaseModel
from beanie import Document, Indexed

# --- Embedded Models (Nested Data) ---
# These are not separate tables; they live inside the User document.

class LanguageProgress(BaseModel):
    language: str              # e.g., "Spanish"
    level: str                 # [beginner, intermediate, advanced, fluent]
    completed_lessons: List[str] # List of lesson Titles
    last_lesson_rating: Optional[int] = None # 1-5 stars
    previous_lesson_notes: Optional[str] = None # LLM generated notes

# --- The Main Document ---

class User(Document):
    email: Indexed(str, unique=True) # Indexed for fast login lookups
    password_hash: str               # Stored, but never returned in API
    first_name: str
    
    # Gamification & Stats
    daily_streak: int = 0
    total_lessons_completed: int = 0
    last_lesson_language: Optional[str] = None # For "Jump back in"
    
    # The nested list of languages
    languages_studied: List[LanguageProgress] = []

    class Settings:
        name = "users" # Collection name in MongoDB