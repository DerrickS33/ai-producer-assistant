import os

from dotenv import load_dotenv
from openai import OpenAI

from app.schemas.marketing import BeatInfo, MarketingKit

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_marketing_kit_with_ai(beat: BeatInfo) -> MarketingKit:
    response = client.responses.parse(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "You are an expert music marketing assistant for online beat producers. "
                    "Generate polished, practical marketing assets for YouTube, BeatStars, "
                    "and social media."
                ),
            },
            {
                "role": "user",
                "content": f"""
Generate a marketing kit for this beat.

Beat title: {beat.title}
Genre: {beat.genre}
Mood: {beat.mood}
BPM: {beat.bpm}
Key: {beat.key}

Requirements:
- Create 8-12 searchable beat tags.
- Create 3 YouTube-ready titles.
- Create a BeatStars-style description.
- Give 3-5 artist matches.
- Create 1 short social media caption.
- Create 1 detailed cover art prompt.
- Keep everything specific to the beat info.
""",
            },
        ],
        text_format=MarketingKit,
    )

    return response.output_parsed