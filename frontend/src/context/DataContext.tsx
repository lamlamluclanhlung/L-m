import { createContext, useContext, useMemo, useState } from 'react';
import {
  Group,
  Project,
  ProjectReport,
  Task,
  TaskReport,
  User,
} from '../types';
import {
  seedGroups,
  seedProjects,
  seedProjectReports,
  seedTaskReports,
  seedTasks,
  seedUsers,
} from '../data/seed';

interface DataState {
  users: User[];
  groups: Group[];
  projects: Project[];
  tasks: Task[];
  projectReports: ProjectReport[];
  taskReports: TaskReport[];
}

interface DataContextValue extends DataState {
  addGroup: (input: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, input: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addUser: (input: Omit<User, 'id'>) => void;
  updateUser: (id: string, input: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addProject: (input: Omit<Project, 'id'>) => void;
  updateProject: (id: string, input: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (input: Omit<Task, 'id'>) => void;
  updateTask: (id: string, input: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProjectReport: (input: Omit<ProjectReport, 'id' | 'createdAt'>) => void;
  addTaskReport: (input: Omit<TaskReport, 'id' | 'createdAt'>) => void;
  changePassword: (userId: string, newPassword: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const storageKey = 'sad-demo-state';

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const initialState: DataState = {
  users: seedUsers,
  groups: seedGroups,
  projects: seedProjects,
  tasks: seedTasks,
  projectReports: seedProjectReports,
  taskReports: seedTaskReports,
};

const loadState = (): DataState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as DataState;
    }
    localStorage.setItem(storageKey, JSON.stringify(initialState));
  } catch (error) {
    console.error('Failed to parse stored data', error);
  }
  return initialState;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<DataState>(() => loadState());

  const updateState = (updater: (prev: DataState) => DataState) => {
    setState((prev) => {
      const next = updater(prev);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
      return next;
    });
  };

  const value = useMemo<DataContextValue>(() => ({
    ...state,
    addGroup: (input) =>
      updateState((prev) => ({
        ...prev,
        groups: [...prev.groups, { ...input, id: generateId('group') }],
      })),
    updateGroup: (id, input) =>
      updateState((prev) => ({
        ...prev,
        groups: prev.groups.map((group) => (group.id === id ? { ...group, ...input } : group)),
      })),
    deleteGroup: (id) =>
      updateState((prev) => ({
        ...prev,
        groups: prev.groups.filter((group) => group.id !== id),
        projects: prev.projects.filter((project) => project.groupId !== id),
        tasks: prev.tasks.filter((task) => {
          const project = prev.projects.find((p) => p.id === task.projectId);
          return project?.groupId !== id;
        }),
        users: prev.users.map((user) =>
          user.groupId === id ? { ...user, groupId: null, role: user.role === 'Owner' ? 'Owner' : 'Member' } : user,
        ),
      })),
    addUser: (input) =>
      updateState((prev) => ({
        ...prev,
        users: [...prev.users, { ...input, id: generateId('user') }],
      })),
    updateUser: (id, input) =>
      updateState((prev) => ({
        ...prev,
        users: prev.users.map((user) => (user.id === id ? { ...user, ...input } : user)),
      })),
    deleteUser: (id) =>
      updateState((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.id !== id),
        tasks: prev.tasks.map((task) => (task.assigneeId === id ? { ...task, assigneeId: '' } : task)),
      })),
    addProject: (input) =>
      updateState((prev) => ({
        ...prev,
        projects: [...prev.projects, { ...input, id: generateId('project') }],
      })),
    updateProject: (id, input) =>
      updateState((prev) => ({
        ...prev,
        projects: prev.projects.map((project) => (project.id === id ? { ...project, ...input } : project)),
      })),
    deleteProject: (id) =>
      updateState((prev) => ({
        ...prev,
        projects: prev.projects.filter((project) => project.id !== id),
        tasks: prev.tasks.filter((task) => task.projectId !== id),
        projectReports: prev.projectReports.filter((report) => report.projectId !== id),
        taskReports: prev.taskReports.filter((report) => {
          const task = prev.tasks.find((t) => t.id === report.taskId);
          return task?.projectId !== id;
        }),
      })),
    addTask: (input) =>
      updateState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, { ...input, id: generateId('task') }],
      })),
    updateTask: (id, input) =>
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...input } : task)),
      })),
    deleteTask: (id) =>
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.id !== id),
        taskReports: prev.taskReports.filter((report) => report.taskId !== id),
      })),
    addProjectReport: (input) =>
      updateState((prev) => ({
        ...prev,
        projectReports: [
          {
            ...input,
            id: generateId('project-report'),
            createdAt: new Date().toISOString(),
          },
          ...prev.projectReports,
        ],
      })),
    addTaskReport: (input) =>
      updateState((prev) => ({
        ...prev,
        taskReports: [
          {
            ...input,
            id: generateId('task-report'),
            createdAt: new Date().toISOString(),
          },
          ...prev.taskReports,
        ],
      })),
    changePassword: (userId, newPassword) =>
      updateState((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                password: newPassword,
              }
            : user,
        ),
      })),
  }), [state]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used inside DataProvider');
  }
  return ctx;
};
