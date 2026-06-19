from pydantic import BaseModel


class BeatInfo(BaseModel):
    title: str
    genre: str
    mood: str
    bpm: int
    key: str
    duration_seconds: float | None = None
    energy: str | None = None


class MarketingKit(BaseModel):
    beat_tags: list[str]
    youtube_titles: list[str]
    description: str
    artist_matches: list[str]
    social_caption: str
    cover_art_prompt: str