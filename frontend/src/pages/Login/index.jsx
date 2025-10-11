import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';
import { showSuccess, showError, showLoading, closePopup } from '../../utils/sweetalert';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoading('LOGGING IN...', 'Please wait while we verify your groovy credentials');

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
      
      // Selalu simpan user data (tidak perlu check keepLoggedIn)
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Login successful, saved data:', {
        token: data.token,
        user: data.user
      });

      // Trigger auth update event
      window.dispatchEvent(new Event('authUpdate'));
      window.dispatchEvent(new Event('storage'));

      // Close loading popup and show success
      closePopup();
      await showSuccess('FAR OUT!', 'Login successful!');
      
      navigate('/'); // Mengubah route ke halaman utama (Landing)
    } catch (error) {
      closePopup();
      showError('BUMMER!', error.message || 'Failed to login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="hero-image">
          <img src="/images/hero/travel-hero.jpg" alt="Travel Adventure" />
          <div className="hero-overlay">
            <h1 className="hero-title">PERGIMMIKAN</h1>
            <div className="hero-stars">★ ★ ★</div>
            <p className="hero-subtitle">WELCOME TO THE JOURNEY</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <div className="header-text">GIMMIK AREA</div>
            <div className="header-stars">
              <span className="line">—</span>
              <span className="star">★</span>
              <span className="line">—</span>
            </div>
          </div>

          <div className="login-form-container">
            {loading && (
              <div className="login-loading-overlay">
                <Loading size="medium" text="Groovy login in progress..." />
              </div>
            )}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group__login">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="retro-input__login"
                  placeholder="USERNAME"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group__login">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="retro-input__login"
                  placeholder="PASSWORD"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="retro-checkbox">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    disabled={loading}
                  />
                </label>
              </div>

              <button 
                type="submit" 
                className="retro-button"
                disabled={loading}
              >
                <span className="button-text">
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </span>
                <span className="button-stars">★ ★ ★</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
