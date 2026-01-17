# app/schemas/auth.py
from pydantic import BaseModel, EmailStr

# What the frontend sends
class LoginRequest(BaseModel):
    username: str
    password_hash: str  # Assuming frontend sends the pre-hashed string

# What the backend returns to populate the dashboard
class UserProfile(BaseModel):
    id: int
    username: str
    full_name: str
    email: EmailStr
    role: str = "user"