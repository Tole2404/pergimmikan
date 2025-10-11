import React, { memo } from 'react';
import { calculateTripCost } from './constants';
import './Next.css';

const DestinationCard = memo(function DestinationCard({ destination, isActive, onClick }) {
  // Hitung biaya minimum untuk 1 hari dengan opsi termurah
  const getMinimumCost = () => {
    const minCost = calculateTripCost({
      destination,
      duration: 1,
      accommodationType: 'BUDGET',
      transportationType: 'PUBLIC',
      flightClass: 'ECONOMY',
      season: 'LOW',
      foodPreference: 'budget',
      groupSize: 1
    });
    
    // Ambil biaya per hari tanpa biaya penerbangan
    const flightCost = minCost.breakdown.flight;
    const dailyCost = (minCost.totalCost - flightCost);
    
    return {
      dailyCost,
      flightCost
    };
  };

  const costs = getMinimumCost();

  return (
    <div 
      className={`destination-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="destination-card__image">
        <img 
          src={destination.image} 
          alt={destination.name} 
          loading="lazy" 
          width="100%" 
          height="auto"
          decoding="async"
        />
      </div>
      <div className="destination-card__content">
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <div className="destination-card__highlights">
          {destination.highlights.map(highlight => (
            <span key={highlight} className="highlight-tag">{highlight}</span>
          ))}
        </div>
        <div className="destination-card__price">
          <div>Start from IDR {costs.dailyCost.toLocaleString('id-ID')} / day</div>
          <div className="destination-card__flight-price">
            + Flight IDR {costs.flightCost.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DestinationCard;
