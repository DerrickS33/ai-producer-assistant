import { useEffect, useState } from "react";
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
import {
  deleteProject,
  getProjects,
  saveProject,
  updateProject,
} from "./services/project";
import type { SavedProject } from "./types/project";
import ProjectHistory from "./components/ProjectHistory";
import AuthForm from "./components/AuthForm";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

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
  const [saveMessage, setSaveMessage] = useState("");
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loadedProjectId, setLoadedProjectId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      loadProjects();
    }
  }, [token]);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      console.error("Failed to load saved projects.");
    }
  }

  function handleAuthSuccess(newToken: string) {
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setProjects([]);
    setResult(null);
    setAnalysis(null);
    setSaveMessage("");
    setLoadedProjectId(null);
  }

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
      setSaveMessage("");

      const data = await generateMarketingKit({
        ...formData,
        duration_seconds: analysis?.duration_seconds,
        energy: analysis?.energy,
      });

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
      setSaveMessage("");

      const data = await analyzeAudio(file);
      setAnalysis(data);

      setFormData((previousFormData) => ({
        ...previousFormData,
        genre: data.suggested_genre,
        mood: data.suggested_moods.join(", "),
        bpm: data.bpm.toString(),
        key: data.key,
      }));
    } catch (error) {
      if (error instanceof Error) {
        setAudioErrorMessage(error.message);
      } else {
        setAudioErrorMessage("Failed to analyze audio. Please try another file.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSaveProject() {
    if (!result) {
      return;
    }

    try {
      setSaveMessage("");

      await saveProject({
        ...formData,
        analysis,
        marketingKit: result,
      });

      setSaveMessage("Project saved successfully.");
      await loadProjects();
    } catch {
      setSaveMessage("Failed to save project.");
    }
  }

  async function handleDeleteProject(projectId: number) {
    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch {
      console.error("Failed to delete project.");
    }
  }

  function handleLoadProject(project: SavedProject) {
    setFormData({
      title: project.title,
      genre: project.genre,
      mood: project.mood,
      bpm: project.bpm.toString(),
      key: project.key,
    });

    setAnalysis({
      filename: project.title,
      duration_seconds: project.duration_seconds,
      bpm: project.bpm,
      key: project.key,
      energy: project.energy,
      suggested_genre: project.genre,
      suggested_moods: project.mood.split(", "),
    });

    setResult(project.marketing_kit);
    setSaveMessage("");
    setErrorMessage("");
    setLoadedProjectId(project.id);
  }

  async function handleUpdateProject() {
    if (!result || loadedProjectId === null) {
      return;
    }

    try {
      setSaveMessage("");

      await updateProject(loadedProjectId, {
        ...formData,
        analysis,
        marketingKit: result,
      });

      setSaveMessage("Project updated successfully.");
      await loadProjects();
    } catch {
      setSaveMessage("Failed to update project.");
    }
  }

  if (!token) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            AI Producer Assistant
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              MVP Demo
            </span>

            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="space-y-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Hero />

            <AudioUpload
              isAnalyzing={isAnalyzing}
              analysis={analysis}
              errorMessage={audioErrorMessage}
              onFileSelect={handleAudioUpload}
            />
          </div>

          <BeatForm
            formData={formData}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>

        {result && (
          <>
            <MarketingResults result={result} onCopy={copyToClipboard} />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveProject}
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold transition hover:bg-green-500"
              >
                Save Project
              </button>

              {loadedProjectId !== null && (
                <button
                  onClick={handleUpdateProject}
                  className="rounded-xl bg-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-600"
                >
                  Update Project
                </button>
              )}

              {saveMessage && (
                <p className="w-full text-sm text-slate-300">{saveMessage}</p>
              )}
            </div>
          </>
        )}

        <ProjectHistory
          projects={projects}
          onLoadProject={handleLoadProject}
          onDeleteProject={handleDeleteProject}
        />
      </section>
    </main>
  );
}

export default App;