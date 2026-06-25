import type { MarketingKit } from "./marketingKit";

export interface SavedProject {
  id: number;
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  key: string;
  duration_seconds: number;
  energy: string;
  marketing_kit: MarketingKit;
  created_at: string;
}