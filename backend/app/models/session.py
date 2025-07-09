from sqlalchemy import JSON, Column, DateTime, Integer, String, func
from app.core.database import Base
from sqlalchemy.orm import relationship

class AnonynousSession(Base):
    __tablename__ =  "anonymouse_sessions"

    token = Column(String(50), primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Statisstics
    total_tasks = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    
    preferences = Column(JSON, default=lambda: {})
    
    task_attempts = relationship("TaskAttempt", back_populates = "session", cascade="all, delete-orphan")

    @property
    def accuracy(self) -> float:
        """Calculate accurace percentage."""
        if self.total_tasks == 0:
            return 0.0
        return round(self.correct_answers / self.total_tasks, 3)
    
    @property
    def level(self) -> int:
        """Calculate user level based on xp"""
        return min(self.total_tasks // 10 + 1, 100)
    
    @property
    def xp(self) -> int:
        """Calculate experience points"""
        return self.correct_answers * 10 + self.best_streak * 5
