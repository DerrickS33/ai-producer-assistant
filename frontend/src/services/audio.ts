import type { AudioAnalysis } from "../types/audioAnalysis";

export async function analyzeAudio(file: File): Promise<AudioAnalysis> {
  const formData = new FormData();
  formData.append("audio_file", file);

  const response = await fetch("http://127.0.0.1:8000/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze audio");
  }

  return response.json();
}