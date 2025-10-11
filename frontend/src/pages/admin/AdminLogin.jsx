import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminLogin.css';
import Loading from '../../components/common/Loading';
import { showLoading, closePopup, showError, showSuccess } from '../../utils/sweetalert';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showLoading('AUTHENTICATING...', 'Checking your admin credentials');

    try {
      const response = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Untuk mengirim cookies jika ada
      });

      closePopup();
      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        // Store the token
        localStorage.setItem('adminToken', data.token);
        // Store admin data
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        
        // Show success message
        await showSuccess('LOGIN SUCCESSFUL!', 'Welcome to the admin dashboard');
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        showError('LOGIN FAILED', errorData.message || 'Invalid credentials');
      }
    } catch (err) {
      closePopup();
      setIsLoading(false);
      showError('CONNECTION ERROR', 'Login failed. Please check your connection and try again.');
      console.error('Login error:', err);
    }
  };

  if (isLoading) {
    return <Loading size="large" overlay text="Authenticating..." />;
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>GIMMIK ADMIN</h1>
          <p>Login to Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="admin-login-button">
            Login to Dashboard
          </button>
        </form>

        <div className="admin-login-footer">
          <p> 2024 GIMMIK Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
