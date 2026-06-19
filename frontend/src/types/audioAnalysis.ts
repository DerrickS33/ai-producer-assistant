export interface AudioAnalysis {
  filename: string;
  duration_seconds: number;
  bpm: number;
  key: string;
  energy: string;
  suggested_genre: string;
  suggested_moods: string[];
}