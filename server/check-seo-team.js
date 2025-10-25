/**
 * Check SEO settings for team page
 * Run: node check-seo-team.js
 */

const db = require('./src/config/database');

async function checkSEO() {
  try {
    console.log('🔍 Checking SEO settings for team page...\n');

    // Check if team SEO exists
    const [rows] = await db.query(
      'SELECT * FROM seo_settings WHERE page_type = ?',
      ['team']
    );

    if (rows.length === 0) {
      console.log('❌ No SEO settings found for page_type "team"!');
      console.log('\n💡 You need to:');
      console.log('1. Go to: http://localhost:5173/dashboard/seo');
      console.log('2. Add SEO setting for page_type "team"');
      console.log('3. Copy keywords from SEO-TEAM-CONTENT.txt');
      console.log('4. Save\n');
      process.exit(1);
    }

    const seo = rows[0];
    
    console.log('✅ SEO settings found!\n');
    console.log('─'.repeat(80));
    console.log('📌 Title:', seo.title);
    console.log('─'.repeat(80));
    console.log('📝 Description:', seo.description);
    console.log('─'.repeat(80));
    console.log('🔑 Keywords (first 200 chars):', seo.keywords?.substring(0, 200) + '...');
    console.log('─'.repeat(80));
    console.log('📊 Keywords length:', seo.keywords?.length || 0, 'characters');
    console.log('─'.repeat(80));
    console.log('✅ Is Active:', seo.is_active ? 'Yes' : 'No');
    console.log('─'.repeat(80));
    
    // Check if member names are in keywords
    console.log('\n🔍 Checking member names in keywords:\n');
    
    const memberNames = [
      'Tunggul', 'Deva', 'Akbar', 'Frasiskus', 'Muhammad', 
      'Miraj', 'Indira', 'Zaki', 'Zul', 'Lia', 
      'Fadia', 'Maesheilla', 'Fira', 'Jordi', 'Zulfa',
      'Kahfi', 'Raga', 'Ridho', 'Toha', 'Arvan', 
      'Farrel', 'Fadil'
    ];
    
    let foundCount = 0;
    memberNames.forEach(name => {
      const found = seo.keywords?.includes(name);
      console.log(`${found ? '✅' : '❌'} ${name}`);
      if (found) foundCount++;
    });
    
    console.log('\n─'.repeat(80));
    console.log(`📊 Result: ${foundCount}/${memberNames.length} names found in keywords`);
    console.log('─'.repeat(80));
    
    if (foundCount < memberNames.length) {
      console.log('\n⚠️  Some names are missing!');
      console.log('💡 Update keywords using SEO-TEAM-CONTENT.txt');
    } else {
      console.log('\n🎉 All member names found in keywords!');
    }
    
    // Check if keywords are too short
    if (!seo.keywords || seo.keywords.length < 500) {
      console.log('\n⚠️  Keywords are too short!');
      console.log('💡 Current length:', seo.keywords?.length || 0);
      console.log('💡 Recommended: 1000+ characters');
      console.log('💡 Use keywords from SEO-TEAM-CONTENT.txt (15000+ chars)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSEO();
