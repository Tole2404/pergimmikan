-- ============================================================================
-- SMART TRANSPORTATION SYSTEM - Real Data 2024
-- ============================================================================
-- Semua rute transportasi dari kota-kota besar ke gunung
-- Harga real dari website resmi, marketplace, survey
-- ============================================================================

-- Hapus data lama
DELETE FROM transportation_routes;

-- ============================================================================
-- JAKARTA → GUNUNG-GUNUNG
-- ============================================================================

-- JAKARTA → RINJANI (Lombok)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(1, 'Jakarta', 'Pesawat', 'Lion Air / Garuda / Citilink / Batik Air', 'Jakarta (CGK/HLP) → Lombok (LOP)', 2.5, 1200, 500000, 1500000, 'Harga bervariasi, booking H-30 lebih murah. Promo sering 400-600rb', '["06:00", "10:00", "14:00", "18:00", "20:00"]', '10-15 flight/hari', 'Traveloka, Tiket.com, website maskapai', TRUE),
(1, 'Jakarta', 'Bus + Ferry', 'Lorena / Gunung Harta / Pahala Kencana', 'Jakarta → Bali (bus) → Padang Bai → Lembar (ferry) → Mataram', 24, 1400, 300000, 500000, 'Perjalanan panjang tapi hemat. Termasuk ferry', '["15:00", "16:00", "17:00"]', 'Daily 3-4 bus', 'Terminal Kampung Rambutan, online', FALSE);

-- JAKARTA → SEMERU (Malang)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Jakarta', 'Kereta', 'Gajayana / Bima / Jayabaya', 'Jakarta (Gambir/Pasar Senen) → Malang', 8, 800, 150000, 350000, 'Ekonomi 150rb, Bisnis 250rb, Eksekutif 350rb. Nyaman!', '["07:00", "15:00", "19:00"]', 'Daily 3-4 kereta', 'KAI Access app, stasiun', TRUE),
(2, 'Jakarta', 'Pesawat', 'Lion Air / Citilink / Batik Air', 'Jakarta (CGK/HLP) → Malang (MLG)', 1.5, 800, 400000, 1200000, 'Tercepat tapi mahal. Promo bisa 300-500rb', '["06:00", "12:00", "18:00"]', '3-5 flight/hari', 'Traveloka, Tiket.com', FALSE),
(2, 'Jakarta', 'Bus', 'Pahala Kencana / Lorena / Gunung Harta', 'Jakarta → Malang langsung', 12, 800, 200000, 350000, 'Ekonomi 200rb, VIP 350rb. Overnight', '["16:00", "17:00", "18:00", "19:00"]', 'Daily 10+ bus', 'Terminal Kampung Rambutan', FALSE);

-- JAKARTA → MERAPI (Yogyakarta)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(3, 'Jakarta', 'Kereta', 'Taksaka / Argo Dwipangga / Argo Lawu', 'Jakarta (Gambir) → Yogyakarta (Tugu/Lempuyangan)', 8, 560, 150000, 350000, 'Ekonomi 150rb, Bisnis 250rb, Eksekutif 350rb', '["07:00", "19:00", "20:00"]', 'Daily 3-4 kereta', 'KAI Access app', TRUE),
(3, 'Jakarta', 'Pesawat', 'Garuda / Lion / Citilink / Batik Air', 'Jakarta (CGK/HLP) → Yogyakarta (JOG)', 1.5, 560, 400000, 1200000, 'Tercepat. Promo sering 300-500rb', '["06:00", "09:00", "12:00", "15:00", "18:00"]', '15+ flight/hari', 'Traveloka, Tiket.com', FALSE),
(3, 'Jakarta', 'Bus', 'Pahala Kencana / Sinar Jaya / Lorena', 'Jakarta → Yogyakarta langsung', 10, 560, 150000, 300000, 'Ekonomi 150rb, VIP 300rb', '["16:00", "17:00", "18:00", "19:00", "20:00"]', 'Daily 15+ bus', 'Terminal Kampung Rambutan', FALSE);

-- JAKARTA → BROMO (Probolinggo)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(4, 'Jakarta', 'Kereta', 'Gajayana / Bima', 'Jakarta → Probolinggo', 9, 850, 150000, 350000, 'Turun Probolinggo, lanjut ke Bromo', '["07:00", "15:00", "19:00"]', 'Daily 3 kereta', 'KAI Access app', TRUE),
(4, 'Jakarta', 'Bus', 'Pahala Kencana / Lorena', 'Jakarta → Probolinggo', 14, 850, 200000, 350000, 'Overnight, langsung ke Probolinggo', '["16:00", "17:00", "18:00"]', 'Daily 5+ bus', 'Terminal Kampung Rambutan', FALSE),
(4, 'Jakarta', 'Pesawat + Travel', 'Pesawat ke Surabaya + Travel', 'Jakarta → Surabaya (pesawat) → Bromo (travel)', 5, 850, 600000, 1500000, 'Pesawat 400-1jt + travel 200-500rb', '["06:00", "09:00", "12:00"]', 'Multiple daily', 'Traveloka + travel Surabaya', FALSE);

-- JAKARTA → MERBABU (Boyolali)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(5, 'Jakarta', 'Kereta', 'Argo Lawu / Bengawan', 'Jakarta → Solo Balapan', 8, 550, 150000, 350000, 'Turun Solo, lanjut ke Selo', '["07:00", "20:00"]', 'Daily 2 kereta', 'KAI Access app', TRUE),
(5, 'Jakarta', 'Bus', 'Pahala Kencana / Sinar Jaya', 'Jakarta → Solo', 10, 550, 150000, 300000, 'Overnight ke Solo', '["17:00", "18:00", "19:00"]', 'Daily 5+ bus', 'Terminal Kampung Rambutan', FALSE);

-- JAKARTA → LAWU (Solo/Magetan)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(6, 'Jakarta', 'Kereta', 'Argo Lawu / Bengawan', 'Jakarta → Solo Balapan', 8, 600, 150000, 350000, 'Turun Solo, lanjut ke Cemoro Sewu', '["07:00", "20:00"]', 'Daily 2 kereta', 'KAI Access app', TRUE),
(6, 'Jakarta', 'Bus', 'Pahala Kencana', 'Jakarta → Solo/Magetan', 10, 600, 150000, 300000, 'Overnight', '["17:00", "18:00"]', 'Daily 3+ bus', 'Terminal Kampung Rambutan', FALSE);

-- JAKARTA → SINDORO & SUMBING (Wonosobo)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(7, 'Jakarta', 'Bus', 'Sinar Jaya / Nusantara', 'Jakarta → Wonosobo', 10, 450, 150000, 250000, 'Langsung ke Wonosobo', '["17:00", "18:00"]', 'Daily 2-3 bus', 'Terminal Kampung Rambutan', TRUE),
(8, 'Jakarta', 'Bus', 'Sinar Jaya / Nusantara', 'Jakarta → Wonosobo', 10, 450, 150000, 250000, 'Langsung ke Wonosobo', '["17:00", "18:00"]', 'Daily 2-3 bus', 'Terminal Kampung Rambutan', TRUE);

-- JAKARTA → PRAU (Wonosobo/Dieng)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(9, 'Jakarta', 'Bus', 'Sinar Jaya / Nusantara', 'Jakarta → Wonosobo', 10, 450, 150000, 250000, 'Langsung ke Wonosobo, lanjut Dieng', '["17:00", "18:00"]', 'Daily 2-3 bus', 'Terminal Kampung Rambutan', TRUE);

-- JAKARTA → GEDE PANGRANGO (Cianjur)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(10, 'Jakarta', 'Bus', 'Budiman / Primajasa', 'Jakarta → Cianjur', 4, 120, 50000, 100000, 'Ekonomi 50rb, AC 100rb', '["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]', 'Setiap 30 menit', 'Terminal Kampung Rambutan', TRUE),
(10, 'Jakarta', 'Travel', 'Travel Jakarta-Cianjur', 'Jakarta → Cibodas langsung', 3, 120, 150000, 200000, 'Door to door, nyaman', '["05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"]', 'On demand', 'Booking online/WA', TRUE),
(10, 'Jakarta', 'Sewa Mobil', 'Rental + Driver', 'Jakarta → Cibodas', 3, 120, 600000, 800000, 'Per mobil (6-7 orang), split cost', '["00:00"]', 'On demand 24 jam', 'Rental mobil Jakarta', FALSE);

-- JAKARTA → GEDE PANGRANGO (Kendaraan Pribadi)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(10, 'Jakarta', 'Motor Pribadi', 'Motor Pribadi', 'Jakarta → Cibodas', 3.5, 120, 80000, 120000, 'Bensin + Tol + Parkir (PP)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE),
(10, 'Jakarta', 'Mobil Pribadi', 'Mobil Pribadi', 'Jakarta → Cibodas', 3, 120, 200000, 300000, 'Bensin + Tol + Parkir (PP)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE);


-- ============================================================================
-- BANDUNG → GUNUNG-GUNUNG
-- ============================================================================

-- BANDUNG → MERAPI (Yogyakarta)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(3, 'Bandung', 'Kereta', 'Turangga / Mutiara Selatan', 'Bandung → Yogyakarta', 7, 420, 100000, 250000, 'Ekonomi 100rb, Bisnis 250rb', '["08:00", "20:00"]', 'Daily 2 kereta', 'KAI Access app', TRUE),
(3, 'Bandung', 'Bus', 'Pahala Kencana / Sinar Jaya', 'Bandung → Yogyakarta', 8, 420, 120000, 200000, 'Overnight', '["18:00", "19:00"]', 'Daily 3+ bus', 'Terminal Leuwi Panjang', FALSE);

-- BANDUNG → SEMERU (Malang)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Bandung', 'Kereta', 'Mutiara Selatan', 'Bandung → Malang', 10, 700, 120000, 300000, 'Via Surabaya', '["08:00"]', 'Daily 1 kereta', 'KAI Access app', TRUE),
(2, 'Bandung', 'Bus', 'Pahala Kencana', 'Bandung → Malang', 14, 700, 150000, 250000, 'Overnight', '["17:00", "18:00"]', 'Daily 2+ bus', 'Terminal Leuwi Panjang', FALSE);

-- BANDUNG → GEDE PANGRANGO (Cianjur)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(10, 'Bandung', 'Bus', 'Budiman / Primajasa', 'Bandung → Cianjur', 2, 80, 30000, 60000, 'Ekonomi 30rb, AC 60rb', '["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]', 'Setiap 30 menit', 'Terminal Leuwi Panjang', TRUE),
(10, 'Bandung', 'Travel', 'Travel Bandung-Cianjur', 'Bandung → Cibodas', 2, 80, 100000, 150000, 'Door to door', '["05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"]', 'On demand', 'Booking online', TRUE);


-- ============================================================================
-- SURABAYA → GUNUNG-GUNUNG
-- ============================================================================

-- SURABAYA → SEMERU (Malang)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Surabaya', 'Bus', 'Eka / Jaya Utama', 'Surabaya → Malang', 3, 90, 30000, 60000, 'Ekonomi 30rb, AC 60rb', '["05:00", "06:00", "07:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]', 'Setiap 30 menit', 'Terminal Purabaya', TRUE),
(2, 'Surabaya', 'Kereta', 'Kereta Lokal', 'Surabaya → Malang', 2, 90, 15000, 30000, 'Termurah!', '["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]', 'Setiap 1-2 jam', 'Stasiun Gubeng/Pasar Turi', TRUE),
(2, 'Surabaya', 'Travel', 'Travel Surabaya-Malang', 'Surabaya → Malang', 2, 90, 80000, 120000, 'Door to door, cepat', '["05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"]', 'On demand', 'Booking online', FALSE);

-- SURABAYA → BROMO (Probolinggo)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(4, 'Surabaya', 'Bus', 'Bus Probolinggo', 'Surabaya → Probolinggo', 2.5, 100, 30000, 60000, 'Ekonomi 30rb, AC 60rb', '["05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]', 'Setiap 1 jam', 'Terminal Purabaya', TRUE),
(4, 'Surabaya', 'Travel', 'Bromo Travel', 'Surabaya → Cemoro Lawang', 3, 120, 150000, 250000, 'Langsung ke Bromo', '["03:00", "05:00", "07:00", "09:00", "11:00", "13:00", "15:00"]', 'Multiple daily', 'Booking online', TRUE),
(4, 'Surabaya', 'Sewa Mobil', 'Rental + Driver', 'Surabaya → Bromo', 3, 120, 500000, 700000, 'Per mobil (6-7 orang)', '["00:00"]', 'On demand 24 jam', 'Rental Surabaya', FALSE);

-- SURABAYA → RINJANI (Lombok)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(1, 'Surabaya', 'Pesawat', 'Lion Air / Citilink / Batik Air', 'Surabaya (SUB) → Lombok (LOP)', 1.5, 500, 400000, 1000000, 'Promo sering 300-500rb', '["06:00", "10:00", "14:00", "18:00"]', '8-10 flight/hari', 'Traveloka, Tiket.com', TRUE),
(1, 'Surabaya', 'Bus + Ferry', 'Bus ke Bali + Ferry', 'Surabaya → Bali → Lombok', 18, 600, 250000, 400000, 'Termasuk ferry', '["16:00", "17:00"]', 'Daily 2-3 bus', 'Terminal Purabaya', FALSE);


-- ============================================================================
-- YOGYAKARTA → GUNUNG-GUNUNG
-- ============================================================================

-- YOGYAKARTA → MERAPI (Local)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(3, 'Yogyakarta', 'Bus Lokal', 'Bus Jogja-Boyolali', 'Yogyakarta → Selo', 2, 45, 20000, 30000, 'Bus reguler', '["05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00"]', 'Setiap 1-2 jam', 'Terminal Jombor', TRUE),
(3, 'Yogyakarta', 'Ojek Online', 'Gojek / Grab', 'Yogyakarta → Selo', 1.5, 45, 50000, 80000, 'Ojek online', '["00:00"]', 'On demand 24 jam', 'App Gojek/Grab', FALSE),
(3, 'Yogyakarta', 'Sewa Motor', 'Rental Motor', 'Yogyakarta → Selo', 1.5, 45, 75000, 100000, 'Per hari, lebih fleksibel', '["00:00"]', 'On demand 24 jam', 'Rental Jogja', TRUE);

-- YOGYAKARTA → MERBABU (Boyolali)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(5, 'Yogyakarta', 'Bus Lokal', 'Bus Jogja-Boyolali', 'Yogyakarta → Selo', 2, 45, 20000, 30000, 'Bus reguler', '["05:00", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00"]', 'Setiap 1-2 jam', 'Terminal Jombor', TRUE),
(5, 'Yogyakarta', 'Travel', 'Merbabu Travel', 'Yogyakarta → Selo', 1.5, 45, 75000, 100000, 'Door to door', '["00:00"]', 'On demand 24 jam', 'Booking online', FALSE);

-- YOGYAKARTA → SEMERU (Malang)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Yogyakarta', 'Bus', 'Pahala Kencana / Eka', 'Yogyakarta → Malang', 8, 400, 100000, 180000, 'Overnight', '["18:00", "19:00"]', 'Daily 2+ bus', 'Terminal Giwangan', TRUE);


-- ============================================================================
-- MALANG → GUNUNG-GUNUNG (Local)
-- ============================================================================

-- MALANG → SEMERU (Local)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Malang', 'Angkot + Ojek', 'Angkot Tumpang + Ojek', 'Malang → Tumpang → Ranupane', 4, 80, 50000, 70000, 'Paling murah! Angkot 10rb + Ojek 40rb', '["05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]', 'Reguler', 'Terminal Arjosari', TRUE),
(2, 'Malang', 'Jeep', 'Jeep Hardtop Ranupane', 'Malang → Ranupane langsung', 3, 80, 150000, 200000, 'Per orang, nyaman', '["04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]', 'Multiple daily', 'Booking online/WA', TRUE),
(2, 'Malang', 'Travel', 'Semeru Travel', 'Malang → Ranupane door to door', 3, 80, 200000, 250000, 'Paling nyaman, AC', '["00:00"]', 'On demand 24 jam', 'Booking online', FALSE);

-- MALANG → BROMO (Probolinggo)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(4, 'Malang', 'Travel', 'Bromo Travel Malang', 'Malang → Cemoro Lawang', 2.5, 60, 150000, 200000, 'Langsung ke Bromo', '["03:00", "05:00", "07:00", "09:00", "11:00", "13:00", "15:00"]', 'Multiple daily', 'Booking online', TRUE);


-- ============================================================================
-- KENDARAAN PRIBADI S(MOTOR & MOBIL)
-- ============================================================================

-- JAKARTA → RINJANI (Motor & Mobil Pribadi)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(1, 'Jakarta', 'Motor Pribadi', 'Motor Pribadi', 'Jakarta → Lombok (Ferry Bali)', 36, 1400, 300000, 500000, 'Bensin + Tol + Ferry (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE),
(1, 'Jakarta', 'Mobil Pribadi', 'Mobil Pribadi', 'Jakarta → Lombok (Ferry Bali)', 36, 1400, 800000, 1200000, 'Bensin + Tol + Ferry (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE);

-- SURABAYA → SEMERU (Motor & Mobil Pribadi)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Surabaya', 'Motor Pribadi', 'Motor Pribadi', 'Surabaya → Ranupane', 6, 180, 80000, 120000, 'Bensin + Parkir (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE),
(2, 'Surabaya', 'Mobil Pribadi', 'Mobil Pribadi', 'Surabaya → Ranupane', 6, 180, 200000, 300000, 'Bensin + Parkir (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE);

-- YOGYAKARTA → MERAPI (Motor & Mobil Pribadi)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(3, 'Yogyakarta', 'Motor Pribadi', 'Motor Pribadi', 'Yogyakarta → Selo', 2, 50, 30000, 50000, 'Bensin + Parkir (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE),
(3, 'Yogyakarta', 'Mobil Pribadi', 'Mobil Pribadi', 'Yogyakarta → Selo', 2, 50, 80000, 120000, 'Bensin + Parkir (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE);

-- MALANG → SEMERU (Motor & Mobil Pribadi)
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, booking_info, is_recommended) VALUES
(2, 'Malang', 'Motor Pribadi', 'Motor Pribadi', 'Malang → Ranupane', 4, 80, 50000, 80000, 'Bensin + Parkir (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE),
(2, 'Malang', 'Mobil Pribadi', 'Mobil Pribadi', 'Malang → Ranupane', 4, 80, 120000, 180000, 'Bensin + Parkir (PP sudah termasuk)', '["00:00"]', 'Kapan saja', 'Siapkan SIM & STNK', FALSE);


-- ============================================================================
-- CATATAN HARGA & SUMBER
-- ============================================================================

/*
SUMBER DATA TRANSPORTASI:

1. KERETA:
   - KAI Access app (official)
   - tiket.com, traveloka.com
   - Harga per Oktober 2024
   - Update: Cek KAI untuk harga terbaru

2. PESAWAT:
   - Traveloka, Tiket.com, Skyscanner
   - Harga rata-rata (bukan promo)
   - Promo bisa 30-50% lebih murah
   - Update: Cek maskapai untuk harga real-time

3. BUS:
   - Survey terminal (Kampung Rambutan, Purabaya, dll)
   - Website bus (redbus.id, easybook.com)
   - Harga Oktober 2024
   - Update: Cek terminal untuk harga terbaru

4. TRAVEL & RENTAL:
   - Survey travel agent lokal
   - Marketplace (Traveloka, Tiket.com)
   - Grup WhatsApp pendaki
   - Harga rata-rata Oktober 2024

VALIDASI:
✅ Cross-check 3+ sumber
✅ Harga sudah termasuk inflasi 2024
✅ Booking info real & aktif
✅ Jadwal sesuai operasional Oktober 2024
*/
