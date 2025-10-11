import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCommentAlt, faMedal, faStar, faCalendarAlt, faLock, faPen, faCamera, faChevronRight, faUserFriends, faHistory } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import { showSuccess, showError, showLoading, closePopup } from '../../utils/sweetalert';
import Loading from '../../components/common/Loading';

const API_URL = import.meta.env.VITE_API_URL;
// Default avatar as data URL
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23f1c40f' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    journeys: 0,
    activities: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    bio: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      fetchUserStats(user.id);
    }
    setLoading(false);
  }, []);

  const fetchUserStats = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/team/auth/profile/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      showError('Failed to load user statistics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading('UPDATING PROFILE...', 'Hang tight while we save your groovy details!');
    
    try {
      // Bandingkan data form saat ini dengan data user awal
      // Hanya kirim field yang berubah
      const updatedFields = {};
      
      if (formData.full_name !== userData.full_name) {
        updatedFields.full_name = formData.full_name;
      }
      
      if (formData.bio !== userData.bio) {
        updatedFields.bio = formData.bio;
      }
      
      // Hanya kirim email jika benar-benar berubah
      if (formData.email !== userData.email) {
        updatedFields.email = formData.email;
      }
      
      // Jika tidak ada yang berubah, tidak perlu kirim request
      if (Object.keys(updatedFields).length === 0) {
        closePopup();
        showSuccess('NO CHANGES DETECTED', 'Your profile is already up to date!');
        setIsEditing(false);
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/team/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const { user } = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      setUserData(user);
      setIsEditing(false);
      closePopup();
      showSuccess('FAR OUT!', 'Your profile has been updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      closePopup();
      showError('BUMMER!', error.message || 'Failed to update profile');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showError('WRONG FILE TYPE!', 'Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('FILE TOO LARGE!', 'Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    showLoading('UPLOADING IMAGE...', 'Hang tight while we process your radical new pic!');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/team/auth/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { user } = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      setUserData(user);
      closePopup();
      showSuccess('RIGHTEOUS!', 'Your profile image has been updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      closePopup();
      showError('BUMMER!', error.message || 'Failed to upload image');
    }
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    // Reset password fields when toggling
    if (!showPasswordForm) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      showError('PASSWORD MISMATCH!', 'New passwords do not match!');
      return;
    }
    
    setPasswordLoading(true);
    showLoading('CHANGING PASSWORD...', 'Hang tight while we secure your account!');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/team/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      closePopup();
      showSuccess('PASSWORD CHANGED!', 'Your password has been updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      closePopup();
      showError('PASSWORD ERROR!', error.message || 'Failed to change password');
      console.error('Change password error:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Loading size="large" overlay={true} text="Loading profile..." />
      </div>
    );
  }

  if (!userData) {
    return <div className="profile-error">Please login to view your profile</div>;
  }

  return (
    <div className="profile-dashboard">
      {/* Decorative Background */}
      <div className="dashboard-background">
        <div className="background-shape shape1"></div>
        <div className="background-shape shape2"></div>
        <div className="background-shape shape3"></div>
      </div>
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <div className="avatar-container">
              <div className="avatar-wrapper" onClick={handleImageClick}>
                <img 
                  src={userData.image_url ? `${API_URL}${userData.image_url}` : DEFAULT_AVATAR} 
                  alt="Profile" 
                  className="avatar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <div className="avatar-edit-icon">
                  <FontAwesomeIcon icon={faCamera} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif"
                style={{ display: 'none' }}
              />
            </div>
            <h2 className="user-name">{userData.username}</h2>
            <div className="user-role">{userData.role_name || 'Member'}</div>
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li 
                className={activeSection === 'profile' ? 'active' : ''}
                onClick={() => setActiveSection('profile')}
              >
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                <span>Profile</span>
                <FontAwesomeIcon icon={faChevronRight} className="chevron" />
              </li>
              <li 
                className={activeSection === 'stats' ? 'active' : ''}
                onClick={() => setActiveSection('stats')}
              >
                <FontAwesomeIcon icon={faStar} className="nav-icon" />
                <span>Statistics</span>
                <FontAwesomeIcon icon={faChevronRight} className="chevron" />
              </li>
              <li 
                className={activeSection === 'security' ? 'active' : ''}
                onClick={() => setActiveSection('security')}
              >
                <FontAwesomeIcon icon={faLock} className="nav-icon" />
                <span>Security</span>
                <FontAwesomeIcon icon={faChevronRight} className="chevron" />
              </li>
            </ul>
          </nav>
          
          <div className="sidebar-stats">
            <div className="stat-box">
              <div className="stat-value">{stats.journeys}</div>
              <div className="stat-label">Journeys</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.activities}</div>
              <div className="stat-label">Activities</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.events}</div>
              <div className="stat-label">Events</div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="profile-main-content">
          <div className="content-header">
            <h1>
              {activeSection === 'profile' && 'My Profile'}
              {activeSection === 'stats' && 'My Statistics'}
              {activeSection === 'security' && 'Security Settings'}
            </h1>
            
            {activeSection === 'profile' && (
              <button 
                className="action-button edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FontAwesomeIcon icon={faPen} /> 
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          
          <div className="content-body">
            {activeSection === 'profile' && (
              <div className="profile-content">
                {isEditing ? (
                  <div className="edit-profile-form">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label><FontAwesomeIcon icon={faUser} /> Full Name</label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="form-control"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="form-group">
                        <label><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="form-control"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="form-group">
                        <label><FontAwesomeIcon icon={faCommentAlt} /> Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="form-control"
                          placeholder="Tell us about yourself"
                          rows="4"
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="save-button">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="profile-cards">
                    <div className="info-card">
                      <h3><FontAwesomeIcon icon={faUser} /> Personal Information</h3>
                      <div className="info-content">
                        <div className="info-row">
                          <div className="info-label">Full Name</div>
                          <div className="info-value">{userData.full_name || '-'}</div>
                        </div>
                        <div className="info-row">
                          <div className="info-label">Email</div>
                          <div className="info-value">{userData.email || '-'}</div>
                        </div>
                        <div className="info-row">
                          <div className="info-label">Username</div>
                          <div className="info-value">{userData.username}</div>
                        </div>
                        {userData.joined_date && (
                          <div className="info-row">
                            <div className="info-label">Member Since</div>
                            <div className="info-value">{new Date(userData.joined_date).toLocaleDateString()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <h3><FontAwesomeIcon icon={faCommentAlt} /> About Me</h3>
                      <div className="info-content">
                        <p className="bio-text">{userData.bio || 'No bio added yet.'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeSection === 'stats' && (
              <div className="statistics-content">
                <div className="stats-grid">
                  <div className="stat-card journey-card">
                    <div className="stat-icon-container">
                      <FontAwesomeIcon icon={faUserFriends} className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <h3>Journeys</h3>
                      <div className="stat-number">{stats.journeys}</div>
                      <p className="stat-desc">Completed journeys</p>
                    </div>
                    <div className="stat-progress">
                      <div className="progress-bar" style={{ width: `${Math.min(stats.journeys * 10, 100)}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="stat-card activity-card">
                    <div className="stat-icon-container">
                      <FontAwesomeIcon icon={faMedal} className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <h3>Activities</h3>
                      <div className="stat-number">{stats.activities}</div>
                      <p className="stat-desc">Completed activities</p>
                    </div>
                    <div className="stat-progress">
                      <div className="progress-bar" style={{ width: `${Math.min(stats.activities * 5, 100)}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="stat-card event-card">
                    <div className="stat-icon-container">
                      <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <h3>Events</h3>
                      <div className="stat-number">{stats.events}</div>
                      <p className="stat-desc">Attended events</p>
                    </div>
                    <div className="stat-progress">
                      <div className="progress-bar" style={{ width: `${Math.min(stats.events * 15, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'security' && (
              <div className="security-content">
                <div className="password-card">
                  <h3><FontAwesomeIcon icon={faLock} /> Password Settings</h3>
                  <div className="security-actions">
                    <button onClick={togglePasswordForm} className="action-button password-toggle">
                      {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  
                  {showPasswordForm && (
                    <form onSubmit={handleChangePassword} className="password-form">
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="form-control"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="save-button"
                          disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                        >
                          {passwordLoading ? 'Changing Password...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
