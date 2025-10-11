import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import RetroModal from '../common/RetroModal';
import './Gallery.css';
import PageTitle from '../common/PageTitle';

const API_URL = import.meta.env.VITE_API_URL || 'https://apiv1.pergimmikan.site';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery`);
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        const data = await response.json();
        
        // Limit to exactly 9 items for the 3x3 grid
        const limitedData = data.slice(0, 9);
        setImages(limitedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again later.');
        
        // Use placeholder data if API fails
        setImages(generatePlaceholderData());
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Generate placeholder data for testing or when API fails
  const generatePlaceholderData = () => {
    return Array(9).fill().map((_, index) => ({
      id: index + 1,
      title: `Gallery Image ${index + 1}`,
      description: `Beautiful description for gallery item ${index + 1}`,
      imageUrl: `https://source.unsplash.com/300x300/?nature,water,${index + 1}`,
      category: 'Nature',
      date: new Date().toISOString().split('T')[0]
    }));
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const modalImages = images.map(image => ({
    src: image.imageUrl,
    alt: image.title,
    caption: image.description
  }));

  return (
    <div className="pgm-gallery">
      <PageTitle title="Galeri" />
      <div className="pgm-gallery__decorative-element pgm-gallery__decorative-element--top-left"></div>
      <div className="pgm-gallery__decorative-element pgm-gallery__decorative-element--top-right"></div>
      <div className="pgm-gallery__decorative-element pgm-gallery__decorative-element--bottom-left"></div>
      <div className="pgm-gallery__decorative-element pgm-gallery__decorative-element--bottom-right"></div>
      
      <div className="pgm-gallery__header">
        <h1 className="pgm-gallery__title">Photo Gallery</h1>
        <p className="pgm-gallery__subtitle">A collection of our most cherished moments</p>
      </div>

      {loading ? (
        <div className="pgm-gallery__loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <div className="pgm-gallery__error">
          <Alert variant="danger">{error}</Alert>
        </div>
      ) : (
        <div className="pgm-gallery__grid">
          {images.map((image, index) => (
            <div key={image.id} className="pgm-gallery__item">
              <div className="pgm-gallery__item-inner">
                <div className="pgm-gallery__item-front">
                  <div 
                    className="pgm-gallery__image-container"
                    onClick={() => openModal(index)}
                  >
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className="pgm-gallery__image" 
                    />
                    <div className="pgm-gallery__image-overlay"></div>
                  </div>
                  <div className="pgm-gallery__item-caption">
                    <h3 className="pgm-gallery__item-title">{image.title}</h3>
                    <span className="pgm-gallery__item-category">{image.category}</span>
                  </div>
                </div>
                <div className="pgm-gallery__item-back">
                  <div className="pgm-gallery__item-content">
                    <h3 className="pgm-gallery__item-title">{image.title}</h3>
                    <p className="pgm-gallery__item-description">{image.description}</p>
                    <div className="pgm-gallery__item-meta">
                      <span className="pgm-gallery__item-date">{image.date}</span>
                    </div>
                    <button 
                      className="pgm-gallery__item-btn"
                      onClick={() => openModal(index)}
                    >
                      View Full Size
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RetroModal
        isOpen={modalOpen}
        onClose={closeModal}
        images={modalImages}
        title="Photo Gallery"
        currentImageIndex={currentImageIndex}
        onImageClick={(index) => setCurrentImageIndex(index)}
      />
    </div>
  );
};

export default Gallery;
