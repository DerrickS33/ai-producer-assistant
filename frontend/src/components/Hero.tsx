function Hero() {
  return (
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

export default Hero;