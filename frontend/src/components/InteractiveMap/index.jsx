import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { FaMapMarkerAlt, FaCamera, FaCalendarAlt, FaFilter, FaTimes, FaRoute } from 'react-icons/fa';
import { MapSkeleton } from '../common/Skeleton';
import mapService from '../../utils/mapService';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_URL = import.meta.env.VITE_API_URL;

// Component to recenter map when filter changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const InteractiveMap = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [mapCenter, setMapCenter] = useState([-2.5489, 118.0149]); // Indonesia center
  const [showFilters, setShowFilters] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [showJournal, setShowJournal] = useState(false);

  // Indonesia map bounds
  const indonesiaBounds = [
    [-11.0, 95.0],  // Southwest
    [6.0, 141.0]    // Northeast
  ];

  useEffect(() => {
    fetchMapData();
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterJourneys();
  }, [selectedType, selectedYear, journeys]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const data = await mapService.getMapData();
      setJourneys(data);
      setFilteredJourneys(data);
      setError(null);
    } catch (err) {
      setError('Failed to load map data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await mapService.getMapStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  const filterJourneys = () => {
    let filtered = journeys;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(j => j.destination_type === selectedType);
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(j => j.year === parseInt(selectedYear));
    }

    setFilteredJourneys(filtered);

    // Recenter map to first filtered journey
    if (filtered.length > 0) {
      setMapCenter([filtered[0].latitude, filtered[0].longitude]);
    }
  };

  const handleMarkerClick = (journey) => {
    navigate(`/journey/${journey.id}`);
  };

  // Generate route coordinates from filtered journeys
  const getRouteCoordinates = () => {
    if (!showRoute || filteredJourneys.length < 2) return [];
    
    // Sort by year and then by id to create chronological path
    const sortedJourneys = [...filteredJourneys].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.id - b.id;
    });

    return sortedJourneys.map(j => [j.latitude, j.longitude]);
  };

  const createCustomIcon = (destinationType) => {
    const color = mapService.getMarkerColor(destinationType);
    const emoji = mapService.getMarkerIcon(destinationType);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pin" style="background-color: ${color};">
          <span class="marker-emoji">${emoji}</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  // Get unique years from journeys
  const years = [...new Set(journeys.map(j => j.year))].sort((a, b) => b - a);

  const destinationTypes = [
    { value: 'all', label: 'Semua', icon: '🗺️' },
    { value: 'gunung', label: 'Gunung', icon: '🏔️' },
    { value: 'pantai', label: 'Pantai', icon: '🏖️' },
    { value: 'hutan', label: 'Hutan', icon: '🌲' },
    { value: 'air_terjun', label: 'Air Terjun', icon: '💧' },
    { value: 'gua', label: 'Gua', icon: '🕳️' },
    { value: 'danau', label: 'Danau', icon: '🏞️' },
  ];

  if (loading) {
    return (
      <div className="interactive-map-container">
        <MapSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error">
        <p>{error}</p>
        <button onClick={fetchMapData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="interactive-map-container">
      {/* Fullscreen Map Background */}
      <div className="map-fullscreen-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={5}
          maxBounds={indonesiaBounds}
          maxBoundsViscosity={1.0}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapRecenter center={mapCenter} />

          {/* Route Line */}
          {showRoute && getRouteCoordinates().length > 1 && (
            <Polyline
              positions={getRouteCoordinates()}
              pathOptions={{
                color: '#8b5a2b',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}

          {filteredJourneys.map((journey) => (
            <Marker
              key={journey.id}
              position={[journey.latitude, journey.longitude]}
              icon={createCustomIcon(journey.destination_type)}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <div className="popup-header">
                    <h3>{journey.title}</h3>
                    <span className="popup-year">
                      <FaCalendarAlt /> {journey.year}
                    </span>
                  </div>
                  
                  <div className="popup-location">
                    <FaMapMarkerAlt /> {journey.location}
                  </div>

                  {journey.cover_image && (
                    <div className="popup-image">
                      <img 
                        src={`${API_URL}${journey.cover_image}`} 
                        alt={journey.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="popup-info">
                    <span className="popup-photos">
                      <FaCamera /> {journey.photos_count} photos
                    </span>
                  </div>

                  <button 
                    className="popup-button"
                    onClick={() => handleMarkerClick(journey)}
                  >
                    View Journey →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Floating Retro Header Board */}
      <div className="map-floating-header">
        <div className="map-floating-header-inner">
          <h1 className="map-title">
            <FaMapMarkerAlt /> Journey Map
          </h1>
          <p className="map-subtitle">
            Explore {filteredJourneys.length} destinations
          </p>
        </div>
      </div>

      {/* Floating Compass Buttons (Top Right actions) */}
      <div className="map-floating-actions">
        <button 
          className={`map-action-btn ${showRoute ? 'active' : ''}`}
          onClick={() => setShowRoute(!showRoute)}
          title={showRoute ? 'Hide Route' : 'Show Route'}
        >
          <FaRoute /> <span className="btn-label">{showRoute ? 'Route On' : 'Route Off'}</span>
        </button>
        <button 
          className="map-action-btn"
          onClick={() => setShowFilters(true)}
          title="Filters"
        >
          <FaFilter /> <span className="btn-label">Filters</span>
        </button>
        <button 
          className={`map-action-btn map-mobile-journal-btn ${showJournal ? 'active' : ''}`}
          onClick={() => setShowJournal(!showJournal)}
          title="Journal"
        >
          📖 <span className="btn-label">Journal</span>
        </button>
      </div>

      {/* Floating Traveler's Notebook (Left Panel) */}
      <div className={`map-journal-panel ${showJournal ? 'show-mobile' : ''}`}>
        {/* Notebook Spiral Rings on Left Edge */}
        <div className="map-journal-binder">
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
          <span className="binder-ring"></span>
        </div>

        {/* Notebook Content Sheet */}
        <div className="map-journal-sheet">
          <div className="map-journal-sheet-inner">
            <div className="map-journal-header">
              <h3>📖 Traveler's Journal</h3>
              <button 
                className="map-journal-close-btn"
                onClick={() => setShowJournal(false)}
                title="Close Journal"
              >
                <FaTimes />
              </button>
            </div>
            
            <p className="journal-intro">Catatan perjalanan gimik di seluruh Indonesia.</p>

            {/* Statistics Section styled like passport stamps */}
            {statistics && (
              <div className="journal-stamps-section">
                <h4>✈️ Destination Stamps</h4>
                <div className="stamps-grid">
                  <div className="stamp-item stamp-destinations">
                    <div className="stamp-inner">
                      <span className="stamp-icon">📍</span>
                      <span className="stamp-value">{statistics.summary.total_destinations}</span>
                      <span className="stamp-label">Explored</span>
                    </div>
                  </div>
                  <div className="stamp-item stamp-mountains">
                    <div className="stamp-inner">
                      <span className="stamp-icon">🏔️</span>
                      <span className="stamp-value">{statistics.summary.total_mountains}</span>
                      <span className="stamp-label">Peaks</span>
                    </div>
                  </div>
                  <div className="stamp-item stamp-beaches">
                    <div className="stamp-inner">
                      <span className="stamp-icon">🏖️</span>
                      <span className="stamp-value">{statistics.summary.total_beaches}</span>
                      <span className="stamp-label">Coasts</span>
                    </div>
                  </div>
                  <div className="stamp-item stamp-forests">
                    <div className="stamp-inner">
                      <span className="stamp-icon">🌲</span>
                      <span className="stamp-value">{statistics.summary.total_forests}</span>
                      <span className="stamp-label">Wilds</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Legend Section */}
            <div className="journal-legend-section">
              <h4>🗺️ Map Legend</h4>
              <div className="journal-legend-list">
                {destinationTypes.filter(t => t.value !== 'all').map(type => (
                  <div key={type.value} className="journal-legend-item">
                    <span 
                      className="legend-color-indicator" 
                      style={{ backgroundColor: mapService.getMarkerColor(type.value) }}
                    >
                      {type.icon}
                    </span>
                    <span className="legend-text-label">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Backdrop */}
      <div 
        className={`map-filters-backdrop ${showFilters ? 'show' : ''}`}
        onClick={() => setShowFilters(false)}
      />

      {/* Filters Folder Drawer */}
      <div className={`map-filters ${showFilters ? 'show' : ''}`}>
        <div className="map-filters-content">
          <div className="filters-header">
            <h3>🎯 Filters</h3>
            <button 
              className="filters-close"
              onClick={() => setShowFilters(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="filter-group">
            <label>📍 Jenis Destinasi:</label>
            <div className="filter-buttons">
              {destinationTypes.map(type => (
                <button
                  key={type.value}
                  className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
                  onClick={() => setSelectedType(type.value)}
                >
                  <span className="filter-icon">{type.icon}</span>
                  <span className="filter-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>📅 Tahun:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedYear === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedYear('all')}
              >
                Semua
              </button>
              {years.map(year => (
                <button
                  key={year}
                  className={`filter-btn ${selectedYear === year ? 'active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
