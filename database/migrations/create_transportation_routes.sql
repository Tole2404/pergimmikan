-- Create transportation_routes table if not exists
CREATE TABLE IF NOT EXISTS transportation_routes (
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

-- Add some sample data (optional)
-- INSERT INTO transportation_routes (mountain_id, from_city, to_location, transport_type, distance_km, estimated_hours, base_price, is_roundtrip_available, description)
-- VALUES 
-- (1, 'Jakarta', 'Terminal Arjosari Malang', 'Bus', 800, 12, 250000, TRUE, 'Bus dari Kampung Rambutan ke Terminal Arjosari'),
-- (1, 'Surabaya', 'Terminal Arjosari Malang', 'Bus', 100, 2, 50000, TRUE, 'Bus dari Terminal Purabaya ke Terminal Arjosari');
