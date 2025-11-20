import { NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
}

const Sidebar = () => {
  const { user } = useAuth();

  const items = useMemo<NavItem[]>(() => {
    if (!user) return [];
    if (user.role === 'Owner') {
      return [
        { to: '/groups', label: 'Groups' },
        { to: '/reports/projects', label: 'Project Reports' },
        { to: '/reports/tasks', label: 'Task Reports' },
      ];
    }
    if (user.role === 'Manager') {
      const baseGroupPath = user.groupId ? `/groups/${user.groupId}` : '/';
      return [
        { to: baseGroupPath, label: 'Group Details' },
        { to: `${baseGroupPath}/projects`, label: 'Projects' },
        { to: '/reports/projects', label: 'Project Reports' },
        { to: '/reports/tasks', label: 'Task Reports' },
      ];
    }
    return [
      { to: '/my-tasks', label: 'My Tasks' },
    ];
  }, [user]);

  return (
    <aside className="flex w-64 flex-col bg-slate-900 text-slate-100">
      <div className="px-6 py-5 text-xl font-semibold tracking-wide">SAD Console</div>
      <nav className="flex-1 space-y-1 px-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-800 ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-300'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 text-xs text-slate-500">© {new Date().getFullYear()} SAD Demo</div>
    </aside>
  );
};

export default Sidebar;
