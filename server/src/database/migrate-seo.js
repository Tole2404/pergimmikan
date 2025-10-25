/**
 * SEO Management Migration Script
 * Run: node src/database/migrate-seo.js
 */

const db = require('../config/database');

async function runMigration() {
  console.log('🚀 Starting SEO Management Migration...\n');

  try {
    // Create seo_settings table
    console.log('📊 Creating seo_settings table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`seo_settings\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`page_type\` VARCHAR(50) NOT NULL COMMENT 'home, team, journey, gallery, etc',
        \`page_id\` INT NULL COMMENT 'Specific page ID (for journey, team member, etc)',
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT,
        \`keywords\` TEXT,
        \`og_title\` VARCHAR(255),
        \`og_description\` TEXT,
        \`og_image\` VARCHAR(500),
        \`twitter_title\` VARCHAR(255),
        \`twitter_description\` TEXT,
        \`twitter_image\` VARCHAR(500),
        \`canonical_url\` VARCHAR(500),
        \`robots\` VARCHAR(50) DEFAULT 'index, follow',
        \`structured_data\` JSON COMMENT 'Custom structured data',
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY \`unique_page\` (\`page_type\`, \`page_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ seo_settings table created!\n');

    // Create seo_templates table
    console.log('📊 Creating seo_templates table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`seo_templates\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`template_name\` VARCHAR(100) NOT NULL UNIQUE,
        \`title_template\` VARCHAR(500) NOT NULL COMMENT 'Use {variable} for dynamic content',
        \`description_template\` TEXT,
        \`keywords_template\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ seo_templates table created!\n');

    // Check if data already exists
    const [existingSettings] = await db.query('SELECT COUNT(*) as count FROM seo_settings');
    const [existingTemplates] = await db.query('SELECT COUNT(*) as count FROM seo_templates');

    // Insert default SEO settings
    if (existingSettings[0].count === 0) {
      console.log('📝 Inserting default SEO settings...');
      await db.query(`
        INSERT INTO \`seo_settings\` 
        (\`page_type\`, \`page_id\`, \`title\`, \`description\`, \`keywords\`, \`og_title\`, \`og_description\`, \`canonical_url\`, \`robots\`) 
        VALUES
        -- Home page
        ('home', NULL, 
          'PERGIMMIKAN - Sekumpulan Pertemanan Mengabadikan Momen Trip dan Nongkrong', 
          'PERGIMMIKAN adalah komunitas petualangan dan persahabatan yang mengabadikan setiap momen perjalanan dan kebersamaan. Bergabunglah dengan tim kami dalam petualangan mendaki gunung, traveling, dan nongkrong bersama.',
          'PERGIMMIKAN, komunitas pendaki, traveling Indonesia, adventure community, hiking Indonesia, komunitas petualangan, tim pendaki gunung, traveling bersama, nongkrong bareng, komunitas anak muda',
          'PERGIMMIKAN - Komunitas Petualangan dan Persahabatan',
          'Bergabunglah dengan PERGIMMIKAN dalam petualangan mendaki gunung, traveling, dan mengabadikan momen kebersamaan.',
          'https://pergimmikan.site',
          'index, follow'),

        -- Team page
        ('team', NULL,
          'Tim PERGIMMIKAN - Anggota Petualang Indonesia',
          'Kenali tim PERGIMMIKAN, komunitas petualang dan pendaki gunung Indonesia yang solid dan berpengalaman. Kami adalah sekumpulan teman yang suka traveling dan mendaki gunung.',
          'PERGIMMIKAN team, tim pendaki Indonesia, komunitas petualangan, anggota PERGIMMIKAN, pendaki gunung Indonesia',
          'Tim PERGIMMIKAN - Anggota Petualang',
          'Kenali tim PERGIMMIKAN, komunitas petualang Indonesia yang solid dan berpengalaman.',
          'https://pergimmikan.site/team',
          'index, follow'),

        -- Journey/Stories page
        ('journey', NULL,
          'Cerita Perjalanan PERGIMMIKAN - Petualangan di Indonesia',
          'Baca cerita perjalanan dan petualangan tim PERGIMMIKAN di berbagai destinasi Indonesia. Dari mendaki gunung hingga traveling ke tempat-tempat eksotis.',
          'cerita perjalanan, petualangan PERGIMMIKAN, traveling Indonesia, mendaki gunung, trip Indonesia, adventure stories',
          'Cerita Perjalanan PERGIMMIKAN',
          'Baca cerita perjalanan dan petualangan tim PERGIMMIKAN di berbagai destinasi Indonesia.',
          'https://pergimmikan.site/journey',
          'index, follow'),

        -- Gallery page
        ('gallery', NULL,
          'Galeri Foto PERGIMMIKAN - Dokumentasi Petualangan',
          'Lihat galeri foto perjalanan dan petualangan tim PERGIMMIKAN. Dokumentasi lengkap dari setiap trip dan momen kebersamaan kami.',
          'galeri PERGIMMIKAN, foto perjalanan, dokumentasi petualangan, foto traveling, galeri pendakian',
          'Galeri Foto PERGIMMIKAN',
          'Lihat galeri foto perjalanan dan petualangan tim PERGIMMIKAN.',
          'https://pergimmikan.site/gallery',
          'index, follow'),

        -- About page
        ('about', NULL,
          'Tentang PERGIMMIKAN - Komunitas Petualangan Indonesia',
          'PERGIMMIKAN adalah komunitas yang didirikan untuk mengabadikan momen perjalanan dan kebersamaan. Kami percaya bahwa setiap petualangan adalah cerita yang layak diabadikan.',
          'tentang PERGIMMIKAN, komunitas petualangan, sejarah PERGIMMIKAN, visi misi PERGIMMIKAN',
          'Tentang PERGIMMIKAN',
          'Kenali lebih dekat komunitas petualangan PERGIMMIKAN.',
          'https://pergimmikan.site/about',
          'index, follow')
      `);
      console.log('✅ Default SEO settings inserted!\n');
    } else {
      console.log('ℹ️  SEO settings already exist, skipping insert.\n');
    }

    // Insert SEO templates
    if (existingTemplates[0].count === 0) {
      console.log('📝 Inserting SEO templates...');
      await db.query(`
        INSERT INTO \`seo_templates\` 
        (\`template_name\`, \`title_template\`, \`description_template\`, \`keywords_template\`)
        VALUES
        ('journey_detail', 
          '{title} - Cerita Perjalanan PERGIMMIKAN',
          'Baca cerita perjalanan {title} oleh tim PERGIMMIKAN. Petualangan di {location} yang penuh dengan pengalaman menarik dan momen tak terlupakan.',
          '{title}, perjalanan {location}, petualangan PERGIMMIKAN, traveling {location}'),

        ('team_member',
          '{name} - Tim PERGIMMIKAN',
          'Kenali {name}, anggota tim PERGIMMIKAN dengan peran sebagai {role}. {description}',
          '{name}, tim PERGIMMIKAN, {role}, anggota PERGIMMIKAN'),

        ('gallery_album',
          '{title} - Galeri PERGIMMIKAN',
          'Lihat foto-foto dari {title}. Dokumentasi lengkap perjalanan di {location} bersama tim PERGIMMIKAN.',
          '{title}, galeri {location}, foto perjalanan, dokumentasi PERGIMMIKAN')
      `);
      console.log('✅ SEO templates inserted!\n');
    } else {
      console.log('ℹ️  SEO templates already exist, skipping insert.\n');
    }

    // Create indexes
    console.log('📊 Creating indexes...');
    try {
      await db.query('CREATE INDEX idx_page_type ON seo_settings(page_type)');
      console.log('✅ Index idx_page_type created!');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_page_type already exists');
      }
    }

    try {
      await db.query('CREATE INDEX idx_page_id ON seo_settings(page_id)');
      console.log('✅ Index idx_page_id created!');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_page_id already exists');
      }
    }

    try {
      await db.query('CREATE INDEX idx_is_active ON seo_settings(is_active)');
      console.log('✅ Index idx_is_active created!');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_is_active already exists');
      }
    }

    console.log('\n');

    // Show results
    console.log('📊 Migration Results:\n');
    
    const [settings] = await db.query('SELECT * FROM seo_settings');
    console.log(`✅ SEO Settings: ${settings.length} rows`);
    settings.forEach(s => {
      console.log(`   - ${s.page_type}: ${s.title.substring(0, 50)}...`);
    });

    console.log('\n');

    const [templates] = await db.query('SELECT * FROM seo_templates');
    console.log(`✅ SEO Templates: ${templates.length} rows`);
    templates.forEach(t => {
      console.log(`   - ${t.template_name}: ${t.title_template}`);
    });

    console.log('\n🎉 Migration completed successfully!\n');
    console.log('✅ Tables created:');
    console.log('   - seo_settings');
    console.log('   - seo_templates');
    console.log('\n✅ Default data inserted:');
    console.log('   - 5 SEO settings (home, team, journey, gallery, about)');
    console.log('   - 3 SEO templates (journey_detail, team_member, gallery_album)');
    console.log('\n🚀 You can now access SEO Management in admin panel!');
    console.log('   URL: http://localhost:5173/dashboard/seo\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
runMigration();
