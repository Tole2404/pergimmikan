import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-css';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import DownloadImageButton from '../DownloadImageButton';
import './RetroModal.css';

const RetroModal = ({ 
  isOpen, 
  onClose, 
  images, 
  title = "Photo Gallery",
  currentImageIndex,
  onImageClick 
}) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (fullscreenImage !== null) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, fullscreenImage]);

  if (!isOpen) return null;

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 3,
    500: 2,
    400: 2
  };

  const handleImageClick = (index) => {
    if (onImageClick) {
      onImageClick(index);
    }
    setFullscreenImage(index);
  };

  const navigateFullscreen = (direction) => {
    if (fullscreenImage === null) return;
    
    let newIndex = fullscreenImage + direction;
    
    if (newIndex < 0) {
      newIndex = images.length - 1; // Loop to end
    } else if (newIndex >= images.length) {
      newIndex = 0; // Loop to beginning
    }
    
    setFullscreenImage(newIndex);
  };

  return (
    <div className="pgm-modal-overlay" onClick={onClose}>
      <div className="pgm-modal" onClick={e => e.stopPropagation()}>
        <div className="pgm-modal__header">
          <div className="pgm-modal__title-container">
            <div className="pgm-modal__corner pgm-modal__corner--tl"></div>
            <h2 className="pgm-modal__title">{title}</h2>
            <div className="pgm-modal__corner pgm-modal__corner--tr"></div>
          </div>
          <button 
            className="pgm-modal__close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="pgm-modal__close-x">×</span>
          </button>
        </div>

        <div className="pgm-modal__content">
          <Masonry
            breakpointCols={breakpointColumns}
            className="pgm-modal__masonry"
            columnClassName="pgm-modal__masonry-column"
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="pgm-modal__image-container"
              >
                <div className="pgm-modal__image-frame">
                  <DownloadImageButton 
                    imageUrl={image.src}
                    fileName={`photo-${index + 1}`}
                  />
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="pgm-modal__image"
                    loading="lazy"
                    onClick={() => handleImageClick(index)}
                  />
                </div>
                {image.caption && (
                  <p className="pgm-modal__caption">{image.caption}</p>
                )}
              </div>
            ))}
          </Masonry>
        </div>

        <div className="pgm-modal__footer">
          <div className="pgm-modal__corner pgm-modal__corner--bl"></div>
          <div className="pgm-modal__footer-content">
            <span className="pgm-modal__footer-text">
              {images.length} photos
            </span>
          </div>
          <div className="pgm-modal__corner pgm-modal__corner--br"></div>
        </div>
      </div>

      {fullscreenImage !== null && (
        <div 
          className="pgm-lightbox-overlay"
          onClick={() => setFullscreenImage(null)}
        >
          <div 
            className="pgm-lightbox"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="pgm-lightbox__close" 
              onClick={() => setFullscreenImage(null)}
              aria-label="Close fullscreen image"
            >
              <FaTimes />
            </button>
            
            <button 
              className="pgm-lightbox__nav pgm-lightbox__nav-prev" 
              onClick={(e) => {
                e.stopPropagation();
                navigateFullscreen(-1);
              }}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            
            <div className="pgm-lightbox__image-container">
              <DownloadImageButton 
                imageUrl={images[fullscreenImage].src}
                fileName={`photo-${fullscreenImage + 1}`}
                className="large"
              />
              <img 
                src={images[fullscreenImage].src} 
                alt={images[fullscreenImage].caption || 'Fullscreen image'} 
                className="pgm-lightbox__image"
              />
              
              {images[fullscreenImage].caption && (
                <div className="pgm-lightbox__caption-container">
                  <p className="pgm-lightbox__caption">
                    {images[fullscreenImage].caption}
                  </p>
                </div>
              )}
            </div>
            
            <button 
              className="pgm-lightbox__nav pgm-lightbox__nav-next" 
              onClick={(e) => {
                e.stopPropagation();
                navigateFullscreen(1);
              }}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
            
            <div className="pgm-lightbox__counter">
              {fullscreenImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RetroModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      caption: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string,
  currentImageIndex: PropTypes.number,
  onImageClick: PropTypes.func
};

export default RetroModal;
