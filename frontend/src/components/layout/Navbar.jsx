import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { showConfirm, showSuccess } from '../../utils/sweetalert';
import NotificationDropdown from '../common/NotificationDropdown';
import './Navbar.css';

const API_URL = import.meta.env.VITE_API_URL;
// Default avatar as data URL - simple placeholder
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23d4af37' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const mobileProfileButtonRef = useRef(null);
  const location = useLocation();

  const checkLoginStatus = () => {
    try {
      // Check both adminToken and regular token
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('token');
      const token = adminToken || userToken;
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setIsLoggedIn(false);
        setUserData(null);
        setRefreshKey(prev => prev + 1);
        return;
      }

      const user = JSON.parse(userStr);

      if (user) {
        setIsLoggedIn(true);
        setUserData(user);
        setRefreshKey(prev => prev + 1);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUserData(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleAuthChange = () => {
      checkLoginStatus();
    };

    // Listen to storage changes (for multi-tab sync)
    window.addEventListener('storage', handleAuthChange);
    // Listen to custom auth update event
    window.addEventListener('authUpdate', handleAuthChange);
    // Listen to location changes (for navigation)
    window.addEventListener('popstate', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authUpdate', handleAuthChange);
      window.removeEventListener('popstate', handleAuthChange);
    };
  }, []);
  
  // Re-check login status on route change
  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname]);
  
  // Force check on window focus (when user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      checkLoginStatus();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        mobileProfileMenuRef.current &&
        !mobileProfileMenuRef.current.contains(event.target) &&
        !mobileProfileButtonRef.current.contains(event.target)
      ) {
        setIsMobileProfileMenuOpen(false);
      }
    };

    setIsScrolled(location.pathname !== '/' || window.scrollY > 50);

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, location.pathname]);

  useEffect(() => {
    // Reset mobile profile menu when main menu is closed
    if (!isMenuOpen) {
      setIsMobileProfileMenuOpen(false);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileProfileMenu = (e) => {
    e.stopPropagation();
    setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen);
  };

  const handleLogout = async () => {
    const result = await showConfirm('LOGGIN\' OUT?', 'Are you sure you want to leave this groovy place?', 'YEAH, SPLIT!', 'NAH, STAY');
    
    if (result.isConfirmed) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserData(null);
      setIsProfileMenuOpen(false);
      setIsMobileProfileMenuOpen(false);
      window.dispatchEvent(new Event('authUpdate'));
      
      await showSuccess('SEE YA LATER!', 'You\'ve been successfully logged out.');
      window.location.href = '/';
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const navbarClass = `nav-ribbon ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="container nav-container">
        <div className="nav-logo-container">
          <Link to="/" className={`nav-logo ${isActive('/')}`}>
            <div className="logo-text">PERGIMMIKAN</div>
            <div className="logo-stars">
              <span className="line">—</span>
              <span className="stars">★★★</span>
              <span className="line">—</span>
            </div>
            <div className="logo-curved-text">
              <svg viewBox="0 0 100 50">
                <path id="curve" d="M 10,10 A 60,40 0 0,0 91,7" fill="transparent" />
                <text>
                  <textPath href="#curve" startOffset="50%" textAnchor="middle" fill="var(--retro-cream)">
                    SINCE 2021
                  </textPath>
                </text>
              </svg>
            </div>
          </Link>
        </div>

        <div className="nav-left">
          <Link to="/" className={isActive('/')}>
            HOME
            <span>landing</span>
          </Link>
          <Link to="/journey" className={isActive('/journey')}>
            JOURNEY
            <span>our works</span>
          </Link>
          <Link to="/map" className={isActive('/map')}>
            MAP
            <span>journey map</span>
          </Link>
          <Link to="/activities" className={isActive('/activities')}>
            ACTIVITIES
            <span>our programs</span>
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/team" className={isActive('/team')}>
            TEAM
            <span>our members</span>
          </Link>
          <Link to="/next" className={isActive('/next')}>
            TRIP
            <span>plan your journey</span>
          </Link>
          {isLoggedIn && userData ? (
            <NotificationDropdown key={`notif-${userData.id}-${refreshKey}`} />
          ) : null}
          {isLoggedIn && userData ? (
            <div className="profile-container">
              <button 
                ref={profileButtonRef}
                onClick={toggleProfileMenu} 
                className="profile-button"
              >
                <img 
                  src={userData.image_url ? `${API_URL}${userData.image_url}` : DEFAULT_AVATAR} 
                  alt="Profile" 
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <span className="profile-name">{userData.username}</span>
              </button>
              {isProfileMenuOpen && (
                <div className="profile-menu" ref={profileMenuRef}>
                  <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                    <div className="menu-item">
                      <i className="menu-icon profile-icon">👤</i>
                      <span>Profile</span>
                    </div>
                  </Link>
                  <Link to="/savings" onClick={() => setIsProfileMenuOpen(false)}>
                    <div className="menu-item">
                      <i className="menu-icon savings-icon">💰</i>
                      <span>Savings</span>
                    </div>
                  </Link>
                  <Link to="/settings" onClick={() => setIsProfileMenuOpen(false)}>
                    <div className="menu-item">
                      <i className="menu-icon settings-icon">⚙️</i>
                      <span>Settings</span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="logout-button">
                    <div className="menu-item">
                      <i className="menu-icon logout-icon">🚪</i>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={`nav-login-btn ${isActive('/login')}`}>
              LOGIN
              <span>members area</span>
            </Link>
          )}
        </div>

        <button 
          ref={buttonRef}
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <div className="hamburger-box">
            <div className="hamburger-inner"></div>
          </div>
        </button>

        {isMenuOpen && (
          <div 
            ref={menuRef}
            className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
          >
            <div className="nav-links">
              <Link to="/" onClick={toggleMenu} className={isActive('/')}>
                BERANDA
                <span>home</span>
              </Link>
              <Link to="/journey" onClick={toggleMenu} className={isActive('/journey')}>
                JOURNEY
                <span>our works</span>
              </Link>
              <Link to="/map" onClick={toggleMenu} className={isActive('/map')}>
                MAP
                <span>journey map</span>
              </Link>
              <Link to="/activities" onClick={toggleMenu} className={isActive('/activities')}>
                ACTIVITIES
                <span>our programs</span>
              </Link>
              <Link to="/team" onClick={toggleMenu} className={isActive('/team')}>
                TEAM
                <span>our members</span>
              </Link>
              <Link to="/next" onClick={toggleMenu} className={isActive('/next')}>
                TRIP
                <span>plan your journey</span>
              </Link>
              {isLoggedIn && userData ? (
                <div className="mobile-profile">
                  <div 
                    className="mobile-profile-header"
                    ref={mobileProfileButtonRef}
                    onClick={toggleMobileProfileMenu}
                  >
                    <img 
                      src={userData.image_url ? `${API_URL}${userData.image_url}` : DEFAULT_AVATAR} 
                      alt="Profile" 
                      className="profile-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <span className="profile-name">{userData.username}</span>
                  </div>
                  {isMobileProfileMenuOpen && (
                    <div className="mobile-profile-menu" ref={mobileProfileMenuRef}>
                      <Link to="/profile" onClick={toggleMenu} className="mobile-menu-item">
                        <i className="menu-icon">👤</i>
                        <span>Profile</span>
                      </Link>
                      <Link to="/savings" onClick={toggleMenu} className="mobile-menu-item">
                        <i className="menu-icon">💰</i>
                        <span>Savings</span>
                      </Link>
                      <Link to="/settings" onClick={toggleMenu} className="mobile-menu-item">
                        <i className="menu-icon">⚙️</i>
                        <span>Settings</span>
                      </Link>
                      <button onClick={async () => { 
                        const result = await showConfirm('LOGGIN\'OUT?', 'Are you sure you want to leave this groovy place?', 'YEAH, SPLIT!', 'NAH, STAY');
                        if (result.isConfirmed) {
                          handleLogout(); 
                          toggleMenu();
                        }
                      }} className="mobile-menu-item logout-button">
                        <i className="menu-icon">🚪</i>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={toggleMenu} className={`nav-login-btn ${isActive('/login')}`}>
                  LOGIN
                  <span>members area</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
