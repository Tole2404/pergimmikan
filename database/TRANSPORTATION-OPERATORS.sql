-- ============================================================================
-- TRANSPORTATION OPERATORS - MERK/OPERATOR TRANSPORTASI
-- ============================================================================
-- Untuk dropdown pilihan operator dengan harga berbeda
-- ============================================================================

-- Create table for transportation operators
CREATE TABLE IF NOT EXISTS transportation_operators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL COMMENT 'FK to transportation_routes',
  
  -- Operator Info
  operator_name VARCHAR(100) NOT NULL COMMENT 'Nama operator (KAI, Garuda, dll)',
  service_class VARCHAR(50) COMMENT 'Kelas layanan (Ekonomi, Bisnis, Eksekutif)',
  
  -- Pricing
  price INT NOT NULL COMMENT 'Harga per orang',
  
  -- Details
  facilities JSON COMMENT 'Fasilitas ["AC", "Meal", "WiFi", "Bagasi"]',
  duration_hours DECIMAL(4,1) COMMENT 'Durasi perjalanan (jam)',
  departure_times JSON COMMENT 'Jam keberangkatan',
  
  -- Booking
  booking_url VARCHAR(255) COMMENT 'Link booking online',
  booking_phone VARCHAR(50) COMMENT 'Nomor booking',
  
  -- Meta
  is_recommended BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  last_updated DATE,
  
  FOREIGN KEY (route_id) REFERENCES transportation_routes(id) ON DELETE CASCADE,
  INDEX idx_route_operator (route_id, operator_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- KERETA API (KAI)
-- ============================================================================

-- JAKARTA → YOGYAKARTA (untuk Merapi/Merbabu)
-- Route ID: Cari dulu dari transportation_routes

INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
-- Asumsi route_id = 1 untuk Kereta Jakarta-Yogyakarta
(1, 'KAI - Argo Dwipangga', 'Eksekutif', 250000, '["AC", "Meal", "Reclining Seat", "Power Outlet", "WiFi"]', 7.5, '["08:00", "20:00"]', 'https://kai.id', TRUE, '2024-10-14'),
(1, 'KAI - Taksaka', 'Eksekutif', 230000, '["AC", "Meal", "Reclining Seat", "Power Outlet"]', 7.5, '["07:30", "19:30"]', 'https://kai.id', FALSE, '2024-10-14'),
(1, 'KAI - Turangga', 'Bisnis', 150000, '["AC", "Snack", "Reclining Seat"]', 8.0, '["08:00"]', 'https://kai.id', FALSE, '2024-10-14'),
(1, 'KAI - Ekonomi AC', 'Ekonomi', 100000, '["AC", "Toilet"]', 9.0, '["06:00", "14:00", "22:00"]', 'https://kai.id', FALSE, '2024-10-14');

-- JAKARTA → SURABAYA (untuk Semeru/Bromo)
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(2, 'KAI - Argo Bromo Anggrek', 'Eksekutif', 350000, '["AC", "Meal", "Reclining Seat", "Power Outlet", "WiFi", "Entertainment"]', 8.0, '["08:00", "20:00"]', 'https://kai.id', TRUE, '2024-10-14'),
(2, 'KAI - Bima', 'Eksekutif', 320000, '["AC", "Meal", "Reclining Seat", "Power Outlet"]', 8.5, '["07:00", "19:00"]', 'https://kai.id', FALSE, '2024-10-14'),
(2, 'KAI - Ekonomi AC', 'Ekonomi', 150000, '["AC", "Toilet"]', 10.0, '["05:00", "13:00", "21:00"]', 'https://kai.id', FALSE, '2024-10-14');

-- BANDUNG → YOGYAKARTA
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(3, 'KAI - Turangga', 'Bisnis', 180000, '["AC", "Snack", "Reclining Seat"]', 7.0, '["08:00", "20:00"]', 'https://kai.id', TRUE, '2024-10-14'),
(3, 'KAI - Ekonomi AC', 'Ekonomi', 100000, '["AC", "Toilet"]', 8.5, '["06:00", "14:00"]', 'https://kai.id', FALSE, '2024-10-14');


-- ============================================================================
-- PESAWAT
-- ============================================================================

-- JAKARTA → LOMBOK (untuk Rinjani)
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(10, 'Garuda Indonesia', 'Ekonomi', 1200000, '["Meal", "Bagasi 20kg", "In-flight Entertainment", "Refundable"]', 2.5, '["06:00", "10:00", "14:00", "18:00"]', 'https://garuda-indonesia.com', TRUE, '2024-10-14'),
(10, 'Lion Air', 'Ekonomi', 800000, '["Bagasi 20kg", "Snack"]', 2.5, '["05:30", "09:30", "13:30", "17:30", "21:30"]', 'https://lionair.co.id', FALSE, '2024-10-14'),
(10, 'Citilink', 'Ekonomi', 700000, '["Bagasi 20kg"]', 2.5, '["07:00", "11:00", "15:00"]', 'https://citilink.co.id', FALSE, '2024-10-14'),
(10, 'Batik Air', 'Ekonomi', 950000, '["Meal", "Bagasi 20kg", "Refundable"]', 2.5, '["08:00", "12:00", "16:00"]', 'https://batikair.com', FALSE, '2024-10-14');

-- JAKARTA → SURABAYA
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(11, 'Garuda Indonesia', 'Ekonomi', 800000, '["Meal", "Bagasi 20kg", "In-flight Entertainment"]', 1.5, '["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]', 'https://garuda-indonesia.com', TRUE, '2024-10-14'),
(11, 'Lion Air', 'Ekonomi', 500000, '["Bagasi 20kg", "Snack"]', 1.5, '["05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"]', 'https://lionair.co.id', FALSE, '2024-10-14'),
(11, 'Citilink', 'Ekonomi', 450000, '["Bagasi 20kg"]', 1.5, '["06:30", "10:30", "14:30", "18:30"]', 'https://citilink.co.id', FALSE, '2024-10-14');


-- ============================================================================
-- BUS
-- ============================================================================

-- JAKARTA → BANDUNG
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(20, 'Damri', 'Ekonomi AC', 50000, '["AC", "Toilet", "Reclining Seat"]', 3.5, '["05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]', 'https://damri.co.id', TRUE, '2024-10-14'),
(20, 'Primajasa', 'Ekonomi AC', 60000, '["AC", "Toilet", "Reclining Seat", "USB Charger"]', 3.0, '["Setiap 30 menit"]', 'https://primajasa.co.id', FALSE, '2024-10-14'),
(20, 'Budiman', 'Ekonomi AC', 55000, '["AC", "Toilet", "Reclining Seat"]', 3.5, '["Setiap 1 jam"]', NULL, FALSE, '2024-10-14');

-- JAKARTA → YOGYAKARTA
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(21, 'Pahala Kencana', 'Eksekutif', 200000, '["AC", "Meal", "Toilet", "Reclining Seat", "WiFi", "Entertainment"]', 8.0, '["18:00", "19:00", "20:00"]', NULL, TRUE, '2024-10-14'),
(21, 'Sinar Jaya', 'Bisnis', 150000, '["AC", "Snack", "Toilet", "Reclining Seat"]', 9.0, '["17:00", "18:00", "19:00", "20:00"]', NULL, FALSE, '2024-10-14'),
(21, 'Nusantara', 'Ekonomi AC', 120000, '["AC", "Toilet"]', 10.0, '["18:00", "20:00", "22:00"]', NULL, FALSE, '2024-10-14');

-- JAKARTA → SURABAYA
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(22, 'Pahala Kencana', 'Eksekutif', 300000, '["AC", "Meal", "Toilet", "Sleeper Seat", "WiFi", "Entertainment"]', 12.0, '["17:00", "18:00", "19:00"]', NULL, TRUE, '2024-10-14'),
(22, 'Sinar Jaya', 'Bisnis', 250000, '["AC", "Snack", "Toilet", "Reclining Seat"]', 13.0, '["17:00", "19:00", "21:00"]', NULL, FALSE, '2024-10-14'),
(22, 'Lorena', 'Ekonomi AC', 180000, '["AC", "Toilet"]', 14.0, '["18:00", "20:00"]', NULL, FALSE, '2024-10-14');


-- ============================================================================
-- TRAVEL
-- ============================================================================

-- JAKARTA → BANDUNG
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, booking_phone, is_recommended, last_updated) VALUES
(30, 'X-Trans', 'Eksekutif', 120000, '["AC", "Reclining Seat", "Door to Door", "WiFi"]', 2.5, '["00:00"]', NULL, '081234567890', TRUE, '2024-10-14'),
(30, 'Cipaganti', 'Eksekutif', 100000, '["AC", "Reclining Seat", "Door to Door"]', 3.0, '["00:00"]', 'https://cipaganti.co.id', '082345678901', FALSE, '2024-10-14'),
(30, 'Baraya Travel', 'Eksekutif', 90000, '["AC", "Reclining Seat"]', 3.0, '["00:00"]', NULL, '083456789012', FALSE, '2024-10-14');


-- ============================================================================
-- CATATAN
-- ============================================================================

/*
ROUTE_ID MAPPING (Harus disesuaikan dengan transportation_routes):
- Cek ID real dari transportation_routes table
- Update semua route_id di atas sesuai ID yang benar

HARGA:
- Harga bisa berubah sewaktu-waktu
- Harga peak season bisa lebih mahal
- Harga promo bisa lebih murah

BOOKING:
- Link booking untuk kemudahan user
- Phone number untuk travel/bus lokal

ADMIN PANEL NANTI:
- CRUD operators
- Update harga bulk
- Set recommended
- Toggle active/inactive
*/
