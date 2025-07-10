from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TaskAttempt(Base):
    __tablename__ = 'task_attempts'

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String(50), ForeignKey("anonumous_sessions.token"), nullable=False)


    #Task Info 
    task_id = Column(String(50), nullable=False)
    difficulty = Column(String(10), nullable=False)

    #User interaction
    user_answer = Column(Text)
    excepted_output = Column(text)
    isCorrect = Column(Boolean, nullable=False)
    response_time_ms = Column(Integer) 

    #Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    #Relationship
    session = relationship("AnonymousSession", back_populates="task_attempts")

class GeneratedTask(Base):
    """Optional: Store generated tasks for caching/analytics."""
    __tablename__ = "generated_tasks"

    id = Column(String(50), primary_key=True, index=True)
    difficulty = Column(String(10), nullable=False)
    code = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)

    #Metadata
    blocks_used = Column(String(200))
    generation_time_ms = Column(Integer)

    time_served = Column(Integer, default=0)
    success_rate = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    