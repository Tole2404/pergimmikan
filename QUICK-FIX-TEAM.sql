-- Quick Fix: Add short_name to teams table
-- Run this in phpMyAdmin SQL tab

-- Check if column exists
SHOW COLUMNS FROM teams LIKE 'short_name';

-- If not exists, add it
ALTER TABLE teams 
ADD COLUMN short_name VARCHAR(50) NULL AFTER name;

-- Verify
DESCRIBE teams;

-- Test
SELECT id, name, short_name FROM teams LIMIT 5;
