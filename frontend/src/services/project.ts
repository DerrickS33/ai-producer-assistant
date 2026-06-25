import type { MarketingKit } from "../types/marketingKit";
import type { AudioAnalysis } from "../types/audioAnalysis";

type ProjectData = {
  title: string;
  genre: string;
  mood: string;
  bpm: string;
  key: string;
  analysis: AudioAnalysis | null;
  marketingKit: MarketingKit;
};

export async function saveProject(projectData: ProjectData) {
  const response = await fetch("http://127.0.0.1:8000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: projectData.title,
      genre: projectData.genre,
      mood: projectData.mood,
      bpm: Number(projectData.bpm),
      key: projectData.key,
      duration_seconds: projectData.analysis?.duration_seconds ?? 0,
      energy: projectData.analysis?.energy ?? "Unknown",
      marketing_kit: projectData.marketingKit,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save project");
  }

  return response.json();
}

export async function getProjects() {
  const response = await fetch("http://127.0.0.1:8000/api/projects");

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}