import { Navigate } from 'react-router-dom';

export default function AdminAuthMiddleware({ children }) {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token; // Returns true if token exists
  };

  if (!isAuthenticated()) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/adminpages" replace />;
  }

  return children;
}
