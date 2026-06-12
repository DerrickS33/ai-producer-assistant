import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";

function App() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    mood: "",
    bpm: "",
    key: "",
  });

    const [result, setResult] = useState<any>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

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

    const data = await response.json();
    setResult(data);
  }

  return (
    <main style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>AI Producer Assistant</h1>
      <p>Generate a marketing kit for your beat.</p>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Beat title" onChange={handleChange} />
        <input name="genre" placeholder="Genre" onChange={handleChange} />
        <input name="mood" placeholder="Mood" onChange={handleChange} />
        <input name="bpm" placeholder="BPM" onChange={handleChange} />
        <input name="key" placeholder="Key" onChange={handleChange} />

        <button type="submit">Generate Marketing Kit</button>
      </form>

      {result && (
        <section>
          <h2>Generated Marketing Kit</h2>

          <h3>Beat Tags</h3>
          <ul>
            {result.beat_tags.map((tag: string, index: number) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>

          <h3>YouTube Titles</h3>
          <ul>
            {result.youtube_titles.map((title: string, index: number) => (
              <li key={index}>{title}</li>
            ))}
          </ul>

          <h3>Description</h3>
          <p>{result.description}</p>

          <h3>Artist Matches</h3>
          <ul>
            {result.artist_matches.map((artist: string, index: number) => (
              <li key={index}>{artist}</li>
            ))}
          </ul>

          <h3>Social Caption</h3>
          <p>{result.social_caption}</p>

          <h3>Cover Art Prompt</h3>
          <p>{result.cover_art_prompt}</p>
        </section>
      )}
    </main>
  );
}

export default App;