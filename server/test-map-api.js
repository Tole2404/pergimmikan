require('dotenv').config();
const db = require('./src/config/database');

async function testMapAPI() {
  try {
    console.log('🧪 Testing Map API...\n');

    // Test the same query that API uses
    const [journeys] = await db.query(`
      SELECT 
        jy.id,
        jy.year,
        jy.title,
        jy.location,
        jy.description,
        jy.latitude,
        jy.longitude,
        jy.destination_type,
        COUNT(jp.id) as photos_count
      FROM journey_years jy
      LEFT JOIN journey_photos jp ON jy.id = jp.journey_year_id
      WHERE jy.latitude IS NOT NULL AND jy.longitude IS NOT NULL
      GROUP BY jy.id
      ORDER BY jy.year DESC
    `);

    console.log(`✅ Found ${journeys.length} journeys with coordinates\n`);

    if (journeys.length === 0) {
      console.log('⚠️  No journeys with coordinates found!');
      console.log('   Make sure you ran: node update-journey-coordinates.js');
      return;
    }

    console.log('📋 Journeys data:');
    console.log('─────────────────────────────────────────');
    journeys.forEach((journey, index) => {
      console.log(`\n${index + 1}. ${journey.title}`);
      console.log(`   ID: ${journey.id}`);
      console.log(`   Year: ${journey.year}`);
      console.log(`   Location: ${journey.location}`);
      console.log(`   Coordinates: ${journey.latitude}, ${journey.longitude}`);
      console.log(`   Type: ${journey.destination_type}`);
      console.log(`   Photos: ${journey.photos_count}`);
    });

    console.log('\n─────────────────────────────────────────');
    console.log('\n✅ API should return this data!');
    console.log('\n🔗 Test URL: http://localhost:5000/api/journeys/map/data');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testMapAPI();
