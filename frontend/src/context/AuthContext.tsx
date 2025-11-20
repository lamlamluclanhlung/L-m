import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useData } from './DataContext';
import { Role, User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const authStorageKey = 'sad-demo-auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { users } = useData();
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(authStorageKey);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (userId) {
      localStorage.setItem(authStorageKey, userId);
    } else {
      localStorage.removeItem(authStorageKey);
    }
  }, [userId]);

  const currentUser = useMemo(() => users.find((u) => u.id === userId) ?? null, [userId, users]);

  const value = useMemo<AuthContextValue>(() => ({
    user: currentUser,
    login: (username, password) => {
      const target = users.find((u) => u.username === username);
      if (!target) {
        return { success: false, message: 'User not found' };
      }
      if (target.password !== password) {
        return { success: false, message: 'Incorrect password' };
      }
      setUserId(target.id);
      return { success: true };
    },
    logout: () => setUserId(null),
    hasRole: (...roles) => {
      if (!currentUser) return false;
      return roles.includes(currentUser.role);
    },
  }), [currentUser, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
