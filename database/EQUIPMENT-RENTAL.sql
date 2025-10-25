-- ============================================================================
-- EQUIPMENT RENTAL - SEWA PERALATAN PENDAKIAN
-- ============================================================================

-- RINJANI - Rental Sembalun
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(1, 'Rental Sembalun Adventure', '081234567890', 
'[
  {"name": "Tenda Kapasitas 2-3 Orang", "price_per_day": 35000, "condition": "Baik", "category": "Tenda"},
  {"name": "Tenda Kapasitas 4-5 Orang", "price_per_day": 50000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 15000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras/Alas Tidur", "price_per_day": 10000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 60L", "price_per_day": 25000, "condition": "Baik", "category": "Tas"},
  {"name": "Carrier 70L+", "price_per_day": 30000, "condition": "Baik", "category": "Tas"},
  {"name": "Kompor Portable + Gas", "price_per_day": 20000, "condition": "Berfungsi", "category": "Masak"},
  {"name": "Nesting (Set Alat Masak)", "price_per_day": 15000, "condition": "Lengkap", "category": "Masak"},
  {"name": "Headlamp", "price_per_day": 10000, "condition": "Baik", "category": "Penerangan"},
  {"name": "Trekking Pole (Sepasang)", "price_per_day": 15000, "condition": "Kokoh", "category": "Alat Bantu"},
  {"name": "Rain Cover Carrier", "price_per_day": 5000, "condition": "Waterproof", "category": "Pelindung"},
  {"name": "Jaket Gunung", "price_per_day": 20000, "condition": "Hangat", "category": "Pakaian"}
]', 
TRUE, 4.8, 'Survey Sembalun Oktober 2024', '2024-10-14');

-- SEMERU - Rental Ranupane
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(2, 'Rental Ranupane Outdoor', '082345678901',
'[
  {"name": "Tenda Kapasitas 2-3 Orang", "price_per_day": 30000, "condition": "Baik", "category": "Tenda"},
  {"name": "Tenda Kapasitas 4 Orang", "price_per_day": 45000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 12000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 8000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 60L", "price_per_day": 20000, "condition": "Baik", "category": "Tas"},
  {"name": "Carrier 70L", "price_per_day": 25000, "condition": "Baik", "category": "Tas"},
  {"name": "Kompor + Gas", "price_per_day": 18000, "condition": "Berfungsi", "category": "Masak"},
  {"name": "Nesting", "price_per_day": 12000, "condition": "Lengkap", "category": "Masak"},
  {"name": "Headlamp", "price_per_day": 8000, "condition": "Baik", "category": "Penerangan"},
  {"name": "Trekking Pole", "price_per_day": 12000, "condition": "Kokoh", "category": "Alat Bantu"}
]',
TRUE, 4.7, 'Survey Ranupane Oktober 2024', '2024-10-14');

-- MERAPI - Rental Selo
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(3, 'Rental Selo Mountain', '083456789012',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 25000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 10000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 7000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 50L", "price_per_day": 15000, "condition": "Baik", "category": "Tas"},
  {"name": "Headlamp", "price_per_day": 7000, "condition": "Baik", "category": "Penerangan"},
  {"name": "Jaket Gunung", "price_per_day": 15000, "condition": "Hangat", "category": "Pakaian"}
]',
TRUE, 4.6, 'Survey Selo Oktober 2024', '2024-10-14');

-- BROMO - Rental Cemoro Lawang
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(4, 'Rental Bromo Sunrise', '084567890123',
'[
  {"name": "Jaket Tebal", "price_per_day": 15000, "condition": "Hangat", "category": "Pakaian"},
  {"name": "Masker Debu", "price_per_day": 5000, "condition": "Baru", "category": "Pelindung"},
  {"name": "Headlamp", "price_per_day": 7000, "condition": "Baik", "category": "Penerangan"},
  {"name": "Trekking Pole", "price_per_day": 10000, "condition": "Kokoh", "category": "Alat Bantu"}
]',
TRUE, 4.5, 'Survey Bromo Oktober 2024', '2024-10-14');

-- MERBABU - Rental Selo
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(5, 'Rental Merbabu Selo', '085678901234',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 30000, "condition": "Baik", "category": "Tenda"},
  {"name": "Tenda 4 Orang", "price_per_day": 40000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 12000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 8000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 60L", "price_per_day": 20000, "condition": "Baik", "category": "Tas"},
  {"name": "Kompor + Gas", "price_per_day": 15000, "condition": "Berfungsi", "category": "Masak"},
  {"name": "Nesting", "price_per_day": 10000, "condition": "Lengkap", "category": "Masak"},
  {"name": "Headlamp", "price_per_day": 8000, "condition": "Baik", "category": "Penerangan"},
  {"name": "Trekking Pole", "price_per_day": 12000, "condition": "Kokoh", "category": "Alat Bantu"}
]',
TRUE, 4.7, 'Survey Selo Merbabu Oktober 2024', '2024-10-14');

-- LAWU - Rental Cemoro Sewu
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(6, 'Rental Lawu Adventure', '086789012345',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 25000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 10000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 7000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 50L", "price_per_day": 18000, "condition": "Baik", "category": "Tas"},
  {"name": "Headlamp", "price_per_day": 7000, "condition": "Baik", "category": "Penerangan"}
]',
TRUE, 4.5, 'Survey Cemoro Sewu Oktober 2024', '2024-10-14');

-- SINDORO - Rental Kledung
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(7, 'Rental Sindoro Kledung', '087890123456',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 28000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 11000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 8000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 60L", "price_per_day": 20000, "condition": "Baik", "category": "Tas"},
  {"name": "Kompor + Gas", "price_per_day": 15000, "condition": "Berfungsi", "category": "Masak"},
  {"name": "Headlamp", "price_per_day": 8000, "condition": "Baik", "category": "Penerangan"}
]',
TRUE, 4.6, 'Survey Kledung Oktober 2024', '2024-10-14');

-- SUMBING - Rental Garung
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(8, 'Rental Sumbing Garung', '088901234567',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 28000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 11000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 8000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 60L", "price_per_day": 20000, "condition": "Baik", "category": "Tas"},
  {"name": "Headlamp", "price_per_day": 8000, "condition": "Baik", "category": "Penerangan"}
]',
TRUE, 4.5, 'Survey Garung Oktober 2024', '2024-10-14');

-- PRAU - Rental Dieng
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(9, 'Rental Prau Dieng', '089012345678',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 25000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 10000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 7000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Jaket Gunung", "price_per_day": 15000, "condition": "Hangat", "category": "Pakaian"},
  {"name": "Headlamp", "price_per_day": 7000, "condition": "Baik", "category": "Penerangan"}
]',
TRUE, 4.6, 'Survey Dieng Oktober 2024', '2024-10-14');

-- GEDE PANGRANGO - Rental Cibodas
INSERT INTO equipment_rental (mountain_id, rental_name, contact_whatsapp, items, is_recommended, rating, price_source, price_last_updated) VALUES
(10, 'Rental Cibodas Outdoor', '081123456789',
'[
  {"name": "Tenda 2-3 Orang", "price_per_day": 30000, "condition": "Baik", "category": "Tenda"},
  {"name": "Tenda 4 Orang", "price_per_day": 45000, "condition": "Baik", "category": "Tenda"},
  {"name": "Sleeping Bag", "price_per_day": 12000, "condition": "Bersih", "category": "Sleeping"},
  {"name": "Matras", "price_per_day": 8000, "condition": "Baik", "category": "Sleeping"},
  {"name": "Carrier 60L", "price_per_day": 22000, "condition": "Baik", "category": "Tas"},
  {"name": "Kompor + Gas", "price_per_day": 18000, "condition": "Berfungsi", "category": "Masak"},
  {"name": "Nesting", "price_per_day": 12000, "condition": "Lengkap", "category": "Masak"},
  {"name": "Headlamp", "price_per_day": 8000, "condition": "Baik", "category": "Penerangan"},
  {"name": "Rain Cover", "price_per_day": 5000, "condition": "Waterproof", "category": "Pelindung"}
]',
TRUE, 4.7, 'Survey Cibodas Oktober 2024', '2024-10-14');
