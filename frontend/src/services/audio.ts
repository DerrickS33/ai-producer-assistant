import type { AudioAnalysis } from "../types/audioAnalysis";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function analyzeAudio(file: File): Promise<AudioAnalysis> {
  const formData = new FormData();
  formData.append("audio_file", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to analyze audio");
  }

  return response.json();
}