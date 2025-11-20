import { FormEvent, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Role } from '../types';

const StaffPage = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { groups, users, addUser, updateUser, deleteUser } = useData();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    password: '',
    role: 'Member' as Role,
    groupId: groupId ?? '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const scopedGroup = groups.find((group) => group.id === groupId);

  const filteredUsers = useMemo(() => {
    return users.filter((member) => {
      const inGroup = member.groupId === groupId;
      const matches = `${member.username} ${member.displayName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      return inGroup && member.role !== 'Owner' && matches;
    });
  }, [groupId, search, users]);

  if (!scopedGroup) {
    return <p className="text-slate-300">Group not found.</p>;
  }

  const roleOptions: Role[] = user?.role === 'Owner' ? ['Manager', 'Member'] : ['Member'];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.username || !form.displayName || !form.password) return;
    const payload = {
      username: form.username,
      displayName: form.displayName,
      password: form.password,
      role: form.role,
      groupId: user?.role === 'Owner' ? form.groupId : groupId,
    };
    if (editingId) {
      updateUser(editingId, payload);
    } else {
      addUser(payload);
    }
    setForm({ username: '', displayName: '', password: '', role: 'Member', groupId: groupId ?? '' });
    setEditingId(null);
  };

  const startEdit = (memberId: string) => {
    const member = users.find((m) => m.id === memberId);
    if (!member) return;
    setEditingId(memberId);
    setForm({
      username: member.username,
      displayName: member.displayName,
      password: member.password,
      role: member.role,
      groupId: member.groupId ?? '',
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ username: '', displayName: '', password: '', role: 'Member', groupId: groupId ?? '' });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Staff</p>
        <h2 className="text-2xl font-semibold">{scopedGroup.name}</h2>
        <p className="text-sm text-slate-400">Create or update managers and members assigned to this group.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Username</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Display name</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Password</label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Role</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as Role }))}
                disabled={user?.role !== 'Owner'}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Group</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
                value={form.groupId}
                onChange={(event) => setForm((prev) => ({ ...prev, groupId: event.target.value }))}
                disabled={user?.role !== 'Owner'}
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              {editingId ? 'Update Member' : 'Add Member'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
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
            <h3 className="text-xl font-semibold">Members</h3>
            <p className="text-sm text-slate-400">Search by username or display name.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="mt-6 space-y-4">
          {filteredUsers.map((member) => (
            <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{member.displayName}</p>
                <p className="text-xs text-slate-500">{member.username}</p>
              </div>
              <div className="text-xs uppercase tracking-wide text-slate-400">{member.role}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(member.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold uppercase"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteUser(member.id)}
                  className="rounded-lg border border-rose-700 px-3 py-1 text-xs font-semibold uppercase text-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && <p className="text-sm text-slate-400">No members match the current search.</p>}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
