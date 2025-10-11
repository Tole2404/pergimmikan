require('dotenv').config();
const db = require('./src/config/database');

async function checkJourneyTable() {
  try {
    console.log('🔍 Checking journey_years table structure...\n');

    // Get table structure
    const [columns] = await db.query('DESCRIBE journey_years');
    
    console.log('📋 Table columns:');
    console.log('─────────────────────────────────────────');
    columns.forEach(col => {
      console.log(`   ${col.Field} (${col.Type})`);
    });
    console.log('─────────────────────────────────────────\n');

    // Get sample data
    const [journeys] = await db.query('SELECT * FROM journey_years LIMIT 3');
    
    if (journeys.length > 0) {
      console.log('📊 Sample data:');
      journeys.forEach((journey, index) => {
        console.log(`\n${index + 1}. Journey ID: ${journey.id}`);
        Object.keys(journey).forEach(key => {
          console.log(`   ${key}: ${journey[key]}`);
        });
      });
    } else {
      console.log('⚠️  No journey data found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkJourneyTable();
