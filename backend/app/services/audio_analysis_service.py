"""
Audio analysis service.

This module uses librosa to extract basic musical features from uploaded
MP3 and WAV files. The extracted data is used to help generate more
specific AI marketing assets for each beat.
"""

import librosa


def estimate_key(y, sr):
    """
    Estimate the musical key of an audio file using chroma features.

    This uses chroma analysis and compares the pitch profile against
    major and minor key profiles. The result is an approximation and
    may not always match the true musical key.
    """
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    chroma_mean = chroma.mean(axis=1)

    notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    major_profile = [
        6.35,
        2.23,
        3.48,
        2.33,
        4.38,
        4.09,
        2.52,
        5.19,
        2.39,
        3.66,
        2.29,
        2.88,
    ]

    minor_profile = [
        6.33,
        2.68,
        3.52,
        5.38,
        2.60,
        3.53,
        2.54,
        4.75,
        3.98,
        2.69,
        3.34,
        3.17,
    ]

    scores = []

    for i in range(12):
        major_score = sum(
            chroma_mean[j] * major_profile[(j - i) % 12]
            for j in range(12)
        )

        minor_score = sum(
            chroma_mean[j] * minor_profile[(j - i) % 12]
            for j in range(12)
        )

        scores.append((major_score, notes[i], "major"))
        scores.append((minor_score, notes[i], "minor"))

    best_score = max(scores, key=lambda item: item[0])
    return f"{best_score[1]} {best_score[2]}"


def suggest_genre_and_moods(
    bpm,
    key,
    energy,
    brightness,
    loudness,
    danceability,
):
    """
    Suggest a genre and mood labels based on extracted audio features.

    These suggestions are heuristic-based rather than machine-learning
    predictions. They provide useful defaults for the user and help guide
    the AI marketing generation step.
    """
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


def analyze_audio_file(file_path, filename):
    """
    Analyze an audio file and return beat metadata.

    Extracted values include:
    - Duration
    - BPM
    - Estimated musical key
    - Energy level
    - Suggested genre
    - Suggested moods

    Args:
        file_path: Temporary path to the uploaded audio file.
        filename: Original filename provided by the user.
    """
    y, sr = librosa.load(file_path)

    duration = librosa.get_duration(y=y, sr=sr)

    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    bpm = round(float(tempo[0]))

    detected_key = estimate_key(y, sr)

    rms = librosa.feature.rms(y=y)[0]
    average_energy = float(rms.mean())

    if average_energy < 0.03:
        energy = "Low"
    elif average_energy < 0.08:
        energy = "Medium"
    else:
        energy = "High"

    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    brightness = float(spectral_centroid.mean())

    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)[0]
    danceability = float(zero_crossing_rate.mean())

    loudness = float(rms.mean())

    suggestions = suggest_genre_and_moods(
        bpm=bpm,
        key=detected_key,
        energy=energy,
        brightness=brightness,
        loudness=loudness,
        danceability=danceability,
    )

    return {
        "filename": filename,
        "duration_seconds": round(duration, 2),
        "bpm": bpm,
        "key": detected_key,
        "energy": energy,
        "suggested_genre": suggestions["suggested_genre"],
        "suggested_moods": suggestions["suggested_moods"],
    }