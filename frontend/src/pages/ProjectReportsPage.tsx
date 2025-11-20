import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ProjectReportsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { projectReports, projects, users } = useData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const params = new URLSearchParams(location.search);
  const projectFilter = params.get('project');

  const accessibleProjectIds = useMemo(() => {
    if (user?.role === 'Owner') {
      return projects.map((project) => project.id);
    }
    if (user?.role === 'Manager' && user.groupId) {
      return projects.filter((project) => project.groupId === user.groupId).map((project) => project.id);
    }
    return [];
  }, [projects, user]);

  if (!user || accessibleProjectIds.length === 0) {
    return <p className="text-slate-300">You do not have access to project reports.</p>;
  }

  const list = projectReports.filter((report) => {
    const allowed = accessibleProjectIds.includes(report.projectId);
    const matchesFilter = projectFilter ? report.projectId === projectFilter : true;
    return allowed && matchesFilter;
  });

  const selectedReport = list.find((report) => report.id === selectedId) ?? list[0] ?? null;

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-lg font-semibold">Project reports</h3>
        <p className="text-sm text-slate-400">Select a report to review full content.</p>
        <div className="mt-4 space-y-3">
          {list.map((report) => {
            const project = projects.find((p) => p.id === report.projectId);
            const sender = users.find((u) => u.id === report.senderId);
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedId(report.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left ${
                  selectedReport?.id === report.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <p className="text-sm font-semibold">{project?.name}</p>
                <p className="text-xs text-slate-500">
                  {sender?.displayName} · {new Date(report.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{report.content}</p>
              </button>
            );
          })}
          {list.length === 0 && <p className="text-sm text-slate-400">No reports available.</p>}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        {selectedReport ? (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">
              {projects.find((project) => project.id === selectedReport.projectId)?.name}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Report overview</h2>
            <p className="text-sm text-slate-400">
              Submitted by {users.find((member) => member.id === selectedReport.senderId)?.displayName} on{' '}
              {new Date(selectedReport.createdAt).toLocaleString()}
            </p>
            <p className="mt-6 whitespace-pre-line text-slate-100">{selectedReport.content}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Select a report to view the details.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectReportsPage;
