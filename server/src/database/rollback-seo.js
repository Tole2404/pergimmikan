/**
 * SEO Management Rollback Script
 * Run: node src/database/rollback-seo.js
 * WARNING: This will delete all SEO data!
 */

const db = require('../config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askConfirmation() {
  return new Promise((resolve) => {
    rl.question('⚠️  WARNING: This will DELETE all SEO tables and data! Continue? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function rollback() {
  console.log('🔄 SEO Management Rollback Script\n');

  const confirmed = await askConfirmation();

  if (!confirmed) {
    console.log('\n❌ Rollback cancelled.\n');
    process.exit(0);
  }

  try {
    console.log('\n🗑️  Starting rollback...\n');

    // Drop seo_settings table
    console.log('🗑️  Dropping seo_settings table...');
    await db.query('DROP TABLE IF EXISTS `seo_settings`');
    console.log('✅ seo_settings table dropped!\n');

    // Drop seo_templates table
    console.log('🗑️  Dropping seo_templates table...');
    await db.query('DROP TABLE IF EXISTS `seo_templates`');
    console.log('✅ seo_templates table dropped!\n');

    console.log('🎉 Rollback completed successfully!\n');
    console.log('✅ Tables removed:');
    console.log('   - seo_settings');
    console.log('   - seo_templates\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Rollback failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run rollback
rollback();
