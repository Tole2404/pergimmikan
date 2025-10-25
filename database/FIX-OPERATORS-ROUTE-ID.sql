-- ============================================================================
-- FIX ROUTE_ID - Cari ID yang benar dari transportation_routes
-- ============================================================================

-- 1. CEK DULU ID YANG ADA
SELECT id, mountain_id, from_city, transport_type, transport_name 
FROM transportation_routes 
WHERE transport_type IN ('Kereta', 'Pesawat', 'Bus', 'Travel')
ORDER BY transport_type, from_city;

-- Setelah dapat ID yang benar, gunakan query ini untuk insert operators
-- Ganti @route_id dengan ID yang sesuai

-- ============================================================================
-- CONTOH: Jika Kereta Jakarta-Yogyakarta punya ID = 5
-- ============================================================================

-- SET @jakarta_yogya_kereta = 5;
-- SET @jakarta_lombok_pesawat = 10;
-- SET @jakarta_bandung_bus = 15;

-- INSERT INTO transportation_operators (route_id, operator_name, service_class, price, facilities, duration_hours, departure_times, booking_url, is_recommended, last_updated) VALUES
-- (@jakarta_yogya_kereta, 'KAI - Argo Dwipangga', 'Eksekutif', 250000, '["AC", "Meal", "WiFi"]', 7.5, '["08:00", "20:00"]', 'https://kai.id', TRUE, '2024-10-14');


-- ============================================================================
-- ATAU: Insert tanpa FK constraint (sementara)
-- ============================================================================

-- Disable FK check sementara
SET FOREIGN_KEY_CHECKS = 0;

-- Insert data (route_id bisa dummy dulu)
-- Nanti update manual setelah tahu ID yang benar

-- Enable FK check lagi
SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================================
-- SOLUSI TERBAIK: Buat route dulu jika belum ada
-- ============================================================================

-- Cek apakah route sudah ada
SELECT * FROM transportation_routes 
WHERE from_city = 'Jakarta' 
  AND transport_type = 'Kereta'
  AND mountain_id = 3; -- Merapi

-- Jika belum ada, insert dulu route-nya
-- INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, is_recommended) VALUES
-- (3, 'Jakarta', 'Kereta', 'KAI Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 7.5, 560, 100000, 250000, 'Berbagai kelas tersedia', TRUE);

-- Lalu ambil ID-nya
-- SELECT LAST_INSERT_ID();

-- Baru insert operators dengan route_id tersebut
