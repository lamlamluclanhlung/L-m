import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const GroupsPage = () => {
  const { groups, users, projects, addGroup, updateGroup, deleteGroup } = useData();
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredGroups = useMemo(
    () => groups.filter((group) => group.name.toLowerCase().includes(search.toLowerCase())),
    [groups, search],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      updateGroup(editingId, { name });
    } else {
      addGroup({ name });
    }
    setName('');
    setEditingId(null);
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Owner</p>
          <h2 className="text-2xl font-semibold text-white">Group management</h2>
          <p className="text-sm text-slate-400">Create, update, and archive student groups.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <label className="text-sm font-medium text-slate-200">Group name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              placeholder="New group name"
              required
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-indigo-500"
            >
              {editingId ? 'Update group' : 'Add group'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-200"
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
            <h3 className="text-xl font-semibold">Groups</h3>
            <p className="text-sm text-slate-400">Search by name, inspect staff and projects.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search groups"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Group</th>
                <th className="pb-3">Members</th>
                <th className="pb-3">Projects</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredGroups.map((group) => {
                const memberCount = users.filter((user) => user.groupId === group.id && user.role !== 'Owner').length;
                const projectCount = projects.filter((project) => project.groupId === group.id).length;
                return (
                  <tr key={group.id}>
                    <td className="py-3">
                      <div className="font-semibold">{group.name}</div>
                      <p className="text-xs text-slate-500">{group.id}</p>
                    </td>
                    <td>{memberCount}</td>
                    <td>{projectCount}</td>
                    <td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          to={`/groups/${group.id}`}
                          className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => startEdit(group.id, group.name)}
                          className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteGroup(group.id)}
                          className="rounded-lg border border-rose-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
