import type { SavedProject } from "../types/project";

type ProjectHistoryProps = {
  projects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (projectId: number) => void;
};

function ProjectHistory({
  projects,
  onLoadProject,
  onDeleteProject,
}: ProjectHistoryProps) {
  if (projects.length === 0) {
  return (
    <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-6 flex items-center justify-between">
  <h2 className="text-3xl font-bold">Saved Projects</h2>

  <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400">
    {projects.length} saved
  </span>
</div>
      <p className="mt-3 text-slate-400">
        No saved projects yet. Generate a marketing kit and save it to see it here.
      </p>
    </section>
  );
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

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onLoadProject(project)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
              >
                Load Project
              </button>

              <button
                onClick={() => onDeleteProject(project.id)}
                className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-300 transition hover:border-red-400 hover:text-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectHistory;