import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useData } from '../context/DataContext';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const { groups, users, projects } = useData();
  const group = groups.find((g) => g.id === groupId);

  const manager = useMemo(
    () => users.find((user) => user.groupId === group?.id && user.role === 'Manager'),
    [group?.id, users],
  );
  const memberCount = useMemo(
    () => users.filter((user) => user.groupId === group?.id && user.role === 'Member').length,
    [group?.id, users],
  );

  if (!group) {
    return <p className="text-slate-300">Group not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Group</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{group.name}</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Manager</dt>
            <dd className="text-lg font-semibold">{manager?.displayName ?? 'Unassigned'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Members</dt>
            <dd className="text-lg font-semibold">{memberCount}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Projects</dt>
            <dd className="text-lg font-semibold">{projects.filter((project) => project.groupId === group.id).length}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/groups/${group.id}/staff`}
            className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-100"
          >
            Manage Staff
          </Link>
          <Link
            to={`/groups/${group.id}/projects`}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Manage Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;
