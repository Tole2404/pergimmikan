import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import './PWAInstallPrompt.css';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Deteksi iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Tangkap event beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Mencegah Chrome 76+ untuk menampilkan prompt otomatis
      e.preventDefault();
      // Simpan event agar bisa dipanggil nanti
      setDeferredPrompt(e);
      // Cek apakah user sudah menolak install sebelumnya
      const hasUserDismissed = localStorage.getItem('pwaInstallDismissed');
      const dismissedDate = hasUserDismissed ? new Date(parseInt(hasUserDismissed)) : null;
      const now = new Date();
      
      // Jika belum pernah dismiss atau sudah lebih dari 7 hari
      if (!dismissedDate || (now - dismissedDate) > (7 * 24 * 60 * 60 * 1000)) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Tampilkan prompt install
    deferredPrompt.prompt();
    
    // Tunggu user selesai dengan prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // userChoice properti hanya resolved sekali prompt dimunculkan
    if (outcome === 'accepted') {
      console.log('User menerima PWA install');
    } else {
      console.log('User menolak PWA install');
    }
    
    // Clear deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Simpan tanggal dismiss
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="prompt-content">
        <div className="prompt-icon">
          <img src="/images/logo_gimik.png" alt="PERGIMMIKAN Logo" />
        </div>
        <div className="prompt-text">
          <h3>Install PERGIMMIKAN App</h3>
          <p>
            {isIOS 
              ? 'Untuk memasang aplikasi ini: tap ikon Share, lalu "Add to Home Screen"' 
              : 'Pasang di perangkat Anda untuk akses offline dan pengalaman yang lebih baik!'}
          </p>
        </div>
        <div className="prompt-actions">
          {!isIOS && (
            <button onClick={handleInstallClick} className="install-button">
              <FontAwesomeIcon icon={faDownload} /> Pasang
            </button>
          )}
          <button onClick={dismissPrompt} className="dismiss-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
