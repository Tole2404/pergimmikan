-- Add ALL missing columns to transportation_routes
-- Run this if table exists but has wrong structure
-- Note: Will show error if column already exists, that's OK!

-- Add all missing columns one by one (ignore errors if column exists)
ALTER TABLE transportation_routes 
ADD COLUMN to_location VARCHAR(100) DEFAULT '' AFTER from_city;

ALTER TABLE transportation_routes 
ADD COLUMN transport_type ENUM('Bus', 'Travel', 'Kereta', 'Pesawat') DEFAULT 'Bus' AFTER to_location;

ALTER TABLE transportation_routes 
ADD COLUMN distance_km DECIMAL(10,2) DEFAULT 0 AFTER transport_type;

ALTER TABLE transportation_routes 
ADD COLUMN estimated_hours DECIMAL(5,2) DEFAULT 0 AFTER distance_km;

ALTER TABLE transportation_routes 
ADD COLUMN base_price INT DEFAULT 0 AFTER estimated_hours;

ALTER TABLE transportation_routes 
ADD COLUMN is_roundtrip_available BOOLEAN DEFAULT TRUE AFTER base_price;

ALTER TABLE transportation_routes 
ADD COLUMN description TEXT AFTER is_roundtrip_available;

-- Verify structure
DESCRIBE transportation_routes;

-- Show all columns
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'pergimmikan' 
AND TABLE_NAME = 'transportation_routes'
ORDER BY ORDINAL_POSITION;
