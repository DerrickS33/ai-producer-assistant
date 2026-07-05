/**
 * API service for marketing kit generation.
 *
 * This module handles communication between the frontend and backend
 * marketing generation endpoint.
 */

import type { MarketingKit } from "../types/marketingKit";

type GenerateMarketingKitData = {
  title: string;
  genre: string;
  mood: string;
  bpm: string;
  key: string;
  duration_seconds?: number;
  energy?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Generate an AI powered marketing kit from beat metadata.
 *
 * Audio analysis results can optionally be included to provide the
 * backend with additional context for generating more relevant outputs.
 */
export async function generateMarketingKit(
  formData: GenerateMarketingKitData
): Promise<MarketingKit> {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: formData.title,
      genre: formData.genre,
      mood: formData.mood,
      bpm: Number(formData.bpm),
      key: formData.key,
      duration_seconds: formData.duration_seconds,
      energy: formData.energy,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate marketing kit");
  }

  return response.json();
}