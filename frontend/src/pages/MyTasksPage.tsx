import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';

const MyTasksPage = () => {
  const { user } = useAuth();
  const { tasks, projects } = useData();
  const [search, setSearch] = useState('');

  if (!user) {
    return <p className="text-slate-300">Please log in.</p>;
  }

  const list = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.assigneeId === user.id && task.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [tasks, user.id, search],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">My Tasks</p>
        <h2 className="mt-2 text-3xl font-semibold">Assignments & updates</h2>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search task name"
          className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="space-y-4">
        {list.map((task) => {
          const project = projects.find((p) => p.id === task.projectId);
          return (
            <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500">{project?.name}</p>
                  <h3 className="text-xl font-semibold">{task.name}</h3>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                  {task.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{task.description}</p>
              <p className="mt-2 text-xs text-slate-500">
                {task.startDate} → {task.endDate}
              </p>
              <div className="mt-4">
                <Link
                  to={`/tasks/${task.id}`}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                >
                  Open task
                </Link>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-slate-400">No tasks assigned.</p>}
      </div>
    </div>
  );
};

export default MyTasksPage;
