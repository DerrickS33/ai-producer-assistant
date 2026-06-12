from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BeatInfo(BaseModel):
    title: str
    genre: str
    mood: str
    bpm: int
    key: str


@app.get("/")
def root():
    return {"message": "AI Producer Assistant API is running"}


@app.post("/api/generate")
def generate_marketing_kit(beat: BeatInfo):
    return {
        "beat_tags": [
            beat.genre,
            beat.mood,
            f"{beat.bpm} BPM",
            beat.key,
            "type beat",
        ],
        "youtube_titles": [
            f"{beat.mood} {beat.genre} Type Beat - '{beat.title}'",
            f"{beat.title} | {beat.genre} Type Beat",
            f"{beat.mood} {beat.genre} Instrumental {beat.bpm} BPM",
        ],
        "description": f"'{beat.title}' is a {beat.mood.lower()} {beat.genre.lower()} beat in {beat.key} at {beat.bpm} BPM. Perfect for artists looking for a polished, modern sound.",
        "artist_matches": [
            "Future",
            "Travis Scott",
            "Metro Boomin",
        ],
        "social_caption": f"New {beat.genre} beat out now. {beat.mood} vibes. Tap in.",
        "cover_art_prompt": f"A cinematic cover art design for a {beat.mood.lower()} {beat.genre.lower()} beat titled '{beat.title}', dark lighting, high contrast, professional album artwork style.",
    }