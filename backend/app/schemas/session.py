from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Optional

class SessionCreate(BaseModel):
    """Schema for creating a new anonymous session."""
    preferences: Optional[Dict[str, Any]] = {}

class SessionResponse(BaseModel):
    """Response when creating a session."""
    token: str
    created_at: datetime

    class Config: 
        from_attributes = True

class SessionStatus(BaseModel):
    """User session statistics."""
    token: str
    total_tasks: int
    correct_answers: int
    current_streak: int
    best_streak: int
    accuracy: float
    level: int
    xp: int
    last_active: datetime
    preferences: Dict[str, Any]

    class Config: 
        from_attributes = True

class HealthCheck(BaseModel):
    """Health check response."""
    status: str
    session_valid: bool
    timestamp: datetime