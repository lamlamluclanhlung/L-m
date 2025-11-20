import { Group, Project, ProjectReport, Task, TaskReport, User } from '../types';

export const seedGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Capstone Innovators',
  },
];

export const seedUsers: User[] = [
  {
    id: 'user-owner',
    username: 'owner',
    password: 'owner',
    displayName: 'System Owner',
    role: 'Owner',
    groupId: null,
  },
  {
    id: 'user-manager',
    username: 'manager',
    password: 'manager',
    displayName: 'Grace Manager',
    role: 'Manager',
    groupId: 'group-1',
  },
  {
    id: 'user-member-1',
    username: 'member1',
    password: 'member1',
    displayName: 'Alex Member',
    role: 'Member',
    groupId: 'group-1',
  },
  {
    id: 'user-member-2',
    username: 'member2',
    password: 'member2',
    displayName: 'Jamie Member',
    role: 'Member',
    groupId: 'group-1',
  },
];

export const seedProjects: Project[] = [
  {
    id: 'project-1',
    groupId: 'group-1',
    name: 'Campus Collaboration Portal',
    description: 'A portal that streamlines collaboration between students and faculty for research proposals.',
    startDate: '2024-01-15',
    endDate: '2024-05-30',
  },
];

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    name: 'Requirement Interviews',
    description: 'Schedule and conduct interviews with stakeholders.',
    startDate: '2024-01-18',
    endDate: '2024-02-05',
    status: 'Done',
    assigneeId: 'user-member-1',
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    name: 'Prototype Wireframes',
    description: 'Design low-fidelity wireframes for the core flows.',
    startDate: '2024-02-10',
    endDate: '2024-03-01',
    status: 'InProgress',
    assigneeId: 'user-member-2',
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    name: 'Technical Spike',
    description: 'Validate the feasibility of the collaboration features.',
    startDate: '2024-03-05',
    endDate: '2024-03-25',
    status: 'ToDo',
    assigneeId: 'user-member-1',
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    name: 'System Testing',
    description: 'Execute the first integrated test suite.',
    startDate: '2024-04-01',
    endDate: '2024-05-10',
    status: 'Fail',
    assigneeId: 'user-member-2',
  },
];

export const seedProjectReports: ProjectReport[] = [];
export const seedTaskReports: TaskReport[] = [];
