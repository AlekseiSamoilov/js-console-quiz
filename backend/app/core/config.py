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
    SECRET_KEY: str = secrets.token_urlsage(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 

    # Databae 
    DATABASE_URL: Optional[str] = None
    POSTRGES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "quiz_user"
    POSTGRES_PASSWORD: str = "quiz_password"
    POSTGRES_DB: str = "js_console_quiz"
