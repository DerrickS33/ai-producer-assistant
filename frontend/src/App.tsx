import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import "./App.css";

type MarketingKit = {
  beat_tags: string[];
  youtube_titles: string[];
  description: string;
  artist_matches: string[];
  social_caption: string;
  cover_art_prompt: string;
};

function App() {
  // Form state used to collect beat metadata from the user
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    mood: "",
    bpm: "",
    key: "",
  });

  // Generated marketing kit returned by the backend
  const [result, setResult] = useState<MarketingKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Handles communication with the FastAPI backend
  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage("Please fill out all fields before generating.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("http://127.0.0.1:8000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          bpm: Number(formData.bpm),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate marketing kit.");
      }

      const data = await response.json();
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
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              AI Marketing Kit Generator
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Turn your beat info into a full marketing kit.
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-400">
              Generate beat tags, YouTube titles, artist matches, descriptions,
              social captions, and cover art prompts from one simple form.
            </p>

            <div className="grid max-w-xl grid-cols-3 gap-4">
              <Stat label="Assets" value="6+" />
              <Stat label="Stack" value="React" />
              <Stat label="API" value="FastAPI" />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur"
          >
            <h2 className="mb-2 text-2xl font-semibold">Beat Information</h2>
            <p className="mb-6 text-sm text-slate-400">
              Enter the core details for your beat.
            </p>

            <div className="space-y-4">
              <Input name="title" placeholder="Beat title" onChange={handleChange} />
              <Input name="genre" placeholder="Genre, e.g. Trap" onChange={handleChange} />
              <Input name="mood" placeholder="Mood, e.g. Dark" onChange={handleChange} />
              <Input name="bpm" placeholder="BPM, e.g. 140" onChange={handleChange} />
              <Input name="key" placeholder="Key, e.g. F Minor" onChange={handleChange} />
            </div>

            {errorMessage && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Marketing Kit"}
            </button>
          </form>
        </div>

        {result && (
          <section className="mt-16">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
                Generated Output
              </p>
              <h2 className="mt-3 text-3xl font-bold">Marketing Kit</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ResultCard title="Beat Tags">
                <div className="flex flex-wrap gap-2">
                  {result.beat_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </ResultCard>

              <ResultCard title="Artist Matches">
                <div className="flex flex-wrap gap-2">
                  {result.artist_matches.map((artist, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </ResultCard>

              <ResultCard title="YouTube Titles">
                <ul className="space-y-3 text-slate-300">
                  {result.youtube_titles.map((title, index) => (
                    <li key={index} className="flex items-start justify-between gap-4">
                      <span>• {title}</span>
                      <CopyButton text={title} />
                    </li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard title="BeatStars Description">
                <p className="leading-7 text-slate-300">{result.description}</p>
                <CopyButton text={result.description} />
              </ResultCard>

              <ResultCard title="Social Caption">
                <p className="leading-7 text-slate-300">{result.social_caption}</p>
                <CopyButton text={result.social_caption} />
              </ResultCard>

              <ResultCard title="Cover Art Prompt">
                <p className="leading-7 text-slate-300">
                  {result.cover_art_prompt}
                </p>
                <CopyButton text={result.cover_art_prompt} />
              </ResultCard>
            </div>
          </section>
        )}
      </section>
    </main>
  );

  function CopyButton({ text }: { text: string }) {
    return (
      <button
        onClick={() => copyToClipboard(text)}
        className="mt-4 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
      >
        Copy
      </button>
    );
  }
}

function Input({
  name,
  placeholder,
  onChange,
}: {
  name: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    />
  );
}

function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default App;