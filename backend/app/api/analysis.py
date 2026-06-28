import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.audio_analysis_service import analyze_audio_file

router = APIRouter()


@router.post("/api/analyze")
async def analyze_audio(audio_file: UploadFile = File(...)):
    file_path = None

    try:
        allowed_content_types = [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/x-wav",
            "audio/wave",
        ]

        if audio_file.content_type not in allowed_content_types:
            raise HTTPException(
                status_code=400,
                detail="Only MP3 and WAV files are supported.",
            )

        max_file_size_mb = 25
        max_file_size_bytes = max_file_size_mb * 1024 * 1024

        audio_file.file.seek(0, os.SEEK_END)
        file_size = audio_file.file.tell()
        audio_file.file.seek(0)

        if file_size > max_file_size_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File is too large. Max size is {max_file_size_mb}MB.",
            )

        upload_dir = "temp_uploads"
        os.makedirs(upload_dir, exist_ok=True)

        original_filename = audio_file.filename or "uploaded_audio"
        safe_filename = f"{uuid4()}_{original_filename}"
        file_path = os.path.join(upload_dir, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

        return analyze_audio_file(file_path, original_filename)

    except HTTPException:
        raise

    except Exception as error:
        print("Audio analysis error:", repr(error))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze audio file: {str(error)}",
        )

    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)