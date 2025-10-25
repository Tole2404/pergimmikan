import React, { useState } from 'react';
import './MountainCalculator.css';

const EquipmentRental = ({ equipmentList, selectedEquipment, onEquipmentChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Parse items from JSON if needed (old format)
  const allItems = [];
  
  if (equipmentList && equipmentList.length > 0) {
    equipmentList.forEach(rental => {
      if (rental.items) {
        try {
          const items = JSON.parse(rental.items);
          items.forEach(item => {
            allItems.push({
              ...item,
              rental_source: rental.rental_name,
              id: `${rental.id}-${item.name}` // Unique ID
            });
          });
        } catch (e) {
          console.error('Error parsing equipment items:', e);
        }
      }
    });
  }

  // Show fallback if no data
  if (allItems.length === 0) {
    return (
      <div className="equipment-section">
        <h3>🎒 Sewa Peralatan</h3>
        <p className="section-subtitle">Pilih peralatan yang ingin disewa (opsional)</p>
        
        <div style={{
          padding: '3rem 2rem',
          background: 'white',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px dashed #e0e0e0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎒</div>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Data Sewa Peralatan Belum Tersedia</h4>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Untuk gunung ini belum ada data rental peralatan.<br/>
            Anda bisa bawa peralatan sendiri atau cari rental lokal di basecamp.
          </p>
          <div style={{
            display: 'inline-block',
            padding: '1rem 1.5rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#2c5f2d' }}>
              💡 Tips:
            </strong>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
              <li>Tanyakan ke guide tentang rental lokal</li>
              <li>Cek grup pendaki di media sosial</li>
              <li>Siapkan peralatan pribadi jika memungkinkan</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (itemId, quantity) => {
    const newSelection = { ...selectedEquipment };
    if (quantity > 0) {
      newSelection[itemId] = quantity;
    } else {
      delete newSelection[itemId];
    }
    onEquipmentChange(newSelection);
  };

  const getTotalCost = () => {
    return allItems.reduce((total, item) => {
      const qty = selectedEquipment[item.id] || 0;
      return total + (item.price_per_day * qty);
    }, 0);
  };

  // Group by category
  const groupedEquipment = allItems.reduce((acc, item) => {
    const category = item.category || 'Peralatan';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedEquipment);
  
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('tenda') || cat.includes('sleeping')) return '⛺';
    if (cat.includes('carrier') || cat.includes('tas')) return '🎒';
    if (cat.includes('masak') || cat.includes('cooking')) return '🍳';
    if (cat.includes('pakaian') || cat.includes('jaket')) return '🧥';
    if (cat.includes('navigasi') || cat.includes('kompas')) return '🧭';
    return '📦';
  };

  const getFilteredItems = () => {
    if (!selectedCategory) return [];
    return groupedEquipment[selectedCategory] || [];
  };

  return (
    <div className="service-section-modern">
      <h3 className="section-title">🎒 Sewa Peralatan</h3>
      <p className="section-subtitle">Pilih peralatan yang ingin disewa (opsional)</p>

      {/* Category Filter */}
      <div className="equipment-filter">
        <p className="filter-label">Pilih Kategori Peralatan:</p>
        <div className="equipment-category-buttons">
          {categories.map(category => {
            const count = groupedEquipment[category].length;
            return (
              <button
                key={category}
                className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{category}</span>
                <span className="category-count">{count} item</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Show equipment cards when category is selected */}
      {selectedCategory && (
        <div className="equipment-category-modern">
          <div className="equipment-grid-modern">
            {getFilteredItems().map(item => {
              const quantity = selectedEquipment[item.id] || 0;
              const itemTotal = item.price_per_day * quantity;

              return (
                <div key={item.id} className={`equipment-card-modern ${quantity > 0 ? 'selected' : ''}`}>
                  <div className="equipment-header-modern">
                    <h5>{item.name || item.item_name}</h5>
                    <span className="equipment-price-tag">
                      Rp {item.price_per_day.toLocaleString('id-ID')}/hari
                    </span>
                  </div>

                  {item.condition && (
                    <p className="equipment-condition">✓ {item.condition}</p>
                  )}

                  <div className="equipment-quantity-modern">
                    <label>Jumlah</label>
                    <div className="number-control-modern">
                      <button 
                        className="control-btn"
                        onClick={() => handleQuantityChange(item.id, Math.max(0, quantity - 1))}
                        disabled={quantity === 0}
                      >
                        <span>−</span>
                      </button>
                      <span className="control-value">{quantity} item</span>
                      <button 
                        className="control-btn"
                        onClick={() => handleQuantityChange(item.id, quantity + 1)}
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>

                  {quantity > 0 && (
                    <div className="equipment-subtotal-modern">
                      <span className="subtotal-label">Subtotal</span>
                      <span className="subtotal-value">Rp {itemTotal.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  {item.rental_source && (
                    <small className="equipment-source">📍 {item.rental_source}</small>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {Object.keys(selectedEquipment).length > 0 && (
        <div className="equipment-total">
          <h4>Total Sewa Peralatan:</h4>
          <div className="total-amount">Rp {getTotalCost().toLocaleString('id-ID')}/hari</div>
          <small>({Object.values(selectedEquipment).reduce((a, b) => a + b, 0)} item dipilih)</small>
        </div>
      )}
    </div>
  );
};

export default EquipmentRental;
