import type { ReactNode } from "react";

type ResultCardProps = {
  title: string;
  children: ReactNode;
};

function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}

export default ResultCard;