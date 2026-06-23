import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { AudioAnalysis } from "../types/audioAnalysis";

type AudioUploadProps = {
  isAnalyzing: boolean;
  analysis: AudioAnalysis | null;
  errorMessage: string;
  onFileSelect: (file: File) => void;
};

function AudioUpload({
  isAnalyzing,
  analysis,
  errorMessage,
  onFileSelect,
}: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  function validateFile(file: File): string {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/x-wav",
    ];

    const maxFileSizeMB = 25;
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return "Only MP3 and WAV files are supported.";
    }

    if (file.size > maxFileSizeBytes) {
      return `File is too large. Max size is ${maxFileSizeMB}MB.`;
    }

    return "";
  }

  function processFile(file: File) {
    const validationError = validateFile(file);

    if (validationError) {
      alert(validationError);
      return;
    }

    onFileSelect(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  }

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <h2 className="mb-2 text-2xl font-semibold">Audio Analysis</h2>

      <p className="mb-6 text-sm text-slate-400">
        Drag and drop an MP3 or WAV file to detect BPM, key, duration, and
        energy.
      </p>

      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 bg-slate-950 hover:border-blue-500"
        }`}
      >
        <span className="text-lg font-semibold">
          {isAnalyzing
            ? "Analyzing audio..."
            : isDragging
            ? "Drop your beat here"
            : "Drag your beat here or click to upload"}
        </span>

        <span className="mt-2 text-sm text-slate-500">
          MP3 or WAV supported (Max 25MB)
        </span>

        <input
          type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
          className="hidden"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
      </label>

      {errorMessage && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {analysis && (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <AnalysisItem
            label="Duration"
            value={formatDuration(analysis.duration_seconds)}
          />
          <AnalysisItem label="BPM" value={analysis.bpm.toString()} />
          <AnalysisItem label="Key" value={analysis.key} />
          <AnalysisItem label="Energy" value={analysis.energy} />
        </div>
      )}
    </div>
  );
}

function AnalysisItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

export default AudioUpload;