import { FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Task, TaskStatus } from '../types';

const columns: { key: TaskStatus; label: string; accent: string }[] = [
  { key: 'ToDo', label: 'To Do', accent: 'text-slate-200' },
  { key: 'InProgress', label: 'In Progress', accent: 'text-amber-300' },
  { key: 'Done', label: 'Done', accent: 'text-emerald-400' },
  { key: 'Fail', label: 'Fail', accent: 'text-rose-400' },
];

const TaskBoardPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const {
    projects,
    tasks,
    users,
    addTask,
    updateTask,
    deleteTask,
    addProjectReport,
  } = useData();
  const project = projects.find((p) => p.id === projectId);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ToDo' as TaskStatus,
    assigneeId: '',
  });
  const [reportContent, setReportContent] = useState('');
  const [reporting, setReporting] = useState(false);

  const projectTasks = useMemo(() => tasks.filter((task) => task.projectId === projectId), [tasks, projectId]);

  if (!project) {
    return <p className="text-slate-300">Project not found.</p>;
  }

  const canManageTasks =
    user?.role === 'Owner' || (user?.role === 'Manager' && user.groupId === project.groupId);

  const assignees = users.filter((member) => member.groupId === project.groupId && member.role !== 'Owner');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.assigneeId) return;
    const payload = { ...form, projectId: project.id };
    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask(payload);
    }
    setForm({ name: '', description: '', startDate: '', endDate: '', status: 'ToDo', assigneeId: '' });
    setEditingTask(null);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      assigneeId: task.assigneeId,
    });
  };

  const resetForm = () => {
    setEditingTask(null);
    setForm({ name: '', description: '', startDate: '', endDate: '', status: 'ToDo', assigneeId: '' });
  };

  const submitReport = () => {
    if (!user) return;
    addProjectReport({ projectId: project.id, senderId: user.id, content: reportContent });
    setReportContent('');
    setReporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Task Board</p>
          <h2 className="text-3xl font-semibold">{project.name}</h2>
          <p className="text-sm text-slate-400">Drag-inspired board grouped by status.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/reports/tasks?project=${project.id}`}
            className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-200"
          >
            View Task Reports
          </Link>
          {user?.role === 'Manager' && user.groupId === project.groupId && (
            <button
              type="button"
              onClick={() => setReporting(true)}
              className="rounded-xl bg-slate-800 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
            >
              Report Project
            </button>
          )}
          {canManageTasks && (
            <button
              type="button"
              onClick={() => setEditingTask({
                id: '',
                projectId: project.id,
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'ToDo',
                assigneeId: '',
              })}
              className="rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Add Task
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <div key={column.key} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className={`text-sm font-semibold uppercase tracking-wide ${column.accent}`}>{column.label}</div>
            <div className="mt-4 space-y-3">
              {projectTasks
                .filter((task) => task.status === column.key)
                .map((task) => {
                  const assignee = users.find((u) => u.id === task.assigneeId);
                  return (
                    <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                      <div className="text-base font-semibold">{task.name}</div>
                      <p className="text-xs text-slate-500">{assignee?.displayName ?? 'Unassigned'}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">{task.startDate}</span>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">{task.endDate}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="rounded-lg border border-slate-700 px-3 py-1"
                        >
                          Details
                        </Link>
                        {canManageTasks && (
                          <button
                            type="button"
                            onClick={() => startEdit(task)}
                            className="rounded-lg border border-slate-700 px-3 py-1"
                          >
                            Edit
                          </button>
                        )}
                        {canManageTasks && (
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="rounded-lg border border-rose-700 px-3 py-1 text-rose-300"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {editingTask && canManageTasks && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{editingTask.id ? 'Edit task' : 'New task'}</h3>
            <button type="button" onClick={resetForm} className="text-sm text-slate-400">
              Close
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
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
                <option value="" disabled>
                  Select member
                </option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.displayName}
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
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wide text-slate-400">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                rows={3}
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
                {columns.map((column) => (
                  <option key={column.key} value={column.key}>
                    {column.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
              >
                {editingTask.id ? 'Update task' : 'Create task'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {reporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold">Project report</h3>
            <p className="text-sm text-slate-400">
              {project.name} • {user?.displayName}
            </p>
            <textarea
              value={reportContent}
              onChange={(event) => setReportContent(event.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              rows={5}
              placeholder="Share progress, blockers, and next steps"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={submitReport}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setReporting(false)}
                className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoardPage;
