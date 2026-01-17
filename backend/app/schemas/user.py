from typing import List, Optional
from datetime import date, datetime  # <--- NEW IMPORT
from pydantic import BaseModel
from beanie import Document, Indexed

class LanguageProgress(BaseModel):
    language: str              
    level: str                 
    completed_lessons: List[str] 
    last_lesson_rating: Optional[int] = None 
    previous_lesson_notes: Optional[str] = None 

class User(Document):
    email: Indexed(str, unique=True)
    password_hash: str
    first_name: str
    
    # Stats
    daily_streak: int = 0
    last_active_date: Optional[date] = None # <--- NEW: Tracks streak
    
    total_lessons_completed: int = 0
    total_time_spent: int = 0 # <--- NEW: Minutes spent learning
    
    last_lesson_language: Optional[str] = None
    languages_studied: List[LanguageProgress] = []

    class Settings:
        name = "users"
        
class UserSignup(BaseModel):
    email: str
    password_hash: str
    first_name: str