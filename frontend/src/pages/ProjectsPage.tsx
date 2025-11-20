import { FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProjectsPage = () => {
  const { groupId } = useParams();
  const { groups, projects, addProject, updateProject, deleteProject } = useData();
  const scopedGroup = groups.find((group) => group.id === groupId);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.groupId === groupId && project.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [projects, groupId, search],
  );

  if (!scopedGroup) {
    return <p className="text-slate-300">Group not found.</p>;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name) return;
    const payload = {
      ...form,
      groupId: groupId!,
    };
    if (editingId) {
      updateProject(editingId, payload);
    } else {
      addProject(payload);
    }
    setForm({ name: '', description: '', startDate: '', endDate: '' });
    setEditingId(null);
  };

  const startEdit = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    setEditingId(projectId);
    setForm({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Projects · {scopedGroup.name}</p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Project name</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Timeline</label>
            <div className="mt-2 flex gap-3">
              <input
                type="date"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                value={form.startDate}
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                required
              />
              <input
                type="date"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                value={form.endDate}
                onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-wide text-slate-400">Description</label>
            <textarea
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              {editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', description: '', startDate: '', endDate: '' });
                }}
                className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold">Projects</h3>
            <p className="text-sm text-slate-400">Search, inspect boards, and track reports.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">{project.name}</h4>
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  {project.startDate} → {project.endDate}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/projects/${project.id}`}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase"
                >
                  Summary
                </Link>
                <Link
                  to={`/projects/${project.id}/tasks`}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase"
                >
                  Task board
                </Link>
                <button
                  type="button"
                  onClick={() => startEdit(project.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteProject(project.id)}
                  className="rounded-lg border border-rose-700 px-3 py-1 text-xs font-semibold uppercase text-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && <p className="text-sm text-slate-400">No projects found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
