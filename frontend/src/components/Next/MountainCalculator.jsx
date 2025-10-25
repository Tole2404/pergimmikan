import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSearch, FiX, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import TrackSelection from './TrackSelection';
import TransportSelection from './TransportSelection';
import EquipmentRental from './EquipmentRental';
import Loading from '../common/Loading';
import DynamicSEO from '../common/DynamicSEO';
import './MountainCalculator.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get nearest city
const getNearestCity = (userLat, userLon) => {
  const cities = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191 },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521 },
    { name: 'Yogyakarta', lat: -7.7956, lon: 110.3695 },
    { name: 'Malang', lat: -7.9666, lon: 112.6326 },
  ];

  let nearest = cities[0];
  let minDistance = calculateDistance(userLat, userLon, cities[0].lat, cities[0].lon);

  cities.forEach(city => {
    const distance = calculateDistance(userLat, userLon, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  });

  return { ...nearest, distance: Math.round(minDistance) };
};

const MountainCalculator = () => {
  // Load saved state from sessionStorage
  const loadSavedState = () => {
    try {
      const saved = sessionStorage.getItem('mountainCalculatorState');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Error loading saved state:', err);
      return null;
    }
  };

  const savedState = loadSavedState();

  const [currentStep, setCurrentStep] = useState(savedState?.currentStep || 1);
  const [mountains, setMountains] = useState([]);
  const [filteredMountains, setFilteredMountains] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCity, setNearestCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedMountain, setSelectedMountain] = useState(savedState?.selectedMountain || null);
  const [mountainTracks, setMountainTracks] = useState(savedState?.mountainTracks || []);
  const [selectedTrack, setSelectedTrack] = useState(savedState?.selectedTrack || null);
  const [fromCity, setFromCity] = useState(savedState?.fromCity || '');
  const [numPeople, setNumPeople] = useState(savedState?.numPeople || 4);
  const [durationDays, setDurationDays] = useState(savedState?.durationDays || 2);
  const [departureDate, setDepartureDate] = useState(savedState?.departureDate || '');
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(savedState?.selectedTransport || '');
  const [isRoundTrip, setIsRoundTrip] = useState(savedState?.isRoundTrip ?? true);
  const [needGuide, setNeedGuide] = useState(savedState?.needGuide || false);
  const [numGuides, setNumGuides] = useState(savedState?.numGuides || 1);
  const [needPorter, setNeedPorter] = useState(savedState?.needPorter || false);
  const [numPorters, setNumPorters] = useState(savedState?.numPorters || 1);
  const [equipmentRentals, setEquipmentRentals] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(savedState?.selectedEquipment || {});
  const [needAccommodation, setNeedAccommodation] = useState(savedState?.needAccommodation || false);
  const [accommodationNights, setAccommodationNights] = useState(savedState?.accommodationNights || 1);
  const [calculation, setCalculation] = useState(savedState?.calculation || null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for carousel auto-scroll
  const carouselRefs = useRef({});
  const [currentCardIndex, setCurrentCardIndex] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [draggingProvince, setDraggingProvince] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Modal detail
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailMountain, setDetailMountain] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Swipe to close modal
  const [modalTouchStart, setModalTouchStart] = useState(null);
  const [modalTouchEnd, setModalTouchEnd] = useState(null);
  const [modalDragY, setModalDragY] = useState(0);

  useEffect(() => {
    fetchMountains();
    fetchCities();
    fetchProvinces();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDetailModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDetailModal]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Save state to sessionStorage
  useEffect(() => {
    const stateToSave = {
      currentStep,
      selectedMountain,
      mountainTracks,
      selectedTrack,
      fromCity,
      numPeople,
      durationDays,
      departureDate,
      selectedTransport,
      isRoundTrip,
      needGuide,
      numGuides,
      needPorter,
      numPorters,
      selectedEquipment,
      needAccommodation,
      accommodationNights,
      calculation
    };
    
    try {
      sessionStorage.setItem('mountainCalculatorState', JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Error saving state:', err);
    }
  }, [
    currentStep,
    selectedMountain,
    mountainTracks,
    selectedTrack,
    fromCity,
    numPeople,
    durationDays,
    departureDate,
    selectedTransport,
    isRoundTrip,
    needGuide,
    numGuides,
    needPorter,
    numPorters,
    selectedEquipment,
    needAccommodation,
    accommodationNights,
    calculation
  ]);

  useEffect(() => {
    let filtered = mountains;
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.province.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedProvince) filtered = filtered.filter(m => m.province === selectedProvince);
    if (selectedDifficulty) filtered = filtered.filter(m => m.difficulty === selectedDifficulty);
    setFilteredMountains(filtered);
  }, [searchQuery, selectedProvince, selectedDifficulty, mountains]);
  
  // Group mountains by province
  const groupedMountains = filteredMountains.reduce((acc, mountain) => {
    const province = mountain.province || 'Lainnya';
    if (!acc[province]) {
      acc[province] = [];
    }
    acc[province].push(mountain);
    return acc;
  }, {});

  useEffect(() => {
    if (selectedMountain && fromCity) fetchTransportRoutes();
  }, [selectedMountain, fromCity]);

  useEffect(() => {
    if (selectedMountain) fetchEquipmentRentals();
  }, [selectedMountain]);

  // Initialize card indices - only once when provinces change
  useEffect(() => {
    const indices = {};
    Object.keys(groupedMountains).forEach(province => {
      if (currentCardIndex[province] === undefined) {
        indices[province] = 0;
      }
    });
    if (Object.keys(indices).length > 0) {
      setCurrentCardIndex(prev => ({ ...prev, ...indices }));
    }
  }, [Object.keys(groupedMountains).join(',')]);

  // Auto-scroll carousel for mobile
  useEffect(() => {
    const intervals = {};
    
    Object.keys(groupedMountains).forEach(province => {
      const carouselElement = carouselRefs.current[province];
      if (carouselElement && window.innerWidth <= 768) {
        let scrollIndex = 0;
        const cardWidth = 300 + 16; // card width + gap
        
        intervals[province] = setInterval(() => {
          scrollIndex++;
          if (scrollIndex >= groupedMountains[province].length) {
            scrollIndex = 0;
          }
          
          const scrollPosition = scrollIndex * cardWidth;
          carouselElement.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }, 3000); // Auto-scroll every 3 seconds
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [groupedMountains]);

  // Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e, province) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setDraggingProvince(province);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Calculate drag offset
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
  };

  const onTouchEnd = (province) => {
    setDraggingProvince(null);
    setDragOffset(0);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const totalCards = groupedMountains[province]?.length || 0;
    
    if (isLeftSwipe && totalCards > 0) {
      setCurrentCardIndex(prev => {
        const current = prev[province] || 0;
        return {
          ...prev,
          [province]: (current + 1) % totalCards
        };
      });
    }
    
    if (isRightSwipe && totalCards > 0) {
      setCurrentCardIndex(prev => {
        const current = prev[province] || 0;
        return {
          ...prev,
          [province]: (current - 1 + totalCards) % totalCards
        };
      });
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };

  const fetchMountains = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/mountains`);
      setMountains(response.data);
      setFilteredMountains(response.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/cities`);
      setCities(response.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/provinces`);
      setProvinces(response.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchTransportRoutes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/trip-calculator/transportation/${selectedMountain.id}`,
        { params: { fromCity } }
      );
      setTransportRoutes(response.data);
      const recommended = response.data.find(r => r.is_recommended);
      if (recommended) {
        setSelectedTransport(recommended.transport_type);
      } else if (response.data.length > 0) {
        setSelectedTransport(response.data[0].transport_type);
      }
    } catch (err) {
      console.error('Error fetching transport routes:', err);
    }
  };

  const fetchEquipmentRentals = async () => {
    try {
      console.log('Fetching equipment for mountain ID:', selectedMountain.id);
      const response = await axios.get(`${API_URL}/api/trip-calculator/equipment/${selectedMountain.id}`);
      console.log('Equipment response:', response.data);
      setEquipmentRentals(response.data);
    } catch (err) {
      console.error('Error fetching equipment rentals:', err);
      setEquipmentRentals([]);
    }
  };

  const fetchMountainTracks = async (mountainId) => {
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/tracks/${mountainId}`);
      setMountainTracks(response.data);
      // Auto-select recommended track
      const recommended = response.data.find(t => t.is_recommended);
      if (recommended) {
        setSelectedTrack(recommended);
      } else if (response.data.length > 0) {
        setSelectedTrack(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setMountainTracks([]);
    }
  };

  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        
        // Find nearest city for departure
        const nearest = getNearestCity(latitude, longitude);
        setNearestCity(nearest);
        setFromCity(nearest.name);
        
        // Calculate distance to selected mountain if exists
        if (selectedMountain) {
          const distToMountain = calculateDistance(
            latitude, 
            longitude, 
            selectedMountain.latitude, 
            selectedMountain.longitude
          );
          console.log(`Distance to ${selectedMountain.name}: ${Math.round(distToMountain)} km`);
        }
        
        setLocationLoading(false);
      },
      (error) => {
        setLocationError('Tidak dapat mengakses lokasi');
        setLocationLoading(false);
      }
    );
  };

  const handleMountainSelect = async (mountain) => {
    // Open modal detail
    setDetailMountain(mountain);
    setShowDetailModal(true);
    setShowFullDescription(false);
  };

  const handleSelectMountainFromModal = (mountain) => {
    // Just change the detail mountain, don't close modal
    setDetailMountain(mountain);
    setShowFullDescription(false);
  };

  // Modal swipe handlers
  const onModalTouchStart = (e) => {
    // Only handle if touching the drag handle area
    const target = e.target;
    if (!target.closest('.modal-drag-handle') && !target.closest('.detail-modal-body')) {
      return;
    }
    
    setModalTouchEnd(null);
    setModalTouchStart(e.targetTouches[0].clientY);
  };

  const onModalTouchMove = (e) => {
    if (!modalTouchStart) return;
    
    const currentY = e.targetTouches[0].clientY;
    setModalTouchEnd(currentY);
    
    const dragY = currentY - modalTouchStart;
    if (dragY > 0) { // Only allow drag down
      setModalDragY(dragY);
      e.preventDefault(); // Prevent background scroll
    }
  };

  const onModalTouchEnd = () => {
    if (!modalTouchStart || !modalTouchEnd) {
      setModalDragY(0);
      return;
    }
    
    const distance = modalTouchEnd - modalTouchStart;
    
    if (distance > 100) { // If dragged down more than 100px, close
      setShowDetailModal(false);
    }
    
    setModalDragY(0);
    setModalTouchStart(null);
    setModalTouchEnd(null);
  };

  const handleSelectTrack = async () => {
    if (!detailMountain) return;
    
    setPageLoading(true);
    setSelectedMountain(detailMountain);
    setDurationDays(detailMountain.typical_duration_days || 2);
    setCalculation(null);
    setShowDetailModal(false);
    
    // Fetch tracks
    try {
      const response = await axios.get(`${API_URL}/api/trip-calculator/tracks/${detailMountain.id}`);
      const tracks = response.data;
      
      // Simulate minimum loading time for smooth UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (tracks && tracks.length > 0) {
        setMountainTracks(tracks);
        const recommended = tracks.find(t => t.is_recommended);
        setSelectedTrack(recommended || tracks[0]);
        setCurrentStep(1);
      } else {
        setMountainTracks([]);
        setSelectedTrack(null);
        setCurrentStep(2);
      }
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setMountainTracks([]);
      setSelectedTrack(null);
      setCurrentStep(2);
    } finally {
      setPageLoading(false);
    }
  };

  // Check if date is in best months
  const isGoodSeason = () => {
    if (!departureDate || !selectedMountain) return null;
    
    const date = new Date(departureDate);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = monthNames[date.getMonth()];
    
    try {
      const bestMonths = JSON.parse(selectedMountain.best_months || '[]');
      return bestMonths.includes(month);
    } catch {
      return null;
    }
  };

  // No auto-update porter - let user decide
  // useEffect(() => {
  //   if (needPorter) {
  //     const recommended = Math.ceil(numPeople / 2);
  //     setNumPorters(recommended);
  //   }
  // }, [numPeople, needPorter]);

  const handleEquipmentToggle = (itemName) => {
    if (selectedEquipment.includes(itemName)) {
      // Remove item
      setSelectedEquipment(prev => prev.filter(i => i !== itemName));
      setEquipmentQuantities(prev => {
        const newQty = { ...prev };
        delete newQty[itemName];
        return newQty;
      });
    } else {
      // Add item with default quantity 1
      setSelectedEquipment(prev => [...prev, itemName]);
      setEquipmentQuantities(prev => ({ ...prev, [itemName]: 1 }));
    }
  };

  const updateEquipmentQuantity = (itemName, delta) => {
    setEquipmentQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + delta)
    }));
  };

  const calculateTrip = async () => {
    if (!selectedMountain || !fromCity) {
      setError('Pilih gunung dan kota keberangkatan');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      mountainId: selectedMountain.id,
      trackId: selectedTrack?.id,
      fromCity,
      numPeople,
      durationDays,
      transportType: selectedTransport,
      needGuide,
      numGuides,
      needPorter,
      numPorters,
      needEquipmentRental: Object.keys(selectedEquipment).length > 0,
      equipmentItems: selectedEquipment,
      needAccommodation,
      accommodationNights
    };

    console.log('=== FRONTEND SENDING ===');
    console.log('Duration Days:', durationDays, typeof durationDays);
    console.log('Num People:', numPeople);
    console.log('Full Payload:', payload);

    try {
      const response = await axios.post(`${API_URL}/api/trip-calculator/calculate`, payload);

      setCalculation(response.data);
      setCurrentStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menghitung biaya');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setSelectedMountain(null);
    setSelectedTrack(null);
    setFromCity('');
    setCalculation(null);
    setSelectedTransport('');
    setNeedGuide(false);
    setNeedPorter(false);
    setSelectedEquipment({});
    setNeedAccommodation(false);
    
    // Clear sessionStorage
    sessionStorage.removeItem('mountainCalculatorState');
  };
  return (
    <>
      {/* SEO Meta Tags */}
      <DynamicSEO 
        pageType="trip-calculator"
        fallback={{
          title: 'Trip Calculator - Hitung Biaya Pendakian Gunung | PERGIMMIKAN',
          description: 'Rencanakan pendakian gunung Anda dengan mudah! Hitung estimasi biaya transportasi, peralatan, dan jalur pendakian. Dapatkan rekomendasi gunung terdekat dari lokasi Anda.',
          keywords: 'kalkulator pendakian, biaya pendakian gunung, peralatan hiking, transportasi gunung, jalur pendakian, estimasi biaya trip, rental alat gunung, gunung terdekat, trip planner indonesia',
          canonical_url: 'https://pergimmikan.site/next',
          og_title: 'Trip Calculator - Rencanakan Pendakian Gunung Anda',
          og_description: 'Hitung estimasi biaya lengkap untuk pendakian gunung: transportasi, peralatan, dan jalur. Temukan gunung terdekat dari lokasi Anda!',
          og_image: 'https://pergimmikan.site/images/og-trip-calculator.jpg',
          twitter_title: 'Trip Calculator - Hitung Biaya Pendakian',
          twitter_description: 'Rencanakan pendakian dengan mudah! Estimasi biaya transportasi, peralatan, dan jalur pendakian.',
          twitter_image: 'https://pergimmikan.site/images/og-trip-calculator.jpg'
        }}
      />
      
      {/* Page Loading Overlay */}
      {pageLoading && (
        <div className="common-loading-overlay">
          <Loading message="Memuat data..." size="large" />
        </div>
      )}

      <div className="mountain-calculator">
        {/* Header - Only show stepper after mountain selected */}
        <div className="calculator-header">
          <div className="header-wave-bg">
            <svg className="wave-pattern" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,50 C300,100 600,0 900,50 C1050,75 1150,50 1200,50 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.1)"></path>
            </svg>
            <svg className="wave-pattern wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,30 C300,80 600,20 900,60 C1050,80 1150,40 1200,40 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.05)"></path>
            </svg>
          </div>
          <div className="header-content">
            <h1 className="header-title-new">Mountain Trip Calculator</h1>
            <p className="header-subtitle-new">Hitung budget trip mendaki gunung dari lokasi kamu</p>
          </div>
        
        {selectedMountain && (
          <div className="horizontal-stepper">
            {[
              { num: 1, label: 'Pilih Jalur', desc: 'Pilih jalur' },
              { num: 2, label: 'Lokasi', desc: 'Detail perjalanan' },
              { num: 3, label: 'Layanan', desc: 'Pilih layanan' },
              { num: 4, label: 'Hasil', desc: 'Lihat estimasi' }
            ].map((step, index) => (
            <React.Fragment key={step.num}>
              <div className={`stepper-step ${currentStep >= step.num ? 'completed' : ''} ${currentStep === step.num ? 'active' : ''}`}>
                <div className="step-circle">
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <div className="step-info">
                  <div className="step-label">{step.label}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              </div>
              {index < 3 && <div className={`stepper-line ${currentStep > step.num ? 'completed' : ''}`}></div>}
            </React.Fragment>
          ))}
          </div>
        )}
        </div>
        {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Mountain Selection - Before Stepper */}
      {!selectedMountain && (
        <div className="step-content">
          <div className="mountain-selection-header">
            <h2 className="selection-title">Pilih Gunung Tujuan Anda</h2>
          </div>
          
          {/* Modern Search Bar */}
          <div className="modern-search">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-search-input"
              />
              {searchQuery && (
                <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          {/* Filter Pills - Province */}
          <div className="filter-pills-section">
            <div className="pills-row">
              <button 
                className={`filter-pill ${selectedProvince === '' ? 'active' : ''}`}
                onClick={() => setSelectedProvince('')}
              >
                Semua Provinsi
              </button>
              {provinces.map(province => (
                <button 
                  key={province}
                  className={`filter-pill ${selectedProvince === province ? 'active' : ''}`}
                  onClick={() => setSelectedProvince(province)}
                >
                  {province}
                </button>
              ))}
            </div>

            {/* Filter Pills - Difficulty */}
            <div className="pills-row">
              <button 
                className={`filter-pill ${selectedDifficulty === '' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('')}
              >
                Semua Tingkat
              </button>
              <button 
                className={`filter-pill ${selectedDifficulty === 'Mudah' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('Mudah')}
              >
                Mudah
              </button>
              <button 
                className={`filter-pill ${selectedDifficulty === 'Sedang' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('Sedang')}
              >
                Sedang
              </button>
              <button 
                className={`filter-pill ${selectedDifficulty === 'Sulit' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('Sulit')}
              >
                Sulit
              </button>
              <button 
                className={`filter-pill ${selectedDifficulty === 'Sangat Sulit' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('Sangat Sulit')}
              >
                Sangat Sulit
              </button>
            </div>
          </div>

          {/* Desktop: Show all in grid */}
          <div className="mountains-container desktop-view">
            {Object.keys(groupedMountains).length > 0 ? (
              Object.keys(groupedMountains).sort().map(province => (
                <div key={province} className="province-group">
                  <h3 className="province-title">{province}</h3>
                  <div className="mountains-grid-new">
                    {groupedMountains[province].map(mountain => (
                      <div 
                        key={mountain.id} 
                        className={`mountain-card-new ${selectedMountain?.id === mountain.id ? 'selected' : ''}`}
                      >
                        <div className="mountain-card-image-wrapper">
                          <img src={mountain.image_url || '/images/default-mountain.jpg'} alt={mountain.name} />
                          <span className={`difficulty-badge-top ${mountain.difficulty?.toLowerCase().replace(' ', '-')}`}>
                            {mountain.difficulty}
                          </span>
                          <div className="mountain-card-overlay">
                            <div className="mountain-card-content">
                              <h3 className="mountain-card-title">{mountain.name}</h3>
                              <p className="mountain-card-elevation">{mountain.elevation} mdpl</p>
                            </div>
                            <button 
                              className="mountain-card-btn"
                              onClick={() => handleMountainSelect(mountain)}
                            >
                              <span>Lihat Detail</span>
                              <span className="btn-arrow">→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">Tidak ada gunung ditemukan</p>
            )}
          </div>

          {/* Mobile: Show card stack per province */}
          <div className="mountains-container mobile-view">
            {Object.keys(groupedMountains).length > 0 ? (
              Object.keys(groupedMountains).sort().map(province => (
                <div key={province} className="province-carousel">
                  <h3 className="province-title">{province}</h3>
                  <div 
                    className="carousel-wrapper"
                    onTouchStart={(e) => onTouchStart(e, province)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(province)}
                  >
                    <div className="carousel-track">
                      {groupedMountains[province].map((mountain, index) => {
                        const currentIndex = currentCardIndex[province] || 0;
                        const totalCards = groupedMountains[province].length;
                        const position = (index - currentIndex + totalCards) % totalCards;
                        
                        // Only show top 3 cards
                        if (position >= 3) return null;
                        
                        const isEven = position % 2 === 0;
                        const baseXOffset = position === 0 ? 0 : (isEven ? 60 : -60) * Math.ceil(position / 2);
                        const rotation = position === 0 ? 0 : (isEven ? -5 : 5) * Math.ceil(position / 2);
                        
                        // Add drag offset ONLY to position 0 (active card) AND only for current province
                        const isDraggingThis = draggingProvince === province;
                        const finalXOffset = position === 0 && isDraggingThis 
                          ? dragOffset  // Only drag offset, no base offset
                          : baseXOffset;
                        
                        const dragRotation = position === 0 && isDraggingThis 
                          ? dragOffset * 0.05 
                          : rotation;
                        
                        return (
                          <div 
                            key={mountain.id} 
                            className={`mountain-card-new ${selectedMountain?.id === mountain.id ? 'selected' : ''}`}
                            style={{
                              zIndex: 10 - position,
                              transform: `translate(-50%, -50%) translateX(${finalXOffset}px) scale(${1 - position * 0.08}) rotateY(${dragRotation}deg)`,
                              opacity: 1 - position * 0.15,
                              pointerEvents: position === 0 ? 'auto' : 'none',
                              transition: isDraggingThis ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onClick={() => {
                              if (position === 0 && !isDraggingThis) {
                                setCurrentCardIndex(prev => ({
                                  ...prev,
                                  [province]: (currentIndex + 1) % totalCards
                                }));
                              }
                            }}
                          >
                            <div className="mountain-card-image-wrapper">
                              <img src={mountain.image_url || '/images/default-mountain.jpg'} alt={mountain.name} />
                              <span className={`difficulty-badge-top ${mountain.difficulty?.toLowerCase().replace(' ', '-')}`}>
                                {mountain.difficulty}
                              </span>
                              <div className="mountain-card-overlay">
                                <div className="mountain-card-content">
                                  <h3 className="mountain-card-title">{mountain.name}</h3>
                                  <p className="mountain-card-elevation">{mountain.elevation} mdpl</p>
                                </div>
                                <button 
                                  className="mountain-card-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMountainSelect(mountain);
                                  }}
                                >
                                  <span>Lihat Detail</span>
                                  <span className="btn-arrow">→</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">Tidak ada gunung ditemukan</p>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Track Selection */}
      {currentStep === 1 && selectedMountain && (
        <TrackSelection
          selectedMountain={selectedMountain}
          mountainTracks={mountainTracks}
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
          onBack={() => {
            setSelectedMountain(null);
            setSelectedTrack(null);
          }}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: Location */}
      {currentStep === 2 && selectedMountain && (
        <div className="step-content location-detail-step">
          <div className="step-header-modern">
            <h2>Lokasi & Detail Perjalanan</h2>
            <p>Tentukan lokasi keberangkatan dan detail pendakian Anda</p>
          </div>
          
          {/* Mountain Info Card */}
          <div className="mountain-info-card">
            <div className="mountain-img-wrapper">
              <img src={selectedMountain.image_url} alt={selectedMountain.name} />
              <div className="mountain-overlay">
                <span className="mountain-badge">{selectedMountain.difficulty || 'Sedang'}</span>
              </div>
            </div>
            <div className="mountain-details">
              <h3>{selectedMountain.name}</h3>
              <p className="mountain-location">📍 {selectedMountain.province}</p>
              {selectedTrack && (
                <p className="mountain-track">🥾 {selectedTrack.track_name}</p>
              )}
            </div>
          </div>

          {/* Location Selection */}
          <div className="location-section-modern">
            <h3 className="section-title">📍 Lokasi Keberangkatan</h3>
            
            <button onClick={getUserLocation} disabled={locationLoading} className="gps-btn-modern">
              <span className="btn-icon">{locationLoading ? '🔄' : '📍'}</span>
              <span className="btn-text">{locationLoading ? 'Mendeteksi Lokasi...' : 'Gunakan Lokasi GPS Saya'}</span>
            </button>
            
            {locationError && (
              <div className="alert alert-error">
                <span className="alert-icon">❌</span>
                <span className="alert-text">{locationError}</span>
              </div>
            )}

            {nearestCity && (
              <div className="location-result-modern">
                <div className="result-item success">
                  <span className="result-icon">✅</span>
                  <div className="result-content">
                    <span className="result-label">Kota terdekat</span>
                    <span className="result-value">{nearestCity.name} <small>(~{nearestCity.distance} km)</small></span>
                  </div>
                </div>
                {userLocation && selectedMountain && (
                  <div className="result-item info">
                    <span className="result-icon">📏</span>
                    <div className="result-content">
                      <span className="result-label">Jarak ke {selectedMountain.name}</span>
                      <span className="result-value">~{Math.round(calculateDistance(
                        userLocation.lat, 
                        userLocation.lon, 
                        selectedMountain.latitude, 
                        selectedMountain.longitude
                      ))} km</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="divider-modern">
              <span>atau pilih manual</span>
            </div>

            <div className="select-wrapper">
              <label className="select-label">Pilih Kota Keberangkatan</label>
              <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="select-modern">
                <option value="">-- Pilih Kota --</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          {/* Trip Details */}
          <div className="trip-details-section">
            <h3 className="section-title">📋 Detail Perjalanan</h3>
            
            <div className="details-grid-modern">
              <div className="detail-card">
                <label className="detail-label">
                  <span className="label-icon">📅</span>
                  <span className="label-text">Tanggal Keberangkatan</span>
                </label>
                <input 
                  type="date" 
                  value={departureDate} 
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-modern"
                />
                {!departureDate && <small className="input-hint">Pilih tanggal untuk cek musim terbaik</small>}
                {departureDate && isGoodSeason() === true && (
                  <div className="season-badge season-good">
                    <span>✅</span> Musim terbaik untuk mendaki!
                  </div>
                )}
                {departureDate && isGoodSeason() === false && (
                  <div className="season-badge season-warning">
                    <span>⚠️</span> Di luar musim terbaik
                    <small>Musim terbaik: {selectedMountain.best_months ? JSON.parse(selectedMountain.best_months).join(', ') : '-'}</small>
                  </div>
                )}
              </div>

              <div className="detail-card">
                <label className="detail-label">
                  <span className="label-icon">👥</span>
                  <span className="label-text">Jumlah Pendaki</span>
                </label>
                <div className="number-control-modern">
                  <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="control-btn">
                    <span>−</span>
                  </button>
                  <span className="control-value">{numPeople} orang</span>
                  <button onClick={() => setNumPeople(numPeople + 1)} className="control-btn">
                    <span>+</span>
                  </button>
                </div>
              </div>

              <div className="detail-card">
                <label className="detail-label">
                  <span className="label-icon">⏱️</span>
                  <span className="label-text">Durasi Pendakian</span>
                </label>
                <div className="number-control-modern">
                  <button onClick={() => setDurationDays(Math.max(1, durationDays - 1))} className="control-btn">
                    <span>−</span>
                  </button>
                  <span className="control-value">{durationDays} hari</span>
                  <button onClick={() => setDurationDays(durationDays + 1)} className="control-btn">
                    <span>+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="step-navigation-modern">
            <button onClick={() => setCurrentStep(1)} className="btn-nav-modern btn-back">
              ← Kembali
            </button>
            <button onClick={() => setCurrentStep(3)} disabled={!fromCity} className="btn-nav-modern btn-next">
              Lanjut ke Layanan →
            </button>
          </div>
        </div>
      )}
      {/* Step 3: Services */}
      {currentStep === 3 && (
        <div className="step-content services-step">
          <div className="step-header-modern">
            <h2>Layanan Tambahan</h2>
            <p>Pilih layanan yang Anda butuhkan</p>
          </div>

          {/* Transportation Section */}
          <TransportSelection
            fromCity={fromCity}
            basecamp={selectedTrack?.basecamp_name || selectedMountain.basecamp_name}
            transportRoutes={transportRoutes}
            selectedTransport={selectedTransport}
            isRoundTrip={isRoundTrip}
            numPeople={numPeople}
            onSelectTransport={setSelectedTransport}
            onToggleRoundTrip={setIsRoundTrip}
          />

          {/* Entrance Fee & SIMAKSI Section */}
          <div className="service-section-modern">
            <h3 className="section-title">🎫 Tiket Masuk & SIMAKSI</h3>
            
            <div className="entrance-card-modern">
              <div className="entrance-header">
                <div className="entrance-title">
                  <span className="entrance-icon">📋</span>
                  <h4>{selectedTrack ? selectedTrack.track_name : selectedMountain.name}</h4>
                </div>
                <div className="entrance-price">
                  <span className="price-label">Per orang</span>
                  <span className="price-value">Rp {(selectedTrack?.entrance_fee || selectedMountain.entrance_fee || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="entrance-total">
                <span className="total-label">Total untuk {numPeople} orang</span>
                <span className="total-value">
                  Rp {((selectedTrack?.entrance_fee || selectedMountain.entrance_fee || 0) * numPeople).toLocaleString('id-ID')}
                </span>
              </div>
              
              {(selectedTrack?.entrance_fee_source || selectedMountain.entrance_fee_source) && (
                <div className="entrance-source">
                  📌 {selectedTrack?.entrance_fee_source || selectedMountain.entrance_fee_source}
                </div>
              )}

              <div className="simaksi-box">
                <div className="simaksi-header">
                  <span className="simaksi-icon">💡</span>
                  <strong>Informasi SIMAKSI</strong>
                </div>
                <ul className="simaksi-list">
                  <li>Wajib untuk Taman Nasional (booking online H-7 sampai H-1)</li>
                  <li>Retribusi desa dibayar langsung di pos pendakian</li>
                  <li>Bawa KTP/identitas asli saat pendakian</li>
                  <li>Cek kuota & status gunung sebelum booking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="service-section-modern">
            <h3 className="section-title">🎒 Layanan Tambahan</h3>
            
            <div className="service-card-modern">
              <div className="service-checkbox">
                <input 
                  type="checkbox" 
                  checked={needGuide} 
                  onChange={(e) => {
                    setNeedGuide(e.target.checked);
                    if (e.target.checked && numGuides === 0) setNumGuides(1);
                  }}
                  id="guide-check"
                  className="checkbox-modern"
                />
                <label htmlFor="guide-check" className="service-label-modern">
                  <div className="service-info">
                    <span className="service-icon">👨‍🏫</span>
                    <div className="service-text">
                      <strong>Guide Profesional</strong>
                      <span className="service-desc">Pemandu berpengalaman untuk keamanan pendakian</span>
                    </div>
                  </div>
                  <div className="service-price-tag">
                    <span className="price-amount">Rp {selectedMountain.guide_fee_per_day?.toLocaleString('id-ID')}</span>
                    <span className="price-unit">/hari/guide</span>
                  </div>
                </label>
              </div>
              
              {needGuide && (
                <div className="service-expanded">
                  <div className="quantity-section">
                    <label className="quantity-label">Jumlah Guide</label>
                    <div className="number-control-modern">
                      <button onClick={() => setNumGuides(Math.max(1, numGuides - 1))} className="control-btn">
                        <span>−</span>
                      </button>
                      <span className="control-value">{numGuides} guide</span>
                      <button onClick={() => setNumGuides(numGuides + 1)} className="control-btn">
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="recommendation-box">
                    💡 Rekomendasi: 1 guide untuk grup {numPeople} orang
                  </div>
                  
                  <div className="price-summary">
                    <span className="summary-label">Total Biaya</span>
                    <span className="summary-value">Rp {(selectedMountain.guide_fee_per_day * durationDays * numGuides).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="price-detail">
                    Rp {selectedMountain.guide_fee_per_day.toLocaleString('id-ID')} × {durationDays} hari × {numGuides} guide
                  </div>
                  
                  {selectedMountain.guide_fee_source && (
                    <div className="source-info">📋 {selectedMountain.guide_fee_source}</div>
                  )}
                </div>
              )}
            </div>

            <div className="service-card-modern">
              <div className="service-checkbox">
                <input 
                  type="checkbox" 
                  checked={needPorter} 
                  onChange={(e) => {
                    setNeedPorter(e.target.checked);
                    if (e.target.checked && numPorters === 0) {
                      setNumPorters(1);
                    }
                  }}
                  id="porter-check"
                  className="checkbox-modern"
                />
                <label htmlFor="porter-check" className="service-label-modern">
                  <div className="service-info">
                    <span className="service-icon">🎒</span>
                    <div className="service-text">
                      <strong>Porter</strong>
                      <span className="service-desc">Bantuan angkut barang (max 20kg/porter)</span>
                    </div>
                  </div>
                  <div className="service-price-tag">
                    <span className="price-amount">Rp {selectedMountain.porter_fee_per_day?.toLocaleString('id-ID')}</span>
                    <span className="price-unit">/hari/porter</span>
                  </div>
                </label>
              </div>
              
              {needPorter && (
                <div className="service-expanded">
                  <div className="quantity-section">
                    <label className="quantity-label">Jumlah Porter</label>
                    <div className="number-control-modern">
                      <button onClick={() => setNumPorters(Math.max(1, numPorters - 1))} className="control-btn">
                        <span>−</span>
                      </button>
                      <span className="control-value">{numPorters} porter</span>
                      <button onClick={() => setNumPorters(numPorters + 1)} className="control-btn">
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="recommendation-box">
                    💡 Rekomendasi: {Math.ceil(numPeople / 2)} porter untuk {numPeople} orang (1 porter untuk 2 orang)
                  </div>
                  
                  <div className="price-summary">
                    <span className="summary-label">Total Biaya</span>
                    <span className="summary-value">Rp {(selectedMountain.porter_fee_per_day * durationDays * numPorters).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="price-detail">
                    Rp {selectedMountain.porter_fee_per_day.toLocaleString('id-ID')} × {durationDays} hari × {numPorters} porter
                  </div>
                  
                  {selectedMountain.porter_fee_source && (
                    <div className="source-info">📋 {selectedMountain.porter_fee_source}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Equipment Rental Section */}
          <EquipmentRental
            equipmentList={equipmentRentals}
            selectedEquipment={selectedEquipment}
            onEquipmentChange={setSelectedEquipment}
          />

          {/* Accommodation Section */}
          <div className="services-section">
            <div className="service-card">
              <div className="service-header">
                <input 
                  type="checkbox" 
                  checked={needAccommodation} 
                  onChange={(e) => setNeedAccommodation(e.target.checked)}
                  id="accommodation-check"
                />
                <label htmlFor="accommodation-check">
                  <strong>🏠 Penginapan Basecamp</strong>
                </label>
              </div>
              {needAccommodation && (
                <div className="service-details">
                  <div className="smart-info">
                    <strong>📍 Basecamp: {selectedMountain.basecamp_name}</strong>
                    <div className="basecamp-info">
                      {selectedMountain.basecamp_address}
                    </div>
                    
                    <div className="accommodation-info-box">
                      <h4>🏠 Rumah Singgah Pendaki</h4>
                      <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                        Penginapan sederhana di basecamp untuk istirahat sebelum/sesudah pendakian
                      </p>
                      <div className="price-info">
                        <span className="price-label">Harga:</span>
                        <span className="price-value">Rp 10.000/orang/malam</span>
                      </div>
                      <small style={{display: 'block', marginTop: '0.5rem', color: '#999'}}>
                        Fasilitas: Kasur/matras, kamar mandi bersama, air bersih
                      </small>
                    </div>
                    
                    <div className="quantity-control">
                      <label>Jumlah malam:</label>
                      <div className="input-group">
                        <button onClick={() => setAccommodationNights(Math.max(1, accommodationNights - 1))}>-</button>
                        <span>{accommodationNights} malam</span>
                        <button onClick={() => setAccommodationNights(accommodationNights + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="price-breakdown">
                      💰 Total: Rp {(10000 * accommodationNights * numPeople).toLocaleString('id-ID')}
                      <small>(Rp 10.000 x {accommodationNights} malam x {numPeople} orang)</small>
                    </div>
                    
                    <small className="info-text">💡 Harga standar rumah singgah pendaki di basecamp</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="step-navigation">
            <button onClick={() => setCurrentStep(2)} className="btn-secondary">← Kembali</button>
            <button onClick={calculateTrip} disabled={loading} className="btn-primary btn-calculate">
              {loading ? '⏳ Menghitung...' : '💰 Hitung Biaya'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === 4 && calculation && (
        <div className="step-content results-step">
          {/* Hero Result */}
          <div className="result-hero">
            <div className="result-hero-bg"></div>
            <div className="result-hero-content">
              <span className="result-badge">Estimasi Biaya</span>
              <h1 className="result-mountain">{calculation.mountain?.name || selectedMountain?.name || 'Gunung'}</h1>
              <div className="result-meta">
                <span>{calculation.tripDetails?.numPeople || numPeople} Pendaki</span>
                <span>•</span>
                <span>{calculation.tripDetails?.durationDays || durationDays} Hari</span>
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="price-display">
            <div className="price-main">
              <div className="price-label">Total Investasi</div>
              <div className="price-amount">
                <span className="currency">Rp</span>
                <span className="value">{calculation.totalCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="price-perperson">
                Rp {calculation.costPerPerson.toLocaleString('id-ID')} / orang
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="breakdown-grid">
            {Object.entries({
              '✈️ Transportasi Utama': calculation.breakdown.transportation.main,
              '🚗 Transportasi Lokal': calculation.breakdown.transportation.local,
              '🎫 Tiket & Permit': calculation.breakdown.permits,
              '👨‍🏫 Guide': calculation.breakdown.guide,
              '🎒 Porter': calculation.breakdown.porter,
              '🏕️ Equipment': calculation.breakdown.equipment,
              '🏠 Penginapan': calculation.breakdown.accommodation,
            }).map(([label, value]) => value > 0 && (
              <div key={label} className="breakdown-card">
                <div className="breakdown-card-label">{label}</div>
                <div className="breakdown-card-value">Rp {value.toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="cost-disclaimer">
            <div className="disclaimer-icon">ℹ️</div>
            <div className="disclaimer-content">
              <strong>Catatan Penting:</strong>
              <p>Estimasi biaya ini belum termasuk makanan pribadi, minuman, obat-obatan, dan keperluan pribadi lainnya. Disarankan untuk menyiapkan budget tambahan sekitar 20-30% dari total biaya.</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="result-action-bar">
            <button 
              className="result-action-btn result-btn-share"
              onClick={() => {
                try {
                  if (!calculation) {
                    alert('Data tidak lengkap. Silakan hitung ulang.');
                    return;
                  }
                  const mountainName = calculation.mountain?.name || selectedMountain?.name || 'Gunung';
                  const people = calculation.tripDetails?.numPeople || numPeople;
                  const days = calculation.tripDetails?.durationDays || durationDays;
                  const total = calculation.totalCost?.toLocaleString('id-ID') || '0';
                  const perPerson = calculation.costPerPerson?.toLocaleString('id-ID') || '0';
                  
                  // Detailed message format
                  const msg = `🏔️ *ESTIMASI BIAYA PENDAKIAN*

📍 Gunung: ${mountainName}
👥 Jumlah Pendaki: ${people} orang
📅 Durasi: ${days} hari

💰 *RINCIAN BIAYA:*
• Total Biaya: Rp ${total}
• Biaya Per Orang: Rp ${perPerson}

⚠️ *Catatan:*
Estimasi ini belum termasuk makanan pribadi, minuman, obat-obatan, dan keperluan pribadi lainnya.

Disarankan tambahan budget 20-30% dari total biaya.

---
📱 Hitung biaya trip kamu di:
PERGIMMIKAN Trip Calculator`;
                  
                  // Try multiple methods
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  
                  if (isMobile) {
                    // Mobile: Use whatsapp:// protocol
                    window.location.href = `whatsapp://send?text=${encodeURIComponent(msg)}`;
                  } else {
                    // Desktop: Use web.whatsapp.com
                    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                  }
                } catch (error) {
                  console.error('Share error:', error);
                  alert('Gagal membuka WhatsApp. Pastikan WhatsApp terinstall di device Anda.');
                }
              }}
            >
              Share WhatsApp
            </button>
            <button onClick={resetCalculator} className="result-action-btn result-btn-reset">
              Hitung Ulang
            </button>
          </div>
        </div>
      )}

      {/* Mountain Detail Modal */}
      {showDetailModal && detailMountain && (
        <div className="detail-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div 
            className="detail-modal-content" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onModalTouchStart}
            onTouchMove={onModalTouchMove}
            onTouchEnd={onModalTouchEnd}
            style={{
              transform: `translateY(${modalDragY}px)`,
              transition: modalDragY > 0 ? 'none' : 'transform 0.3s ease'
            }}
          >
            {/* Drag Handle */}
            <div className="modal-drag-handle">
              <div className="drag-handle-bar"></div>
            </div>

            {/* Content */}
            <div className="detail-modal-body">
              {/* Mountain Info */}
              <div className="detail-info-card">
                <h2 className="detail-mountain-name">{detailMountain.name}</h2>
                
                <div className="detail-meta">
                  <span className="detail-location">
                    <FiMapPin /> {detailMountain.province}
                  </span>
                  <span className="detail-elevation">
                    <FiTrendingUp /> {detailMountain.elevation} mdpl
                  </span>
                </div>

                <div className={`detail-difficulty difficulty-${detailMountain.difficulty?.toLowerCase().replace(' ', '-')}`}>
                  {detailMountain.difficulty}
                </div>

                {/* Description */}
                <div className="detail-description">
                  <p className={showFullDescription ? 'full' : 'preview'}>
                    {detailMountain.description || 
                     `${detailMountain.name} adalah salah satu gunung di ${detailMountain.province} dengan ketinggian ${detailMountain.elevation} mdpl. Gunung ini memiliki tingkat kesulitan ${detailMountain.difficulty?.toLowerCase()} dan durasi pendakian sekitar ${detailMountain.typical_duration_days || 2} hari.`}
                  </p>
                  <button 
                    className="read-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </button>
                </div>
              </div>

              {/* Other Mountains Section */}
              <div className="detail-mountains-section">
                <div className="section-header">
                  <h3>Gunung Lainnya</h3>
                  <button className="select-track-btn-main" onClick={handleSelectTrack}>
                    Pilih Jalur
                  </button>
                </div>

                {filteredMountains.length > 0 ? (
                  <div className="mountains-horizontal-scroll">
                    {filteredMountains
                      .filter(m => m.id !== detailMountain.id)
                      .slice(0, 5)
                      .map(mountain => (
                        <div key={mountain.id} className="mountain-card-horizontal">
                          <img 
                            src={mountain.image_url || '/images/default-mountain.jpg'} 
                            alt={mountain.name}
                            className="mountain-card-h-image"
                          />
                          <div className="mountain-card-h-info">
                            <h4 className="mountain-card-h-name">{mountain.name}</h4>
                            <p className="mountain-card-h-location">{mountain.province}</p>
                            <p className="mountain-card-h-elevation">{mountain.elevation} mdpl</p>
                          </div>
                          <button 
                            className="mountain-card-h-btn"
                            onClick={() => handleSelectMountainFromModal(mountain)}
                          >
                            →
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="no-mountains">Tidak ada gunung lain</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default MountainCalculator;
