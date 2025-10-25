-- Create equipment_rental table
-- Run this to create the table with correct structure

-- Disable FK checks
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS equipment_rental;

CREATE TABLE equipment_rental (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mountain_id INT NOT NULL,
  equipment_name VARCHAR(100) NOT NULL,
  category ENUM('Carrier', 'Tenda', 'Sleeping Bag', 'Kompor', 'Tracking Pole', 'Headlamp', 'Lainnya') DEFAULT 'Lainnya',
  price_per_day INT DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  description TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mountain_id) REFERENCES mountains(id) ON DELETE CASCADE,
  INDEX idx_mountain (mountain_id),
  INDEX idx_category (category),
  INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify structure
DESCRIBE equipment_rental;

-- Optional: Add sample data
-- INSERT INTO equipment_rental (mountain_id, equipment_name, category, price_per_day, stock_quantity, description, is_available)
-- VALUES 
-- (1, 'Carrier 60L Eiger', 'Carrier', 50000, 10, 'Carrier 60L cocok untuk pendakian 2-3 hari', TRUE),
-- (1, 'Tenda Kapasitas 4 Orang', 'Tenda', 75000, 5, 'Tenda dome 4 orang, waterproof', TRUE),
-- (1, 'Sleeping Bag -5°C', 'Sleeping Bag', 35000, 8, 'Sleeping bag untuk suhu dingin', TRUE);
