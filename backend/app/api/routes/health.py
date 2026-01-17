from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    Checks the health of the service. 
    Load balancers (like AWS ALB or Kubernetes) use this to monitor uptime.
    """
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": "development"  # In real apps, fetch this from settings
    }