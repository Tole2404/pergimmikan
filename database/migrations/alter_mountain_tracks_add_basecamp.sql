-- Add basecamp columns to mountain_tracks table
-- Run each statement separately, ignore "Duplicate column" errors

-- 1. Add basecamp_name
ALTER TABLE mountain_tracks ADD COLUMN basecamp_name VARCHAR(100) DEFAULT '';

-- 2. Add basecamp_accommodation_fee
ALTER TABLE mountain_tracks ADD COLUMN basecamp_accommodation_fee INT DEFAULT 10000;

-- Verify structure
DESCRIBE mountain_tracks;

-- Show all columns
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'pergimmikan' 
AND TABLE_NAME = 'mountain_tracks'
ORDER BY ORDINAL_POSITION;
