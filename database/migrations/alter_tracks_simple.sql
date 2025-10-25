-- Add basecamp columns to mountain_tracks
-- Run in phpMyAdmin or MySQL CLI
-- Ignore "Duplicate column" errors

-- Add basecamp_name
ALTER TABLE mountain_tracks ADD COLUMN basecamp_name VARCHAR(100) DEFAULT '';

-- Add basecamp_accommodation_fee
ALTER TABLE mountain_tracks ADD COLUMN basecamp_accommodation_fee INT DEFAULT 10000;

-- Check result
DESCRIBE mountain_tracks;
