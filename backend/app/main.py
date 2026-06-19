import os
import shutil
import librosa
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File

from app.schemas.marketing import BeatInfo, MarketingKit
from app.services.openai_service import generate_marketing_kit_with_ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI Producer Assistant API is running"}


@app.post("/api/generate", response_model=MarketingKit)
def generate_marketing_kit(beat: BeatInfo):
    try:
        return generate_marketing_kit_with_ai(beat)

    except Exception as error:
        print("OpenAI generation error:", error)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate marketing kit",
        )
    
@app.post("/api/analyze")
async def analyze_audio(audio_file: UploadFile = File(...)):
    try:
        upload_dir = "temp_uploads"
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, audio_file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

        y, sr = librosa.load(file_path)

        duration = librosa.get_duration(y=y, sr=sr)

        tempo, _ = librosa.beat.beat_track(
            y=y,
            sr=sr
        )

        return {
            "filename": audio_file.filename,
            "duration_seconds": round(duration, 2),
            "bpm": round(float(tempo[0]))
    }

    except Exception as error:
        print("Audio analysis error:", error)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze audio file",
        )