/**
 * Audio analysis API service.
 *
 * This module handles audio file uploads and retrieves extracted
 * audio metadata from the backend analysis endpoint.
 */

import type { AudioAnalysis } from "../types/audioAnalysis";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Upload an audio file for analysis.
 *
 * The backend extracts features such as:
 * - BPM
 * - Musical key
 * - Energy level
 * - Suggested genre
 * - Suggested moods
 *
 * These values are used to prefill form fields and improve
 * AI-generated marketing assets.
 */
export async function analyzeAudio(
  file: File
): Promise<AudioAnalysis> {
  const formData = new FormData();
  formData.append("audio_file", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || "Failed to analyze audio"
    );
  }

  return response.json();
}