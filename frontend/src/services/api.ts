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