import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './Settings.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
  const [loading, setLoading] = useState(false);
  
  // Theme settings
  const [theme, setTheme] = useState('groovy');
  
  // Language settings
  const [language, setLanguage] = useState('id');
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    activityUpdates: true,
    teamMessages: true,
    securityAlerts: true
  });

  useEffect(() => {
    // Load saved settings if they exist
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('userTheme', newTheme);
    toast.success(language === 'id' ? `Tema diubah ke ${newTheme}` : `Theme changed to ${newTheme}`);
    // In a real app, you would apply the theme here
  };
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('userLanguage', newLanguage);
    
    const message = newLanguage === 'id' 
      ? 'Bahasa diubah ke Indonesia' 
      : 'Language changed to English';
    
    toast.success(message);
    // In a real app, you would apply the language change here
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    const updatedNotifications = {
      ...notifications,
      [name]: checked
    };
    setNotifications(updatedNotifications);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
  };
  
  const handleSaveNotifications = () => {
    // In a real app, you would save these to your backend
    toast.success(language === 'id' ? 'Preferensi notifikasi disimpan' : 'Notification preferences saved');
  };
  
  const handleResetSettings = () => {
    // Reset to defaults
    setTheme('groovy');
    setLanguage('id');
    setNotifications({
      emailNotifications: true,
      activityUpdates: true,
      teamMessages: true,
      securityAlerts: true
    });
    
    // Clear localStorage
    localStorage.removeItem('userTheme');
    localStorage.removeItem('userLanguage');
    localStorage.removeItem('userNotifications');
    
    toast.success(language === 'id' ? 'Pengaturan direset ke default' : 'Settings reset to defaults');
  };

  // Translations
  const translations = {
    id: {
      settings: 'Pengaturan',
      description: 'Sesuaikan pengalaman groovy Anda',
      themesTitle: 'Pengaturan Tema',
      groovy: 'Groovy',
      disco: 'Disco',
      psychedelic: 'Psychedelic',
      languageTitle: 'Pengaturan Bahasa',
      indonesian: 'Indonesia',
      english: 'Inggris',
      notificationTitle: 'Preferensi Notifikasi',
      emailNotifs: 'Notifikasi Email',
      activityUpdates: 'Update Aktivitas',
      teamMessages: 'Pesan Tim',
      securityAlerts: 'Peringatan Keamanan',
      saveNotifs: 'Simpan Pengaturan Notifikasi',
      goToProfile: 'Ke Halaman Profil',
      resetAll: 'Reset Semua Pengaturan'
    },
    en: {
      settings: 'Settings',
      description: 'Customize your groovy experience',
      themesTitle: 'Theme Settings',
      groovy: 'Groovy',
      disco: 'Disco',
      psychedelic: 'Psychedelic',
      languageTitle: 'Language Settings',
      indonesian: 'Indonesian',
      english: 'English',
      notificationTitle: 'Notification Preferences',
      emailNotifs: 'Email Notifications',
      activityUpdates: 'Activity Updates',
      teamMessages: 'Team Messages',
      securityAlerts: 'Security Alerts',
      saveNotifs: 'Save Notification Settings',
      goToProfile: 'Go to Profile',
      resetAll: 'Reset All Settings'
    }
  };
  
  // Get current language translations
  const t = translations[language === 'id' ? 'id' : 'en'];

  return (
    <div className="settings-container full-width">
      {/* Floating Decorative Elements */}
      <div className="groovy-circle circle-1"></div>
      <div className="groovy-circle circle-2"></div>
      <div className="groovy-circle circle-3"></div>
      <div className="groovy-shape shape-1">☮</div>
      <div className="groovy-shape shape-2">★</div>
      
      <div className="settings-header">
        <h1>{t.settings}</h1>
        <div className="header-stars">★ ★ ★</div>
        <p className="settings-description">{t.description}</p>
      </div>

      <div className="settings-content">
        <section className="theme-section">
          <h2>{t.themesTitle}</h2>
          <div className="theme-options">
            <div className="theme-option">
              <input 
                type="radio" 
                id="groovy-theme" 
                name="theme" 
                value="groovy" 
                checked={theme === 'groovy'} 
                onChange={handleThemeChange}
              />
              <label htmlFor="groovy-theme" className="theme-label groovy-theme">
                <div className="theme-color"></div>
                <span>{t.groovy}</span>
              </label>
            </div>
            
            <div className="theme-option">
              <input 
                type="radio" 
                id="disco-theme" 
                name="theme" 
                value="disco" 
                checked={theme === 'disco'} 
                onChange={handleThemeChange}
              />
              <label htmlFor="disco-theme" className="theme-label disco-theme">
                <div className="theme-color"></div>
                <span>{t.disco}</span>
              </label>
            </div>
            
            <div className="theme-option">
              <input 
                type="radio" 
                id="psych-theme" 
                name="theme" 
                value="psych" 
                checked={theme === 'psych'} 
                onChange={handleThemeChange}
              />
              <label htmlFor="psych-theme" className="theme-label psych-theme">
                <div className="theme-color"></div>
                <span>{t.psychedelic}</span>
              </label>
            </div>
          </div>
        </section>

        <section className="language-section">
          <h2>{t.languageTitle}</h2>
          <div className="language-options">
            <div className="language-option">
              <input 
                type="radio" 
                id="id-language" 
                name="language" 
                value="id" 
                checked={language === 'id'} 
                onChange={handleLanguageChange}
              />
              <label htmlFor="id-language" className="language-label">
                <span>🇮🇩 {t.indonesian}</span>
              </label>
            </div>
            
            <div className="language-option">
              <input 
                type="radio" 
                id="en-language" 
                name="language" 
                value="en" 
                checked={language === 'en'} 
                onChange={handleLanguageChange}
              />
              <label htmlFor="en-language" className="language-label">
                <span>🇬🇧 {t.english}</span>
              </label>
            </div>
          </div>
        </section>
        
        <section className="notification-section">
          <h2>{t.notificationTitle}</h2>
          <div className="notification-options">
            <div className="notification-option">
              <input 
                type="checkbox" 
                id="emailNotifications" 
                name="emailNotifications" 
                checked={notifications.emailNotifications} 
                onChange={handleNotificationChange}
              />
              <label htmlFor="emailNotifications">{t.emailNotifs}</label>
            </div>
            
            <div className="notification-option">
              <input 
                type="checkbox" 
                id="activityUpdates" 
                name="activityUpdates" 
                checked={notifications.activityUpdates} 
                onChange={handleNotificationChange}
              />
              <label htmlFor="activityUpdates">{t.activityUpdates}</label>
            </div>
            
            <div className="notification-option">
              <input 
                type="checkbox" 
                id="teamMessages" 
                name="teamMessages" 
                checked={notifications.teamMessages} 
                onChange={handleNotificationChange}
              />
              <label htmlFor="teamMessages">{t.teamMessages}</label>
            </div>
            
            <div className="notification-option">
              <input 
                type="checkbox" 
                id="securityAlerts" 
                name="securityAlerts" 
                checked={notifications.securityAlerts} 
                onChange={handleNotificationChange}
              />
              <label htmlFor="securityAlerts">{t.securityAlerts}</label>
            </div>
            
            <button 
              className="retro-button save-notifications" 
              onClick={handleSaveNotifications}
            >
              {t.saveNotifs}
            </button>
          </div>
        </section>
        
        <div className="settings-links">
          <Link to="/profile" className="profile-link">{t.goToProfile}</Link>
          <button className="reset-button" onClick={handleResetSettings}>{t.resetAll}</button>
        </div>
      </div>
    </div>
  );
}
