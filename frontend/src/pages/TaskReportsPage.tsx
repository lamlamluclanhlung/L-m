import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const TaskReportsPage = () => {
  const { user } = useAuth();
  const { taskReports, tasks, projects, users } = useData();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectFilter = params.get('project');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const accessibleTaskIds = useMemo(() => {
    if (user?.role === 'Owner') {
      return tasks.map((task) => task.id);
    }
    if (user?.role === 'Manager' && user.groupId) {
      const allowedProjects = projects.filter((project) => project.groupId === user.groupId).map((p) => p.id);
      return tasks.filter((task) => allowedProjects.includes(task.projectId)).map((task) => task.id);
    }
    return [];
  }, [projects, tasks, user]);

  if (!user || accessibleTaskIds.length === 0) {
    return <p className="text-slate-300">You do not have access to task reports.</p>;
  }

  const filtered = taskReports.filter((report) => {
    const allowed = accessibleTaskIds.includes(report.taskId);
    const projectMatch = projectFilter
      ? tasks.find((task) => task.id === report.taskId)?.projectId === projectFilter
      : true;
    return allowed && projectMatch;
  });

  const selected = filtered.find((report) => report.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-lg font-semibold">Task reports</h3>
        <p className="text-sm text-slate-400">Monitor updates from members.</p>
        <div className="mt-4 space-y-3">
          {filtered.map((report) => {
            const task = tasks.find((t) => t.id === report.taskId);
            const sender = users.find((u) => u.id === report.senderId);
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedId(report.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left ${
                  selected?.id === report.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <p className="text-sm font-semibold">{task?.name}</p>
                <p className="text-xs text-slate-500">
                  {sender?.displayName} · {new Date(report.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{report.content}</p>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-slate-400">No reports recorded.</p>}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        {selected ? (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              {tasks.find((task) => task.id === selected.taskId)?.name}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Report transcript</h2>
            <p className="text-sm text-slate-400">
              Submitted by {users.find((member) => member.id === selected.senderId)?.displayName} on{' '}
              {new Date(selected.createdAt).toLocaleString()}
            </p>
            <p className="mt-6 whitespace-pre-line text-slate-100">{selected.content}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Select a report to review the story.</p>
        )}
      </div>
    </div>
  );
};

export default TaskReportsPage;
