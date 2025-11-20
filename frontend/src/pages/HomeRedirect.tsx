import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'Owner') {
    return <Navigate to="/groups" replace />;
  }
  if (user.role === 'Manager' && user.groupId) {
    return <Navigate to={`/groups/${user.groupId}`} replace />;
  }
  return <Navigate to="/my-tasks" replace />;
};

export default HomeRedirect;
