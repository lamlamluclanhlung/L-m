export type Role = 'Owner' | 'Manager' | 'Member';

export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: Role;
  groupId?: string | null;
}

export interface Group {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  groupId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export type TaskStatus = 'ToDo' | 'InProgress' | 'Done' | 'Fail';

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  assigneeId: string;
}

export interface ProjectReport {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface TaskReport {
  id: string;
  taskId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
