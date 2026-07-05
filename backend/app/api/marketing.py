"""
Marketing generation API routes.

This module provides endpoints for generating AI powered marketing assets
from beat metadata supplied by the user.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.marketing import BeatInfo, MarketingKit
from app.services.openai_service import generate_marketing_kit_with_ai

router = APIRouter()


@router.post("/api/generate", response_model=MarketingKit)
def generate_marketing_kit(beat: BeatInfo):
    """
    Generate a complete marketing kit for a beat.

    The generated response may include:
    - Beat tags
    - Artist matches
    - Genre suggestions
    - Mood suggestions
    - YouTube titles
    - Descriptions
    - Social media captions
    - Cover art prompts
    """
    try:
        return generate_marketing_kit_with_ai(beat)

    except Exception as error:
        # Log the error and return a generic message to the client.
        print("OpenAI generation error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate marketing kit",
        )