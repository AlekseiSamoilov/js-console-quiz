from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.models.session import AnonymousSession
from app.services.session_service import SessionService

async def get_current_session(
        authorization: Optional[str] = Header(None),
        db: AsyncSession = Depends(get_db)
) -> AnonymousSession:
    """
    Get current session from Authorization header 
    Expected format: "Bearer anon_
    """

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is missing"
        )
    
    try: 
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail = "Invalid authorization scheme."
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail = "Invalid authorization header format"
        )
    
    session = await SessionService.get_session(db, token)
    if not session:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session token"
        )
    
    return session 

async def get_optional_session(
        authorization: Optional[str] = Header(None),
        db: AsyncSession = Depends(get_db)
) -> Optional[AnonymousSession]:
    """
    Get current session if provided, otherwise return None
    Used for endpoints that work both with and without authentication
    """

    if not authorization:
        return None
    
    try: 
        scheme, token = authorization.split(" ", 1)
        if scheme.lower != "bearer":
            return None
        
        session = await SessionService.get_session(db, token)
        return session
    except (ValueError, Exception):
        return None