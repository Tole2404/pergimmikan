import { useState, useEffect, useRef } from 'react';
import RetroModal from '../common/RetroModal';
import DownloadImageButton from '../common/DownloadImageButton';
import { FaMapMarkerAlt, FaCalendarAlt, FaCameraRetro, FaCompass, FaHiking, FaMountain, 
  FaGlobeAmericas, FaArrowRight, FaArrowLeft, FaStar, FaRoute, FaUsers, FaHistory,
  FaClock, FaMapMarked, FaMedal } from 'react-icons/fa';
import './Journey.css';

const API_URL = import.meta.env.VITE_API_URL;

// Fallback image if image not found
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0e6d2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='18' text-anchor='middle' fill='%238b4513'%3EImage not available%3C/text%3E%3C/svg%3E";

export default function Journey() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [journeyData, setJourneyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [visibleStats, setVisibleStats] = useState({});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Tambahkan refs untuk tombol tahun
  const yearButtonsRef = useRef({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJourneyData();
    
    // Add timeout to give time for rendering
    setTimeout(() => {
      try {
        // Add visible class to all elements when loading
        document.querySelectorAll('.animate-on-scroll').forEach(elem => {
          elem.classList.add('visible');
        });
        
        // Setup observer for elements that appear on scroll
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { threshold: 0.1 });
        
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(elem => {
          observer.observe(elem);
        });
        
        return () => {
          elements.forEach(elem => {
            observer.unobserve(elem);
          });
        };
      } catch (error) {
        // Error handling for IntersectionObserver
      }
    }, 500);
  }, []);

  useEffect(() => {
    // Deteksi apakah device menggunakan touch
    const detectTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    detectTouchDevice();
  }, []);

  const fetchJourneyData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/journeys`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch journey data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        setJourneyData([]);
        setError('No journey data available. Try again later!');
        setLoading(false);
        return;
      }
      
      const groupedData = data.reduce((acc, journey) => {
        // Pastikan year disimpan sebagai number
        const journeyWithNumberYear = { ...journey, year: Number(journey.year) };
        
        const existingJourney = acc.find(j => j.year === journeyWithNumberYear.year);
        if (existingJourney) {
          existingJourney.photos = [...existingJourney.photos, ...journeyWithNumberYear.photos];
        } else {
          acc.push(journeyWithNumberYear);
        }
        return acc;
      }, []);

      const sortedData = groupedData.sort((a, b) => b.year - a.year);
      
      setJourneyData(sortedData);
      if (sortedData.length > 0) {
        setActiveYear(sortedData[0].year);
      }
    } catch (err) {
      setError('Failed to load journey data. Try again later!');
    } finally {
      setLoading(false);
    }
  };

  // Reset photo index when active year changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
    
    // Set stats for active year
    if (activeYear) {
      setVisibleStats({
        photos: true,
        locations: true,
        experiences: true
      });
    }
  }, [activeYear]);

  const handleViewMore = (yearData) => {
    setSelectedYear(yearData);
    setIsModalOpen(true);
  };

  const nextPhoto = () => {
    const activeYearData = journeyData.find(data => data.year === activeYear);
    if (!activeYearData) return;
    
    setCurrentPhotoIndex(prevIndex => 
      prevIndex === activeYearData.photos.length - 1 ? 0 : prevIndex + 1);
  };

  const prevPhoto = () => {
    const activeYearData = journeyData.find(data => data.year === activeYear);
    if (!activeYearData) return;
    
    setCurrentPhotoIndex(prevIndex => 
      prevIndex === 0 ? activeYearData.photos.length - 1 : prevIndex - 1);
  };

  if (loading) {
    return (
      <div className="pgm-journey">
        <div className="pgm-journey__loading-container">
          <div className="pgm-journey__loading-card">
            <div className="pgm-journey__loading-header">
              <div className="pgm-journey__loading-title">
                <FaHistory className="loading-icon-pulse" />
                <span>Journey Loading</span>
              </div>
              <div className="pgm-journey__loading-subtitle">Traveling through time...</div>
            </div>
            
            <div className="pgm-journey__loading-timeline">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="pgm-journey__loading-year">
                  <div className="loading-year-card">
                    <div className="loading-year-number"></div>
                    <div className="loading-year-title"></div>
                  </div>
                  <div className="loading-year-line"></div>
                </div>
              ))}
            </div>
            
            <div className="pgm-journey__loading-photo-section">
              <div className="pgm-journey__loading-main-photo">
                <div className="loading-photo-frame">
                  <FaCameraRetro className="loading-camera-icon" />
                </div>
                <div className="loading-photo-nav loading-photo-nav-left">
                  <FaArrowLeft />
                </div>
                <div className="loading-photo-nav loading-photo-nav-right">
                  <FaArrowRight />
                </div>
              </div>
              
              <div className="pgm-journey__loading-thumbnails">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="loading-thumbnail"></div>
                ))}
              </div>
            </div>
            
            <div className="pgm-journey__loading-info">
              <div className="loading-info-header"></div>
              <div className="loading-info-text"></div>
              <div className="loading-info-text loading-info-text--short"></div>
              <div className="loading-info-stats">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="loading-stat-item">
                    <div className="loading-stat-icon"></div>
                    <div className="loading-stat-text"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pgm-journey__loading-compass">
              <div className="loading-compass-needle"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pgm-journey">
        <div className="pgm-journey__error">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            className="pgm-journey__retry-btn"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchJourneyData();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeYearData = journeyData.find(data => data.year === activeYear);

  return (
    <div className="pgm-journey">
      <div className="pgm-journey__background-elements">
        <div className="pgm-journey__bg-circle circle-1"></div>
        <div className="pgm-journey__bg-circle circle-2"></div>
        <div className="pgm-journey__bg-circle circle-3"></div>
        <div className="pgm-journey__bg-line line-1"></div>
        <div className="pgm-journey__bg-line line-2"></div>
      </div>
      
      {/* Header section with new accents */}
      <div className="pgm-journey__header">
        <div className="vintage-stamp">
          <span className="vintage-stamp-text">JOURNEY</span>
        </div>
        <div className="pgm-journey__header-decoration">
          <div className="decoration-line retro-pattern"></div>
          <div className="decoration-star">
            <FaStar />
          </div>
          <div className="decoration-line retro-pattern"></div>
        </div>
        <h1 className="pgm-journey__title">Pergimmikan Journey</h1>
        <p className="pgm-journey__subtitle">Timeline of our awesome adventures around the world</p>
        <div className="pgm-journey__header-decoration bottom">
          <div className="decoration-dot"></div>
          <div className="decoration-line retro-dash"></div>
          <div className="decoration-dot"></div>
          <div className="decoration-line retro-dash"></div>
          <div className="decoration-dot"></div>
        </div>
      </div>

      {/* Timeline years navigation - Completely redesigned */}
      <div className="pgm-journey__timeline-section">
        <div className="pgm-journey__section-header">
          <FaHistory className="pgm-journey__section-icon" />
          <h2>Journey Timeline</h2>
        </div>
        
        <div className="pgm-journey__years-cards">
          {journeyData.map((yearData) => (
            <button 
              key={yearData.year}
              type="button"
              className={`pgm-journey__year-card ${activeYear === yearData.year ? 'active' : ''}`}
              onClick={() => setActiveYear(yearData.year)}
            >
              <div className="pgm-journey__year-number">
                <FaCalendarAlt className="year-icon" />
                <span>{yearData.year}</span>
              </div>
              <div className="pgm-journey__year-title">
                {yearData.title}
              </div>
              <div className="pgm-journey__photo-count">
                <FaCameraRetro className="photo-icon" />
                <span>{yearData.photos.length}</span>
              </div>
              
              {activeYear === yearData.year && (
                <div className="pgm-journey__active-indicator"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {activeYearData && (
        <div className="pgm-journey__content-wrapper animate-on-scroll">
          <div className="pgm-journey__year-banner">
            <div className="pgm-journey__year-label">
              <FaCalendarAlt className="pgm-journey__year-icon" />
              <span>{activeYearData.year}</span>
            </div>
            <h2 className="pgm-journey__year-title">{activeYearData.title}</h2>
          </div>
          
          <div className="pgm-journey__main-content">
            <div className="pgm-journey__photo-showcase">
              <div className="pgm-journey__photo-main">
                <button className="pgm-journey__photo-nav prev" onClick={prevPhoto}>
                  <FaArrowLeft />
                </button>
                <div className="pgm-journey__photo-frame">
                  {activeYearData.photos.length > 0 && (
                    <>
                      <DownloadImageButton 
                        imageUrl={`${API_URL}${activeYearData.photos[currentPhotoIndex].src}`}
                        fileName={`journey-${activeYearData.year}-${currentPhotoIndex + 1}`}
                        className="large"
                      />
                      <img
                        src={`${API_URL}${activeYearData.photos[currentPhotoIndex].src}`}
                        alt={activeYearData.photos[currentPhotoIndex].caption}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </>
                  )}
                  <div className="pgm-journey__photo-counter">
                    {currentPhotoIndex + 1} / {activeYearData.photos.length}
                  </div>
                </div>
                <button className="pgm-journey__photo-nav next" onClick={nextPhoto}>
                  <FaArrowRight />
                </button>
              </div>
              
              <div className="pgm-journey__photo-caption">
                {activeYearData.photos.length > 0 && (
                  <p>{activeYearData.photos[currentPhotoIndex].caption}</p>
                )}
              </div>
              
              <div className="pgm-journey__photo-thumbnails">
                {activeYearData.photos.slice(0, 9).map((photo, index) => (
                  <div 
                    key={index} 
                    className={`pgm-journey__thumbnail ${currentPhotoIndex === index ? 'active' : ''}`}
                  >
                    <DownloadImageButton 
                      imageUrl={`${API_URL}${photo.src}`}
                      fileName={`journey-${activeYearData.year}-${index + 1}`}
                    />
                    <img
                      src={`${API_URL}${photo.src}`}
                      alt={photo.caption}
                      onClick={() => setCurrentPhotoIndex(index)}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                ))}
                {activeYearData.photos.length > 9 && (
                  <div 
                    className="pgm-journey__thumbnail pgm-journey__thumbnail-more"
                    onClick={() => handleViewMore(activeYearData)}
                  >
                    <div className="thumbnail-more-content">
                      <FaCameraRetro />
                      <span>+{activeYearData.photos.length - 9}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pgm-journey__info-panel">
              <div className="pgm-journey__description">
                <div className="pgm-journey__section-header small">
                  <FaCompass className="pgm-journey__section-icon small" />
                  <h3>About This Journey</h3>
                </div>
                <p>{activeYearData.description}</p>
              </div>
              
              <div className="pgm-journey__stats">
                <div className={`pgm-journey__stat-item ${visibleStats.photos ? 'visible' : ''}`}>
                  <div className="pgm-journey__stat-icon">
                    <FaCameraRetro />
                  </div>
                  <div className="pgm-journey__stat-info">
                    <span className="pgm-journey__stat-value">{activeYearData.photos.length}</span>
                    <span className="pgm-journey__stat-label">Photos</span>
                  </div>
                </div>
                
                <div className={`pgm-journey__stat-item ${visibleStats.locations ? 'visible' : ''}`}>
                  <div className="pgm-journey__stat-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="pgm-journey__stat-info">
                    <span className="pgm-journey__stat-value">{activeYearData.locations || 'Various'}</span>
                    <span className="pgm-journey__stat-label">Locations</span>
                  </div>
                </div>
                
                <div className={`pgm-journey__stat-item ${visibleStats.experiences ? 'visible' : ''}`}>
                  <div className="pgm-journey__stat-icon">
                    <FaMountain />
                  </div>
                  <div className="pgm-journey__stat-info">
                    <span className="pgm-journey__stat-value">{activeYearData.experiences || 'Various'}</span>
                    <span className="pgm-journey__stat-label">Experiences</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="pgm-journey__view-all-btn"
                onClick={() => handleViewMore(activeYearData)}
              >
                <span>View All Photos</span>
                <FaGlobeAmericas className="view-all-icon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teams section */}
      <div className="pgm-journey__teams-section animate-on-scroll">
        <div className="pgm-journey__section-header">
          <FaUsers className="pgm-journey__section-icon" />
          <h2>Pergimmikan Team</h2>
        </div>
        
        <div className="pgm-journey__team-description">
          <p>This journey was created by our awesome Pergimmikan team members who are dedicated to capturing every precious moment</p>
        </div>
        
        <div className="pgm-journey__team-cta">
          <a href="/team" className="pgm-journey__team-button">
            <span>Meet Our Crew</span>
            <FaArrowRight className="arrow-icon" />
          </a>
        </div>
      </div>

      {/* Routes and destinations section - only show if destination data exists */}
      {journeyData.some(year => Array.isArray(year.destinations) && year.destinations.length > 0) && (
        <div className="pgm-journey__destinations-section animate-on-scroll">
          <div className="pgm-journey__section-header">
            <FaRoute className="pgm-journey__section-icon" />
            <h2>Journey Routes</h2>
          </div>
          
          <div className="pgm-journey__destinations-map">
            <div className="pgm-journey__map-placeholder">
              <img 
                src="/images/indonesia-map.svg" 
                alt="Indonesia Map" 
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }} 
              />
            </div>
            
            <div className="pgm-journey__destination-list">
              {journeyData.flatMap(year => 
                (year.destinations || []).map((destination, index) => (
                  <div className="pgm-journey__destination-item" key={`${year.year}-${index}`}>
                    <div className="pgm-journey__destination-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="pgm-journey__destination-info">
                      <h4>{destination}</h4>
                      <span>{year.year}</span>
                    </div>
                  </div>
                ))
              ).slice(0, 5)}
            </div>
          </div>
        </div>
      )}

      {selectedYear && (
        <RetroModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={selectedYear.photos.map(photo => ({
            ...photo,
            src: `${API_URL}${photo.src}`
          }))}
          title={`${selectedYear.year} - ${selectedYear.title}`}
        />
      )}
    </div>
  );
}
