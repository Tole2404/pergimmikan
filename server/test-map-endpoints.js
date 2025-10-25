/**
 * Test Map API Endpoints
 * Run: node test-map-endpoints.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testMapEndpoints() {
  console.log('🧪 Testing Map API Endpoints...\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Map Data
  console.log('📍 Test 1: GET /api/journeys/map/data');
  try {
    const response = await axios.get(`${API_URL}/api/journeys/map/data`);
    console.log('✅ Status:', response.status);
    console.log('✅ Data count:', response.data.length);
    console.log('✅ Sample:', JSON.stringify(response.data[0], null, 2));
  } catch (error) {
    console.log('❌ Error:', error.response?.status || error.message);
    if (error.response?.data) {
      console.log('❌ Response:', error.response.data);
    }
  }

  console.log('\n---\n');

  // Test 2: Map Statistics
  console.log('📊 Test 2: GET /api/journeys/map/statistics');
  try {
    const response = await axios.get(`${API_URL}/api/journeys/map/statistics`);
    console.log('✅ Status:', response.status);
    console.log('✅ Statistics:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.response?.status || error.message);
    if (error.response?.data) {
      console.log('❌ Response:', error.response.data);
    }
  }

  console.log('\n---\n');

  // Test 3: Regular Journeys Endpoint
  console.log('📝 Test 3: GET /api/journeys (for comparison)');
  try {
    const response = await axios.get(`${API_URL}/api/journeys?limit=1`);
    console.log('✅ Status:', response.status);
    console.log('✅ Data count:', response.data.journeys?.length || 0);
  } catch (error) {
    console.log('❌ Error:', error.response?.status || error.message);
  }

  console.log('\n---\n');
  console.log('🎉 Test complete!');
}

// Run tests
testMapEndpoints().catch(console.error);
