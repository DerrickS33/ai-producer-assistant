import os
import shutil
from app.database import Base, engine
from app.models.project import Project
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.schemas.marketing import BeatInfo, MarketingKit
from app.services.openai_service import generate_marketing_kit_with_ai
from app.services.audio_analysis_service import analyze_audio_file

app = FastAPI()
Base.metadata.create_all(bind=engine)
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

def suggest_genre_and_moods(bpm, key, energy, brightness, loudness, danceability):
    key_lower = key.lower()

    suggested_genre = "Hip-Hop"
    suggested_moods = ["Focused", "Modern", "Polished"]

    if bpm >= 130 and "minor" in key_lower and energy == "High":
        suggested_genre = "Trap"
        suggested_moods = ["Dark", "Aggressive", "Cinematic"]
    elif bpm >= 120 and energy in ["Medium", "High"]:
        suggested_genre = "Hip-Hop"
        suggested_moods = ["Energetic", "Confident", "Bouncy"]
    elif bpm < 100 and energy == "Low":
        suggested_genre = "R&B"
        suggested_moods = ["Smooth", "Emotional", "Laid-back"]
    elif bpm < 100 and "minor" in key_lower:
        suggested_genre = "Soul"
        suggested_moods = ["Moody", "Warm", "Reflective"]

    if brightness > 2500:
        suggested_moods.append("Bright")
    elif brightness < 1500:
        suggested_moods.append("Dark")

    if loudness > 0.08:
        suggested_moods.append("Punchy")

    if danceability > 0.08:
        suggested_moods.append("Rhythmic")

    return {
        "suggested_genre": suggested_genre,
        "suggested_moods": list(dict.fromkeys(suggested_moods)),
    }
   
@app.post("/api/analyze")
async def analyze_audio(audio_file: UploadFile = File(...)):
    file_path = None

    try:
        allowed_content_types = ["audio/mpeg", "audio/wav", "audio/x-wav"]

        if audio_file.content_type not in allowed_content_types:
            raise HTTPException(
            status_code=400,
            detail="Only MP3 and WAV files are supported.",
        )
        MAX_FILE_SIZE_MB = 25
        MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

        audio_file.file.seek(0, os.SEEK_END)
        file_size = audio_file.file.tell()
        audio_file.file.seek(0)

        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
            status_code=400,
            detail=f"File is too large. Max size is {MAX_FILE_SIZE_MB}MB.",
        )
        upload_dir = "temp_uploads"
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, audio_file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

        return analyze_audio_file(file_path, audio_file.filename)

    except Exception as error:
        print("Audio analysis error:", error)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze audio file",
        )

    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            
@app.post("/api/projects")
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        title=project_data.title,
        genre=project_data.genre,
        mood=project_data.mood,
        bpm=project_data.bpm,
        key=project_data.key,
        duration_seconds=project_data.duration_seconds,
        energy=project_data.energy,
        marketing_kit=project_data.marketing_kit,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Project saved successfully",
        "project_id": project.id,
    }
    
@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects