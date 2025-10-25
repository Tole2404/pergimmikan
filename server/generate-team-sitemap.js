require('dotenv').config();
const db = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function generateTeamSitemap() {
  console.log('🗺️  Generating Team Sitemap...\n');

  try {
    // Fetch all active team members
    const [members] = await db.execute(`
      SELECT id, name, role, updated_at 
      FROM teams 
      WHERE status = 'active'
      ORDER BY id
    `);

    console.log(`📋 Found ${members.length} active team members`);

    // Generate sitemap XML
    const sitemapEntries = members.map(member => {
      const slug = member.name.toLowerCase().replace(/\s+/g, '-');
      const lastmod = member.updated_at 
        ? new Date(member.updated_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return `  <url>
    <loc>https://pergimmikan.site/team#${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>https://pergimmikan.site/api/team/${member.id}/image</image:loc>
      <image:title>${member.name} - ${member.role}</image:title>
      <image:caption>${member.name}, ${member.role} at PERGIMMIKAN</image:caption>
    </image:image>
  </url>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Team Page -->
  <url>
    <loc>https://pergimmikan.site/team</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Team Members -->
${sitemapEntries}
</urlset>`;

    // Save to frontend/public directory
    const outputPath = path.join(__dirname, '../frontend/public/team-sitemap.xml');
    fs.writeFileSync(outputPath, sitemap, 'utf8');

    console.log(`\n✅ Team sitemap generated successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`🔗 URL: https://pergimmikan.site/team-sitemap.xml`);
    console.log(`\n📊 Statistics:`);
    console.log(`   Total URLs: ${members.length + 1}`);
    console.log(`   Team page: 1`);
    console.log(`   Team members: ${members.length}`);

    // Generate member names list for SEO
    console.log(`\n👥 Team Members in Sitemap:`);
    members.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.name} (${member.role})`);
    });

    console.log(`\n💡 Next steps:`);
    console.log(`   1. Submit sitemap to Google Search Console`);
    console.log(`   2. Submit sitemap to Bing Webmaster Tools`);
    console.log(`   3. Verify in robots.txt: https://pergimmikan.site/robots.txt`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

generateTeamSitemap();
