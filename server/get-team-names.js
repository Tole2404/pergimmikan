/**
 * Get all team member names for SEO keywords
 * Run: node get-team-names.js
 */

const db = require('./src/config/database');

async function getTeamNames() {
  try {
    const [teams] = await db.query('SELECT name, short_name, role FROM teams WHERE status = "active" ORDER BY name');
    
    console.log('📋 TEAM MEMBERS:\n');
    
    const fullNames = [];
    const shortNames = [];
    const roles = new Set();
    
    teams.forEach(member => {
      fullNames.push(member.name);
      if (member.short_name) {
        shortNames.push(member.short_name);
      }
      roles.add(member.role);
    });
    
    console.log('Full Names:', fullNames.join(', '));
    console.log('\nShort Names:', shortNames.join(', '));
    console.log('\nRoles:', Array.from(roles).join(', '));
    
    console.log('\n\n📝 SEO KEYWORDS (Copy this):');
    console.log('─'.repeat(80));
    
    const keywords = [
      'PERGIMMIKAN team',
      'tim PERGIMMIKAN',
      ...fullNames,
      ...shortNames,
      'anggota PERGIMMIKAN',
      'team pendaki PERGIMMIKAN',
      'komunitas pendaki Indonesia',
      'tim petualang Indonesia',
      'pendaki gunung Indonesia',
      'traveling Indonesia',
      'adventure team Indonesia',
      'komunitas outdoor Indonesia',
      ...Array.from(roles).map(r => `${r} PERGIMMIKAN`),
      'fotografer petualangan',
      'dokumentasi perjalanan',
      'cerita pendakian',
      'trip organizer Indonesia',
      'komunitas anak muda petualang',
      'hiking team Indonesia',
      'mountain climbing Indonesia',
      'outdoor adventure Indonesia',
      'backpacker Indonesia',
      'nature photography Indonesia',
      'travel blogger Indonesia',
      'petualangan alam Indonesia'
    ];
    
    console.log(keywords.join(', '));
    console.log('─'.repeat(80));
    console.log(`\nTotal: ${keywords.length} keywords`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getTeamNames();
