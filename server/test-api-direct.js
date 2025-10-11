require('dotenv').config();
const journeyController = require('./src/controllers/journey.controller');

async function testAPI() {
  try {
    console.log('🧪 Testing getJourneysForMap method...\n');

    // Mock request and response
    const req = {};
    const res = {
      json: (data) => {
        console.log('✅ Success! API returned:');
        console.log(JSON.stringify(data, null, 2));
      }
    };
    const next = (error) => {
      console.error('❌ Error in controller:');
      console.error(error);
    };

    await journeyController.getJourneysForMap(req, res, next);

  } catch (error) {
    console.error('❌ Unexpected error:');
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testAPI();
