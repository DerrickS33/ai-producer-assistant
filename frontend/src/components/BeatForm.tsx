import type { ChangeEvent, SyntheticEvent } from "react";

type BeatFormProps = {
  isLoading: boolean;
  errorMessage: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: SyntheticEvent) => void;
};

function BeatForm({
  isLoading,
  errorMessage,
  onChange,
  onSubmit,
}: BeatFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur"
    >
      <h2 className="mb-2 text-2xl font-semibold">Beat Information</h2>

      <p className="mb-6 text-sm text-slate-400">
        Enter the core details for your beat.
      </p>

      <div className="space-y-4">
        <Input name="title" placeholder="Beat title" onChange={onChange} />
        <Input name="genre" placeholder="Genre, e.g. Trap" onChange={onChange} />
        <Input name="mood" placeholder="Mood, e.g. Dark" onChange={onChange} />
        <Input name="bpm" placeholder="BPM, e.g. 140" onChange={onChange} />
        <Input name="key" placeholder="Key, e.g. F Minor" onChange={onChange} />
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
  );
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

export default BeatForm;