import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Next.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MountainTripCalculator = () => {
  // Step Management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Mountains & Cities
  const [mountains, setMountains] = useState([]);
  const [filteredMountains, setFilteredMountains] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  // Location
  const [userLocation, setUserLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState(null);
  const [locationMethod, setLocationMethod] = useState('city'); // 'city', 'gps', 'map'
  
  // Trip Details
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [fromCity, setFromCity] = useState('');
  const [numPeople, setNumPeople] = useState(4);
  const [durationDays, setDurationDays] = useState(2);
  
  // Transportation
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState('');
  
  // Services
  const [needGuide, setNeedGuide] = useState(false);
  const [needPorter, setNeedPorter] = useState(false);
  const [needEquipment, setNeedEquipment] = useState(false);
  const [needAccommodation, setNeedAccommodation] = useState(false);
  const [accommodationNights, setAccommodationNights] = useState(1);
  
  // Equipment
  const [equipmentRentals, setEquipmentRentals] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  
  // Results
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchMountains();
    fetchCities();
    fetchProvinces();
  }, []);

  // Fetch mountains with filters
  useEffect(() => {
    fetchMountains();
  }, [selectedProvince, selectedDifficulty]);

  // Fetch transport routes when mountain/city changes
  useEffect(() => {
    if (selectedMountain && fromCity) {
      fetchTransportRoutes();
    }
  }, [selectedMountain, fromCity]);

  // Fetch equipment when mountain changes
  useEffect(() => {
    if (selectedMountain) {
      fetchEquipmentRentals();
    }
  }, [selectedMountain]);

  const fetchMountains = async () => {
    try {
      const params = {};
      if (selectedProvince) params.province = selectedProvince;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      
      const response = await axios.get(`${API_URL}/api/trip-calculator/mountains`, { params });
      setMountains(response.data);
    } catch (err) {
      console.error('Error fetching mountains:', err);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/cities`);
      setCities(response.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/provinces`);
      setProvinces(response.data);
    } catch (err) {
      console.error('Error fetching provinces:', err);
    }
  };

  const fetchTransportRoutes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/trip-calculator/transportation/${selectedMountain.id}`,
        { params: { fromCity } }
      );
      setTransportRoutes(response.data);
      if (response.data.length > 0) {
        setSelectedTransport(response.data[0].transport_type);
      }
    } catch (err) {
      console.error('Error fetching transport routes:', err);
    }
  };

  const fetchEquipmentRentals = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/trip-calculator/equipment/${selectedMountain.id}`
      );
      setEquipmentRentals(response.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  const handleMountainSelect = (mountain) => {
    setSelectedMountain(mountain);
    setDurationDays(mountain.typical_duration_days || 2);
    setCalculation(null);
  };

  const handleEquipmentToggle = (itemName) => {
    setSelectedEquipment(prev => 
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    );
  };

  const calculateTrip = async () => {
    if (!selectedMountain || !fromCity) {
      setError('Please select mountain and departure city');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/trip-calculator/calculate`, {
        mountainId: selectedMountain.id,
        fromCity,
        numPeople,
        durationDays,
        transportType: selectedTransport,
        needGuide,
        needPorter,
        needEquipmentRental: needEquipment,
        equipmentItems: selectedEquipment,
        needAccommodation,
        accommodationNights
      });

      setCalculation(response.data);
    } catch (err) {
      console.error('Error calculating trip:', err);
      setError(err.response?.data?.error || 'Failed to calculate trip cost');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mountain-trip-calculator">
      <div className="calculator-header">
        <h1>🏔️ Mountain Trip Calculator</h1>
        <p>Hitung budget trip mendaki gunung dari kota kamu!</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Step 1: Select Mountain */}
      <div className="calculator-section">
        <h2>1. Pilih Gunung</h2>
        
        {/* Filters */}
        <div className="filters-grid">
          <div className="filter-item">
            <label>Provinsi</label>
            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
              <option value="">Semua Provinsi</option>
              {provinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Tingkat Kesulitan</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="">Semua Tingkat</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
              <option value="Sangat Sulit">Sangat Sulit</option>
            </select>
          </div>
        </div>

        {/* Mountain Grid */}
        <div className="mountains-grid">
          {mountains.map(mountain => (
            <div 
              key={mountain.id}
              className={`mountain-card ${selectedMountain?.id === mountain.id ? 'selected' : ''}`}
              onClick={() => handleMountainSelect(mountain)}
            >
              {mountain.image_url && (
                <div className="mountain-image">
                  <img src={mountain.image_url} alt={mountain.name} />
                </div>
              )}
              <div className="mountain-info">
                <h3>{mountain.name}</h3>
                <p className="mountain-location">📍 {mountain.province}</p>
                <p className="mountain-elevation">⛰️ {mountain.elevation} mdpl</p>
                <span className={`difficulty-badge ${mountain.difficulty.toLowerCase().replace(' ', '-')}`}>
                  {mountain.difficulty}
                </span>
                <p className="mountain-duration">📅 {mountain.typical_duration_days} hari</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Trip Details */}
      {selectedMountain && (
        <>
          <div className="calculator-section">
            <h2>2. Detail Trip</h2>
            
            <div className="trip-details-grid">
              <div className="detail-item">
                <label>Dari Kota</label>
                <select value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
                  <option value="">Pilih Kota Keberangkatan</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="detail-item">
                <label>Jumlah Orang</label>
                <div className="number-input">
                  <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))}>-</button>
                  <span>{numPeople} orang</span>
                  <button onClick={() => setNumPeople(numPeople + 1)}>+</button>
                </div>
              </div>

              <div className="detail-item">
                <label>Durasi</label>
                <div className="number-input">
                  <button onClick={() => setDurationDays(Math.max(1, durationDays - 1))}>-</button>
                  <span>{durationDays} hari</span>
                  <button onClick={() => setDurationDays(durationDays + 1)}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Transportation */}
          {fromCity && transportRoutes.length > 0 && (
            <div className="calculator-section">
              <h2>3. Transportasi</h2>
              
              <div className="transport-options">
                {transportRoutes.map(route => (
                  <div 
                    key={route.id}
                    className={`transport-card ${selectedTransport === route.transport_type ? 'selected' : ''}`}
                    onClick={() => setSelectedTransport(route.transport_type)}
                  >
                    <h4>{route.transport_type}</h4>
                    <p>{route.transport_name}</p>
                    <p className="duration">{route.duration_hours} jam</p>
                    <p className="cost">
                      Rp {route.cost_min.toLocaleString()} - Rp {route.cost_max.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Services */}
          <div className="calculator-section">
            <h2>4. Layanan</h2>
            
            <div className="services-grid">
              <div className="service-item">
                <input 
                  type="checkbox" 
                  id="guide" 
                  checked={needGuide}
                  onChange={(e) => setNeedGuide(e.target.checked)}
                />
                <label htmlFor="guide">
                  <strong>Guide</strong>
                  <span>Rp {selectedMountain.guide_fee_per_day?.toLocaleString()}/hari</span>
                  {selectedMountain.guide_fee_source && (
                    <small className="price-source">📋 {selectedMountain.guide_fee_source}</small>
                  )}
                </label>
              </div>

              <div className="service-item">
                <input 
                  type="checkbox" 
                  id="porter" 
                  checked={needPorter}
                  onChange={(e) => setNeedPorter(e.target.checked)}
                />
                <label htmlFor="porter">
                  <strong>Porter</strong>
                  <span>Rp {selectedMountain.porter_fee_per_day?.toLocaleString()}/hari</span>
                  {selectedMountain.porter_fee_source && (
                    <small className="price-source">📋 {selectedMountain.porter_fee_source}</small>
                  )}
                </label>
              </div>

              <div className="service-item">
                <input 
                  type="checkbox" 
                  id="equipment" 
                  checked={needEquipment}
                  onChange={(e) => setNeedEquipment(e.target.checked)}
                />
                <label htmlFor="equipment">
                  <strong>Sewa Peralatan</strong>
                  <span>Carrier, Tenda, Sleeping Bag, dll</span>
                </label>
              </div>

              <div className="service-item">
                <input 
                  type="checkbox" 
                  id="accommodation" 
                  checked={needAccommodation}
                  onChange={(e) => setNeedAccommodation(e.target.checked)}
                />
                <label htmlFor="accommodation">
                  <strong>Penginapan</strong>
                  <span>Homestay sebelum/sesudah trip</span>
                </label>
              </div>
            </div>

            {/* Equipment Selection */}
            {needEquipment && equipmentRentals.length > 0 && (
              <div className="equipment-selection">
                <h3>Pilih Peralatan</h3>
                {equipmentRentals[0] && JSON.parse(equipmentRentals[0].items).map(item => (
                  <div key={item.name} className="equipment-item">
                    <input 
                      type="checkbox"
                      id={item.name}
                      checked={selectedEquipment.includes(item.name)}
                      onChange={() => handleEquipmentToggle(item.name)}
                    />
                    <label htmlFor={item.name}>
                      {item.name} - Rp {item.price_per_day.toLocaleString()}/hari
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Accommodation Nights */}
            {needAccommodation && (
              <div className="accommodation-nights">
                <label>Jumlah Malam</label>
                <div className="number-input">
                  <button onClick={() => setAccommodationNights(Math.max(1, accommodationNights - 1))}>-</button>
                  <span>{accommodationNights} malam</span>
                  <button onClick={() => setAccommodationNights(accommodationNights + 1)}>+</button>
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <div className="calculator-section">
            <button 
              className="calculate-btn"
              onClick={calculateTrip}
              disabled={loading || !fromCity}
            >
              {loading ? 'Menghitung...' : '💰 Hitung Total Biaya'}
            </button>
          </div>

          {/* Results */}
          {calculation && (
            <div className="calculator-section results-section">
              <h2>📊 Hasil Perhitungan</h2>
              
              {/* Price Transparency Info */}
              <div className="price-transparency-info">
                <p>
                  ℹ️ <strong>Harga Transparan:</strong> Semua harga berdasarkan data resmi dari 
                  Balai Taman Nasional, Asosiasi Guide, dan rata-rata komunitas pendaki 2024.
                  {selectedMountain.price_last_updated && (
                    <span> Terakhir diupdate: {new Date(selectedMountain.price_last_updated).toLocaleDateString('id-ID')}</span>
                  )}
                </p>
              </div>
              
              <div className="results-summary">
                <div className="result-card total">
                  <h3>Total Biaya</h3>
                  <p className="amount">Rp {calculation.totalCost.toLocaleString()}</p>
                </div>
                
                <div className="result-card per-person">
                  <h3>Per Orang</h3>
                  <p className="amount">Rp {calculation.costPerPerson.toLocaleString()}</p>
                </div>
              </div>

              <div className="cost-breakdown">
                <h3>Rincian Biaya</h3>
                
                <div className="breakdown-list">
                  <div className="breakdown-item">
                    <span>✈️ Transportasi Utama</span>
                    <strong>Rp {calculation.breakdown.transportation.main.toLocaleString()}</strong>
                  </div>
                  
                  <div className="breakdown-item">
                    <span>🚗 Transportasi Lokal</span>
                    <strong>Rp {calculation.breakdown.transportation.local.toLocaleString()}</strong>
                  </div>
                  
                  <div className="breakdown-item">
                    <span>🎫 Tiket & Permit</span>
                    <strong>Rp {calculation.breakdown.permits.toLocaleString()}</strong>
                  </div>
                  
                  {calculation.breakdown.guide > 0 && (
                    <div className="breakdown-item">
                      <span>👨‍🏫 Guide</span>
                      <strong>Rp {calculation.breakdown.guide.toLocaleString()}</strong>
                    </div>
                  )}
                  
                  {calculation.breakdown.porter > 0 && (
                    <div className="breakdown-item">
                      <span>🎒 Porter</span>
                      <strong>Rp {calculation.breakdown.porter.toLocaleString()}</strong>
                    </div>
                  )}
                  
                  {calculation.breakdown.equipment > 0 && (
                    <div className="breakdown-item">
                      <span>🏕️ Sewa Peralatan</span>
                      <strong>Rp {calculation.breakdown.equipment.toLocaleString()}</strong>
                    </div>
                  )}
                  
                  <div className="breakdown-item">
                    <span>🍜 Makanan & Konsumsi</span>
                    <strong>Rp {calculation.breakdown.food.toLocaleString()}</strong>
                  </div>
                  
                  {calculation.breakdown.accommodation > 0 && (
                    <div className="breakdown-item">
                      <span>🏠 Penginapan</span>
                      <strong>Rp {calculation.breakdown.accommodation.toLocaleString()}</strong>
                    </div>
                  )}
                  
                  <div className="breakdown-item">
                    <span>💼 Lain-lain (10%)</span>
                    <strong>Rp {calculation.breakdown.miscellaneous.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="share-actions">
                <button 
                  className="share-btn whatsapp"
                  onClick={() => {
                    const message = `🏔️ Trip ke ${selectedMountain.name}\n👥 ${numPeople} orang\n📅 ${durationDays} hari\n💰 Total: Rp ${calculation.totalCost.toLocaleString()}\n💵 Per orang: Rp ${calculation.costPerPerson.toLocaleString()}\n\nBooking: wa.me/6281234567890`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
                  }}
                >
                  📱 Share via WhatsApp
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MountainTripCalculator;
