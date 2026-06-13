import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=f"""
You are an expert music marketing assistant for online beat producers.

Generate a marketing kit for this beat:

Title: {beat.title}
Genre: {beat.genre}
Mood: {beat.mood}
BPM: {beat.bpm}
Key: {beat.key}

Return only valid JSON. Do not include markdown, explanations, or code blocks.

Use this exact JSON structure:
{{
  "beat_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "youtube_titles": ["title1", "title2", "title3"],
  "description": "description text",
  "artist_matches": ["artist1", "artist2", "artist3"],
  "social_caption": "caption text",
  "cover_art_prompt": "cover art prompt text"
}}
""",
        )

        content = response.output_text.strip()

        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()

        if content.startswith("```"):
            content = content.replace("```", "").strip()

        return json.loads(content)

    except Exception as error:
        print("OpenAI generation error:", error)
        print("Raw content:", content if "content" in locals() else "No content returned")
        raise HTTPException(status_code=500, detail="Failed to generate marketing kit")