import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProjectSummaryPage = () => {
  const { projectId } = useParams();
  const { projects, groups, tasks } = useData();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return <p className="text-slate-300">Project not found.</p>;
  }

  const group = groups.find((g) => g.id === project.groupId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const total = projectTasks.length;
  const done = projectTasks.filter((task) => task.status === 'Done').length;
  const unfinished = total - done;
  const completion = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Project</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{project.name}</h2>
        <p className="text-sm text-slate-400">{project.description}</p>
        <dl className="mt-6 grid gap-4 md:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Group</dt>
            <dd className="text-lg font-semibold">{group?.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Start</dt>
            <dd className="text-lg font-semibold">{project.startDate}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">End</dt>
            <dd className="text-lg font-semibold">{project.endDate}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Completion</dt>
            <dd className="text-lg font-semibold">{completion}%</dd>
          </div>
        </dl>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total tasks</p>
          <p className="mt-2 text-3xl font-semibold">{total}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Completed</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">{done}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Unfinished</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{unfinished}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryPage;
