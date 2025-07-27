import pytest
import pytest_asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient

from app.main import app


class TestSessionEndpoints:
    """Test session-related endpoints"""
    
    @pytest.mark.asyncio
    async def test_create_session(self):
        """Test creating a new session"""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/api/v1/session")
            
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["token"].startswith("anon_")
        assert "created_at" in data
    
    @pytest.mark.asyncio
    async def test_health_check_without_token(self):
        """Test health check without authorization"""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/api/v1/health")
            
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_health_check_with_token(self):
        """Test health check with valid token"""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            # First create a session
            create_response = await ac.post("/api/v1/session")
            token = create_response.json()["token"]
            
            # Then check health
            headers = {"Authorization": f"Bearer {token}"}
            response = await ac.get("/api/v1/health", headers=headers)
            
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["session_valid"] is True
    
    @pytest.mark.asyncio
    async def test_get_session_stats(self):
        """Test getting session statistics"""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            # Create session
            create_response = await ac.post("/api/v1/session")
            token = create_response.json()["token"]
            
            # Get stats
            headers = {"Authorization": f"Bearer {token}"}
            response = await ac.get("/api/v1/session/stats", headers=headers)
            
        assert response.status_code == 200
        data = response.json()
        assert data["token"] == token
        assert data["total_tasks"] == 0
        assert data["correct_answers"] == 0
        assert data["accuracy"] == 0.0
        assert data["level"] == 1
        assert data["xp"] == 0