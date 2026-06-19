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
def estimate_key(y, sr):
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    chroma_mean = chroma.mean(axis=1)

    notes = [
        "C", "C#", "D", "D#", "E", "F",
        "F#", "G", "G#", "A", "A#", "B"
    ]

    major_profile = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
    minor_profile = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]

    scores = []

    for i in range(12):
        major_score = sum(chroma_mean[j] * major_profile[(j - i) % 12] for j in range(12))
        minor_score = sum(chroma_mean[j] * minor_profile[(j - i) % 12] for j in range(12))

        scores.append((major_score, notes[i], "major"))
        scores.append((minor_score, notes[i], "minor"))

    best_score = max(scores, key=lambda item: item[0])

    return f"{best_score[1]} {best_score[2]}"
   
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
        detected_key = estimate_key(y, sr)

        return {
            "filename": audio_file.filename,
            "duration_seconds": round(duration, 2),
            "bpm": round(float(tempo[0])),
            "key": detected_key,
    }

    except Exception as error:
        print("Audio analysis error:", error)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze audio file",
        )