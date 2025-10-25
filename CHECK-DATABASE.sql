-- CHECK DATABASE STRUCTURE
-- Run this in phpMyAdmin to verify everything

-- 1. Check teams table structure
DESCRIBE teams;

-- 2. Check if short_name column exists
SHOW COLUMNS FROM teams LIKE 'short_name';

-- 3. Check social_media table structure
DESCRIBE social_media;

-- 4. Check if view exists and works
SELECT * FROM team_members_view LIMIT 1;

-- 5. Check team ID 26 data
SELECT * FROM teams WHERE id = 26;

-- 6. Check social media for team 26
SELECT * FROM social_media WHERE team_id = 26;

-- 7. Test update query manually
UPDATE teams 
SET name = 'Test Name', short_name = 'Test' 
WHERE id = 26;

-- 8. Verify update
SELECT id, name, short_name, role FROM teams WHERE id = 26;
