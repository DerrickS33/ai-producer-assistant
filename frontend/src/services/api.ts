import type { MarketingKit } from "../types/marketingKit";

type BeatFormData = {
  title: string;
  genre: string;
  mood: string;
  bpm: string;
  key: string;
};

export async function generateMarketingKit(
  formData: BeatFormData
): Promise<MarketingKit> {
  const response = await fetch("http://127.0.0.1:8000/api/generate", {
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
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API error:", errorData);
    throw new Error("Failed to generate marketing kit");
  }

  return response.json();
}