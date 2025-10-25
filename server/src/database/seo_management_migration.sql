-- SEO Management System Migration
-- This allows admin to manage SEO for all pages dynamically

-- Create SEO settings table
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_type` VARCHAR(50) NOT NULL COMMENT 'home, team, journey, gallery, etc',
  `page_id` INT NULL COMMENT 'Specific page ID (for journey, team member, etc)',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `keywords` TEXT,
  `og_title` VARCHAR(255),
  `og_description` TEXT,
  `og_image` VARCHAR(500),
  `twitter_title` VARCHAR(255),
  `twitter_description` TEXT,
  `twitter_image` VARCHAR(500),
  `canonical_url` VARCHAR(500),
  `robots` VARCHAR(50) DEFAULT 'index, follow',
  `structured_data` JSON COMMENT 'Custom structured data',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_page` (`page_type`, `page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default SEO settings for main pages
INSERT INTO `seo_settings` 
(`page_type`, `page_id`, `title`, `description`, `keywords`, `og_title`, `og_description`, `canonical_url`, `robots`) 
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
  'index, follow');

-- Create SEO templates table (for dynamic content)
CREATE TABLE IF NOT EXISTS `seo_templates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `template_name` VARCHAR(100) NOT NULL UNIQUE,
  `title_template` VARCHAR(500) NOT NULL COMMENT 'Use {variable} for dynamic content',
  `description_template` TEXT,
  `keywords_template` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert SEO templates
INSERT INTO `seo_templates` 
(`template_name`, `title_template`, `description_template`, `keywords_template`)
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
  '{title}, galeri {location}, foto perjalanan, dokumentasi PERGIMMIKAN');

-- Create index for better performance
CREATE INDEX idx_page_type ON seo_settings(page_type);
CREATE INDEX idx_page_id ON seo_settings(page_id);
CREATE INDEX idx_is_active ON seo_settings(is_active);

-- Show results
SELECT 'SEO Management tables created successfully!' as status;
SELECT * FROM seo_settings;
SELECT * FROM seo_templates;
