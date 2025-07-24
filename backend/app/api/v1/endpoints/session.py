from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.core.database import get_db
from app.schemas.session import SessionCreate, SessionResponse, SessionStats, HealthCheck
from app.services.session_service import SessionService
from app.api.deps import get_current_session
from app.models.session import AnonymousSession

@router.post("/sessions", response_model=SessionResponse)
async def create_session(
    session_data: SessionCreate = SessionCreate(),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new session
    No authentication required - this creates the initial token
    """
    try: 
        session = await SessionService.create_session(db, session_data)
        return SessionResponse(
            token=session.token,
            created_at=session.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")
    
@router.get('/health', response_model=HealthCheck)
async def health_check(
    session: AnonymousSession = Depends(get_current_session)
):
    """
    Check API health and validate session token
    Requires valid session token in Authorization header
    """
    return HealthCheck(
        status="ok",
        session_valid=True,
        timestamp=datetime.utcnow()
    )

@router.get('/session/stats', response_model=SessionStats)
async def get_session_stats(
    session: AnonymousSession = Depends(get_current_session)
):
    """
    Get current session statistics
    Return user progress, achievements, etc
    """
    return SessionStats(
        token=session.token,
        total_tasks=session.total_tasks,
        correct_answers=session.correct_answers,
        current_strike=session.current_strike,
        best_strike=session.best_strike,
        accuracy=session.accuracy,
        level=session.level,
        xp=session.xp,
        last_active=session.last_active,
        preference=session.preference,
    )

@router.delete('/session')
async def delete_session(
    session: AnonymousSession = Depends(get_current_session),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete current session (reset progress)
    """
    try:
        await db.delete(session)
        await db.commit()
        return {"message": "Session deleted successfully"}
    except Exception as e: 
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete session: {str(e)}"
        )


