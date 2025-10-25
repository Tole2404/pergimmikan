-- Simple ALTER without any INFORMATION_SCHEMA queries
-- Run each statement separately, ignore "Duplicate column" errors

-- 1. Add to_location
ALTER TABLE transportation_routes ADD COLUMN to_location VARCHAR(100) DEFAULT '';

-- 2. Add transport_type
ALTER TABLE transportation_routes ADD COLUMN transport_type ENUM('Bus', 'Travel', 'Kereta', 'Pesawat') DEFAULT 'Bus';

-- 3. Add distance_km
ALTER TABLE transportation_routes ADD COLUMN distance_km DECIMAL(10,2) DEFAULT 0;

-- 4. Add estimated_hours
ALTER TABLE transportation_routes ADD COLUMN estimated_hours DECIMAL(5,2) DEFAULT 0;

-- 5. Add base_price
ALTER TABLE transportation_routes ADD COLUMN base_price INT DEFAULT 0;

-- 6. Add is_roundtrip_available
ALTER TABLE transportation_routes ADD COLUMN is_roundtrip_available BOOLEAN DEFAULT TRUE;

-- 7. Add description
ALTER TABLE transportation_routes ADD COLUMN description TEXT;

-- Check result
DESCRIBE transportation_routes;
