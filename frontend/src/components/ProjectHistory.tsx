import type { SavedProject } from "../types/project";

type ProjectHistoryProps = {
  projects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
};

function ProjectHistory({ projects, onLoadProject }: ProjectHistoryProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-3xl font-bold">Saved Projects</h2>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
          >
            <h3 className="text-xl font-semibold">{project.title}</h3>

            <p className="mt-2 text-sm text-slate-400">
              {project.genre} • {project.mood} • {project.bpm} BPM •{" "}
              {project.key} • {project.energy}
            </p>

            <button
              onClick={() => onLoadProject(project)}
              className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
            >
              Load Project
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectHistory;