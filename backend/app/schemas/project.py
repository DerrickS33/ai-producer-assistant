from pydantic import BaseModel
from typing import Any


class ProjectCreate(BaseModel):
    title: str
    genre: str
    mood: str

    bpm: int
    key: str
    duration_seconds: float
    energy: str

    marketing_kit: dict[str, Any]
    
class ProjectUpdate(ProjectCreate):
    pass