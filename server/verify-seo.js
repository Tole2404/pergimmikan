require('dotenv').config();
const db = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function verifySEO() {
  console.log('🔍 VERIFYING SEO IMPLEMENTATION\n');
  console.log('='.repeat(60));

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // 1. Check index.html meta tags
  console.log('\n📄 Checking index.html...');
  const indexPath = path.join(__dirname, '../frontend/index.html');
  
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check for essential meta tags
    const checks = [
      { name: 'Title tag', pattern: /<title>.*<\/title>/ },
      { name: 'Meta description', pattern: /<meta name="description"/ },
      { name: 'Meta keywords', pattern: /<meta name="keywords"/ },
      { name: 'Canonical URL', pattern: /<link rel="canonical"/ },
      { name: 'Open Graph title', pattern: /<meta property="og:title"/ },
      { name: 'Open Graph description', pattern: /<meta property="og:description"/ },
      { name: 'Twitter card', pattern: /<meta property="twitter:card"/ },
      { name: 'Structured data', pattern: /<script type="application\/ld\+json">/ },
      { name: 'Language tag', pattern: /<html lang="id">/ },
      { name: 'Robots meta', pattern: /<meta name="robots"/ }
    ];

    checks.forEach(check => {
      if (check.pattern.test(indexContent)) {
        results.passed.push(`✅ ${check.name}`);
      } else {
        results.failed.push(`❌ ${check.name}`);
      }
    });
  } else {
    results.failed.push('❌ index.html not found');
  }

  // 2. Check robots.txt
  console.log('\n🤖 Checking robots.txt...');
  const robotsPath = path.join(__dirname, '../frontend/public/robots.txt');
  
  if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    
    if (robotsContent.includes('Sitemap:')) {
      results.passed.push('✅ Sitemap reference in robots.txt');
    } else {
      results.failed.push('❌ No sitemap reference in robots.txt');
    }

    if (robotsContent.includes('User-agent:')) {
      results.passed.push('✅ User-agent directives present');
    } else {
      results.failed.push('❌ No user-agent directives');
    }
  } else {
    results.failed.push('❌ robots.txt not found');
  }

  // 3. Check team sitemap
  console.log('\n🗺️  Checking team sitemap...');
  const sitemapPath = path.join(__dirname, '../frontend/public/team-sitemap.xml');
  
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    if (sitemapContent.includes('<urlset')) {
      results.passed.push('✅ Valid sitemap XML structure');
    } else {
      results.failed.push('❌ Invalid sitemap structure');
    }

    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    results.passed.push(`✅ Sitemap contains ${urlCount} URLs`);
  } else {
    results.warnings.push('⚠️  Team sitemap not generated yet (run generate-team-sitemap.js)');
  }

  // 4. Check database for team members
  console.log('\n👥 Checking team members data...');
  try {
    const [members] = await db.execute(`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM teams
    `);

    const { total, active } = members[0];
    results.passed.push(`✅ ${active} active team members (${total} total)`);

    // Check for social links
    const [socialLinks] = await db.execute(`
      SELECT 
        COUNT(DISTINCT CASE WHEN sm.platform = 'linkedin' THEN t.id END) as linkedin_count,
        COUNT(DISTINCT CASE WHEN sm.platform = 'github' THEN t.id END) as github_count,
        COUNT(DISTINCT CASE WHEN sm.platform = 'instagram' THEN t.id END) as instagram_count
      FROM teams t
      LEFT JOIN social_media sm ON t.id = sm.team_id
      WHERE t.status = 'active'
    `);

    const { linkedin_count, github_count, instagram_count } = socialLinks[0];
    
    if (linkedin_count > 0) results.passed.push(`✅ ${linkedin_count} members with LinkedIn`);
    if (github_count > 0) results.passed.push(`✅ ${github_count} members with GitHub`);
    if (instagram_count > 0) results.passed.push(`✅ ${instagram_count} members with Instagram`);

    if (linkedin_count === 0 && github_count === 0 && instagram_count === 0) {
      results.warnings.push('⚠️  No social links found (recommended for better SEO)');
    }

  } catch (error) {
    results.failed.push(`❌ Database check failed: ${error.message}`);
  }

  // 5. Check Team component
  console.log('\n⚛️  Checking Team component...');
  const teamComponentPath = path.join(__dirname, '../frontend/src/components/Team/index.jsx');
  
  if (fs.existsSync(teamComponentPath)) {
    const componentContent = fs.readFileSync(teamComponentPath, 'utf8');
    
    const componentChecks = [
      { name: 'Helmet import', pattern: /import.*Helmet.*from.*react-helmet-async/ },
      { name: 'Structured data generation', pattern: /generateStructuredData/ },
      { name: 'itemProp attributes', pattern: /itemProp=/ },
      { name: 'Semantic HTML (article)', pattern: /<article/ },
      { name: 'Meta description', pattern: /<meta name="description"/ }
    ];

    componentChecks.forEach(check => {
      if (check.pattern.test(componentContent)) {
        results.passed.push(`✅ ${check.name}`);
      } else {
        results.failed.push(`❌ ${check.name}`);
      }
    });
  } else {
    results.failed.push('❌ Team component not found');
  }

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SEO VERIFICATION RESULTS\n');

  if (results.passed.length > 0) {
    console.log('✅ PASSED CHECKS:');
    results.passed.forEach(item => console.log(`   ${item}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach(item => console.log(`   ${item}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED CHECKS:');
    results.failed.forEach(item => console.log(`   ${item}`));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 SUMMARY:');
  console.log(`   ✅ Passed: ${results.passed.length}`);
  console.log(`   ⚠️  Warnings: ${results.warnings.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);

  const score = Math.round((results.passed.length / (results.passed.length + results.failed.length)) * 100);
  console.log(`\n   🎯 SEO Score: ${score}%`);

  if (score >= 90) {
    console.log('\n   🎉 EXCELLENT! Your SEO is PRO level!');
  } else if (score >= 70) {
    console.log('\n   👍 GOOD! Minor improvements needed.');
  } else {
    console.log('\n   ⚠️  NEEDS WORK! Please fix failed checks.');
  }

  // Recommendations
  console.log('\n💡 NEXT STEPS:');
  
  if (results.warnings.some(w => w.includes('sitemap not generated'))) {
    console.log('   1. Run: node generate-team-sitemap.js');
  }
  
  if (results.warnings.some(w => w.includes('social links'))) {
    console.log('   2. Add social media links for team members');
  }
  
  console.log('   3. Deploy to production');
  console.log('   4. Submit sitemap to Google Search Console');
  console.log('   5. Request indexing for team page');
  console.log('   6. Monitor results in Search Console');

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Verification complete!\n');

  process.exit(results.failed.length > 0 ? 1 : 0);
}

verifySEO();
