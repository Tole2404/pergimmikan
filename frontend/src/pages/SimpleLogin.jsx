import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError, showLoading, closePopup } from '../utils/sweetalert';
import Loading from '../components/common/Loading';
import './SimpleLogin.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function SimpleLogin({ redirectTo = '/' }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Cek jika ada query parameter untuk pesan error
  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get('session') === 'expired';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoading('LOGGING IN...', 'Please wait while we verify your credentials');

    try {
      const response = await fetch(`${API_URL}/api/team/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token
      localStorage.setItem('adminToken', data.token);
      
      // Simpan user data
      localStorage.setItem('user', JSON.stringify(data.user));

      // Trigger auth update event
      window.dispatchEvent(new Event('authUpdate'));
      window.dispatchEvent(new Event('storage'));

      // Close loading popup and show success
      closePopup();
      await showSuccess('LOGIN BERHASIL!', 'Anda akan diarahkan ke halaman tabungan');
      
      // Redirect ke halaman tabungan sederhana
      navigate(redirectTo || '/tabungan');
    } catch (error) {
      closePopup();
      showError('LOGIN GAGAL!', error.message || 'Gagal login. Periksa kredensial Anda');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Image Background */}
      <div className="video-background">
        <img src="/videos/retro-background.png" alt="Retro Background" className="background-image" />
      </div>
      
      {/* Scanlines Effect */}
      <div className="scanlines"></div>
      
      <div className="simple-login-container">
        <div className="simple-login-card">
          <div className="simple-login-header">
            <h1>PERGIMMIKAN</h1>
            <p>NABUNG NABUNG NABUNG</p>
            {sessionExpired && (
              <div className="session-expired-alert">
                Sesi Anda telah berakhir. Silakan login kembali.
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="simple-login-form">
            {loading && (
              <div className="simple-login-loading">
                <Loading size="medium" text="Logging in..." />
              </div>
            )}
            
            <div className="simple-form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                disabled={loading}
              />
            </div>

            <div className="simple-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="simple-login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="simple-login-footer">
            <p>khusus Anggota PERGIMMIKAN - Sistem Tabungan</p>
          </div>
        </div>
      </div>
    </>
  );
}
