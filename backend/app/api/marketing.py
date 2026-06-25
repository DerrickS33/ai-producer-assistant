from fastapi import APIRouter, HTTPException

from app.schemas.marketing import BeatInfo, MarketingKit
from app.services.openai_service import generate_marketing_kit_with_ai

router = APIRouter()


@router.post("/api/generate", response_model=MarketingKit)
def generate_marketing_kit(beat: BeatInfo):
    try:
        return generate_marketing_kit_with_ai(beat)

    except Exception as error:
        print("OpenAI generation error:", error)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate marketing kit",
        )