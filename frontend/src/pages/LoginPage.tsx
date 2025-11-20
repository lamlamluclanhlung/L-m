import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(username, password);
    if (!result.success) {
      setError(result.message ?? 'Unable to login');
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SAD DEMO</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sign in to continue</h1>
        <p className="text-sm text-slate-400">Use the seeded accounts: owner/owner, manager/manager, member1/member1…</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-200">Username</label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              placeholder="owner"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-500"
          >
            Enter Console
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
