import React, { useState, useCallback, useMemo } from 'react';
import DestinationCard from './DestinationCard';
import TripCalculator from './TripCalculator';
import { destinations, calculateTripCost } from './constants';
import './Next.css';

export default function Next() {
  const [duration, setDuration] = useState(3);
  const [savings, setSavings] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [activeDestination, setActiveDestination] = useState(destinations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [preferences, setPreferences] = useState({
    accommodationType: 'STANDARD',
    transportationType: 'PUBLIC',
    flightClass: 'ECONOMY',
    foodPreference: 'standard',
    season: 'LOW',
    selectedActivities: [],
    groupSize: 1
  });

  const calculateTimeToReach = useCallback((totalCost) => {
    if (!monthlySavings || monthlySavings <= 0) return '∞';
    const remainingCost = totalCost - savings;
    if (remainingCost <= 0) return 0;
    return Math.ceil(remainingCost / monthlySavings);
  }, [monthlySavings, savings]);

  const handleSavingsUpdate = useCallback((amount) => {
    setSavings(prev => Math.max(0, prev + amount));
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter(destination =>
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination logic
  const itemsPerPage = 3;
  const totalPages = useMemo(() => Math.ceil(filteredDestinations.length / itemsPerPage), [filteredDestinations]);
  
  const currentDestinations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDestinations.slice(startIndex, endIndex);
  }, [currentPage, filteredDestinations, itemsPerPage]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const handleDestinationClick = useCallback((destination) => {
    setActiveDestination(destination);
    setPreferences(prev => ({
      ...prev,
      selectedActivities: []
    }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const tripCost = useMemo(() => calculateTripCost({
    destination: activeDestination,
    duration,
    ...preferences
  }), [activeDestination, duration, preferences]);

  const monthsToReach = useMemo(() => calculateTimeToReach(tripCost.totalCost), [calculateTimeToReach, tripCost.totalCost]);

  return (
    <div className="next-trip">
      <div className="next-trip__container">
        <h1 className="next-trip__title">Where's Your Next Adventure?</h1>
        <p className="next-trip__subtitle">Choose your dream destination and start planning</p>

        <div className="trip-planner">
          <div className="destinations-section">
            <div className="destinations-header">
              <h2>Dream Destinations</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Where would you like to go?"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
            </div>
            <div className="destinations-grid">
              {currentDestinations.map(destination => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isActive={activeDestination.id === destination.id}
                  onClick={() => handleDestinationClick(destination)}
                />
              ))}
            </div>
            {/* Paginasi akan selalu ditampilkan jika ada lebih dari 3 item */}
            {filteredDestinations.length > 3 && (
              <div className="pagination">
                <button
                  className="pagination-btn prev"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn next"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </div>

          <TripCalculator
            destination={activeDestination}
            duration={duration}
            setDuration={setDuration}
            savings={savings}
            monthlySavings={monthlySavings}
            setMonthlySavings={setMonthlySavings}
            handleSavingsUpdate={handleSavingsUpdate}
            preferences={preferences}
            setPreferences={setPreferences}
            tripCost={tripCost}
            monthsToReach={monthsToReach}
          />
        </div>
      </div>
    </div>
  );
}
