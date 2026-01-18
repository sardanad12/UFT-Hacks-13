from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Internal imports
from app.core.config import settings
from app.core.database import init_db
from app.api.routes import health, auth, lessons, chat

# 1. Define the Lifespan Context Manager
# This replaces the old "startup" and "shutdown" events.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
    try:
        await init_db()
        print("Startup: Connected to MongoDB via Beanie!")
    except Exception as e:
        print(f"Startup Error: Could not connect to DB - {e}")
    
    yield # The application runs while the code halts here
    
    # --- Shutdown Logic (Optional) ---
    print("Shutdown: Closing connections...")

# 2. Define the Application Factory
def get_application() -> FastAPI:
    # Pass the lifespan manager into the FastAPI constructor
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan 
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register Routers
    app.include_router(health.router, prefix=settings.API_PREFIX)
    app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
    app.include_router(lessons.router, prefix=f"{settings.API_PREFIX}/lessons", tags=["Lessons"])
    app.include_router(chat.router, prefix=f"{settings.API_PREFIX}/chat", tags=["Chat"])

    return app

# 3. Create the App Instance
app = get_application()

# 4. Debug Entry Point
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)