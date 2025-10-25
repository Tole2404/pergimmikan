-- ============================================================================
-- COMPLETE TRANSPORTATION OPERATORS WITH ROUTES
-- ============================================================================
-- Insert routes dulu, baru operators (fix FK constraint)
-- ============================================================================

-- Create table jika belum ada
CREATE TABLE IF NOT EXISTS transportation_operators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL COMMENT 'FK to transportation_routes',
  operator_name VARCHAR(100) NOT NULL,
  service_class VARCHAR(50),
  price INT NOT NULL,
  facilities JSON,
  duration_hours DECIMAL(4,1),
  departure_times JSON,
  booking_url VARCHAR(255),
  booking_phone VARCHAR(50),
  is_recommended BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  last_updated DATE,
  FOREIGN KEY (route_id) REFERENCES transportation_routes(id) ON DELETE CASCADE,
  INDEX idx_route_operator (route_id, operator_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- 1. KERETA JAKARTA → YOGYAKARTA (untuk Merapi/Merbabu)
-- ============================================================================

-- Insert route dulu (cek apakah sudah ada)
INSERT IGNORE INTO transportation_routes 
(mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) 
VALUES
(3, 'Jakarta', 'Kereta', 'KAI Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 7.5, 560, 100000, 250000, 'Berbagai kelas tersedia', '["08:00", "20:00"]', 'Multiple daily', 'https://kai.id', TRUE);

-- Ambil route_id yang baru dibuat
SET @route_jkt_yogya_kereta = LAST_INSERT_ID();

-- Insert operators untuk route ini
INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(@route_jkt_yogya_kereta, 'KAI - Argo Dwipangga', 'Eksekutif', 250000, '["AC", "Meal", "Reclining Seat", "Power Outlet", "WiFi"]', 7.5, '["08:00", "20:00"]', 'https://kai.id', TRUE, '2024-10-14'),
(@route_jkt_yogya_kereta, 'KAI - Taksaka', 'Eksekutif', 230000, '["AC", "Meal", "Reclining Seat", "Power Outlet"]', 7.5, '["07:30", "19:30"]', 'https://kai.id', FALSE, '2024-10-14'),
(@route_jkt_yogya_kereta, 'KAI - Turangga', 'Bisnis', 150000, '["AC", "Snack", "Reclining Seat"]', 8.0, '["08:00"]', 'https://kai.id', FALSE, '2024-10-14'),
(@route_jkt_yogya_kereta, 'KAI - Ekonomi AC', 'Ekonomi', 100000, '["AC", "Toilet"]', 9.0, '["06:00", "14:00", "22:00"]', 'https://kai.id', FALSE, '2024-10-14');


-- ============================================================================
-- 2. KERETA JAKARTA → SURABAYA (untuk Semeru/Bromo)
-- ============================================================================

INSERT IGNORE INTO transportation_routes 
(mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) 
VALUES
(2, 'Jakarta', 'Kereta', 'KAI Jakarta-Surabaya', 'Jakarta → Surabaya (untuk Semeru)', 8.0, 730, 150000, 350000, 'Berbagai kelas tersedia', '["08:00", "20:00"]', 'Multiple daily', 'https://kai.id', TRUE);

SET @route_jkt_sby_kereta = LAST_INSERT_ID();

INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(@route_jkt_sby_kereta, 'KAI - Argo Bromo Anggrek', 'Eksekutif', 350000, '["AC", "Meal", "Reclining Seat", "Power Outlet", "WiFi", "Entertainment"]', 8.0, '["08:00", "20:00"]', 'https://kai.id', TRUE, '2024-10-14'),
(@route_jkt_sby_kereta, 'KAI - Bima', 'Eksekutif', 320000, '["AC", "Meal", "Reclining Seat", "Power Outlet"]', 8.5, '["07:00", "19:00"]', 'https://kai.id', FALSE, '2024-10-14'),
(@route_jkt_sby_kereta, 'KAI - Ekonomi AC', 'Ekonomi', 150000, '["AC", "Toilet"]', 10.0, '["05:00", "13:00", "21:00"]', 'https://kai.id', FALSE, '2024-10-14');


-- ============================================================================
-- 3. PESAWAT JAKARTA → LOMBOK (untuk Rinjani)
-- ============================================================================

INSERT IGNORE INTO transportation_routes 
(mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) 
VALUES
(1, 'Jakarta', 'Pesawat', 'Jakarta-Lombok Flight', 'Jakarta → Lombok (untuk Rinjani)', 2.5, 1100, 700000, 1200000, 'Berbagai maskapai tersedia', '["06:00", "10:00", "14:00"]', 'Multiple daily', 'Traveloka/Tiket.com', TRUE);

SET @route_jkt_lombok_pesawat = LAST_INSERT_ID();

INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(@route_jkt_lombok_pesawat, 'Garuda Indonesia', 'Ekonomi', 1200000, '["Meal", "Bagasi 20kg", "In-flight Entertainment", "Refundable"]', 2.5, '["06:00", "10:00", "14:00", "18:00"]', 'https://garuda-indonesia.com', TRUE, '2024-10-14'),
(@route_jkt_lombok_pesawat, 'Lion Air', 'Ekonomi', 800000, '["Bagasi 20kg", "Snack"]', 2.5, '["05:30", "09:30", "13:30", "17:30", "21:30"]', 'https://lionair.co.id', FALSE, '2024-10-14'),
(@route_jkt_lombok_pesawat, 'Citilink', 'Ekonomi', 700000, '["Bagasi 20kg"]', 2.5, '["07:00", "11:00", "15:00"]', 'https://citilink.co.id', FALSE, '2024-10-14'),
(@route_jkt_lombok_pesawat, 'Batik Air', 'Ekonomi', 950000, '["Meal", "Bagasi 20kg", "Refundable"]', 2.5, '["08:00", "12:00", "16:00"]', 'https://batikair.com', FALSE, '2024-10-14');


-- ============================================================================
-- 4. BUS JAKARTA → YOGYAKARTA
-- ============================================================================

INSERT IGNORE INTO transportation_routes 
(mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) 
VALUES
(3, 'Jakarta', 'Bus', 'Bus Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 9.0, 560, 120000, 200000, 'Bus malam, berbagai kelas', '["18:00", "19:00", "20:00"]', 'Multiple evening', 'Langsung di terminal', TRUE);

SET @route_jkt_yogya_bus = LAST_INSERT_ID();

INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
(@route_jkt_yogya_bus, 'Pahala Kencana', 'Eksekutif', 200000, '["AC", "Meal", "Toilet", "Reclining Seat", "WiFi", "Entertainment"]', 8.0, '["18:00", "19:00", "20:00"]', NULL, TRUE, '2024-10-14'),
(@route_jkt_yogya_bus, 'Sinar Jaya', 'Bisnis', 150000, '["AC", "Snack", "Toilet", "Reclining Seat"]', 9.0, '["17:00", "18:00", "19:00", "20:00"]', NULL, FALSE, '2024-10-14'),
(@route_jkt_yogya_bus, 'Nusantara', 'Ekonomi AC', 120000, '["AC", "Toilet"]', 10.0, '["18:00", "20:00", "22:00"]', NULL, FALSE, '2024-10-14');


-- ============================================================================
-- 5. TRAVEL JAKARTA → BANDUNG
-- ============================================================================

INSERT IGNORE INTO transportation_routes 
(mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) 
VALUES
(10, 'Jakarta', 'Travel', 'Travel Jakarta-Bandung', 'Jakarta → Bandung (untuk Gede Pangrango)', 3.0, 150, 90000, 120000, 'Door to door service', '["00:00"]', 'On demand 24 jam', 'Booking online/WA', TRUE);

SET @route_jkt_bdg_travel = LAST_INSERT_ID();

INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, booking_phone, is_recommended, last_updated) VALUES
(@route_jkt_bdg_travel, 'X-Trans', 'Eksekutif', 120000, '["AC", "Reclining Seat", "Door to Door", "WiFi"]', 2.5, '["00:00"]', NULL, '081234567890', TRUE, '2024-10-14'),
(@route_jkt_bdg_travel, 'Cipaganti', 'Eksekutif', 100000, '["AC", "Reclining Seat", "Door to Door"]', 3.0, '["00:00"]', 'https://cipaganti.co.id', '082345678901', FALSE, '2024-10-14'),
(@route_jkt_bdg_travel, 'Baraya Travel', 'Eksekutif', 90000, '["AC", "Reclining Seat"]', 3.0, '["00:00"]', NULL, '083456789012', FALSE, '2024-10-14');


-- ============================================================================
-- SELESAI!
-- ============================================================================
-- Sekarang transportation_operators sudah terisi dengan FK yang benar
-- Data bisa digunakan untuk dropdown operator selection
-- ============================================================================
