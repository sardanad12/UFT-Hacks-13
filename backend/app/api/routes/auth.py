from fastapi import APIRouter, HTTPException
from app.schemas.user import User
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password_hash: str

@router.post("/login", response_model=User)
async def login(credentials: LoginRequest):
    # MongoDB Query: Find one document where email matches
    # fetch_links=True is useful if you ever reference other documents
    user = await User.find_one(User.email == credentials.email)

    if not user or user.password_hash != credentials.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Beanie/Pydantic will automatically convert the MongoDB BSON to JSON
    # AND exclude the password_hash if you use a response_model that excludes it.
    return user