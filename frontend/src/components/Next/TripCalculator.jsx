import React, { memo, useCallback } from 'react';
import { baseCosts } from './constants';
import './Next.css';

const TripCalculator = memo(function TripCalculator({
  destination,
  duration,
  setDuration,
  savings,
  monthlySavings,
  setMonthlySavings,
  handleSavingsUpdate,
  preferences,
  setPreferences,
  tripCost,
  monthsToReach
}) {
  const handleDurationDecrease = useCallback(() => setDuration(prev => Math.max(1, prev - 1)), [setDuration]);
  const handleDurationIncrease = useCallback(() => setDuration(prev => prev + 1), [setDuration]);
  
  const handlePreferenceChange = useCallback((field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  }, [setPreferences]);
  
  const handleMonthlySavingsChange = useCallback((e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setMonthlySavings(rawValue ? parseInt(rawValue, 10) : 0);
  }, [setMonthlySavings]);
  
  const handleActivityToggle = useCallback((activityName, checked) => {
    setPreferences(prev => ({
      ...prev,
      selectedActivities: checked
        ? [...prev.selectedActivities, activityName]
        : prev.selectedActivities.filter(a => a !== activityName)
    }));
  }, [setPreferences]);
  
  const handleSavingsAdd = useCallback((amount) => () => handleSavingsUpdate(amount), [handleSavingsUpdate]);
  
  return (
    <div className="trip-calculator">
      <div className="calculator-header">
        <h2>Trip Calculator</h2>
        <p>Planning a trip to {destination.name}</p>
      </div>
      
      <div className="calculator-grid">
        <div className="calculator-section">
          <h3>Trip Duration</h3>
          <div className="duration-input">
            <button 
              onClick={handleDurationDecrease}
              className="duration-btn"
            >
              -
            </button>
            <span>{duration} days</span>
            <button 
              onClick={handleDurationIncrease}
              className="duration-btn"
            >
              +
            </button>
          </div>
        </div>

        <div className="calculator-section">
          <h3>Travel Preferences</h3>
          <div className="preferences-grid">
            <div className="preference-item">
              <label>Accommodation Type</label>
              <select
                value={preferences.accommodationType}
                onChange={(e) => handlePreferenceChange('accommodationType', e.target.value)}
              >
                {Object.entries(baseCosts.ACCOMMODATION).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div className="preference-item">
              <label>Transportation Type</label>
              <select
                value={preferences.transportationType}
                onChange={(e) => handlePreferenceChange('transportationType', e.target.value)}
              >
                {Object.entries(baseCosts.TRANSPORTATION).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div className="preference-item">
              <label>Flight Class</label>
              <select
                value={preferences.flightClass}
                onChange={(e) => handlePreferenceChange('flightClass', e.target.value)}
              >
                {Object.entries(baseCosts.FLIGHT_CLASS).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div className="preference-item">
              <label>Season</label>
              <select
                value={preferences.season}
                onChange={(e) => handlePreferenceChange('season', e.target.value)}
              >
                {Object.entries(baseCosts.SEASON).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div className="preference-item">
              <label>Food Preference</label>
              <select
                value={preferences.foodPreference}
                onChange={(e) => handlePreferenceChange('foodPreference', e.target.value)}
              >
                <option value="budget">Budget Meals</option>
                <option value="standard">Standard Meals</option>
                <option value="luxury">Luxury Dining</option>
              </select>
            </div>

            <div className="preference-item">
              <label>Group Size</label>
              <select
                value={preferences.groupSize}
                onChange={(e) => handlePreferenceChange('groupSize', parseInt(e.target.value))}
              >
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="calculator-section">
          <h3>Monthly Savings Target</h3>
          <div className="preference-item">
            <input
              type="text"
              value={monthlySavings ? monthlySavings.toLocaleString('id-ID') : ''}
              onChange={handleMonthlySavingsChange}
              className="savings-input"
              placeholder="Enter your monthly savings target"
            />
          </div>
        </div>

        <div className="calculator-section">
          <h3>Activities</h3>
          <div className="activities-grid">
            {destination.costs.activities.basic.map((activity) => (
              <div key={activity.name} className="activity-item">
                <input
                  type="checkbox"
                  id={activity.name}
                  checked={preferences.selectedActivities.includes(activity.name)}
                  onChange={(e) => handleActivityToggle(activity.name, e.target.checked)}
                />
                <label htmlFor={activity.name}>{activity.name}</label>
                <span className="activity-cost">
                  IDR {activity.cost.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="calculator-section">
          <h3>Current Savings</h3>
          <div className="savings-display">
            IDR {savings.toLocaleString('id-ID')}
          </div>
          <div className="savings-actions">
            <button 
              onClick={handleSavingsAdd(500000)}
              className="savings-btn"
            >
              + IDR 500K
            </button>
            <button 
              onClick={handleSavingsAdd(1000000)}
              className="savings-btn"
            >
              + IDR 1M
            </button>
            <button 
              onClick={handleSavingsAdd(-500000)}
              className="savings-btn remove"
            >
              - IDR 500K
            </button>
          </div>
        </div>
      </div>

      <div className="trip-summary">
        <h3>Trip Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span>Total Cost</span>
            <strong>IDR {tripCost.totalCost.toLocaleString('id-ID')}</strong>
          </div>
          <div className="summary-item">
            <span>Cost per Person</span>
            <strong>IDR {tripCost.costPerPerson.toLocaleString('id-ID')}</strong>
          </div>
          <div className="summary-item">
            <span>Current Savings</span>
            <strong>IDR {savings.toLocaleString('id-ID')}</strong>
          </div>
          <div className="summary-item">
            <span>Remaining Amount</span>
            <strong>IDR {Math.max(0, tripCost.totalCost - savings).toLocaleString('id-ID')}</strong>
          </div>
          <div className="summary-item">
            <span>Time to Reach Goal</span>
            <strong>{monthsToReach} months</strong>
          </div>
        </div>

        <div className="cost-breakdown">
          <h4>Cost Breakdown</h4>
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <span>Flight</span>
              <strong>IDR {tripCost.breakdown.flight.toLocaleString('id-ID')}</strong>
            </div>
            <div className="breakdown-item">
              <span>Accommodation</span>
              <strong>IDR {tripCost.breakdown.accommodation.toLocaleString('id-ID')}</strong>
            </div>
            <div className="breakdown-item">
              <span>Local Transportation</span>
              <strong>IDR {tripCost.breakdown.transportation.toLocaleString('id-ID')}</strong>
            </div>
            <div className="breakdown-item">
              <span>Food</span>
              <strong>IDR {tripCost.breakdown.food.toLocaleString('id-ID')}</strong>
            </div>
            <div className="breakdown-item">
              <span>Activities</span>
              <strong>IDR {tripCost.breakdown.activities.toLocaleString('id-ID')}</strong>
            </div>
            <div className="breakdown-item">
              <span>Season Multiplier</span>
              <strong>{tripCost.breakdown.seasonalMultiplier}x</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TripCalculator;
