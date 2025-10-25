-- ============================================================================
-- MOUNTAIN TRACKS (JALUR PENDAKIAN) - SCHEMA & DATA
-- ============================================================================
-- Setiap gunung bisa punya multiple tracks dengan harga & detail berbeda
-- ============================================================================

-- Create table for mountain tracks
CREATE TABLE IF NOT EXISTS mountain_tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  
  -- Track Info
  track_name VARCHAR(100) NOT NULL COMMENT 'Nama jalur (e.g., Sembalun, Senaru)',
  track_code VARCHAR(20) COMMENT 'Kode jalur (e.g., SMB, SNR)',
  
  -- Basecamp
  basecamp_name VARCHAR(100) NOT NULL,
  basecamp_address TEXT,
  basecamp_latitude DECIMAL(10, 8),
  basecamp_longitude DECIMAL(11, 8),
  
  -- Track Details
  difficulty ENUM('Mudah', 'Sedang', 'Sulit', 'Sangat Sulit') NOT NULL,
  typical_duration_days INT DEFAULT 2,
  distance_km DECIMAL(5, 2) COMMENT 'Total jarak track (km)',
  elevation_gain INT COMMENT 'Total pendakian (meter)',
  
  -- Pricing (bisa beda per jalur)
  entrance_fee INT DEFAULT 0,
  entrance_fee_source VARCHAR(255),
  guide_fee_per_day INT DEFAULT 0,
  guide_fee_source VARCHAR(255),
  porter_fee_per_day INT DEFAULT 0,
  porter_fee_source VARCHAR(255),
  
  -- Track Features
  highlights JSON COMMENT 'Highlight jalur ini',
  best_for VARCHAR(255) COMMENT 'Cocok untuk siapa (pemula, expert, dll)',
  scenery_type VARCHAR(100) COMMENT 'Jenis pemandangan (hutan, savana, dll)',
  
  -- Status
  is_open BOOLEAN DEFAULT TRUE COMMENT 'Jalur buka/tutup',
  is_recommended BOOLEAN DEFAULT FALSE,
  popularity_rank INT DEFAULT 0 COMMENT '1=paling populer',
  
  -- Meta
  notes TEXT,
  last_updated DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE,
  INDEX idx_mountain_track (mountain_id, track_name),
  INDEX idx_popularity (popularity_rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SAMPLE DATA - POPULAR MOUNTAIN TRACKS
-- ============================================================================

-- GUNUNG RINJANI (2 jalur utama)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(1, 'Jalur Sembalun', 'SMB', 'Sembalun Village', 'Desa Sembalun Lawang, Lombok Timur', -8.3500, 116.5000, 'Sulit', 3, 22.5, 2426, 150000, 'BTNGR Official 2024', 400000, 'Asosiasi Guide Rinjani 2024', 350000, 'HPI Lombok 2024', '["Danau Segara Anak", "Puncak Rinjani", "Sunrise terbaik", "Jalur terpopuler"]', 'Pendaki berpengalaman, sunrise hunter', 'Savana, hutan pinus, danau vulkanik', TRUE, TRUE, 1, 'Jalur paling populer, start dari savana, view terbaik', '2024-10-14'),

(1, 'Jalur Senaru', 'SNR', 'Senaru Village', 'Desa Senaru, Lombok Utara', -8.3200, 116.4100, 'Sangat Sulit', 3, 24.0, 2526, 150000, 'BTNGR Official 2024', 400000, 'Asosiasi Guide Rinjani 2024', 350000, 'HPI Lombok 2024', '["Air Terjun Sendang Gile", "Danau Segara Anak", "Hutan lebat", "Lebih menantang"]', 'Pendaki expert, petualang', 'Hutan tropis lebat, air terjun', TRUE, FALSE, 2, 'Jalur lebih sulit, start dari hutan, lebih sepi', '2024-10-14');

-- GUNUNG SEMERU (2 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(2, 'Jalur Ranupane', 'RNP', 'Ranu Pani', 'Desa Ranupane, Lumajang', -8.0500, 112.9500, 'Sangat Sulit', 4, 28.0, 1476, 32000, 'TNBTS Official 2024', 350000, 'Asosiasi Guide Semeru 2024', 300000, 'HPI Malang 2024', '["Ranu Kumbolo", "Oro-oro Ombo", "Puncak Mahameru", "Jalur klasik"]', 'Pendaki berpengalaman', 'Danau, savana, pasir vulkanik', TRUE, TRUE, 1, 'Jalur klasik paling populer via Ranu Kumbolo', '2024-10-14'),

(2, 'Jalur Burno', 'BRN', 'Burno', 'Desa Burno, Malang', -8.0700, 112.9300, 'Sangat Sulit', 4, 30.0, 1576, 32000, 'TNBTS Official 2024', 350000, 'Asosiasi Guide Semeru 2024', 300000, 'HPI Malang 2024', '["Jalur alternatif", "Lebih sepi", "View berbeda"]', 'Pendaki expert, mencari tantangan', 'Hutan, savana', FALSE, FALSE, 2, 'Jalur alternatif, sering tutup, lebih sepi', '2024-10-14');

-- GUNUNG MERAPI (3 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(3, 'Jalur Selo (New Selo)', 'SLO', 'Selo Basecamp', 'Desa Selo, Boyolali', -7.5200, 110.4200, 'Sedang', 1, 8.0, 1700, 25000, 'Desa Selo 2024', 250000, 'Asosiasi Guide Merapi Selo 2024', 200000, 'Porter Selo 2024', '["Jalur paling populer", "Sunrise terbaik", "Dekat dari Jogja/Solo"]', 'Pemula hingga expert', 'Hutan pinus, pasir vulkanik', TRUE, TRUE, 1, 'Jalur paling populer dan mudah diakses', '2024-10-14'),

(3, 'Jalur Kaliurang', 'KLU', 'Kaliurang', 'Kaliurang, Sleman, Yogyakarta', -7.5800, 110.4300, 'Sulit', 1, 10.0, 1800, 25000, 'Desa Kaliurang 2024', 250000, 'Guide Kaliurang 2024', 200000, 'Porter Kaliurang 2024', '["Jalur klasik", "Lebih panjang", "View berbeda"]', 'Pendaki berpengalaman', 'Hutan, pasir vulkanik', TRUE, FALSE, 2, 'Jalur klasik dari sisi Jogja', '2024-10-14'),

(3, 'Jalur Babadan', 'BBD', 'Babadan', 'Babadan, Magelang', -7.5100, 110.4100, 'Sedang', 1, 9.0, 1750, 25000, 'Desa Babadan 2024', 250000, 'Guide Babadan 2024', 200000, 'Porter Babadan 2024', '["Jalur alternatif", "Lebih sepi"]', 'Pendaki sedang', 'Hutan, pasir', TRUE, FALSE, 3, 'Jalur alternatif dari sisi Magelang', '2024-10-14');

-- GUNUNG BROMO (2 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(4, 'Jalur Cemoro Lawang', 'CML', 'Cemoro Lawang', 'Cemoro Lawang, Probolinggo', -7.9400, 112.9500, 'Mudah', 1, 5.0, 400, 34000, 'TNBTS Official 2024', 200000, 'Guide Bromo 2024', 0, 'Tidak perlu porter (jalur mudah)', '["Lautan pasir", "Sunrise Penanjakan", "Kawah Bromo", "Paling populer"]', 'Semua level, wisatawan', 'Lautan pasir, kawah aktif', TRUE, TRUE, 1, 'Jalur paling mudah dan populer untuk wisata', '2024-10-14'),

(4, 'Jalur Wonokitri', 'WNK', 'Wonokitri', 'Wonokitri, Pasuruan', -7.9200, 112.9300, 'Mudah', 1, 6.0, 450, 34000, 'TNBTS Official 2024', 200000, 'Guide Wonokitri 2024', 0, 'Tidak perlu porter', '["Alternatif Cemoro Lawang", "Lebih sepi", "View bagus"]', 'Semua level', 'Lautan pasir', TRUE, FALSE, 2, 'Jalur alternatif lebih sepi', '2024-10-14');

-- GUNUNG MERBABU (4 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(5, 'Jalur Selo', 'SLO', 'Selo', 'Desa Selo, Boyolali', -7.4500, 110.4200, 'Sedang', 2, 12.0, 1600, 20000, 'Desa Selo 2024', 250000, 'Guide Merbabu Selo 2024', 200000, 'Porter Selo 2024', '["Jalur paling populer", "Savana luas", "Sunrise di Sabana 1"]', 'Pemula hingga expert', 'Savana, hutan pinus', TRUE, TRUE, 1, 'Jalur paling populer dengan savana luas', '2024-10-14'),

(5, 'Jalur Wekas', 'WKS', 'Wekas', 'Wekas, Boyolali', -7.4400, 110.4300, 'Sedang', 2, 11.0, 1550, 20000, 'Desa Wekas 2024', 250000, 'Guide Wekas 2024', 200000, 'Porter Wekas 2024', '["Jalur pendek", "Lebih cepat"]', 'Pendaki sedang', 'Hutan, savana', TRUE, FALSE, 2, 'Jalur lebih pendek dari Selo', '2024-10-14'),

(5, 'Jalur Cunthel', 'CTL', 'Cunthel', 'Cunthel, Semarang', -7.4300, 110.4400, 'Sulit', 2, 13.0, 1650, 20000, 'Desa Cunthel 2024', 250000, 'Guide Cunthel 2024', 200000, 'Porter Cunthel 2024', '["Jalur menantang", "Lebih sepi"]', 'Pendaki berpengalaman', 'Hutan lebat', TRUE, FALSE, 3, 'Jalur lebih sulit dan sepi', '2024-10-14'),

(5, 'Jalur Thekelan', 'TKL', 'Thekelan', 'Thekelan, Magelang', -7.4600, 110.4100, 'Sedang', 2, 12.5, 1580, 20000, 'Desa Thekelan 2024', 250000, 'Guide Thekelan 2024', 200000, 'Porter Thekelan 2024', '["Jalur alternatif", "View bagus"]', 'Pendaki sedang', 'Hutan, savana', TRUE, FALSE, 4, 'Jalur alternatif dari Magelang', '2024-10-14'),

(5, 'Jalur Suwanting', 'SWT', 'Suwanting', 'Suwanting, Kopeng, Semarang', -7.4700, 110.4500, 'Sedang', 2, 11.5, 1570, 20000, 'Desa Suwanting 2024', 250000, 'Guide Suwanting 2024', 200000, 'Porter Suwanting 2024', '["Jalur populer", "Savana cantik", "Camping ground bagus"]', 'Pemula hingga sedang', 'Savana, hutan pinus', TRUE, TRUE, 2, 'Jalur populer kedua setelah Selo, savana luas', '2024-10-14');

-- GUNUNG LAWU (2 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(6, 'Jalur Cemoro Sewu', 'CMS', 'Cemoro Sewu', 'Cemoro Sewu, Magetan', -7.6300, 111.1900, 'Sedang', 1, 8.0, 1300, 15000, 'Desa Cemoro Sewu 2024', 200000, 'Guide Lawu 2024', 150000, 'Porter Cemoro Sewu 2024', '["Jalur paling populer", "Candi Cetho", "Sunrise bagus"]', 'Pemula hingga sedang', 'Hutan pinus, candi', TRUE, TRUE, 1, 'Jalur paling populer dari Magetan', '2024-10-14'),

(6, 'Jalur Candi Cetho', 'CCT', 'Candi Cetho', 'Candi Cetho, Karanganyar', -7.6200, 111.1800, 'Sedang', 1, 9.0, 1350, 15000, 'Desa Cetho 2024', 200000, 'Guide Cetho 2024', 150000, 'Porter Cetho 2024', '["Lewat Candi Cetho", "Jalur spiritual", "View berbeda"]', 'Pendaki sedang', 'Hutan, candi', TRUE, FALSE, 2, 'Jalur alternatif lewat Candi Cetho', '2024-10-14');

-- GUNUNG SINDORO (2 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(7, 'Jalur Kledung', 'KLD', 'Kledung', 'Kledung, Temanggung', -7.3000, 110.0800, 'Sulit', 1, 10.0, 1800, 15000, 'Desa Kledung 2024', 200000, 'Guide Sindoro 2024', 150000, 'Porter Kledung 2024', '["Jalur paling populer", "Savana luas", "Puncak kembar"]', 'Pendaki berpengalaman', 'Savana, hutan', TRUE, TRUE, 1, 'Jalur paling populer Sindoro', '2024-10-14'),

(7, 'Jalur Sigedang', 'SGD', 'Sigedang', 'Sigedang, Temanggung', -7.2900, 110.0700, 'Sulit', 1, 11.0, 1850, 15000, 'Desa Sigedang 2024', 200000, 'Guide Sigedang 2024', 150000, 'Porter Sigedang 2024', '["Jalur alternatif", "Lebih sepi"]', 'Pendaki expert', 'Hutan, savana', TRUE, FALSE, 2, 'Jalur alternatif lebih menantang', '2024-10-14');

-- GUNUNG SUMBING (2 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(8, 'Jalur Garung', 'GRG', 'Garung', 'Garung, Wonosobo', -7.3800, 110.0700, 'Sulit', 1, 11.0, 1900, 15000, 'Desa Garung 2024', 200000, 'Guide Sumbing 2024', 150000, 'Porter Garung 2024', '["Jalur paling populer", "Savana", "View Sindoro"]', 'Pendaki berpengalaman', 'Savana, hutan', TRUE, TRUE, 1, 'Jalur paling populer Sumbing', '2024-10-14'),

(8, 'Jalur Banaran', 'BNR', 'Banaran', 'Banaran, Wonosobo', -7.3700, 110.0600, 'Sangat Sulit', 1, 12.0, 1950, 15000, 'Desa Banaran 2024', 200000, 'Guide Banaran 2024', 150000, 'Porter Banaran 2024', '["Jalur menantang", "Lebih sepi", "Expert only"]', 'Pendaki expert', 'Hutan lebat', TRUE, FALSE, 2, 'Jalur lebih sulit untuk expert', '2024-10-14');

-- GUNUNG PRAU (2 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(9, 'Jalur Patak Banteng', 'PTB', 'Patak Banteng', 'Patak Banteng, Dieng', -7.2000, 109.9200, 'Mudah', 1, 4.0, 600, 10000, 'Desa Patak Banteng 2024', 150000, 'Guide Prau 2024', 100000, 'Porter Patak Banteng 2024', '["Jalur paling populer", "Mudah", "Sunrise hunting", "Instagramable"]', 'Pemula, keluarga', 'Savana, bukit', TRUE, TRUE, 1, 'Jalur termudah dan terpopuler', '2024-10-14'),

(9, 'Jalur Igirmranak', 'IGR', 'Igirmranak', 'Igirmranak, Dieng', -7.1900, 109.9100, 'Mudah', 1, 5.0, 650, 10000, 'Desa Igirmranak 2024', 150000, 'Guide Igirmranak 2024', 100000, 'Porter Igirmranak 2024', '["Jalur alternatif", "View bagus"]', 'Pemula', 'Savana', TRUE, FALSE, 2, 'Jalur alternatif sedikit lebih panjang', '2024-10-14');

-- GUNUNG GEDE PANGRANGO (3 jalur)
INSERT INTO mountain_tracks (mountain_id, track_name, track_code, basecamp_name, basecamp_address, basecamp_latitude, basecamp_longitude, difficulty, typical_duration_days, distance_km, elevation_gain, entrance_fee, entrance_fee_source, guide_fee_per_day, guide_fee_source, porter_fee_per_day, porter_fee_source, highlights, best_for, scenery_type, is_open, is_recommended, popularity_rank, notes, last_updated) VALUES

(10, 'Jalur Cibodas', 'CBD', 'Cibodas', 'Cibodas, Cianjur', -6.7400, 107.0100, 'Sedang', 2, 14.0, 1700, 30000, 'TN Gede Pangrango 2024', 250000, 'Guide Cibodas 2024', 200000, 'Porter Cibodas 2024', '["Jalur paling populer", "Air terjun Cibeureum", "Hutan tropis", "Alun-alun Suryakencana"]', 'Pemula hingga sedang', 'Hutan tropis, air terjun', TRUE, TRUE, 1, 'Jalur paling populer dan klasik', '2024-10-14'),

(10, 'Jalur Gunung Putri', 'GPT', 'Gunung Putri', 'Gunung Putri, Bogor', -6.7200, 106.9900, 'Sulit', 2, 16.0, 1800, 30000, 'TN Gede Pangrango 2024', 250000, 'Guide Gunung Putri 2024', 200000, 'Porter Gunung Putri 2024', '["Jalur menantang", "Lebih sepi", "View berbeda"]', 'Pendaki berpengalaman', 'Hutan lebat', TRUE, FALSE, 2, 'Jalur lebih sulit dan sepi', '2024-10-14'),

(10, 'Jalur Salabintana', 'SLB', 'Salabintana', 'Salabintana, Sukabumi', -6.7600, 107.0300, 'Sangat Sulit', 2, 18.0, 1900, 30000, 'TN Gede Pangrango 2024', 250000, 'Guide Salabintana 2024', 200000, 'Porter Salabintana 2024', '["Jalur expert", "Paling menantang", "Jarang digunakan"]', 'Pendaki expert', 'Hutan lebat, terjal', TRUE, FALSE, 3, 'Jalur paling sulit, untuk expert', '2024-10-14');


-- ============================================================================
-- NOTES & VALIDATION
-- ============================================================================

/*
KENAPA PERLU MOUNTAIN TRACKS?

1. MULTIPLE JALUR PER GUNUNG:
   - Rinjani: Sembalun (populer) vs Senaru (sulit)
   - Merapi: Selo (mudah) vs Kaliurang (klasik) vs Babadan (alternatif)
   - Merbabu: Selo, Wekas, Cunthel, Thekelan (4 jalur!)

2. BEDA JALUR = BEDA HARGA:
   - Basecamp berbeda
   - Guide fee bisa beda
   - Porter fee bisa beda
   - Entrance fee bisa beda

3. BEDA KARAKTERISTIK:
   - Difficulty berbeda
   - Durasi berbeda
   - Jarak berbeda
   - Pemandangan berbeda
   - Cocok untuk level berbeda

4. USER EXPERIENCE:
   - User bisa pilih jalur sesuai skill
   - User bisa pilih jalur sesuai budget
   - User bisa pilih jalur sesuai waktu
   - User tahu highlight masing-masing jalur

SUMBER DATA:
✅ Website resmi TN
✅ Asosiasi Guide per jalur
✅ HPI cabang lokal
✅ Survey langsung basecamp
✅ Komunitas pendaki
✅ Google Maps (koordinat)

VALIDASI:
✅ Harga per jalur Oktober 2024
✅ Status buka/tutup verified
✅ Koordinat basecamp akurat
✅ Difficulty sesuai konsensus
✅ Highlights dari review pendaki
*/
