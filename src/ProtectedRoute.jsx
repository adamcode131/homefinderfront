import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();

  // If not logged in
  if (!currentUser) {
    return <Navigate to="/login_owner" />;
  }

  // If role restriction exists, check it
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />; // redirect unauthorized users to home
  }

  return children;
};

export default ProtectedRoute;
