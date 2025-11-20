import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TaskStatus } from '../types';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const { user } = useAuth();
  const { tasks, users, updateTask, addTaskReport, projects } = useData();
  const task = tasks.find((t) => t.id === taskId);
  const [report, setReport] = useState('');
  const [form, setForm] = useState(() => ({
    name: task?.name ?? '',
    description: task?.description ?? '',
    startDate: task?.startDate ?? '',
    endDate: task?.endDate ?? '',
    status: (task?.status ?? 'ToDo') as TaskStatus,
    assigneeId: task?.assigneeId ?? '',
  }));

  if (!task) {
    return <p className="text-slate-300">Task not found.</p>;
  }

  const project = projects.find((p) => p.id === task.projectId);
  const assignees = users.filter((member) => member.groupId === project?.groupId && member.role !== 'Owner');
  const canEdit = user?.role === 'Owner' || user?.role === 'Manager';
  const canReport = user?.role === 'Member' && user.id === task.assigneeId;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateTask(task.id, form);
  };

  const submitReport = () => {
    if (!user) return;
    addTaskReport({ taskId: task.id, senderId: user.id, content: report });
    setReport('');
  };

  const assignee = users.find((member) => member.id === task.assigneeId);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Task</p>
        <h2 className="mt-2 text-3xl font-semibold">{task.name}</h2>
        <p className="text-sm text-slate-400">Assigned to {assignee?.displayName ?? 'Unassigned'}</p>
      </div>

      {canEdit ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Name</label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Assignee</label>
              <select
                value={form.assigneeId}
                onChange={(event) => setForm((prev) => ({ ...prev, assigneeId: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                required
              >
                {assignees.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Start</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">End</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Status</label>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as TaskStatus }))}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ToDo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Save changes
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Description</dt>
              <dd className="text-sm text-slate-200">{task.description}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Schedule</dt>
              <dd className="text-sm text-slate-200">
                {task.startDate} → {task.endDate}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Status</dt>
              <dd className="text-sm text-slate-200">{task.status}</dd>
            </div>
          </dl>
        </div>
      )}

      {canReport && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">Report task progress</h3>
          <textarea
            value={report}
            onChange={(event) => setReport(event.target.value)}
            rows={4}
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
            placeholder="Share your updates, blockers, or needs"
          />
          <button
            type="button"
            onClick={submitReport}
            className="mt-3 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Submit report
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPage;
