require('dotenv').config();
const db = require('./src/config/database');

// Sample coordinates for common Indonesian destinations
const sampleCoordinates = {
  // Gunung
  'semeru': { lat: -8.1077, lng: 112.9225, type: 'gunung' },
  'rinjani': { lat: -8.4114, lng: 116.4571, type: 'gunung' },
  'bromo': { lat: -7.9425, lng: 112.9533, type: 'gunung' },
  'merapi': { lat: -7.5407, lng: 110.4456, type: 'gunung' },
  'kerinci': { lat: -1.6969, lng: 101.2644, type: 'gunung' },
  'merbabu': { lat: -7.4550, lng: 110.4400, type: 'gunung' },
  'lawu': { lat: -7.6250, lng: 111.1920, type: 'gunung' },
  'gede': { lat: -6.7820, lng: 106.9810, type: 'gunung' },
  'pangrango': { lat: -6.7820, lng: 106.9810, type: 'gunung' },
  'slamet': { lat: -7.2425, lng: 109.2082, type: 'gunung' },
  'sumbing': { lat: -7.3847, lng: 110.0831, type: 'gunung' },
  'sindoro': { lat: -7.3000, lng: 109.9917, type: 'gunung' },
  
  // Pantai
  'kuta': { lat: -8.7184, lng: 115.1686, type: 'pantai' },
  'sanur': { lat: -8.7088, lng: 115.2629, type: 'pantai' },
  'nusa dua': { lat: -8.8008, lng: 115.2304, type: 'pantai' },
  'senggigi': { lat: -8.4906, lng: 116.0422, type: 'pantai' },
  'raja ampat': { lat: -0.2340, lng: 130.5160, type: 'pantai' },
  'derawan': { lat: 2.2833, lng: 118.2500, type: 'pantai' },
  'pink beach': { lat: -8.5333, lng: 119.5333, type: 'pantai' },
  'tanjung bira': { lat: -5.6167, lng: 120.4500, type: 'pantai' },
  'parangtritis': { lat: -8.0250, lng: 110.3292, type: 'pantai' },
  
  // Danau
  'toba': { lat: 2.6845, lng: 98.8756, type: 'danau' },
  'kelimutu': { lat: -8.7667, lng: 121.8167, type: 'danau' },
  'maninjau': { lat: -0.3167, lng: 100.2000, type: 'danau' },
  'sentani': { lat: -2.5833, lng: 140.5167, type: 'danau' },
  'ranu kumbolo': { lat: -8.0167, lng: 112.9167, type: 'danau' },
  
  // Air Terjun
  'tumpak sewu': { lat: -8.2333, lng: 112.9167, type: 'air_terjun' },
  'madakaripura': { lat: -7.8833, lng: 112.9667, type: 'air_terjun' },
  'coban rondo': { lat: -7.8833, lng: 112.5333, type: 'air_terjun' },
  'sipiso': { lat: 2.9167, lng: 98.5167, type: 'air_terjun' },
  
  // Hutan
  'alas purwo': { lat: -8.6333, lng: 114.3667, type: 'hutan' },
  'ujung kulon': { lat: -6.7667, lng: 105.3333, type: 'hutan' },
  'taman negara': { lat: -7.6167, lng: 110.7000, type: 'hutan' },
  
  // Gua
  'jomblang': { lat: -7.9667, lng: 110.6333, type: 'gua' },
  'gong': { lat: -8.0167, lng: 111.6833, type: 'gua' },
  
  // Kota/Area (untuk journey yang mention kota)
  'bandung': { lat: -6.9175, lng: 107.6191, type: 'hutan' },
  'jogja': { lat: -7.7956, lng: 110.3695, type: 'hutan' },
  'yogyakarta': { lat: -7.7956, lng: 110.3695, type: 'hutan' },
  'solo': { lat: -7.5705, lng: 110.8285, type: 'hutan' },
  'pacitan': { lat: -8.2000, lng: 111.0833, type: 'pantai' },
  'malang': { lat: -7.9666, lng: 112.6326, type: 'gunung' },
  'batu': { lat: -7.8700, lng: 112.5300, type: 'gunung' },
  'surabaya': { lat: -7.2575, lng: 112.7521, type: 'pantai' },
  'bali': { lat: -8.3405, lng: 115.0920, type: 'pantai' },
  'lombok': { lat: -8.6500, lng: 116.3242, type: 'pantai' },
};

async function updateJourneyCoordinates() {
  try {
    console.log('🗺️  Updating journey coordinates...\n');

    // Get all journeys
    const [journeys] = await db.query('SELECT id, title, description FROM journey_years');
    
    if (journeys.length === 0) {
      console.log('⚠️  No journeys found in database.');
      return;
    }

    console.log(`📋 Found ${journeys.length} journeys\n`);

    let updated = 0;
    let skipped = 0;

    for (const journey of journeys) {
      const searchText = `${journey.title} ${journey.description || ''}`.toLowerCase();
      let matched = false;

      // Try to match title/description with sample coordinates
      for (const [key, coords] of Object.entries(sampleCoordinates)) {
        if (searchText.includes(key)) {
          await db.query(
            'UPDATE journey_years SET latitude = ?, longitude = ?, destination_type = ? WHERE id = ?',
            [coords.lat, coords.lng, coords.type, journey.id]
          );
          
          console.log(`✅ Updated: ${journey.title}`);
          console.log(`   Matched keyword: ${key}`);
          console.log(`   Coordinates: ${coords.lat}, ${coords.lng}`);
          console.log(`   Type: ${coords.type}\n`);
          
          updated++;
          matched = true;
          break;
        }
      }

      if (!matched) {
        console.log(`⏭️  Skipped: ${journey.title}`);
        console.log(`   Description: ${journey.description || 'N/A'}`);
        console.log(`   No matching coordinates found\n`);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated} journeys`);
    console.log(`   ⏭️  Skipped: ${skipped} journeys`);
    console.log('\n💡 Tip: For skipped journeys, you can manually add coordinates via SQL or admin panel.');
    
    if (updated > 0) {
      console.log('\n🎉 Success! You can now view the map at: http://localhost:5173/map');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

updateJourneyCoordinates();
