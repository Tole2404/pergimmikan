import { useState, useEffect, useRef } from 'react';
import RetroModal from '../common/RetroModal';
import DownloadImageButton from '../common/DownloadImageButton';
import { JourneySkeleton } from '../common/Skeleton';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaCameraRetro, FaCompass, 
  FaMountain, FaGlobeAmericas, FaArrowRight, FaArrowLeft, 
  FaStar, FaUsers, FaHistory, FaMusic, FaPlay, FaPause, FaTree,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Journey.css';

const API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0e6d2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='18' text-anchor='middle' fill='%238b4513'%3EImage not available%3C/text%3E%3C/svg%3E";

// Custom Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (destinationType) => {
  const icons = {
    gunung: '🏔️',
    pantai: '🏖️',
    hutan: '🌲',
    air_terjun: '💧',
    gua: '🕳️',
    danau: '🏞️',
    default: '📍'
  };
  const emoji = icons[destinationType] || icons.default;
  const colors = {
    gunung: '#8B4513',      // Brown
    pantai: '#4A90E2',      // Blue
    hutan: '#2ECC71',       // Green
    air_terjun: '#3498DB',  // Light Blue
    gua: '#95A5A6',         // Gray
    danau: '#1ABC9C',       // Teal
    default: '#E74C3C'      // Red
  };
  const color = colors[destinationType] || colors.default;
  
  return L.divIcon({
    className: 'custom-marker-div',
    html: `
      <div class="marker-pin-wrapper" style="background-color: ${color};">
        <span class="marker-pin-emoji">${emoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export default function Journey() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [journeyData, setJourneyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJourneyData();
  }, []);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [activeYear]);

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

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser policies: ", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevPhoto = () => {
    if (!activeYearData || !activeYearData.photos || activeYearData.photos.length === 0) return;
    setActivePhotoIndex((prev) => 
      prev === 0 ? activeYearData.photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    if (!activeYearData || !activeYearData.photos || activeYearData.photos.length === 0) return;
    setActivePhotoIndex((prev) => 
      prev === activeYearData.photos.length - 1 ? 0 : prev + 1
    );
  };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const scrollAmount = 340; // Approx 2 tags width
      timelineRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="pgm-journey">
        <JourneySkeleton />
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
  const currentPhoto = activeYearData && activeYearData.photos && activeYearData.photos[activePhotoIndex];

  return (
    <div className="pgm-journey">
      {/* Background elements */}
      <div className="pgm-journey__background-elements">
        <div className="pgm-journey__bg-circle circle-1"></div>
        <div className="pgm-journey__bg-circle circle-2"></div>
        <div className="pgm-journey__bg-circle circle-3"></div>
      </div>

      {/* Floating Vinyl Player Widget */}
      <div className="vinyl-player-widget">
        <audio ref={audioRef} src="/music/Hindia-Kitakesana.mp3" loop />
        <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`} onClick={toggleMusic}>
          <div className="vinyl-center"></div>
        </div>
        <div className={`vinyl-arm ${isPlaying ? 'active' : ''}`}></div>
        <button className="vinyl-control-btn" onClick={toggleMusic}>
          {isPlaying ? <FaPause /> : <FaPlay />}
          <span>{isPlaying ? 'Pause Hindia' : 'Play Hindia'}</span>
        </button>
      </div>

      {/* Header section */}
      <div className="pgm-journey__header">
        <div className="vintage-stamp">
          <span className="vintage-stamp-text">JOURNEY</span>
        </div>
        <div className="pgm-journey__header-decoration">
          <div className="decoration-line retro-pattern"></div>
          <div className="decoration-star"><FaStar /></div>
          <div className="decoration-line retro-pattern"></div>
        </div>
        <h1 className="pgm-journey__title">Pergimmikan Journey</h1>
        <p className="pgm-journey__subtitle">The Scrapbook of Our Travels & Shared Adventures</p>
      </div>

      {/* Luggage Tag Timeline Navigation */}
      <div className="pgm-journey__timeline-section">
        <div className="pgm-journey__section-header">
          <FaHistory className="pgm-journey__section-icon" />
          <h2>Travel Log Timeline</h2>
        </div>
        
        <div className="pgm-journey__timeline-carousel-wrapper">
          <button 
            type="button" 
            className="timeline-nav-btn prev" 
            onClick={() => scrollTimeline('left')}
            aria-label="Scroll older"
          >
            <FaChevronLeft />
          </button>
          
          <div className="pgm-journey__luggage-tags" ref={timelineRef}>
            {journeyData.map((yearData, index) => {
              // Apply slight random rotations to the tags
              const rot = (index % 3 === 0) ? -2 : (index % 3 === 1) ? 2 : 1;
              return (
                <button 
                  key={yearData.year}
                  type="button"
                  className={`pgm-journey__luggage-tag ${activeYear === yearData.year ? 'active' : ''}`}
                  onClick={() => setActiveYear(yearData.year)}
                  style={{ '--tag-rot': `${rot}deg` }}
                >
                  <div className="tag-strap"></div>
                  <div className="tag-hole"></div>
                  <div className="tag-content">
                    <span className="tag-year">{yearData.year}</span>
                    <span className="tag-title">{yearData.title}</span>
                    <span className="tag-photos-count">
                      <FaCameraRetro /> {yearData.photos.length} photos
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button 
            type="button" 
            className="timeline-nav-btn next" 
            onClick={() => scrollTimeline('right')}
            aria-label="Scroll newer"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Book Slider (Carousel Halaman Buku) */}
      {journeyData.length > 0 && (
        <div className="pgm-journey__book-carousel-container">
          <div 
            className="pgm-journey__book-slider" 
            style={{ 
              transform: `translateX(-${(journeyData.findIndex(item => item.year === activeYear) >= 0 ? journeyData.findIndex(item => item.year === activeYear) : 0) * 100}%)`
            }}
          >
            {journeyData.map((yearData, idx) => {
              const isThisActive = yearData.year === activeYear;
              const photoIdx = isThisActive ? activePhotoIndex : 0;
              const currentPhoto = yearData.photos[photoIdx];

              return (
                <div key={yearData.year} className="pgm-journey__book-page">
                  <div className="pgm-journey__content-wrapper">
                    <div className="pgm-journey__notebook-header">
                      <div className="notebook-spine"></div>
                      {/* Retro Fountain Pen */}
                      <div className="retro-fountain-pen">
                        <div className="retro-fountain-pen-clip"></div>
                        <div className="retro-fountain-pen-band"></div>
                        <div className="retro-fountain-pen-nib"></div>
                      </div>
                      <div className="notebook-header-content">
                        <span className="notebook-date-badge">
                          <FaCalendarAlt /> {yearData.year}
                        </span>
                        <h2 className="notebook-title">{yearData.title}</h2>
                      </div>
                    </div>

                    <div className="pgm-journey__scrapbook-layout">
                      {/* Book spine crease shadow in the center */}
                      <div className="pgm-journey__book-spine-crease"></div>
                      
                      {/* Left Column: Scrapbook Note & Statistics & Map */}
                      <div className="scrapbook-aside">
                        <div className="scrapbook-note-card">
                          <div className="note-pin">📌</div>
                          <div className="pgm-journey__section-header small">
                            <FaCompass className="pgm-journey__section-icon small" />
                            <h3>Adventure Log Details</h3>
                          </div>
                          <p className="note-desc">{yearData.description}</p>
                        </div>

                        {/* Stat Stamps */}
                        <div className="scrapbook-stats-grid">
                          <div className="stat-stamp">
                            <div className="stamp-icon"><FaCameraRetro /></div>
                            <span className="stamp-value">{yearData.photos.length}</span>
                            <span className="stamp-label">Snapshots</span>
                          </div>
                          <div className="stat-stamp">
                            <div className="stamp-icon"><FaMapMarkerAlt /></div>
                            <span className="stamp-value">{yearData.location || 'Various'}</span>
                            <span className="stamp-label">Location</span>
                          </div>
                          <div className="stat-stamp">
                            <div className="stamp-icon"><FaMountain /></div>
                            <span className="stamp-value">{yearData.experiences || 'Nature'}</span>
                            <span className="stamp-label">Theme</span>
                          </div>
                        </div>

                        {/* Destination Map Card - Render only when active to avoid layout calculation issues */}
                        {isThisActive && yearData.latitude && yearData.longitude && (
                          <div className="scrapbook-map-card">
                            <div className="map-tape top-left"></div>
                            <div className="map-tape bottom-right"></div>
                            <h4>
                              <FaMapMarkerAlt /> Mini Route Map
                            </h4>
                            <div className="mini-map-container">
                              <MapContainer
                                center={[yearData.latitude, yearData.longitude]}
                                zoom={8}
                                scrollWheelZoom={false}
                                className="mini-leaflet-map"
                              >
                                <TileLayer
                                  attribution='&copy; OpenStreetMap contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker 
                                  position={[yearData.latitude, yearData.longitude]}
                                  icon={createCustomIcon(yearData.destination_type)}
                                >
                                  <Popup>
                                    <strong>{yearData.title}</strong>
                                    <br />
                                    {yearData.location}
                                  </Popup>
                                </Marker>
                              </MapContainer>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Featured Polaroid & Thumbnails */}
                      <div className="scrapbook-gallery-main">
                        <div className="polaroid-collage-header">
                          <h3>📷 Polaroid Showcase</h3>
                          <button 
                            className="pgm-journey__view-all-btn"
                            onClick={() => {
                              setSelectedYear(yearData);
                              setIsModalOpen(true);
                            }}
                          >
                            <span>Expand Gallery</span>
                            <FaGlobeAmericas />
                          </button>
                        </div>

                        {/* Featured Polaroid Section */}
                        {currentPhoto && (
                          <div className="featured-polaroid-showcase">
                            <button 
                              type="button"
                              className="featured-nav-btn prev-btn" 
                              onClick={handlePrevPhoto}
                              aria-label="Previous photo"
                            >
                              <FaChevronLeft />
                            </button>

                            <div className="featured-polaroid-card">
                              <div className="polaroid-tape"></div>
                              <div className="polaroid-image-frame">
                                <DownloadImageButton 
                                  imageUrl={`${API_URL}${currentPhoto.src}`}
                                  fileName={`journey-${yearData.year}-${photoIdx + 1}`}
                                />
                                <img
                                  src={`${API_URL}${currentPhoto.src}`}
                                  alt={currentPhoto.caption || 'Featured snapshot'}
                                  onError={(e) => {
                                    e.target.src = FALLBACK_IMAGE;
                                  }}
                                />
                                <div className="polaroid-image-counter">
                                  {photoIdx + 1} / {yearData.photos.length}
                                </div>
                              </div>
                              <div className="polaroid-caption">
                                {currentPhoto.caption || `Snapshot #${photoIdx + 1}`}
                              </div>
                            </div>

                            <button 
                              type="button"
                              className="featured-nav-btn next-btn" 
                              onClick={handleNextPhoto}
                              aria-label="Next photo"
                            >
                              <FaChevronRight />
                            </button>
                          </div>
                        )}

                        {/* Thumbnails Polaroid List */}
                        {yearData.photos.length > 1 && (
                          <div className="polaroid-thumbnails-list">
                            {yearData.photos.map((photo, index) => {
                              const rot = (index % 4 === 0) ? -3 : (index % 4 === 1) ? 2 : (index % 4 === 2) ? -1 : 3;
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  className={`mini-polaroid-item ${isThisActive && activePhotoIndex === index ? 'active' : ''}`}
                                  onClick={() => isThisActive && setActivePhotoIndex(index)}
                                  style={{ '--mini-rot': `${rot}deg` }}
                                >
                                  <div className="mini-polaroid-tape"></div>
                                  <div className="mini-polaroid-frame">
                                    <img 
                                      src={`${API_URL}${photo.src}`} 
                                      alt={`Thumbnail ${index + 1}`} 
                                      onError={(e) => {
                                        e.target.src = FALLBACK_IMAGE;
                                      }}
                                    />
                                  </div>
                                  <span className="mini-polaroid-number">#{index + 1}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team CTA section */}
      <div className="pgm-journey__teams-section">
        <div className="pgm-journey__section-header">
          <FaUsers className="pgm-journey__section-icon" />
          <h2>Pergimmikan Team</h2>
        </div>
        <div className="pgm-journey__team-description">
          <p>Behind every epic trip is an amazing crew. Met our group of climbers, surfers, and dreamers.</p>
        </div>
        <div className="pgm-journey__team-cta">
          <a href="/team" className="pgm-journey__team-button">
            <span>Meet Our Crew</span>
            <FaArrowRight className="arrow-icon" />
          </a>
        </div>
      </div>

      {/* Retro modal for viewing all album photos */}
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
