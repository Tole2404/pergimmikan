import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">PERGIMMIKAN</h3>
            <p className="footer-tagline">Capturing Moments, Creating Memories</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="https://www.instagram.com/gimmicksquad?igsh=MndwcDY1djJiZnJx" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaTiktok />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            {new Date().getFullYear()} PERGIMMIKAN. All rights reserved.
          </p>
          <p className="footer-love">Made with in Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
