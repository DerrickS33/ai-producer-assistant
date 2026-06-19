import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import "./App.css";
import type { MarketingKit } from "./types/marketingKit";
import { generateMarketingKit } from "./services/api";
import MarketingResults from "./components/MarketingResults";
import BeatForm from "./components/BeatForm";
import Hero from "./components/Hero";
import type { AudioAnalysis } from "./types/audioAnalysis";
import { analyzeAudio } from "./services/audio";
import AudioUpload from "./components/AudioUpload";

function App() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    mood: "",
    bpm: "",
    key: "",
  });

  const [result, setResult] = useState<MarketingKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioErrorMessage, setAudioErrorMessage] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function isFormValid() {
    return (
      formData.title.trim() &&
      formData.genre.trim() &&
      formData.mood.trim() &&
      formData.bpm.trim() &&
      formData.key.trim()
    );
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage("Please fill out all fields before generating.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await generateMarketingKit(formData);
      setResult(data);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
  }

  async function handleAudioUpload(file: File) {
  try {
    setIsAnalyzing(true);
    setAudioErrorMessage("");

    const data = await analyzeAudio(file);
    setAnalysis(data);
  } catch {
    setAudioErrorMessage("Failed to analyze audio. Please try another file.");
  } finally {
    setIsAnalyzing(false);
  }
}

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            AI Producer Assistant
          </div>

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            MVP Demo
          </span>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Hero />

          <BeatForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
        <AudioUpload
          isAnalyzing={isAnalyzing}
          analysis={analysis}
          errorMessage={audioErrorMessage}
          onFileSelect={handleAudioUpload}
        />
        {result && (
          <MarketingResults result={result} onCopy={copyToClipboard} />
        )}
      </section>
    </main>
  );
}

export default App;