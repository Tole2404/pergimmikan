import React, { useRef } from 'react';
import './MountainCalculator.css';

const TrackSelection = ({ selectedMountain, mountainTracks, selectedTrack, onSelectTrack, onBack, onNext }) => {
  const carouselRef = useRef(null);

  if (!mountainTracks || mountainTracks.length === 0) {
    // No tracks available, skip to next step
    onNext();
    return null;
  }

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Mudah': return '#4caf50';
      case 'Sedang': return '#ff9800';
      case 'Sulit': return '#f44336';
      case 'Sangat Sulit': return '#9c27b0';
      default: return '#666';
    }
  };

  return (
    <div className="step-content">
      <h2>Pilih Jalur Pendakian</h2>
      
      <div className="track-selection-header">
        <div className="mountain-info-compact">
          <img src={selectedMountain.image_url} alt={selectedMountain.name} />
          <div>
            <h3>{selectedMountain.name}</h3>
            <p>{mountainTracks.length} jalur tersedia</p>
          </div>
        </div>
      </div>

      <div className="tracks-carousel-container">
        {mountainTracks.length > 2 && (
          <button className="carousel-nav carousel-nav-left" onClick={() => scroll('left')}>
            ‹
          </button>
        )}
        
        <div className="tracks-carousel" ref={carouselRef}>
          {mountainTracks.map((track) => (
            <div 
              key={track.id}
              className={`track-card-compact ${selectedTrack?.id === track.id ? 'selected' : ''}`}
              onClick={() => onSelectTrack(track)}
            >
              {track.is_recommended && (
                <div className="track-badge">⭐ Populer</div>
              )}
              
              <div className="track-card-header">
                <h4>{track.track_name}</h4>
                <span className="track-basecamp-compact">📍 {track.basecamp_name}</span>
              </div>

              <div className="track-stats-compact">
                <div className="stat-compact">
                  <span className="stat-icon">⛰️</span>
                  <div>
                    <span className="stat-value" style={{ color: getDifficultyColor(track.difficulty) }}>
                      {track.difficulty}
                    </span>
                    <span className="stat-label">Kesulitan</span>
                  </div>
                </div>
                <div className="stat-compact">
                  <span className="stat-icon">📅</span>
                  <div>
                    <span className="stat-value">{track.typical_duration_days}D</span>
                    <span className="stat-label">Durasi</span>
                  </div>
                </div>
                <div className="stat-compact">
                  <span className="stat-icon">📏</span>
                  <div>
                    <span className="stat-value">{track.distance_km}km</span>
                    <span className="stat-label">Jarak</span>
                  </div>
                </div>
                <div className="stat-compact">
                  <span className="stat-icon">📈</span>
                  <div>
                    <span className="stat-value">+{track.elevation_gain}m</span>
                    <span className="stat-label">Elevasi</span>
                  </div>
                </div>
              </div>

              {track.highlights && (
                <div className="track-highlights-compact">
                  {JSON.parse(track.highlights).slice(0, 2).map((h, i) => (
                    <span key={i}>• {h}</span>
                  ))}
                </div>
              )}

              <div className="track-footer-compact">
                <div className="track-best-for-compact">
                  👥 {track.best_for}
                </div>
                <div className="track-pricing-compact">
                  {track.guide_fee_per_day > 0 && (
                    <span>Guide: Rp {(track.guide_fee_per_day / 1000).toFixed(0)}k/hari</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mountainTracks.length > 2 && (
          <button className="carousel-nav carousel-nav-right" onClick={() => scroll('right')}>
            ›
          </button>
        )}
      </div>

      {selectedTrack && (() => {
        // Prioritas: 1. Link dari database, 2. Koordinat, 3. Nama tempat
        const gmapsLink = selectedTrack.gmaps_link || selectedMountain.gmaps_link;
        const lat = selectedMountain.latitude ? parseFloat(selectedMountain.latitude).toFixed(6) : null;
        const lng = selectedMountain.longitude ? parseFloat(selectedMountain.longitude).toFixed(6) : null;
        const hasCoords = lat && lng;
        const locationQuery = selectedTrack.basecamp_name + ' ' + selectedMountain.name;
        
        // Extract embed URL dari link Google Maps jika ada
        let directLink, navLink;
        
        // Debug - log data yang ada
        console.log('Track Data:', {
          gmapsLink,
          lat,
          lng,
          basecamp: selectedTrack.basecamp_name,
          mountain: selectedMountain.name
        });
        
        // Prioritas: Gunakan link DB jika ada, fallback ke koordinat
        if (gmapsLink) {
          // Gunakan link dari database
          directLink = gmapsLink;
          
          // Untuk navigasi, gunakan koordinat jika ada (lebih reliable)
          if (hasCoords) {
            navLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
          } else {
            // Extract koordinat dari link jika ada
            const coordMatch = gmapsLink.match(/[-]?\d+\.\d+,[-]?\d+\.\d+/);
            if (coordMatch) {
              const [extractedLat, extractedLng] = coordMatch[0].split(',');
              navLink = `https://www.google.com/maps/dir/?api=1&destination=${extractedLat},${extractedLng}`;
            } else {
              navLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery)}`;
            }
          }
        } else if (hasCoords) {
          // Fallback ke koordinat jika tidak ada link
          directLink = `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},15z`;
          navLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        } else {
          // Fallback terakhir ke nama tempat
          directLink = `https://www.google.com/maps/search/${encodeURIComponent(locationQuery)}`;
          navLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery)}`;
        }
        
        console.log('Generated Links:', { directLink, navLink });
        
        // Generate embed URL untuk iframe
        const embedUrl = hasCoords 
          ? `https://maps.google.com/maps?q=${lat},${lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`
          : `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        
        return (
          <div className="track-map-section">
            <div className="step-navigation-top">
              <button onClick={onBack} className="btn-nav btn-back">
                ← Kembali
              </button>
              <button onClick={onNext} disabled={!selectedTrack} className="btn-nav btn-next">
                Lanjut ke Lokasi →
              </button>
            </div>

            <div className="map-header">
              <h3>📍 Lokasi Basecamp</h3>
              <p>{selectedTrack.basecamp_name}</p>
            </div>

            <div className="map-container">
              <iframe
                title="Basecamp Location"
                width="100%"
                height="350"
                frameBorder="0"
                style={{ border: 0, borderRadius: '12px' }}
                src={embedUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-fallback">
                <a 
                  href={directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  🗺️ Buka di Google Maps
                </a>
                <a 
                  href={navLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link map-link-secondary"
                >
                  🧭 Navigasi ke Basecamp
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TrackSelection;
