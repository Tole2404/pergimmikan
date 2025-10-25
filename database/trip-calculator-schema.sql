-- ============================================================================
-- TRIP CALCULATOR DATABASE SCHEMA
-- Comprehensive mountain trip planning system for Indonesia
-- ============================================================================

-- 1. Mountains Master Data
CREATE TABLE mountains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  elevation INT COMMENT 'in meters (mdpl)',
  difficulty ENUM('Mudah', 'Sedang', 'Sulit', 'Sangat Sulit') DEFAULT 'Sedang',
  
  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  basecamp_name VARCHAR(200),
  basecamp_address TEXT,
  
  -- Trip Info
  typical_duration_days INT DEFAULT 2 COMMENT 'Typical trip duration',
  best_months JSON COMMENT 'Best months to climb ["Jan", "Feb", ...]',
  
  -- Costs (base estimates in IDR)
  entrance_fee INT DEFAULT 0,
  entrance_fee_source VARCHAR(255) COMMENT 'Source/reference for entrance fee',
  simaksi_fee INT DEFAULT 0 COMMENT 'Permit fee',
  simaksi_fee_source VARCHAR(255),
  parking_fee INT DEFAULT 0,
  porter_fee_per_day INT DEFAULT 0,
  porter_fee_source VARCHAR(255) COMMENT 'Porter price reference',
  guide_fee_per_day INT DEFAULT 0,
  guide_fee_source VARCHAR(255) COMMENT 'Guide price reference',
  price_last_updated DATE COMMENT 'Last price update date',
  
  -- Description
  description TEXT,
  highlights JSON COMMENT 'Key highlights',
  image_url VARCHAR(255),
  
  -- Meta
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_province (province),
  INDEX idx_difficulty (difficulty),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. Transportation Routes
CREATE TABLE transportation_routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  
  -- Origin
  from_city VARCHAR(100) NOT NULL COMMENT 'Jakarta, Bandung, Surabaya, etc',
  
  -- Transportation
  transport_type ENUM('Pesawat', 'Kereta', 'Bus', 'Travel', 'Mobil Pribadi') NOT NULL,
  transport_name VARCHAR(200) COMMENT 'Airline/Bus company name',
  
  -- Route Details
  route_description TEXT COMMENT 'Detailed route',
  duration_hours DECIMAL(4,1) COMMENT 'Travel time in hours',
  distance_km INT,
  
  -- Costs
  cost_min INT COMMENT 'Minimum cost in IDR',
  cost_max INT COMMENT 'Maximum cost in IDR',
  cost_notes TEXT COMMENT 'Cost breakdown/notes',
  
  -- Schedule
  departure_times JSON COMMENT 'Available departure times',
  frequency VARCHAR(100) COMMENT 'Daily, 3x/week, etc',
  
  -- Booking
  booking_url VARCHAR(255),
  booking_phone VARCHAR(50),
  
  -- Meta
  is_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE,
  INDEX idx_from_city (from_city),
  INDEX idx_transport_type (transport_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. Local Transportation (from city to basecamp)
CREATE TABLE local_transportation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  
  -- Route
  from_location VARCHAR(200) NOT NULL COMMENT 'Station/Terminal/Airport',
  to_location VARCHAR(200) NOT NULL COMMENT 'Basecamp/Village',
  
  -- Transportation
  transport_type ENUM('Ojek', 'Angkot', 'Travel', 'Sewa Mobil', 'Jalan Kaki') NOT NULL,
  
  -- Details
  duration_minutes INT,
  distance_km DECIMAL(5,1),
  cost_per_person INT,
  cost_notes TEXT,
  
  -- Availability
  operating_hours VARCHAR(100),
  availability_notes TEXT,
  
  -- Meta
  is_recommended BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Equipment Rental
CREATE TABLE equipment_rental (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  
  -- Rental Location
  rental_name VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  contact_phone VARCHAR(50),
  contact_whatsapp VARCHAR(50),
  website_url VARCHAR(255) COMMENT 'Official website',
  
  -- Equipment Items
  items JSON COMMENT 'Array of {name, price_per_day, deposit, condition}',
  
  -- Package Deals
  package_name VARCHAR(200),
  package_items JSON,
  package_price INT,
  
  -- Terms
  rental_terms TEXT,
  deposit_required INT,
  price_source VARCHAR(255) COMMENT 'Price reference/source',
  price_last_updated DATE,
  
  -- Meta
  is_recommended BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Food & Consumption Estimates
CREATE TABLE food_estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  duration_days INT NOT NULL,
  
  -- Meal Costs (per person per day)
  breakfast_cost INT DEFAULT 15000,
  lunch_cost INT DEFAULT 20000,
  dinner_cost INT DEFAULT 20000,
  snack_cost INT DEFAULT 10000,
  water_cost INT DEFAULT 5000,
  
  -- Notes
  food_availability TEXT COMMENT 'Warung di basecamp, bawa dari kota, dll',
  recommendations TEXT,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mountain_duration (mountain_id, duration_days)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. Accommodation Options
CREATE TABLE accommodations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  
  -- Accommodation Details
  name VARCHAR(200) NOT NULL,
  type ENUM('Hotel', 'Homestay', 'Camping Ground', 'Basecamp', 'Villa') NOT NULL,
  location VARCHAR(200),
  
  -- Pricing
  price_per_night INT,
  price_notes TEXT,
  
  -- Facilities
  facilities JSON COMMENT 'WiFi, Hot Water, Breakfast, etc',
  
  -- Contact
  contact_phone VARCHAR(50),
  contact_whatsapp VARCHAR(50),
  booking_url VARCHAR(255),
  
  -- Rating
  rating DECIMAL(2,1),
  reviews_count INT DEFAULT 0,
  
  -- Meta
  is_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. Trip Itineraries (Sample/Template)
CREATE TABLE trip_itineraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mountain_id INT NOT NULL,
  duration_days INT NOT NULL,
  
  -- Itinerary
  title VARCHAR(200) NOT NULL,
  description TEXT,
  itinerary_detail JSON COMMENT 'Day by day schedule',
  
  -- Difficulty
  difficulty_level ENUM('Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'),
  fitness_required VARCHAR(100),
  
  -- Recommendations
  best_for JSON COMMENT 'Pemula, Keluarga, Solo, Group, etc',
  tips TEXT,
  
  -- Meta
  is_popular BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 8. User Trip Calculations (Save user calculations)
CREATE TABLE trip_calculations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- User Info (optional)
  user_id INT NULL,
  user_email VARCHAR(255),
  
  -- Trip Details
  mountain_id INT NOT NULL,
  from_city VARCHAR(100) NOT NULL,
  
  -- Group
  num_people INT NOT NULL DEFAULT 1,
  duration_days INT NOT NULL,
  
  -- Preferences
  transport_type VARCHAR(50),
  need_guide BOOLEAN DEFAULT FALSE,
  need_porter BOOLEAN DEFAULT FALSE,
  need_equipment_rental BOOLEAN DEFAULT FALSE,
  need_accommodation BOOLEAN DEFAULT FALSE,
  
  -- Calculated Costs (JSON for breakdown)
  cost_breakdown JSON COMMENT 'Detailed cost breakdown',
  total_cost INT NOT NULL,
  cost_per_person INT NOT NULL,
  
  -- Itinerary
  selected_itinerary_id INT NULL,
  custom_notes TEXT,
  
  -- Tracking
  calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_date TIMESTAMP NULL,
  
  FOREIGN KEY (mountain_id) REFERENCES mountains(id),
  FOREIGN KEY (selected_itinerary_id) REFERENCES trip_itineraries(id),
  INDEX idx_calculation_date (calculation_date),
  INDEX idx_mountain (mountain_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. Equipment Checklist Template
CREATE TABLE equipment_checklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Category
  category ENUM('Pakaian', 'Peralatan Tidur', 'Peralatan Masak', 'Navigasi', 'P3K', 'Lain-lain') NOT NULL,
  
  -- Item
  item_name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Priority
  priority ENUM('Wajib', 'Penting', 'Opsional') DEFAULT 'Penting',
  
  -- Difficulty Level
  for_difficulty JSON COMMENT 'Which difficulty levels need this',
  
  -- Rental Info
  can_be_rented BOOLEAN DEFAULT FALSE,
  typical_rental_price INT,
  typical_purchase_price INT,
  
  -- Meta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_mountains_province_difficulty ON mountains(province, difficulty);
CREATE INDEX idx_transportation_mountain_city ON transportation_routes(mountain_id, from_city);
CREATE INDEX idx_calculations_mountain_date ON trip_calculations(mountain_id, calculation_date);

