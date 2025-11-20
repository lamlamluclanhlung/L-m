import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 text-slate-100">
      <div>
        <p className="text-sm uppercase tracking-widest text-slate-500">Systems Analysis & Design</p>
        <h1 className="text-xl font-semibold">Group · Project · Task · Report Console</h1>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        {user && (
          <div className="text-right">
            <p className="font-semibold">{user.displayName}</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">{user.role}</p>
          </div>
        )}
        <Link
          to="/profile/password"
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800"
        >
          Change Password
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-rose-500"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
