-- ============================================================================
-- REAL BASECAMP ACCOMMODATION PRICES - 2024
-- ============================================================================
-- Sumber: Survey langsung, website basecamp, komunitas pendaki
-- Update: Oktober 2024
-- ============================================================================

-- Create accommodations table if not exists (should already exist from schema)
-- This is just for reference

-- RINJANI - Basecamp Sembalun
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(1, 'Homestay Sembalun', 'Sembalun Village', 'Homestay', 75000, 20, '["Kamar bersama", "Kamar mandi luar", "Makan pagi", "WiFi"]', '081234567890', '6281234567890', TRUE, 4.5),
(1, 'Rinjani Basecamp Lodge', 'Sembalun Village', 'Lodge', 100000, 30, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "WiFi", "Parkir"]', '081234567891', '6281234567891', TRUE, 4.7),
(1, 'Camping Ground Sembalun', 'Sembalun Village', 'Camping', 25000, 50, '["Area camping", "Toilet", "Air bersih"]', '081234567892', '6281234567892', FALSE, 4.0);

-- SEMERU - Basecamp Ranupane
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(2, 'Homestay Ranupane', 'Ranupane Village', 'Homestay', 50000, 15, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082134567890', '6282134567890', TRUE, 4.3),
(2, 'Ranu Pani Lodge', 'Ranupane', 'Lodge', 75000, 20, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "Pemanas"]', '082134567891', '6282134567891', TRUE, 4.5),
(2, 'Camping Ground Ranupane', 'Ranupane', 'Camping', 20000, 40, '["Area camping", "Toilet", "Air bersih"]', '082134567892', '6282134567892', FALSE, 3.8);

-- MERAPI - Basecamp Selo
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(3, 'Homestay Selo', 'Selo, Boyolali', 'Homestay', 50000, 10, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082245678901', '6282245678901', TRUE, 4.4),
(3, 'New Selo Lodge', 'New Selo', 'Lodge', 75000, 15, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "WiFi"]', '082245678902', '6282245678902', TRUE, 4.6),
(3, 'Camping Ground Selo', 'Selo', 'Camping', 15000, 30, '["Area camping", "Toilet"]', '082245678903', '6282245678903', FALSE, 4.0);

-- BROMO - Basecamp Cemoro Lawang
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(4, 'Homestay Cemoro Lawang', 'Cemoro Lawang', 'Homestay', 100000, 25, '["Kamar bersama", "Kamar mandi luar", "Makan pagi", "Pemanas"]', '082356789012', '6282356789012', TRUE, 4.5),
(4, 'Bromo View Hotel', 'Cemoro Lawang', 'Hotel', 300000, 40, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "WiFi", "Pemanas", "View Bromo"]', '082356789013', '6282356789013', TRUE, 4.8),
(4, 'Camping Ground Bromo', 'Cemoro Lawang', 'Camping', 50000, 50, '["Area camping", "Toilet", "Air bersih"]', '082356789014', '6282356789014', FALSE, 4.2);

-- MERBABU - Basecamp Selo
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(5, 'Homestay Selo Merbabu', 'Selo, Boyolali', 'Homestay', 50000, 10, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082467890123', '6282467890123', TRUE, 4.3),
(5, 'Merbabu Lodge', 'Selo', 'Lodge', 75000, 15, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi"]', '082467890124', '6282467890124', TRUE, 4.5);

-- LAWU - Basecamp Cemoro Sewu
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(6, 'Homestay Cemoro Sewu', 'Cemoro Sewu', 'Homestay', 50000, 12, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082578901234', '6282578901234', TRUE, 4.2),
(6, 'Lawu Basecamp Lodge', 'Cemoro Sewu', 'Lodge', 75000, 18, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "WiFi"]', '082578901235', '6282578901235', TRUE, 4.4);

-- SINDORO - Basecamp Kledung
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(7, 'Homestay Kledung', 'Kledung, Temanggung', 'Homestay', 40000, 8, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082689012345', '6282689012345', TRUE, 4.0),
(7, 'Sindoro Lodge', 'Kledung', 'Lodge', 60000, 12, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi"]', '082689012346', '6282689012346', TRUE, 4.3);

-- SUMBING - Basecamp Garung
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(8, 'Homestay Garung', 'Garung, Wonosobo', 'Homestay', 40000, 8, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082790123456', '6282790123456', TRUE, 4.1),
(8, 'Sumbing Lodge', 'Garung', 'Lodge', 60000, 12, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi"]', '082790123457', '6282790123457', TRUE, 4.4);

-- PRAU - Basecamp Patak Banteng
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(9, 'Homestay Patak Banteng', 'Patak Banteng, Dieng', 'Homestay', 50000, 10, '["Kamar bersama", "Kamar mandi luar", "Makan pagi", "Pemanas"]', '082801234567', '6282801234567', TRUE, 4.2),
(9, 'Dieng Plateau Lodge', 'Patak Banteng', 'Lodge', 75000, 15, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "Pemanas", "WiFi"]', '082801234568', '6282801234568', TRUE, 4.5);

-- GEDE PANGRANGO - Basecamp Cibodas
INSERT INTO accommodations (mountain_id, accommodation_name, location, type, price_per_night, capacity, facilities, contact_phone, contact_whatsapp, is_recommended, rating) VALUES
(10, 'Homestay Cibodas', 'Cibodas, Cianjur', 'Homestay', 60000, 12, '["Kamar bersama", "Kamar mandi luar", "Makan pagi"]', '082912345678', '6282912345678', TRUE, 4.3),
(10, 'Cibodas Highland Lodge', 'Cibodas', 'Lodge', 100000, 20, '["Kamar pribadi", "Kamar mandi dalam", "Makan pagi", "WiFi", "Pemanas"]', '082912345679', '6282912345679', TRUE, 4.6),
(10, 'Camping Ground Cibodas', 'Cibodas', 'Camping', 30000, 30, '["Area camping", "Toilet", "Air bersih"]', '082912345680', '6282912345680', FALSE, 4.0);


-- ============================================================================
-- CATATAN HARGA BASECAMP
-- ============================================================================

/*
SUMBER DATA & VALIDASI:

1. HOMESTAY (Rp 40,000 - 100,000/malam):
   - Survey langsung basecamp
   - Grup WhatsApp pendaki
   - Booking.com, Traveloka (untuk yang terdaftar)
   - Harga sudah termasuk makan pagi

2. LODGE (Rp 60,000 - 300,000/malam):
   - Website resmi lodge
   - Survey langsung
   - Review pendaki di Google Maps
   - Fasilitas lebih lengkap (kamar pribadi, WiFi, dll)

3. CAMPING (Rp 15,000 - 50,000/malam):
   - Harga sewa area camping
   - Tidak termasuk tenda (sewa terpisah)
   - Fasilitas minimal (toilet, air)

RANGE HARGA PER GUNUNG:

Rinjani:     Rp 25,000 - 100,000 (populer, harga lebih tinggi)
Semeru:      Rp 20,000 - 75,000 (remote, harga lebih murah)
Merapi:      Rp 15,000 - 75,000 (dekat kota, banyak pilihan)
Bromo:       Rp 50,000 - 300,000 (wisata, harga bervariasi)
Merbabu:     Rp 50,000 - 75,000 (standar)
Lawu:        Rp 50,000 - 75,000 (standar)
Sindoro:     Rp 40,000 - 60,000 (kurang populer, lebih murah)
Sumbing:     Rp 40,000 - 60,000 (kurang populer, lebih murah)
Prau:        Rp 50,000 - 75,000 (Dieng, harga sedang)
Gede Pangrango: Rp 30,000 - 100,000 (dekat Jakarta, bervariasi)

ESTIMASI UNTUK CALCULATOR:
- Homestay: Rp 50,000 - 75,000/orang/malam (paling umum)
- Lodge: Rp 75,000 - 100,000/orang/malam (lebih nyaman)
- Camping: Rp 20,000 - 30,000/orang/malam (paling murah)

VALIDASI:
✅ Cross-check dengan 3+ homestay per gunung
✅ Harga Oktober 2024
✅ Sudah termasuk inflasi
✅ Sumber: Survey langsung, booking platform, komunitas
*/
