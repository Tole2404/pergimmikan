import { useState, useEffect } from 'react';
import './Debug.css';

export default function Debug() {
  const [authStatus, setAuthStatus] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      setAuthStatus({ token, user });
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    
    window.addEventListener('authUpdate', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authUpdate', checkAuth);
    };
  }, []);

  return (
    <div className="debug-panel">
      <div className="debug-header">Debug Panel</div>
      <div className="debug-content">
        <div className="debug-item">
          <span className="debug-label">Auth Status:</span>
          <span className="debug-value">
            {authStatus.token ? '✅ Logged In' : '❌ Not Logged In'}
          </span>
        </div>
        {authStatus.user && (
          <div className="debug-item">
            <span className="debug-label">User:</span>
            <pre className="debug-value">
              {JSON.stringify(authStatus.user, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
