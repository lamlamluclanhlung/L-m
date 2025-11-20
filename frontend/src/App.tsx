import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import HomeRedirect from './pages/HomeRedirect';
import GroupsPage from './pages/GroupsPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import StaffPage from './pages/StaffPage';
import ProjectsPage from './pages/ProjectsPage';
import TaskBoardPage from './pages/TaskBoardPage';
import ProjectSummaryPage from './pages/ProjectSummaryPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import ProjectReportsPage from './pages/ProjectReportsPage';
import TaskReportsPage from './pages/TaskReportsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import MyTasksPage from './pages/MyTasksPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
          <Route path="/groups/:groupId/staff" element={<StaffPage />} />
          <Route path="/groups/:groupId/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectSummaryPage />} />
          <Route path="/projects/:projectId/tasks" element={<TaskBoardPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
          <Route path="/reports/projects" element={<ProjectReportsPage />} />
          <Route path="/reports/tasks" element={<TaskReportsPage />} />
          <Route path="/profile/password" element={<ChangePasswordPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
