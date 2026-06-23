from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    mood = Column(String, nullable=False)

    bpm = Column(Integer, nullable=True)
    key = Column(String, nullable=True)
    duration_seconds = Column(Float, nullable=True)
    energy = Column(String, nullable=True)

    marketing_kit = Column(JSONB, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())