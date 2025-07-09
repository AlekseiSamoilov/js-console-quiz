from pydantic_settings import BaseSettings
from typing import Optional
import secrets

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "JS Console Quiz API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for JavaScript Console Quiz application"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 

    # Databae 
    DATABASE_URL: Optional[str] = None
    POSTRGES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "quiz_user"
    POSTGRES_PASSWORD: str = "quiz_password"
    POSTGRES_DB: str = "js_console_quiz"

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

    # Session settings
    SESSION_CLEANUP_DAYS: int = 90

    ENVIROMENT: str = "development"
    DEBUG: bool = True

    class Config: 
        env_file = ".env"
        case_sensitive = True

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
settings = Settings()
