import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MountainCalculator.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TransportSelection = ({ 
  fromCity, 
  basecamp, 
  transportRoutes, 
  selectedTransport, 
  isRoundTrip, 
  numPeople,
  onSelectTransport, 
  onToggleRoundTrip 
}) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [showPrivateTransport, setShowPrivateTransport] = useState(false);
  
  console.log('TransportSelection render:', { fromCity, basecamp, transportRoutes });
  
  // Fetch operators when route is selected
  useEffect(() => {
    if (selectedRoute?.id) {
      fetchOperators(selectedRoute.id);
    }
  }, [selectedRoute]);
  
  const fetchOperators = async (routeId) => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/operators/${routeId}`);
      setOperators(response.data);
      // Auto-select recommended or first
      if (response.data.length > 0) {
        const recommended = response.data.find(op => op.is_recommended);
        setSelectedOperator(recommended || response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching operators:', err);
      setOperators([]);
    }
  };
  
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    onSelectTransport(route.transport_type);
  };
  
  const handleOperatorSelect = (operator) => {
    setSelectedOperator(operator);
    // Update parent with operator price (optional, for now use route average)
  };
  
  if (!transportRoutes || transportRoutes.length === 0) {
    return (
      <div className="transport-section">
        <h3>🚗 Transportasi Utama</h3>
        <p className="section-subtitle">Tidak ada data transportasi dari {fromCity} ke {basecamp}</p>
        <div style={{padding: '2rem', background: '#fff3cd', borderRadius: '8px', textAlign: 'center'}}>
          <p>⚠️ Data transportasi belum tersedia untuk rute ini.</p>
          <small>Silakan pilih kota lain atau lanjutkan tanpa transportasi.</small>
        </div>
      </div>
    );
  }

  // Separate public and private transport
  const publicTransport = transportRoutes.filter(route => 
    !route.transport_type.toLowerCase().includes('pribadi')
  );
  
  const privateTransport = transportRoutes.filter(route => 
    route.transport_type.toLowerCase().includes('pribadi')
  );

  // Group public transport by vehicle type
  const getVehicleType = (transportType) => {
    const type = transportType.toLowerCase();
    if (type.includes('bus') || type.includes('bis')) return 'Bus';
    if (type.includes('kereta')) return 'Kereta Api';
    if (type.includes('travel')) return 'Travel';
    if (type.includes('pesawat') || type.includes('penerbangan')) return 'Pesawat';
    return 'Lainnya';
  };

  const vehicleTypes = [...new Set(publicTransport.map(route => getVehicleType(route.transport_type)))];
  
  const getFilteredTransport = () => {
    if (!selectedVehicleType) return [];
    return publicTransport.filter(route => getVehicleType(route.transport_type) === selectedVehicleType);
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Bus': return '🚌';
      case 'Kereta Api': return '🚆';
      case 'Travel': return '🚐';
      case 'Pesawat': return '✈️';
      default: return '🚗';
    }
  };

  const renderTransportCard = (route, idx) => {
    const isPrivate = route.transport_type.toLowerCase().includes('pribadi');
    const isSelected = selectedRoute?.id === route.id;
    const multiplier = isPrivate ? 1 : (isRoundTrip ? 2 : 1);
    
    // Use operator price if selected, otherwise use route average
    const basePrice = (isSelected && selectedOperator) 
      ? selectedOperator.price 
      : Math.round((route.cost_min + route.cost_max) / 2);
    const totalCost = basePrice * multiplier;
    
    return (
      <div 
        key={idx}
        className={`transport-card ${isSelected ? 'selected' : ''}`}
        onClick={() => handleRouteSelect(route)}
      >
        <div className="transport-header">
          <h4>{route.transport_type}</h4>
          {route.is_recommended ? (
            <span className="badge-recommended">⭐ Recommended</span>
          ) : isPrivate ? (
            <span className="badge-expert">Pribadi</span>
          ) : (
            <span className="badge-alternative">Alternatif</span>
          )}
        </div>
        <p className="transport-name">{route.transport_name}</p>
        
        {/* Operator Dropdown - Show if route is selected and has operators */}
        {isSelected && operators.length > 0 && (
          <div className="operator-selection">
            <label>Pilih Operator/Kelas:</label>
            <select 
              value={selectedOperator?.id || ''} 
              onChange={(e) => {
                const op = operators.find(o => o.id === parseInt(e.target.value));
                handleOperatorSelect(op);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {operators.map(op => {
                // Format harga lebih ringkas
                const priceK = op.price >= 1000000 
                  ? `${(op.price / 1000000).toFixed(1)}jt`
                  : `${(op.price / 1000)}rb`;
                
                return (
                  <option key={op.id} value={op.id}>
                    {op.operator_name} ({op.service_class}) - {priceK}
                    {op.is_recommended && ' ⭐'}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        
        <div className="transport-details">
          <div className="detail-item">
            <span className="icon">⏱️</span>
            <span>{route.duration_hours} jam</span>
          </div>
          <div className="detail-item">
            <span className="icon">📏</span>
            <span>{route.distance_km} km</span>
          </div>
        </div>
        <div className="transport-price">
          <div className="price-per-person">
            Rp {basePrice.toLocaleString('id-ID')}/orang
            {isPrivate && <span className="auto-pp"> (Auto PP)</span>}
            {!isPrivate && isRoundTrip && <span className="pp-label"> x2 (PP)</span>}
          </div>
          <div className="price-total">
            💰 Total: Rp {(totalCost * numPeople).toLocaleString('id-ID')}
            <small>({totalCost.toLocaleString('id-ID')} x {numPeople} orang)</small>
          </div>
        </div>
        {route.booking_info && (
          <small className="booking-info">🎫 {route.booking_info}</small>
        )}
      </div>
    );
  };

  return (
    <div className="transport-section">
      <h3>🚗 Transportasi Utama</h3>
      <p className="section-subtitle">Pilih transportasi dari {fromCity} ke {basecamp}</p>
      
      {publicTransport.length > 0 && (
        <>
          <h4 className="transport-category">🚌 Transportasi Umum</h4>
          
          {/* Vehicle Type Filter */}
          <div className="vehicle-type-filter">
            <p className="filter-label">Pilih Tipe Kendaraan:</p>
            <div className="vehicle-type-buttons">
              {vehicleTypes.map(type => {
                const count = publicTransport.filter(r => getVehicleType(r.transport_type) === type).length;
                return (
                  <button
                    key={type}
                    className={`vehicle-type-btn ${selectedVehicleType === type ? 'active' : ''}`}
                    onClick={() => setSelectedVehicleType(selectedVehicleType === type ? null : type)}
                  >
                    <span className="vehicle-icon">{getVehicleIcon(type)}</span>
                    <span className="vehicle-name">{type}</span>
                    <span className="vehicle-count">{count} opsi</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show transport cards when vehicle type is selected */}
          {selectedVehicleType && (
            <>
              <div className="trip-type-selector">
                <button 
                  className={`trip-type-btn ${isRoundTrip ? 'active' : ''}`}
                  onClick={() => onToggleRoundTrip(true)}
                >
                  ↔️ Pulang-Pergi (PP)
                </button>
                <button 
                  className={`trip-type-btn ${!isRoundTrip ? 'active' : ''}`}
                  onClick={() => onToggleRoundTrip(false)}
                >
                  → One Way
                </button>
              </div>

              <div className="transport-grid">
                {getFilteredTransport().map((route, idx) => renderTransportCard(route, idx))}
              </div>
            </>
          )}
        </>
      )}

      {privateTransport.length > 0 && (
        <>
          <div className="transport-category-header">
            <h4 className="transport-category">🏍️ Kendaraan Pribadi (Auto PP)</h4>
            <button 
              className="toggle-transport-btn"
              onClick={() => setShowPrivateTransport(!showPrivateTransport)}
            >
              {showPrivateTransport ? '▲ Sembunyikan' : `▼ Lihat ${privateTransport.length} Opsi`}
            </button>
          </div>

          {showPrivateTransport && (
            <div className="transport-grid">
              {privateTransport.map((route, idx) => renderTransportCard(route, `private-${idx}`))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransportSelection;
