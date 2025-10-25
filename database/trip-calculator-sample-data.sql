-- ============================================================================
-- SAMPLE DATA - POPULAR MOUNTAINS IN INDONESIA
-- ============================================================================

-- Insert Popular Mountains
INSERT INTO mountains (name, province, city, elevation, difficulty, latitude, longitude, basecamp_name, basecamp_address, typical_duration_days, best_months, entrance_fee, entrance_fee_source, simaksi_fee, simaksi_fee_source, parking_fee, porter_fee_per_day, porter_fee_source, guide_fee_per_day, guide_fee_source, price_last_updated, description, highlights, image_url) VALUES

-- 1. Gunung Rinjani (Lombok)
('Gunung Rinjani', 'Nusa Tenggara Barat', 'Lombok Timur', 3726, 'Sulit', -8.4116, 116.4572, 'Sembalun Village', 'Desa Sembalun Lawang, Lombok Timur', 3, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"]', 
150000, 'Balai Taman Nasional Gunung Rinjani (BTNGR) 2024', 
150000, 'SIMAKSI Online - Kementerian LHK', 
5000, 
350000, 'Rata-rata HPI Rinjani & komunitas pendaki Lombok 2024', 
400000, 'Asosiasi Guide Rinjani & Rinjani Trek Center 2024',
'2024-10-01',
'Gunung Rinjani adalah gunung berapi tertinggi kedua di Indonesia dengan Danau Segara Anak yang memukau.', '["Danau Segara Anak", "Puncak Rinjani 3726 mdpl", "Air Terjun Tiu Kelep", "Sunrise spektakuler"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),

-- 2. Gunung Semeru (Jawa Timur)
('Gunung Semeru', 'Jawa Timur', 'Lumajang', 3676, 'Sangat Sulit', -8.1077, 112.9225, 'Ranu Pani', 'Desa Ranupane, Lumajang', 4, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"]', 
32000, 'TN Bromo Tengger Semeru (TNBTS) 2024', 
32000, 'SIMAKSI Online - Kementerian LHK', 
5000, 
300000, 'Rata-rata HPI Semeru & komunitas pendaki Malang 2024', 
350000, 'Asosiasi Guide Semeru Ranupane 2024',
'2024-10-01',
'Mahameru, gunung tertinggi di Pulau Jawa dengan kawah Jonggring Saloko yang aktif.', '["Puncak Mahameru 3676 mdpl", "Ranu Kumbolo", "Oro-oro Ombo", "Kawah Jonggring Saloko"]', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'),

-- 3. Gunung Merapi (Yogyakarta)
('Gunung Merapi', 'DI Yogyakarta', 'Sleman', 2930, 'Sedang', -7.5407, 110.4460, 'Selo', 'Desa Selo, Boyolali', 1, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"]', 
25000, 'Balai TN Gunung Merapi & Desa Selo 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
200000, 'Rata-rata HPI Merapi & komunitas pendaki Jogja 2024', 
250000, 'Asosiasi Guide Merapi Selo & New Selo 2024',
'2024-10-01',
'Gunung api paling aktif di Indonesia dengan pemandangan sunrise yang memukau.', '["Sunrise di puncak", "Bunker Kaliadem", "Lava tour", "Dekat Jogja"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),

-- 4. Gunung Bromo (Jawa Timur)
('Gunung Bromo', 'Jawa Timur', 'Probolinggo', 2329, 'Mudah', -7.9425, 112.9530, 'Cemoro Lawang', 'Desa Cemoro Lawang, Probolinggo', 2, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"]', 
34000, 'TN Bromo Tengger Semeru (TNBTS) 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
0, 'Porter tidak umum digunakan di Bromo', 
200000, 'Asosiasi Guide Bromo Cemoro Lawang 2024',
'2024-10-01',
'Gunung berapi ikonik dengan lautan pasir dan sunrise legendaris.', '["Sunrise Penanjakan", "Lautan Pasir", "Kawah Bromo", "Bukit Teletubbies"]', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'),

-- 5. Gunung Merbabu (Jawa Tengah)
('Gunung Merbabu', 'Jawa Tengah', 'Boyolali', 3145, 'Sedang', -7.4550, 110.4400, 'Selo', 'Desa Selo, Boyolali', 2, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"]', 
20000, 'Balai TN Gunung Merbabu & Desa Selo 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
200000, 'Rata-rata HPI Merbabu & komunitas pendaki Jogja/Solo 2024', 
250000, 'Asosiasi Guide Merbabu Selo 2024',
'2024-10-01',
'Gunung dengan savana luas dan pemandangan 360 derajat.', '["Sabana luas", "View Merapi-Merbabu", "Sunrise cantik", "Jalur beragam"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),

-- 6. Gunung Lawu (Jawa Tengah/Jawa Timur)
('Gunung Lawu', 'Jawa Tengah', 'Karanganyar', 3265, 'Sedang', -7.6250, 111.1920, 'Cemoro Sewu', 'Cemoro Sewu, Magetan', 2, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"]', 
15000, 'Desa Cemoro Sewu & Balai TN 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
200000, 'Rata-rata HPI Lawu & komunitas pendaki Solo/Madiun 2024', 
250000, 'Asosiasi Guide Lawu Cemoro Sewu 2024',
'2024-10-01',
'Gunung mistis dengan berbagai situs sejarah dan candi.', '["Candi Cetho", "Sunrise", "Jalur mistis", "Puncak Hargo Dumilah"]', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'),

-- 7. Gunung Sindoro (Jawa Tengah)
('Gunung Sindoro', 'Jawa Tengah', 'Wonosobo', 3153, 'Sulit', -7.3000, 109.9920, 'Kledung', 'Desa Kledung, Temanggung', 2, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"]', 
15000, 'Desa Kledung & Balai TN Dieng 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
200000, 'Rata-rata HPI Sindoro & komunitas pendaki Wonosobo 2024', 
250000, 'Asosiasi Guide Sindoro Kledung 2024',
'2024-10-01',
'Gunung kembar Sumbing dengan jalur menantang dan pemandangan indah.', '["Puncak Sundoro", "View Dieng", "Jalur menantang", "Savana"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),

-- 8. Gunung Sumbing (Jawa Tengah)
('Gunung Sumbing', 'Jawa Tengah', 'Wonosobo', 3371, 'Sulit', -7.3840, 110.0730, 'Garung', 'Desa Garung, Wonosobo', 2, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"]', 
15000, 'Desa Garung & Balai TN Dieng 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
200000, 'Rata-rata HPI Sumbing & komunitas pendaki Wonosobo 2024', 
250000, 'Asosiasi Guide Sumbing Garung 2024',
'2024-10-01',
'Gunung tertinggi ketiga di Jawa dengan jalur terjal.', '["Puncak tertinggi ke-3 Jawa", "View Sindoro", "Jalur ekstrem", "Sunrise"]', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'),

-- 9. Gunung Prau (Jawa Tengah)
('Gunung Prau', 'Jawa Tengah', 'Wonosobo', 2565, 'Mudah', -7.1860, 109.9200, 'Patak Banteng', 'Patak Banteng, Wonosobo', 1, '["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]', 
10000, 'Desa Patak Banteng & Balai TN Dieng 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
150000, 'Rata-rata HPI Prau & komunitas pendaki Wonosobo 2024', 
200000, 'Asosiasi Guide Prau Dieng 2024',
'2024-10-01',
'Gunung ramah pemula dengan savana luas dan camping ground indah.', '["Savana luas", "Camping ground", "Ramah pemula", "Sunrise Dieng"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),

-- 10. Gunung Gede Pangrango (Jawa Barat)
('Gunung Gede Pangrango', 'Jawa Barat', 'Cianjur', 2958, 'Sedang', -6.7820, 106.9800, 'Cibodas', 'Cibodas, Cianjur', 2, '["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"]', 
29000, 'TN Gede Pangrango (TNGP) - Cibodas 2024', 
0, 'Tidak diperlukan SIMAKSI', 
5000, 
200000, 'Rata-rata HPI Gede Pangrango & komunitas pendaki Jabar 2024', 
250000, 'Asosiasi Guide Gede Pangrango Cibodas 2024',
'2024-10-01',
'Taman Nasional dengan keanekaragaman hayati tinggi.', '["Alun-alun Suryakencana", "Telaga Biru", "Air Terjun Cibeureum", "Hutan tropis"]', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800');


-- ============================================================================
-- TRANSPORTATION ROUTES - FROM MAJOR CITIES
-- ============================================================================

-- RINJANI - From Jakarta
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, is_recommended) VALUES
(1, 'Jakarta', 'Pesawat', 'Lion Air / Garuda / Citilink', 'Jakarta (CGK) → Lombok (LOP)', 2.5, 1200, 500000, 1500000, 'Harga bervariasi tergantung musim dan booking', '["06:00", "10:00", "14:00", "18:00"]', 'Multiple daily', TRUE),
(1, 'Jakarta', 'Bus + Ferry', 'Lorena / Gunung Harta', 'Jakarta → Bali (bus) → Lombok (ferry)', 24, 1400, 300000, 500000, 'Perjalanan panjang tapi hemat', '["15:00", "16:00"]', 'Daily', FALSE);

-- RINJANI - From Surabaya
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, is_recommended) VALUES
(1, 'Surabaya', 'Pesawat', 'Lion Air / Citilink', 'Surabaya (SUB) → Lombok (LOP)', 1.5, 500, 400000, 1000000, 'Lebih dekat dari Jakarta', '["07:00", "12:00", "16:00"]', 'Daily', TRUE);

-- SEMERU - From Jakarta
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, is_recommended) VALUES
(2, 'Jakarta', 'Kereta', 'Kereta Gajayana / Bima', 'Jakarta → Malang', 12, 800, 200000, 400000, 'Kereta malam, nyaman', '["18:00", "19:00"]', 'Daily', TRUE),
(2, 'Jakarta', 'Bus', 'Pahala Kencana / Lorena', 'Jakarta → Malang', 16, 850, 200000, 350000, 'Alternatif ekonomis', '["14:00", "15:00", "16:00"]', 'Daily', FALSE);

-- SEMERU - From Surabaya
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, is_recommended) VALUES
(2, 'Surabaya', 'Bus', 'Bus DAMRI / Travel', 'Surabaya → Malang', 3, 90, 50000, 100000, 'Dekat, banyak pilihan', '["05:00", "07:00", "09:00", "11:00"]', 'Frequent', TRUE);

-- MERAPI - From Jakarta
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, is_recommended) VALUES
(3, 'Jakarta', 'Kereta', 'Kereta Taksaka / Argo Dwipangga', 'Jakarta → Yogyakarta', 8, 560, 150000, 350000, 'Kereta siang/malam', '["07:00", "19:00"]', 'Daily', TRUE),
(3, 'Jakarta', 'Pesawat', 'Garuda / Lion / Citilink', 'Jakarta (CGK) → Yogyakarta (JOG)', 1.5, 560, 400000, 1200000, 'Tercepat', '["06:00", "09:00", "12:00", "15:00"]', 'Multiple daily', TRUE);

-- MERAPI - From Bandung
INSERT INTO transportation_routes (mountain_id, from_city, transport_type, transport_name, route_description, duration_hours, distance_km, cost_min, cost_max, cost_notes, departure_times, frequency, is_recommended) VALUES
(3, 'Bandung', 'Kereta', 'Kereta Turangga', 'Bandung → Yogyakarta', 7, 420, 100000, 250000, 'Ekonomis', '["08:00", "20:00"]', 'Daily', TRUE);


-- ============================================================================
-- LOCAL TRANSPORTATION (City/Airport to Basecamp)
-- ============================================================================

-- RINJANI
INSERT INTO local_transportation (mountain_id, from_location, to_location, transport_type, duration_minutes, distance_km, cost_per_person, cost_notes, operating_hours) VALUES
(1, 'Bandara Lombok (LOP)', 'Sembalun Village', 'Sewa Mobil', 120, 80, 150000, 'Sewa mobil 600rb/mobil (isi 4 orang)', '24 hours'),
(1, 'Mataram City', 'Sembalun Village', 'Travel', 150, 85, 100000, 'Travel door to door', '06:00-20:00');

-- SEMERU
INSERT INTO local_transportation (mountain_id, from_location, to_location, transport_type, duration_minutes, distance_km, cost_per_person, cost_notes, operating_hours) VALUES
(2, 'Malang City', 'Ranupane', 'Sewa Mobil', 180, 120, 200000, 'Sewa mobil 800rb/mobil (isi 4 orang)', '24 hours'),
(2, 'Stasiun Malang', 'Ranupane', 'Travel', 180, 120, 150000, 'Travel langsung ke basecamp', '05:00-15:00');

-- MERAPI
INSERT INTO local_transportation (mountain_id, from_location, to_location, transport_type, duration_minutes, distance_km, cost_per_person, cost_notes, operating_hours) VALUES
(3, 'Stasiun Yogyakarta', 'Selo Basecamp', 'Sewa Mobil', 90, 45, 100000, 'Sewa mobil 400rb/mobil (isi 4 orang)', '24 hours'),
(3, 'Bandara Yogyakarta', 'Selo Basecamp', 'Travel', 120, 60, 150000, 'Travel door to door', '06:00-22:00');


-- ============================================================================
-- FOOD ESTIMATES (Per Person Per Day)
-- ============================================================================

INSERT INTO food_estimates (mountain_id, duration_days, breakfast_cost, lunch_cost, dinner_cost, snack_cost, water_cost, food_availability, recommendations) VALUES
-- Rinjani (3 days)
(1, 3, 20000, 25000, 25000, 15000, 10000, 'Warung di Sembalun, bawa logistik sendiri untuk di gunung', 'Bawa makanan instan, air mineral cukup, porter bisa bawa logistik'),

-- Semeru (4 days)
(2, 4, 15000, 20000, 20000, 10000, 8000, 'Warung di Ranupane, bawa logistik untuk 4 hari', 'Makanan ringan, mie instan, air mineral, gas untuk masak'),

-- Merapi (1 day)
(3, 1, 15000, 20000, 20000, 10000, 5000, 'Warung di Selo, bisa beli sebelum naik', 'Cukup bawa snack dan air mineral'),

-- Bromo (2 days)
(4, 2, 20000, 25000, 25000, 15000, 10000, 'Banyak warung di Cemoro Lawang', 'Makanan mudah didapat, harga sedikit mahal'),

-- Merbabu (2 days)
(5, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Selo, bawa logistik untuk 2 hari', 'Makanan instan, air mineral, gas'),

-- Lawu (2 days)
(6, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Cemoro Sewu', 'Bawa logistik sendiri lebih aman'),

-- Sindoro (2 days)
(7, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Kledung', 'Bawa makanan instan'),

-- Sumbing (2 days)
(8, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Garung', 'Bawa logistik sendiri'),

-- Prau (1 day)
(9, 1, 15000, 20000, 20000, 10000, 5000, 'Warung di Patak Banteng', 'Cukup bawa snack'),

-- Gede Pangrango (2 days)
(10, 2, 20000, 25000, 25000, 15000, 10000, 'Warung di Cibodas', 'Bawa logistik untuk 2 hari');


-- ============================================================================
-- EQUIPMENT RENTAL
-- ============================================================================

INSERT INTO equipment_rental (mountain_id, rental_name, location, contact_phone, contact_whatsapp, items, is_recommended, rating) VALUES
(1, 'Rinjani Rental Sembalun', 'Sembalun Village', '081234567890', '081234567890', 
'[
  {"name": "Carrier 60L", "price_per_day": 50000, "deposit": 200000, "condition": "Baik"},
  {"name": "Tenda 2-3 orang", "price_per_day": 50000, "deposit": 150000, "condition": "Baik"},
  {"name": "Sleeping Bag", "price_per_day": 30000, "deposit": 100000, "condition": "Baik"},
  {"name": "Matras", "price_per_day": 15000, "deposit": 50000, "condition": "Baik"},
  {"name": "Kompor + Gas", "price_per_day": 30000, "deposit": 100000, "condition": "Baik"},
  {"name": "Nesting", "price_per_day": 20000, "deposit": 50000, "condition": "Baik"},
  {"name": "Headlamp", "price_per_day": 15000, "deposit": 50000, "condition": "Baik"},
  {"name": "Trekking Pole", "price_per_day": 15000, "deposit": 50000, "condition": "Baik"}
]', TRUE, 4.5),

(2, 'Semeru Outdoor Rental', 'Malang / Ranupane', '081234567891', '081234567891',
'[
  {"name": "Carrier 70L", "price_per_day": 50000, "deposit": 200000, "condition": "Baik"},
  {"name": "Tenda 2-3 orang", "price_per_day": 50000, "deposit": 150000, "condition": "Baik"},
  {"name": "Sleeping Bag", "price_per_day": 30000, "deposit": 100000, "condition": "Baik"},
  {"name": "Matras", "price_per_day": 15000, "deposit": 50000, "condition": "Baik"},
  {"name": "Kompor + Gas", "price_per_day": 30000, "deposit": 100000, "condition": "Baik"}
]', TRUE, 4.3),

(3, 'Merapi Outdoor Selo', 'Selo, Boyolali', '081234567892', '081234567892',
'[
  {"name": "Carrier 50L", "price_per_day": 40000, "deposit": 150000, "condition": "Baik"},
  {"name": "Headlamp", "price_per_day": 15000, "deposit": 50000, "condition": "Baik"},
  {"name": "Jaket Gunung", "price_per_day": 25000, "deposit": 100000, "condition": "Baik"}
]', TRUE, 4.6);


-- ============================================================================
-- ACCOMMODATIONS
-- ============================================================================

INSERT INTO accommodations (mountain_id, name, type, location, price_per_night, price_notes, facilities, contact_phone, contact_whatsapp, rating, is_recommended) VALUES
(1, 'Sembalun Homestay', 'Homestay', 'Sembalun Village', 100000, 'Per kamar (2-3 orang)', '["WiFi", "Hot Water", "Breakfast", "Parking"]', '081234567890', '081234567890', 4.5, TRUE),
(1, 'Rinjani Lodge', 'Hotel', 'Sembalun Village', 250000, 'Per kamar', '["WiFi", "Hot Water", "Breakfast", "AC", "Restaurant"]', '081234567891', '081234567891', 4.7, TRUE),

(2, 'Ranupane Homestay', 'Homestay', 'Ranupane', 80000, 'Per kamar (2-3 orang)', '["Hot Water", "Breakfast", "Parking"]', '081234567892', '081234567892', 4.3, TRUE),

(3, 'Selo Homestay', 'Homestay', 'Selo, Boyolali', 75000, 'Per kamar', '["Hot Water", "Breakfast", "View Merapi"]', '081234567893', '081234567893', 4.4, TRUE);


-- ============================================================================
-- EQUIPMENT CHECKLIST
-- ============================================================================

INSERT INTO equipment_checklist (category, item_name, description, priority, for_difficulty, can_be_rented, typical_rental_price, typical_purchase_price) VALUES
-- Pakaian
('Pakaian', 'Jaket Gunung / Windbreaker', 'Jaket anti angin dan air', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', TRUE, 25000, 200000),
('Pakaian', 'Celana Gunung', 'Celana panjang quick dry', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 150000),
('Pakaian', 'Kaos Kaki Tebal', 'Kaos kaki hiking', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 50000),
('Pakaian', 'Sepatu Gunung', 'Sepatu hiking anti slip', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 400000),
('Pakaian', 'Sarung Tangan', 'Sarung tangan tebal', 'Penting', '["Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 50000),
('Pakaian', 'Buff / Masker', 'Pelindung wajah dari debu', 'Penting', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 30000),

-- Peralatan Tidur
('Peralatan Tidur', 'Carrier 50-70L', 'Tas gunung besar', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', TRUE, 50000, 500000),
('Peralatan Tidur', 'Tenda', 'Tenda 2-3 orang', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', TRUE, 50000, 800000),
('Peralatan Tidur', 'Sleeping Bag', 'Sleeping bag suhu dingin', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', TRUE, 30000, 300000),
('Peralatan Tidur', 'Matras', 'Matras lipat / foam', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', TRUE, 15000, 100000),

-- Peralatan Masak
('Peralatan Masak', 'Kompor Portable + Gas', 'Kompor camping', 'Wajib', '["Sedang", "Sulit", "Sangat Sulit"]', TRUE, 30000, 200000),
('Peralatan Masak', 'Nesting / Alat Masak', 'Set alat masak portable', 'Wajib', '["Sedang", "Sulit", "Sangat Sulit"]', TRUE, 20000, 150000),
('Peralatan Masak', 'Sendok Garpu', 'Alat makan', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 20000),

-- Navigasi & Penerangan
('Navigasi', 'Headlamp + Baterai Cadangan', 'Senter kepala', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', TRUE, 15000, 100000),
('Navigasi', 'Trekking Pole', 'Tongkat gunung', 'Penting', '["Sedang", "Sulit", "Sangat Sulit"]', TRUE, 15000, 150000),
('Navigasi', 'GPS / Kompas', 'Alat navigasi', 'Penting', '["Sulit", "Sangat Sulit"]', FALSE, 0, 200000),

-- P3K & Obat-obatan
('P3K', 'Obat-obatan Pribadi', 'Obat rutin, vitamin', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 50000),
('P3K', 'P3K Kit', 'Kotak P3K lengkap', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 100000),
('P3K', 'Sunblock & Lip Balm', 'Pelindung kulit', 'Penting', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 50000),

-- Lain-lain
('Lain-lain', 'Botol Minum 1-2L', 'Botol air', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 50000),
('Lain-lain', 'Makanan & Snack', 'Logistik makanan', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 100000),
('Lain-lain', 'Plastik Sampah', 'Kantong sampah', 'Wajib', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 5000),
('Lain-lain', 'Powerbank', 'Charger portable', 'Penting', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 150000),
('Lain-lain', 'Kamera / HP', 'Dokumentasi', 'Opsional', '["Mudah", "Sedang", "Sulit", "Sangat Sulit"]', FALSE, 0, 2000000);

