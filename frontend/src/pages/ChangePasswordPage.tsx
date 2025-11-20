import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ChangePasswordPage = () => {
  const { user, logout } = useAuth();
  const { changePassword } = useData();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!user) {
    return <p className="text-slate-300">Please log in.</p>;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (oldPassword !== user.password) {
      setMessage('Old password does not match.');
      return;
    }
    changePassword(user.id, newPassword);
    setOldPassword('');
    setNewPassword('');
    setMessage('Password updated. Please re-login.');
    logout();
  };

  return (
    <div className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-2xl font-semibold text-white">Change password</h2>
      <p className="text-sm text-slate-400">Update your password and log in again for security.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">Old password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>
        {message && <p className="text-sm text-slate-200">{message}</p>}
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
        >
          Save new password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
