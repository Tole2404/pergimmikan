const db = require('../config/database');

class TripCalculatorController {
  /**
   * Get all mountains
   * GET /api/trip-calculator/mountains
   */
  async getMountains(req, res, next) {
    try {
      const { province, difficulty } = req.query;
      
      let query = 'SELECT * FROM mountains WHERE is_active = TRUE';
      const params = [];
      
      if (province) {
        query += ' AND province = ?';
        params.push(province);
      }
      
      if (difficulty) {
        query += ' AND difficulty = ?';
        params.push(difficulty);
      }
      
      query += ' ORDER BY name ASC';
      
      const [mountains] = await db.query(query, params);
      
      res.json(mountains);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tracks (for admin)
   * GET /api/trip-calculator/tracks
   */
  async getAllTracks(req, res, next) {
    try {
      const [tracks] = await db.query(
        'SELECT * FROM mountain_tracks ORDER BY mountain_id, popularity_rank ASC'
      );
      
      res.json(tracks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get mountain tracks
   * GET /api/trip-calculator/tracks/:mountainId
   */
  async getMountainTracks(req, res, next) {
    try {
      const { mountainId } = req.params;
      
      const [tracks] = await db.query(
        'SELECT * FROM mountain_tracks WHERE mountain_id = ? AND is_open = TRUE ORDER BY popularity_rank ASC',
        [mountainId]
      );
      
      res.json(tracks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get mountain detail
   * GET /api/trip-calculator/mountains/:id
   */
  async getMountainDetail(req, res, next) {
    try {
      const { id } = req.params;
      
      const [mountains] = await db.query(
        'SELECT * FROM mountains WHERE id = ? AND is_active = TRUE',
        [id]
      );
      
      if (mountains.length === 0) {
        return res.status(404).json({ error: 'Mountain not found' });
      }
      
      res.json(mountains[0]);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all transportation routes (for admin)
   * GET /api/trip-calculator/transportation
   */
  async getAllTransportation(req, res, next) {
    try {
      const [routes] = await db.query(
        'SELECT * FROM transportation_routes ORDER BY mountain_id, from_city ASC'
      );
      
      res.json(routes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transportation routes by mountain
   * GET /api/trip-calculator/transportation/:mountainId
   */
  async getTransportation(req, res, next) {
    try {
      const { mountainId } = req.params;
      const { fromCity } = req.query;
      
      let query = 'SELECT * FROM transportation_routes WHERE mountain_id = ?';
      const params = [mountainId];
      
      if (fromCity) {
        query += ' AND from_city = ?';
        params.push(fromCity);
      }
      
      query += ' ORDER BY is_recommended DESC, cost_min ASC';
      
      const [routes] = await db.query(query, params);
      
      res.json(routes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get local transportation
   * GET /api/trip-calculator/local-transport/:mountainId
   */
  async getLocalTransportation(req, res, next) {
    try {
      const { mountainId } = req.params;
      
      const [transport] = await db.query(
        'SELECT * FROM local_transportation WHERE mountain_id = ? ORDER BY is_recommended DESC',
        [mountainId]
      );
      
      res.json(transport);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all equipment (for admin)
   * GET /api/trip-calculator/equipment
   */
  async getAllEquipment(req, res, next) {
    try {
      const [equipment] = await db.query(
        'SELECT * FROM equipment_rental ORDER BY mountain_id, category ASC'
      );
      
      res.json(equipment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get equipment rental by mountain
   * GET /api/trip-calculator/equipment/:mountainId
   */
  async getEquipmentRental(req, res, next) {
    try {
      const { mountainId } = req.params;
      
      const [rentals] = await db.query(
        'SELECT * FROM equipment_rental WHERE mountain_id = ? AND is_available = TRUE ORDER BY category, equipment_name ASC',
        [mountainId]
      );
      
      res.json(rentals);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transportation operators by route
   * GET /api/trip-calculator/operators/:routeId
   */
  async getTransportOperators(req, res, next) {
    try {
      const { routeId } = req.params;
      
      const [operators] = await db.query(
        'SELECT * FROM transportation_operators WHERE route_id = ? AND is_active = TRUE ORDER BY is_recommended DESC, price ASC',
        [routeId]
      );
      
      res.json(operators);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get food estimates
   * GET /api/trip-calculator/food/:mountainId/:days
   */
  async getFoodEstimates(req, res, next) {
    try {
      const { mountainId, days } = req.params;
      
      const [estimates] = await db.query(
        'SELECT * FROM food_estimates WHERE mountain_id = ? AND duration_days = ?',
        [mountainId, days]
      );
      
      if (estimates.length === 0) {
        // Return default estimates if not found
        return res.json({
          breakfast_cost: 15000,
          lunch_cost: 20000,
          dinner_cost: 20000,
          snack_cost: 10000,
          water_cost: 5000
        });
      }
      
      res.json(estimates[0]);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get accommodations
   * GET /api/trip-calculator/accommodations/:mountainId
   */
  async getAccommodations(req, res, next) {
    try {
      const { mountainId } = req.params;
      
      const [accommodations] = await db.query(
        'SELECT * FROM accommodations WHERE mountain_id = ? ORDER BY is_recommended DESC, rating DESC',
        [mountainId]
      );
      
      res.json(accommodations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get equipment checklist
   * GET /api/trip-calculator/checklist
   */
  async getEquipmentChecklist(req, res, next) {
    try {
      const { difficulty } = req.query;
      
      let query = 'SELECT * FROM equipment_checklist';
      const params = [];
      
      if (difficulty) {
        query += ' WHERE JSON_CONTAINS(for_difficulty, ?)';
        params.push(JSON.stringify(difficulty));
      }
      
      query += ' ORDER BY FIELD(priority, "Wajib", "Penting", "Opsional"), category, item_name';
      
      const [checklist] = await db.query(query, params);
      
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calculate trip cost
   * POST /api/trip-calculator/calculate
   */
  async calculateTrip(req, res, next) {
    try {
      const {
        mountainId,
        trackId,
        fromCity,
        numPeople,
        durationDays,
        transportType,
        needGuide,
        numGuides,
        needPorter,
        numPorters,
        needEquipmentRental,
        equipmentItems,
        needAccommodation,
        accommodationNights
      } = req.body;

      console.log('=== TRIP CALCULATION REQUEST ===');
      console.log('Duration Days:', durationDays, typeof durationDays);
      console.log('Num People:', numPeople);
      console.log('Need Guide:', needGuide);
      console.log('Need Porter:', needPorter);

      // Get mountain data
      const [mountains] = await db.query(
        'SELECT * FROM mountains WHERE id = ?',
        [mountainId]
      );
      
      if (mountains.length === 0) {
        return res.status(404).json({ error: 'Mountain not found' });
      }
      
      const mountain = mountains[0];
      
      // Get track data if trackId provided
      let track = null;
      if (trackId) {
        const [tracks] = await db.query(
          'SELECT * FROM mountain_tracks WHERE id = ?',
          [trackId]
        );
        if (tracks.length > 0) {
          track = tracks[0];
        }
      }
      
      // Initialize cost breakdown
      const breakdown = {
        transportation: { main: 0, local: 0 },
        permits: 0,
        guide: 0,
        porter: 0,
        equipment: 0,
        food: 0,
        accommodation: 0,
        miscellaneous: 0
      };

      // 1. Main Transportation
      if (fromCity && transportType) {
        const [routes] = await db.query(
          'SELECT * FROM transportation_routes WHERE mountain_id = ? AND from_city = ? AND transport_type = ?',
          [mountainId, fromCity, transportType]
        );
        
        if (routes.length > 0) {
          // Use average of min and max
          breakdown.transportation.main = Math.round((routes[0].cost_min + routes[0].cost_max) / 2) * numPeople;
        }
      }

      // 2. Local Transportation
      const [localTransport] = await db.query(
        'SELECT * FROM local_transportation WHERE mountain_id = ? AND is_recommended = TRUE LIMIT 1',
        [mountainId]
      );
      
      if (localTransport.length > 0) {
        breakdown.transportation.local = localTransport[0].cost_per_person * numPeople;
      }

      // 3. Permits & Fees (use track entrance_fee if available)
      const entranceFee = track?.entrance_fee || mountain.entrance_fee || 0;
      breakdown.permits = entranceFee * numPeople;

      // 4. Guide (use track guide_fee if available)
      if (needGuide) {
        const guideFee = track?.guide_fee_per_day || mountain.guide_fee_per_day || 0;
        const guides = numGuides || 1;
        breakdown.guide = guideFee * durationDays * guides;
        console.log(`Guide calculation: ${guideFee} x ${durationDays} days x ${guides} guides = ${breakdown.guide}`);
      }

      // 5. Porter (use track porter_fee if available)
      if (needPorter) {
        const porterFee = track?.porter_fee_per_day || mountain.porter_fee_per_day || 0;
        const porters = numPorters || Math.ceil(numPeople / 2);
        breakdown.porter = porterFee * durationDays * porters;
        console.log(`Porter calculation: ${porterFee} x ${durationDays} days x ${porters} porters = ${breakdown.porter}`);
      }

      // 6. Equipment Rental (equipmentItems is object: {itemId: quantity})
      if (equipmentItems && Object.keys(equipmentItems).length > 0) {
        const [rentals] = await db.query(
          'SELECT items FROM equipment_rental WHERE mountain_id = ? LIMIT 1',
          [mountainId]
        );
        
        if (rentals.length > 0) {
          const availableItems = JSON.parse(rentals[0].items);
          
          Object.entries(equipmentItems).forEach(([itemId, quantity]) => {
            // itemId format: "rentalId-itemName"
            const itemName = itemId.split('-').slice(1).join('-');
            const item = availableItems.find(i => i.name === itemName);
            if (item && quantity > 0) {
              breakdown.equipment += item.price_per_day * durationDays * quantity;
            }
          });
        }
      }

      // 7. Food - NOT INCLUDED (user will bring their own)
      breakdown.food = 0;

      // 8. Accommodation (use basecamp_accommodation_fee from mountain data)
      if (needAccommodation && accommodationNights > 0) {
        const accommodationFee = mountain.basecamp_accommodation_fee || 10000;
        breakdown.accommodation = accommodationFee * accommodationNights * numPeople;
      }

      // 9. Miscellaneous - NOT INCLUDED (user will handle separately)
      breakdown.miscellaneous = 0;

      // Calculate totals (without food and miscellaneous)
      const totalCost = Object.values(breakdown).reduce((sum, val) => {
        if (typeof val === 'object') {
          return sum + Object.values(val).reduce((s, v) => s + v, 0);
        }
        return sum + val;
      }, 0);
      
      const costPerPerson = Math.round(totalCost / numPeople);

      // Save calculation
      const [result] = await db.query(
        `INSERT INTO trip_calculations 
        (mountain_id, from_city, num_people, duration_days, transport_type, need_guide, need_porter, 
         need_equipment_rental, need_accommodation, cost_breakdown, total_cost, cost_per_person) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mountainId, fromCity, numPeople, durationDays, transportType, needGuide, needPorter,
          needEquipmentRental, needAccommodation, JSON.stringify(breakdown), totalCost, costPerPerson
        ]
      );

      res.json({
        calculationId: result.insertId,
        mountain: {
          id: mountain.id,
          name: mountain.name,
          province: mountain.province
        },
        tripDetails: {
          fromCity,
          numPeople,
          durationDays,
          transportType
        },
        breakdown,
        totalCost,
        costPerPerson,
        currency: 'IDR'
      });
    } catch (error) {
      console.error('Calculate trip error:', error);
      next(error);
    }
  }

  /**
   * Get available cities (for dropdown)
   * GET /api/trip-calculator/cities
   */
  async getCities(req, res, next) {
    try {
      const [cities] = await db.query(
        'SELECT DISTINCT from_city FROM transportation_routes ORDER BY from_city ASC'
      );
      
      res.json(cities.map(c => c.from_city));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provinces (for filter)
   * GET /api/trip-calculator/provinces
   */
  async getProvinces(req, res, next) {
    try {
      const [provinces] = await db.query(
        'SELECT DISTINCT province FROM mountains WHERE is_active = TRUE ORDER BY province ASC'
      );
      
      res.json(provinces.map(p => p.province));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TripCalculatorController();
