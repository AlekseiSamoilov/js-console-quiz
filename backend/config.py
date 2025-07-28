from pydantic_settings import BaseSettings
from typing import Optional, List
import secrets

class Settings(BaseException):
        # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "JS Console Quiz API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for JavaScript Console Quiz application"
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: Optional[str] = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "quiz_user"
    POSTGRES_PASSWORD: str = "quiz_password"
    POSTGRES_DB: str = "js_console_quiz"
    
    # CORS - can be comma-separated string or list
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    
    # Session settings
    SESSION_CLEANUP_DAYS: int = 90
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    AUTO_CREATE_TABLES: bool = True
    ENABLE_DOCS: bool = True

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
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert ALLOWED_ORIGINS string to list"""
        if isinstance(self.ALLOWED_ORIGINS, str):
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        return self.ALLOWED_ORIGINS


settings = Settings()