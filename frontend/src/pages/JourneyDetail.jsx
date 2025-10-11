import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaCamera, FaHeart, FaMapPin, FaStar, FaUsers, FaQuoteLeft, FaQuoteRight, FaCompass, FaPlane, FaUtensils, FaHotel, FaSuitcase } from 'react-icons/fa';
import CommentSection from '../components/common/CommentSection';
import ReactionBar from '../components/common/ReactionBar';
import ShareButton from '../components/common/ShareButton';
import ExportButton from '../components/common/ExportButton';
import SEOHead from '../components/common/SEOHead';
import DownloadImageButton from '../components/common/DownloadImageButton';
import './JourneyDetail.css';

const API_URL = import.meta.env.VITE_API_URL;

// ===============================================
// DATA KONFIGURASI - UBAH DATA DI SINI
// ===============================================

// Data untuk highlights/fitur utama
const JOURNEY_HIGHLIGHTS = [
  { icon: <FaHeart />, title: "Pemandangan Indah", description: "Panorama alam yang memukau dan menakjubkan" },
  { icon: <FaUsers />, title: "Bertemu Penduduk Lokal", description: "Interaksi otentik dengan penduduk setempat" },
  { icon: <FaStar />, title: "Tempat Tersembunyi", description: "Temukan lokasi rahasia yang jarang dikunjungi" },
  { icon: <FaMapPin />, title: "Landmark Ikonik", description: "Kunjungi lokasi sejarah yang terkenal" }
];

// Data untuk itinerary/agenda perjalanan
const JOURNEY_ITINERARY = [
  { day: "Hari 1", title: "Kedatangan & Eksplorasi", activities: ["Tiba di bandara", "Check-in hotel", "Makan malam lokal"] },
  { day: "Hari 2", title: "Pengalaman Budaya", activities: ["Kunjungan museum", "Pasar tradisional", "Pertunjukan budaya"] },
  { day: "Hari 3", title: "Petualangan Alam", activities: ["Hiking pagi", "Kunjungan air terjun", "Menikmati matahari terbenam"] },
  { day: "Hari 4", title: "Perpisahan", activities: ["Belanja oleh-oleh", "Foto terakhir", "Keberangkatan pulang"] }
];

// Data untuk testimonial
const JOURNEY_TESTIMONIAL = {
  quote: "Di Pergimmikan, kita nggak cuma jalan-jalan, tapi juga bangun persahabatan seru! Bareng-bareng nikmatin alam sambil bikin cerita yang bakal kita inget terus.",
  author: "TOLE",
  date: null // Akan diisi dengan journeyDetail.year di komponen
};

// Data untuk Travel Info
const TRAVEL_INFO = [
  { icon: <FaPlane />, title: "Transportasi", details: "Penerbangan langsung tersedia dari Jakarta. Transport lokal menggunakan mobil sewaan atau ojek." },
  { icon: <FaHotel />, title: "Akomodasi", details: "Pilihan penginapan dari homestay hingga resort bintang 5 tersedia di sekitar lokasi." },
  { icon: <FaUtensils />, title: "Kuliner", details: "Nikmati kuliner lokal yang kaya rempah dan hidangan seafood segar dari laut." },
  { icon: <FaSuitcase />, title: "Perlengkapan", details: "Bawa pakaian ringan, kamera, tabir surya, dan perlengkapan outdoor yang nyaman." }
];

export default function JourneyDetail() {
  const { id } = useParams();
  const [journeyDetail, setJourneyDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchJourneyDetail = async () => {
      try {
        setLoading(true);
        // Mengambil semua data journey terlebih dahulu
        const response = await fetch(`${API_URL}/api/journeys`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch journeys data`);
        }
        
        const data = await response.json();
        
        // Mencari journey dengan ID yang sesuai dari data yang sudah diambil
        const journey = data.find(item => item.id === parseInt(id) || item.id === id);
        
        if (!journey) {
          throw new Error(`Journey with ID ${id} not found`);
        }
        
        console.log('Journey detail:', journey);
        setJourneyDetail(journey);
      } catch (error) {
        console.error('Error fetching journey detail:', error);
        setError(error.message || 'Failed to load journey details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJourneyDetail();
  }, [id]);

  // Format date to more readable format
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      // Gunakan zona waktu Jakarta (WIB/UTC+7)
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="journey-loading">
        <div className="retro-pattern"></div>
        <BounceLoader color="#FF6B35" size={60} />
        <p>Loading groovy journey details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="journey-error">
        <div className="retro-pattern"></div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/journey" className="back-button">
          <FaArrowLeft /> Back to All Journeys
        </Link>
      </div>
    );
  }
  
  if (!journeyDetail) {
    return (
      <div className="journey-error">
        <div className="retro-pattern"></div>
        <h2>Journey Not Found</h2>
        <p>The journey you are looking for does not exist or has been removed.</p>
        <Link to="/journey" className="back-button">
          <FaArrowLeft /> Back to All Journeys
        </Link>
      </div>
    );
  }
  
  // Get the main display image
  const mainImage = journeyDetail.photos && journeyDetail.photos.length > 0 
    ? journeyDetail.photos[activeImage]?.src || journeyDetail.image
    : journeyDetail.image;
    
  // Menggunakan tahun dari journey untuk testimonial
  const testimonialWithYear = {
    ...JOURNEY_TESTIMONIAL,
    date: journeyDetail.year || "2022"
  };
    
  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHead
        title={`${journeyDetail.title || 'Journey'} - PERGIMMIKAN`}
        description={journeyDetail.description || 'Explore our amazing journey and adventures'}
        image={mainImage ? `${API_URL}${mainImage}` : null}
        type="article"
        keywords={`journey, travel, ${journeyDetail.title}, ${journeyDetail.location}, adventure`}
      />

      <div className="journey-detail-container" id="journey-detail-content">
        {/* Retro decorative elements */}
        <div className="retro-circle retro-circle-1"></div>
        <div className="retro-circle retro-circle-2"></div>
        <div className="retro-circle retro-circle-3"></div>
        <div className="retro-pattern-top"></div>
        <div className="retro-pattern-bottom"></div>
        
        <div className="journey-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/journey">Journeys</Link> / <span>{journeyDetail.title || 'Journey Detail'}</span>
        </div>
      
      {/* Hero Section */}
      <div className="journey-hero-section">
        {mainImage && (
          <div className="journey-hero-image">
            <DownloadImageButton 
              imageUrl={`${API_URL}${mainImage}`}
              fileName={`${journeyDetail.title?.replace(/\s+/g, '-').toLowerCase()}-hero`}
              className="large"
            />
            <img 
              src={`${API_URL}${mainImage}`}
              alt={journeyDetail.title} 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x600?text=Groovy+Journey';
              }}
            />
            <div className="journey-hero-overlay">
              <h1 className="journey-hero-title">{journeyDetail.title}</h1>
              <div className="journey-hero-meta">
                <span className="journey-date">
                  <FaCalendarAlt /> {journeyDetail.date || `${journeyDetail.year || ''}`}
                </span>
                {journeyDetail.location && (
                  <span className="journey-location">
                    <FaMapMarkerAlt /> {journeyDetail.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Tabs */}
      <div className="journey-tabs">
        <button 
          className={`journey-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <FaCompass /> Overview
        </button>
        <button 
          className={`journey-tab ${activeSection === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveSection('itinerary')}
        >
          <FaMapPin /> Itinerary
        </button>
        <button 
          className={`journey-tab ${activeSection === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveSection('gallery')}
        >
          <FaCamera /> Gallery
        </button>
        <button 
          className={`journey-tab ${activeSection === 'travel-info' ? 'active' : ''}`}
          onClick={() => setActiveSection('travel-info')}
        >
          <FaSuitcase /> Travel Info
        </button>
      </div>
      
      {/* Content Sections */}
      <div className="journey-sections">
        {/* Overview Section */}
        <div className={`journey-section ${activeSection === 'overview' ? 'active' : ''}`}>
          <div className="journey-row">
            <div className="journey-col journey-col-main">
              <h2 className="section-title">Overview</h2>
              <div className="journey-content">
                <p>{journeyDetail.description || 'No description available for this journey.'}</p>
              </div>
              
              <h2 className="section-title">Highlights</h2>
              <div className="journey-highlights">
                {JOURNEY_HIGHLIGHTS.map((highlight, index) => (
                  <div className="highlight-card" key={index}>
                    <div className="highlight-icon">
                      {highlight.icon}
                    </div>
                    <h3>{highlight.title}</h3>
                    <p>{highlight.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="journey-testimonial">
                <FaQuoteLeft className="quote-marks quote-start" />
                <div className="testimonial-text">
                  {testimonialWithYear.quote}
                </div>
                <FaQuoteRight className="quote-marks quote-end" />
                <div className="testimonial-author">
                  <strong>{testimonialWithYear.author}</strong>
                  <div className="testimonial-date">{testimonialWithYear.date}</div>
                </div>
              </div>
            </div>
            
            <div className="journey-col journey-col-sidebar">
              <div className="journey-sidebar-card">
                <h3>Journey Details</h3>
                <ul className="journey-details-list">
                  <li>
                    <span>Duration:</span>
                    <span>{journeyDetail.duration || '4 days'}</span>
                  </li>
                  <li>
                    <span>Location:</span>
                    <span>{journeyDetail.location || 'Various locations'}</span>
                  </li>
                  <li>
                    <span>Date:</span>
                    <span>{formatDate(journeyDetail.date) || journeyDetail.year || 'Flexible dates'}</span>
                  </li>
                  <li>
                    <span>Group Size:</span>
                    <span>{journeyDetail.groupSize || '4-10 people'}</span>
                  </li>
                  <li>
                    <span>Difficulty:</span>
                    <span>{journeyDetail.difficulty || 'Moderate'}</span>
                  </li>
                </ul>
                <div className="journey-sidebar-cta">
                  <span className="journey-share-text">Share this journey</span>
                  <div className="journey-social-icons">
                    <a href="#" className="social-icon">FB</a>
                    <a href="#" className="social-icon">TW</a>
                    <a href="#" className="social-icon">IG</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Itinerary Section */}
        <div className={`journey-section ${activeSection === 'itinerary' ? 'active' : ''}`}>
          <h2 className="section-title">Itinerary</h2>
          <div className="journey-itinerary">
            {JOURNEY_ITINERARY.map((day, index) => (
              <div className="itinerary-day" key={index}>
                <div className="day-header">
                  <span className="day-number">{day.day}</span>
                  <h3 className="day-title">{day.title}</h3>
                </div>
                <div className="day-activities">
                  <ul>
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gallery Section */}
        <div className={`journey-section ${activeSection === 'gallery' ? 'active' : ''}`}>
          <h2 className="section-title">Gallery</h2>
          <div className="journey-gallery">
            {journeyDetail.photos && journeyDetail.photos.length > 0 ? (
              <>
                <div className="featured-photo">
                  <img 
                    src={`${API_URL}${journeyDetail.photos[activeImage]?.src || journeyDetail.image}`}
                    alt={journeyDetail.photos[activeImage]?.caption || journeyDetail.title} 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x600?text=No+Image+Available';
                    }}
                  />
                  {journeyDetail.photos[activeImage]?.caption && (
                    <div className="featured-caption">
                      {journeyDetail.photos[activeImage].caption}
                    </div>
                  )}
                </div>
                
                <div className="photo-thumbnails">
                  {journeyDetail.photos.map((photo, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={`${API_URL}${photo.src}`}
                        alt={photo.caption || `Photo ${index + 1}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="photo-grid">
                  {journeyDetail.photos.map((photo, index) => (
                    <div className="gallery-item" key={index}>
                      <DownloadImageButton 
                        imageUrl={`${API_URL}${photo.src}`}
                        fileName={`${journeyDetail.title?.replace(/\s+/g, '-').toLowerCase()}-${index + 1}`}
                      />
                      <img 
                        src={`${API_URL}${photo.src}`}
                        alt={photo.caption || `Photo ${index + 1}`}
                        onClick={() => setActiveImage(index)}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Error';
                        }}
                      />
                      {photo.caption && (
                        <div className="gallery-caption">{photo.caption}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-photos">
                <p>No photos available for this journey yet.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Travel Info Section */}
        <div className={`journey-section ${activeSection === 'travel-info' ? 'active' : ''}`}>
          <h2 className="section-title">Travel Information</h2>
          <div className="journey-row info-row">
            {TRAVEL_INFO.map((info, index) => (
              <div className="info-card" key={index}>
                <div className="info-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <p>{info.details}</p>
              </div>
            ))}
          </div>
          
          <div className="journey-map">
            <h3>Journey Map</h3>
            <div className="map-placeholder">
              <img 
                src={journeyDetail.mapImage || 'https://via.placeholder.com/1200x600?text=Journey+Map'} 
                alt="Journey Map"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x600?text=Map+Not+Available';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="journey-detail-footer">
        <div className="journey-detail-nav">
          <Link to="/journey" className="back-button">
            <FaArrowLeft /> Back to All Journeys
          </Link>
          <div className="journey-pagination">
            <Link to="#" className="pagination-link">Previous Journey</Link>
            <Link to="#" className="pagination-link">Next Journey</Link>
          </div>
        </div>
        <div className="journey-footer-tagline">
          Explore. Dream. Discover. — The Groovy Journey Team
        </div>
      </div>

        {/* Export & Share Buttons */}
        <div className="journey-actions">
          <ExportButton 
            elementId="journey-detail-content"
            fileName={`journey-${journeyDetail.title?.replace(/\s+/g, '-').toLowerCase()}`}
            title={journeyDetail.title}
          />
          <ShareButton 
            url={window.location.href}
            title={journeyDetail.title}
            description={journeyDetail.description}
            image={mainImage ? `${API_URL}${mainImage}` : null}
          />
        </div>

        {/* Reaction & Comment Section */}
        <div className="journey-interaction-section">
          <ReactionBar contentType="journey" contentId={id} />
          <CommentSection contentType="journey" contentId={id} />
        </div>
      </div>
    </>
  );
}
