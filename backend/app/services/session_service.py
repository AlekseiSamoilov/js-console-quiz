import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional, Dict, Any
import logging

from app.models.session import AnonymousSession
from app.schemas.session import SessionCreate


logger = logging.getLogger(__name__)

class SessionService:
    """Service for managing anonymous user sessions."""

    @staticmethod
    def generate_token() -> str:
        """Generate a unique token for the session."""
        return f"anon_{uuid.uuid4().hex}"
    
    @staticmethod
    async def create_session(
        db: AsyncSession,
        session_data: SessionCreate
    ) -> AnonymousSession:
        """Create a new anonymous session."""
        token = SessionService.generate_token()

        session = AnonymousSession(
            token=token,
            preference=session_data.preferences or {}
        )

        db.add(session)
        await db.commit()
        await db.refresh(session)

        logger.info(f"Created new session: {token[:12]}...")
        return session
    
    @staticmethod
    async def get_session(
        db: AsyncSession,
        token: str
    ) -> Optional[AnonymousSession]:
        """Get session by token."""
        result = await db.execute(
            select(AnonymousSession).where(AnonymousSession.token == token)
        )
        session = result.scalar_one_or_none()

        if session: 
            await SessionService.update_last_active(db, token)

        return session
    
    @staticmethod
    async def update_last_active(
        db: AsyncSession,
        token: str
    ) -> None: 
        """Update the last_active timestamp for a session."""
        await db.execute(
            update(AnonymousSession)
            .where(AnonymousSession.token == token)
            .values(last_active=datetime.utcnow())
        )
        await db.commit()

    @staticmethod
    async def update_session_stats(
        db: AsyncSession,
        token: str,
        is_correct: bool
    ) -> None:
        """Update session statistics after a task attempt"""
        session = await SessionService.get_session(db, token)
        if not session:
            return
        
        # Update totals
        session.total_tasks += 1
        if is_correct:
            session.correct_answers += 1
            session.current_streak += 1
            # Update best streak if current is better
            if session.current_streak > session.best_streak:
                session.best_streak = session.current_streak
        else:
            session.current_streak = 0
        
        await db.commit()
        await db.refresh(session)
        
        logger.info(f"Updated stats for session {token[:12]}...: "
                   f"tasks={session.total_tasks}, correct={session.correct_answers}, "
                   f"streak={session.current_streak}")
            