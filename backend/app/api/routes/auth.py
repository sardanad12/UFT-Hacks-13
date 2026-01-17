# app/api/routes/auth.py
from fastapi import APIRouter, HTTPException
from app.schemas.auth import LoginRequest, UserProfile

router = APIRouter()

# --- MOCK DATABASE ---
# In the future, you will replace this with a SQL query.
FAKE_USERS_DB = [
    {
        "id": 1,
        "username": "jdoe",
        "password_hash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", # Example hash for 'password'
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "admin"
    },
    {
        "id": 2,
        "username": "alice",
        "password_hash": "hash_of_alice_password",
        "full_name": "Alice Wonderland",
        "email": "alice@example.com",
        "role": "user"
    }
]

@router.post("/login", response_model=UserProfile)
async def login(credentials: LoginRequest):
    """
    Receives credentials. 
    If valid, returns the user profile.
    If invalid, returns 401 Unauthorized.
    """
    # Loop through our fake DB to find a match
    user_found = None
    for user in FAKE_USERS_DB:
        if (user["username"] == credentials.username and 
            user["password_hash"] == credentials.password_hash):
            user_found = user
            break
    
    if not user_found:
        # Standard generic error message for security
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # If found, return the user data (Pydantic filters out the password_hash automatically!)
    return user_found