-- Add ALL missing columns to mountain_tracks
-- Run each query separately in phpMyAdmin
-- Ignore "Duplicate column" errors

-- 1. Add basecamp_name
ALTER TABLE mountain_tracks ADD COLUMN basecamp_name VARCHAR(100) DEFAULT '';

-- 2. Add basecamp_accommodation_fee
ALTER TABLE mountain_tracks ADD COLUMN basecamp_accommodation_fee INT DEFAULT 10000;

-- 3. Add difficulty
ALTER TABLE mountain_tracks ADD COLUMN difficulty VARCHAR(50) DEFAULT 'Sedang';

-- 4. Add distance_km
ALTER TABLE mountain_tracks ADD COLUMN distance_km DECIMAL(10,2) DEFAULT 0;

-- 5. Add estimated_hours
ALTER TABLE mountain_tracks ADD COLUMN estimated_hours DECIMAL(5,2) DEFAULT 0;

-- 6. Add entrance_fee
ALTER TABLE mountain_tracks ADD COLUMN entrance_fee INT DEFAULT 0;

-- 7. Add guide_fee_per_day
ALTER TABLE mountain_tracks ADD COLUMN guide_fee_per_day INT DEFAULT 0;

-- 8. Add porter_fee_per_day
ALTER TABLE mountain_tracks ADD COLUMN porter_fee_per_day INT DEFAULT 0;

-- 9. Add description
ALTER TABLE mountain_tracks ADD COLUMN description TEXT;

-- 10. Add is_open
ALTER TABLE mountain_tracks ADD COLUMN is_open BOOLEAN DEFAULT TRUE;

-- 11. Add popularity_rank
ALTER TABLE mountain_tracks ADD COLUMN popularity_rank INT DEFAULT 1;

-- Verify structure
DESCRIBE mountain_tracks;
