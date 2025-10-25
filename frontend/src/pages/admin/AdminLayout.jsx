import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './styles/Admin.css'; // Pastikan path ini benar dan file CSS ada
import {
  FaTachometerAlt, FaUsers, FaUsersCog, FaFileAlt, FaImages, FaCalendarAlt,
  FaLandmark, FaQuoteRight, FaHistory, FaMapMarkedAlt, FaHiking, FaPiggyBank,
  FaSignOutAlt, FaBars, FaChevronDown, FaChevronUp, FaSearch, FaMountain, FaCalculator
} from 'react-icons/fa';

// Komponen untuk Dropdown Navigasi
const NavDropdown = ({ title, icon, children, path }) => {
  const location = useLocation();
  // Cek apakah path saat ini adalah bagian dari path dropdown
  const isActive = location.pathname.startsWith(path);
  const [isOpen, setIsOpen] = useState(isActive);

  // Buka dropdown jika halaman aktif saat pertama kali dimuat
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  return (
    <div className={`nav-dropdown ${isOpen ? 'active' : ''}`}>
      <div className="nav-dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {icon}
          <span className="nav-text">{title}</span>
        </div>
        <span className="nav-text">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      <div className={`nav-dropdown-menu ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 992);
  const [adminData, setAdminData] = useState(null);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const data = localStorage.getItem('adminData');
    if (!token || !data) {
      navigate('/adminpages');
    } else {
      setAdminData(JSON.parse(data));
    }
  }, [navigate]);

  // Handle window resize untuk tampilan mobile
  const handleResize = () => {
    if (window.innerWidth <= 992) {
      setIsMobileView(true);
      setSidebarOpen(false);
    } else {
      setIsMobileView(false);
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mengatur judul halaman berdasarkan URL
  const getPageTitle = (pathname) => {
    const routes = {
      '/dashboard': 'Dashboard',
      '/dashboard/users': 'User Management',
      '/dashboard/team': 'Team Management',
      '/dashboard/content': 'Content',
      '/dashboard/gallery': 'Captured Moments',
      '/dashboard/events': 'Events',
      '/dashboard/legacy': 'Legacy',
      '/dashboard/quotes': 'Quotes',
      '/dashboard/journey': 'Journey',
      '/dashboard/activities': 'Activities',
      '/dashboard/savings': 'Savings',
      '/dashboard/trip-calculator/mountains': 'Mountains Management',
      '/dashboard/trip-calculator/tracks': 'Tracks Management',
      '/dashboard/trip-calculator/transportation': 'Transportation Management',
      '/dashboard/trip-calculator/equipment': 'Equipment Management',
      '/dashboard/seo': 'SEO Management',
    };
    // Cari judul yang cocok, atau kembalikan judul default
    for (const route in routes) {
        if (pathname.startsWith(route) && route.length > 1) return routes[route];
    }
    return routes['/dashboard']; // Default title
  };

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location.pathname]);

  // Fungsi untuk logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Anda yakin ingin keluar?',
      text: "Anda akan keluar dari panel admin.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6b35',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, keluar!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        Swal.fire(
          'Berhasil Keluar!',
          'Anda telah berhasil logout.',
          'success'
        );
        navigate('/adminpages');
      }
    });
  };

  // Tampilkan loading jika data admin belum siap
  if (!adminData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      {isMobileView && isSidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)}></div>}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-headerr">
          <h2 className="brand-text">GIMMIK</h2>
          {!isMobileView && (
             <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <FaBars />
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          <div className="nav-links-container">
            <NavLink to="/dashboard" className="nav-link" end><FaTachometerAlt /> <span className="nav-text">Dashboard</span></NavLink>
            <NavLink to="/dashboard/users" className="nav-link"><FaUsers /> <span className="nav-text">User Management</span></NavLink>
            <NavLink to="/dashboard/team" className="nav-link"><FaUsersCog /> <span className="nav-text">Team Management</span></NavLink>
            
            <NavDropdown title="Content Management" icon={<FaFileAlt />} path="/dashboard/content">
              <NavLink to="/dashboard/gallery" className="nav-link"><FaImages /> <span className="nav-text">Captured Moments</span></NavLink>
              <NavLink to="/dashboard/events" className="nav-link"><FaCalendarAlt /> <span className="nav-text">Events</span></NavLink>
              <NavLink to="/dashboard/legacy" className="nav-link"><FaLandmark /> <span className="nav-text">Legacy</span></NavLink>
              <NavLink to="/dashboard/quotes" className="nav-link"><FaQuoteRight /> <span className="nav-text">Quotes</span></NavLink>
            </NavDropdown>

            <NavLink to="/dashboard/journey" className="nav-link"><FaMapMarkedAlt /> <span className="nav-text">Journeys</span></NavLink>
            <NavLink to="/dashboard/activities" className="nav-link"><FaHiking /> <span className="nav-text">Activities</span></NavLink>
            <NavLink to="/dashboard/savings" className="nav-link"><FaPiggyBank /> <span className="nav-text">Savings</span></NavLink>
            
            <NavDropdown title="Trip Calculator" icon={<FaCalculator />} path="/dashboard/trip-calculator">
              <NavLink to="/dashboard/trip-calculator/mountains" className="nav-link"><FaMountain /> <span className="nav-text">Mountains</span></NavLink>
              <NavLink to="/dashboard/trip-calculator/tracks" className="nav-link"><FaMapMarkedAlt /> <span className="nav-text">Tracks</span></NavLink>
              <NavLink to="/dashboard/trip-calculator/transportation" className="nav-link"><FaHiking /> <span className="nav-text">Transportation</span></NavLink>
              <NavLink to="/dashboard/trip-calculator/equipment" className="nav-link"><FaLandmark /> <span className="nav-text">Equipment</span></NavLink>
            </NavDropdown>
            
            <NavLink to="/dashboard/seo" className="nav-link"><FaSearch /> <span className="nav-text">SEO Management</span></NavLink>
          </div>
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> <span className="nav-text">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className={`admin-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        <header className="admin-header">
          <div className="container-fluid">
            <div className="header-content">
              <div className="header-left">
                {isMobileView && (
                  <button className="toggle-btn mobile-toggle" style={{display: 'block'}} onClick={() => setSidebarOpen(!isSidebarOpen)}>
                    <FaBars />
                  </button>
                )}
                <div className="header-titles">
                    <h1 className="header-title">PERGIMMIKAN</h1>
                    <div className="header-divider"></div>
                    <div className="header-subtitle-container">
                        <p className="header-subtitle">{pageTitle}</p>
                    </div>
                </div>
              </div>
              <div className="user-info__admin">
                <span className="user-name__admin">Welcome, {adminData.username}</span>
                <div className="user-avatar">
                  <FaUsersCog size={24} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
        
        <footer className="admin-footer">
            <div className="footer-content">
                <div className="footer-copyright">
                    <p>&copy; {new Date().getFullYear()} PERGIMMIKAN. All Rights Reserved.</p>
                </div>
                <div className="footer-info">
                    <p>Admin Control Panel v1.0</p>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}
