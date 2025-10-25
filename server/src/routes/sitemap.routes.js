const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Generate sitemap.xml
 * GET /sitemap.xml
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://pergimmikan.site';
    
    // Get all team members
    let teams = [];
    try {
      const [teamRows] = await db.query('SELECT id, name, updated_at FROM teams WHERE status = "active"');
      teams = teamRows;
    } catch (err) {
      console.error('Error fetching teams for sitemap:', err);
    }
    
    // Get all journeys
    let journeys = [];
    try {
      const [journeyRows] = await db.query('SELECT id, title, updated_at FROM journeys WHERE status = "published"');
      journeys = journeyRows;
    } catch (err) {
      console.error('Error fetching journeys for sitemap:', err);
    }
    
    // Get all gallery albums
    let galleries = [];
    try {
      const [galleryRows] = await db.query('SELECT id, title, updated_at FROM galleries WHERE status = "published"');
      galleries = galleryRows;
    } catch (err) {
      console.error('Error fetching galleries for sitemap:', err);
    }
    
    // Build sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Home Page -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Team Page -->
  <url>
    <loc>${baseUrl}/team</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Journey Page -->
  <url>
    <loc>${baseUrl}/journey</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Gallery Page -->
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

    // Add team members with images
    teams.forEach(member => {
      const slug = member.name.toLowerCase().replace(/\s+/g, '-');
      const lastmod = member.updated_at ? new Date(member.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <!-- Team Member: ${member.name} -->
  <url>
    <loc>${baseUrl}/team#${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${baseUrl}/api/team/${member.id}/image</image:loc>
      <image:title>${member.name} - PERGIMMIKAN</image:title>
    </image:image>
  </url>
`;
    });

    // Add journeys
    journeys.forEach(journey => {
      const lastmod = journey.updated_at ? new Date(journey.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <!-- Journey: ${journey.title} -->
  <url>
    <loc>${baseUrl}/journey/${journey.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add galleries
    galleries.forEach(gallery => {
      const lastmod = gallery.updated_at ? new Date(gallery.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <!-- Gallery: ${gallery.title} -->
  <url>
    <loc>${baseUrl}/gallery/${gallery.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemap += `
</urlset>`;

    console.log('✅ Sitemap generated successfully');
    console.log(`   - ${teams.length} team members`);
    console.log(`   - ${journeys.length} journeys`);
    console.log(`   - ${galleries.length} galleries`);
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<error>Error generating sitemap: ${error.message}</error>`);
  }
});

module.exports = router;
