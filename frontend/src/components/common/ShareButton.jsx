import React, { useState } from 'react';
import { FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaLink, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ShareButton.css';

const ShareButton = ({ url, title, description, image }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get full URL
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || 'Check out this amazing journey!';
  const shareImage = image || '';

  // Share handlers
  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
    window.open(waUrl, '_blank');
    setShowMenu(false);
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(telegramUrl, '_blank');
    setShowMenu(false);
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDescription + '\n\n' + shareUrl)}`;
    window.location.href = emailUrl;
    setShowMenu(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
      setShowMenu(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  // Native share (for mobile)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        setShowMenu(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="share-button-container">
      <button 
        className="share-button"
        onClick={nativeShare}
        title="Share this journey"
      >
        <FaShareAlt />
        <span>Share</span>
      </button>

      {showMenu && (
        <>
          <div className="share-overlay" onClick={() => setShowMenu(false)} />
          <div className="share-menu">
            <div className="share-menu-header">
              <h4>Share this journey</h4>
              <button className="share-close" onClick={() => setShowMenu(false)}>×</button>
            </div>
            <div className="share-options">
              <button className="share-option facebook" onClick={shareToFacebook}>
                <FaFacebook />
                <span>Facebook</span>
              </button>
              <button className="share-option twitter" onClick={shareToTwitter}>
                <FaTwitter />
                <span>Twitter</span>
              </button>
              <button className="share-option whatsapp" onClick={shareToWhatsApp}>
                <FaWhatsapp />
                <span>WhatsApp</span>
              </button>
              <button className="share-option telegram" onClick={shareToTelegram}>
                <FaTelegram />
                <span>Telegram</span>
              </button>
              <button className="share-option email" onClick={shareViaEmail}>
                <FaEnvelope />
                <span>Email</span>
              </button>
              <button className="share-option copy" onClick={copyLink}>
                <FaLink />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
