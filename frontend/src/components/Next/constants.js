// Biaya transportasi dari Jakarta
export const transportFromJakarta = {
  BALI: {
    FLIGHT: {
      ECONOMY: 1200000,
      BUSINESS: 3500000,
      FIRST: 8000000
    }
  },
  JAPAN: {
    FLIGHT: {
      ECONOMY: 8000000,
      BUSINESS: 15000000,
      FIRST: 25000000
    }
  },
  EUROPE: {
    FLIGHT: {
      ECONOMY: 12000000,
      BUSINESS: 25000000,
      FIRST: 40000000
    }
  },
  'LABUAN BAJO': {
    FLIGHT: {
      ECONOMY: 2500000,
      BUSINESS: 5000000,
      FIRST: 10000000
    }
  },
  'BANDA NEIRA': {
    FLIGHT: {
      ECONOMY: 3500000,
      BUSINESS: 7000000,
      FIRST: 12000000
    }
  },
  'RAJA AMPAT': {
    FLIGHT: {
      ECONOMY: 4500000,
      BUSINESS: 8000000,
      FIRST: 15000000
    }
  }
};

// Biaya dasar per kategori
export const baseCosts = {
  ACCOMMODATION: {
    BUDGET: { label: 'Budget', multiplier: 1 },
    STANDARD: { label: 'Standard', multiplier: 1.5 },
    LUXURY: { label: 'Luxury', multiplier: 2.5 }
  },
  TRANSPORTATION: {
    PUBLIC: { label: 'Public Transport', multiplier: 1 },
    PRIVATE: { label: 'Private Transport', multiplier: 2 },
    LUXURY: { label: 'Premium Transport', multiplier: 3 }
  },
  FLIGHT_CLASS: {
    ECONOMY: { label: 'Economy Class', multiplier: 1 },
    BUSINESS: { label: 'Business Class', multiplier: 2 },
    FIRST: { label: 'First Class', multiplier: 3 }
  },
  SEASON: {
    LOW: { label: 'Low Season', multiplier: 1 },
    SHOULDER: { label: 'Shoulder Season', multiplier: 1.3 },
    PEAK: { label: 'Peak Season', multiplier: 1.8 }
  }
};

export const destinations = [
  {
    id: 1,
    name: 'Labuan Bajo',
    image: '/images/destinations/labuanbajo.jpg',
    description: 'Gateway to Komodo dragons and pristine marine life',
    highlights: ['Komodo Dragons', 'Diving', 'Pink Beach', 'Island Hopping'],
    costs: {
      accommodation: {
        BUDGET: 400000,    // per night
        STANDARD: 1000000,
        LUXURY: 3000000
      },
      transportation: {
        PUBLIC: 150000,    // per day
        PRIVATE: 800000,
        LUXURY: 2000000
      },
      food: {
        budget: 200000,    // per day
        standard: 400000,
        luxury: 1000000
      },
      activities: {
        basic: [
          { name: 'Komodo Tour', cost: 500000 },
          { name: 'Island Hopping', cost: 400000 },
          { name: 'Local Market Visit', cost: 0 }
        ],
        premium: [
          { name: 'Diving Trip', cost: 1500000 },
          { name: 'Luxury Boat Tour', cost: 2000000 },
          { name: 'Sunset Dinner Cruise', cost: 1000000 }
        ]
      },
      seasons: {
        LOW: ['January', 'February', 'March', 'December'],
        SHOULDER: ['April', 'October', 'November'],
        PEAK: ['May', 'June', 'July', 'August', 'September']
      }
    }
  },
  {
    id: 2,
    name: 'Banda Neira',
    image: '/images/destinations/bandaneira.jpg',
    description: 'Historic spice islands with rich colonial heritage and world-class diving',
    highlights: ['Spice Plantations', 'Colonial History', 'Diving', 'Volcanic Views'],
    costs: {
      accommodation: {
        BUDGET: 300000,    // per night
        STANDARD: 800000,
        LUXURY: 2500000
      },
      transportation: {
        PUBLIC: 100000,    // per day
        PRIVATE: 600000,
        LUXURY: 1500000
      },
      food: {
        budget: 150000,    // per day
        standard: 300000,
        luxury: 800000
      },
      activities: {
        basic: [
          { name: 'Spice Tour', cost: 300000 },
          { name: 'Fort Visit', cost: 100000 },
          { name: 'Local Market Visit', cost: 0 }
        ],
        premium: [
          { name: 'Diving Trip', cost: 1500000 },
          { name: 'Historical Tour', cost: 800000 },
          { name: 'Volcano Trekking', cost: 1000000 }
        ]
      },
      seasons: {
        LOW: ['January', 'February', 'March', 'December'],
        SHOULDER: ['April', 'May', 'October', 'November'],
        PEAK: ['June', 'July', 'August', 'September']
      }
    }
  },
  {
    id: 3,
    name: 'Raja Ampat',
    image: '/images/destinations/rajaampat.jpg',
    description: 'Paradise on Earth with the richest marine biodiversity in the world',
    highlights: ['Marine Life', 'Pristine Beaches', 'Island Hopping', 'Snorkeling'],
    costs: {
      accommodation: {
        BUDGET: 500000,  
        STANDARD: 1500000,
        LUXURY: 5000000
      },
      transportation: {
        PUBLIC: 200000,    // per day
        PRIVATE: 1000000,
        LUXURY: 2500000
      },
      food: {
        budget: 200000,    // per day
        standard: 500000,
        luxury: 1200000
      },
      activities: {
        basic: [
          { name: 'Snorkeling Trip', cost: 800000 },
          { name: 'Island Tour', cost: 500000 },
          { name: 'Beach Hopping', cost: 300000 }
        ],
        premium: [
          { name: 'Diving Package', cost: 2500000 },
          { name: 'Private Island Tour', cost: 2000000 },
          { name: 'Luxury Yacht Charter', cost: 5000000 }
        ]
      },
      seasons: {
        LOW: ['June', 'July', 'August'],
        SHOULDER: ['April', 'May', 'September', 'October'],
        PEAK: ['November', 'December', 'January', 'February', 'March']
      }
    }
  }
];

// Algoritma perhitungan
export const calculateTripCost = ({
  destination,
  duration,
  accommodationType = 'STANDARD',
  transportationType = 'PUBLIC',
  flightClass = 'ECONOMY',
  foodPreference = 'standard',
  season = 'LOW',
  groupSize = 1
}) => {
  // Biaya yang dibagi per orang
  const perPersonCosts = {
    accommodation: destination.costs.accommodation[accommodationType] * duration,
    food: destination.costs.food[foodPreference] * duration,
    activities: destination.costs.activities.basic.reduce((acc, curr) => acc + curr.cost, 0) * duration
  };

  // Biaya yang tidak dibagi (per orang)
  const individualCosts = {
    flight: transportFromJakarta[destination.name.toUpperCase()]?.FLIGHT[flightClass] || 0,
    transportation: destination.costs.transportation[transportationType] * duration
  };

  // Hitung total biaya per orang
  const costPerPerson = (
    Object.values(perPersonCosts).reduce((acc, curr) => acc + curr, 0) / groupSize
  ) + Object.values(individualCosts).reduce((acc, curr) => acc + curr, 0);

  // Hitung total biaya untuk semua orang
  const totalCost = (
    Object.values(perPersonCosts).reduce((acc, curr) => acc + curr, 0)
  ) + (
    Object.values(individualCosts).reduce((acc, curr) => acc + curr, 0) * groupSize
  );

  // Terapkan multiplier musiman
  const seasonalMultiplier = baseCosts.SEASON[season].multiplier;
  const finalTotalCost = Math.round(totalCost * seasonalMultiplier);
  const finalCostPerPerson = Math.round(costPerPerson * seasonalMultiplier);

  return {
    totalCost: finalTotalCost,
    costPerPerson: finalCostPerPerson,
    breakdown: {
      flight: individualCosts.flight * groupSize,
      accommodation: perPersonCosts.accommodation,
      transportation: individualCosts.transportation * groupSize,
      food: perPersonCosts.food,
      activities: perPersonCosts.activities,
      seasonalMultiplier
    }
  };
};
