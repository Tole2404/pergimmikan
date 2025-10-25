-- Fix transportation_routes table structure
-- Drop and recreate with correct columns

-- First, find and drop tables that reference transportation_routes
DROP TABLE IF EXISTS transport_operators;
DROP TABLE IF EXISTS transportation_bookings;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS transportation_routes;

CREATE TABLE transportation_routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mountain_id INT NOT NULL,
  from_city VARCHAR(100) NOT NULL,
  to_location VARCHAR(100) NOT NULL,
  transport_type ENUM('Bus', 'Travel', 'Kereta', 'Pesawat') DEFAULT 'Bus',
  distance_km DECIMAL(10,2) DEFAULT 0,
  estimated_hours DECIMAL(5,2) DEFAULT 0,
  base_price INT DEFAULT 0,
  is_roundtrip_available BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE,
  INDEX idx_mountain (mountain_id),
  INDEX idx_from_city (from_city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify structure
DESCRIBE transportation_routes;
