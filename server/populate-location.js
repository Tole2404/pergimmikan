require('dotenv').config();
const db = require('./src/config/database');

// Extract location from title/description
const locationKeywords = {
  'semeru': 'Gunung Semeru, Jawa Timur',
  'rinjani': 'Gunung Rinjani, Lombok',
  'bromo': 'Gunung Bromo, Jawa Timur',
  'merapi': 'Gunung Merapi, Yogyakarta',
  'bandung': 'Bandung, Jawa Barat',
  'jogja': 'Yogyakarta',
  'yogyakarta': 'Yogyakarta',
  'solo': 'Solo, Jawa Tengah',
  'pacitan': 'Pacitan, Jawa Timur',
  'malang': 'Malang, Jawa Timur',
  'batu': 'Batu, Jawa Timur',
  'kuta': 'Pantai Kuta, Bali',
  'bali': 'Bali',
  'lombok': 'Lombok',
  'raja ampat': 'Raja Ampat, Papua',
  'toba': 'Danau Toba, Sumatera Utara',
};

async function populateLocation() {
  try {
    console.log('📍 Populating location data...\n');

    const [journeys] = await db.query('SELECT id, title, description FROM journey_years');
    
    if (journeys.length === 0) {
      console.log('⚠️  No journeys found.');
      return;
    }

    console.log(`📋 Found ${journeys.length} journeys\n`);

    let updated = 0;

    for (const journey of journeys) {
      const searchText = `${journey.title} ${journey.description || ''}`.toLowerCase();
      let location = null;

      // Try to match keywords
      for (const [keyword, loc] of Object.entries(locationKeywords)) {
        if (searchText.includes(keyword)) {
          location = loc;
          break;
        }
      }

      // If no match, use title as location
      if (!location) {
        location = journey.title;
      }

      // Update location
      await db.query(
        'UPDATE journey_years SET location = ? WHERE id = ?',
        [location, journey.id]
      );

      console.log(`✅ ${journey.title}`);
      console.log(`   → Location: ${location}\n`);
      updated++;
    }

    console.log(`\n📊 Summary: Updated ${updated} journeys with location data`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

populateLocation();
