import type { MarketingKit } from "../types/marketingKit";
import ResultCard from "./ResultCard";

type MarketingResultsProps = {
  result: MarketingKit;
  onCopy: (text: string) => void;
};

function MarketingResults({ result, onCopy }: MarketingResultsProps) {
  return (
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
                <CopyButton text={title} onCopy={onCopy} />
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard title="BeatStars Description">
          <p className="leading-7 text-slate-300">{result.description}</p>
          <CopyButton text={result.description} onCopy={onCopy} />
        </ResultCard>

        <ResultCard title="Social Caption">
          <p className="leading-7 text-slate-300">{result.social_caption}</p>
          <CopyButton text={result.social_caption} onCopy={onCopy} />
        </ResultCard>

        <ResultCard title="Cover Art Prompt">
          <p className="leading-7 text-slate-300">{result.cover_art_prompt}</p>
          <CopyButton text={result.cover_art_prompt} onCopy={onCopy} />
        </ResultCard>
      </div>
    </section>
  );
}

function CopyButton({
  text,
  onCopy,
}: {
  text: string;
  onCopy: (text: string) => void;
}) {
  return (
    <button
      onClick={() => onCopy(text)}
      className="mt-4 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
    >
      Copy
    </button>
  );
}

export default MarketingResults;