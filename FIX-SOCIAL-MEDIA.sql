-- Check and fix social_media table structure

-- 1. Check current structure
DESCRIBE social_media;

-- 2. Check for problematic data
SELECT * FROM social_media WHERE team_id = 0 OR team_id IS NULL OR team_id = '';

-- 3. Check primary key and auto_increment
SHOW CREATE TABLE social_media;

-- 4. Clean up any invalid entries
DELETE FROM social_media WHERE team_id = 0 OR team_id IS NULL OR url = '' OR url IS NULL;
DELETE FROM social_media WHERE url IN ('a', 'A', 'aa', 'aaa') OR LENGTH(url) < 5;

-- 5. FIX AUTO_INCREMENT - Reset to proper value
-- Get the max ID first
SELECT MAX(id) FROM social_media;

-- Then reset auto_increment to max + 1
-- Replace XXX with the max ID + 1 from query above
-- Example: if max is 150, use 151
ALTER TABLE social_media AUTO_INCREMENT = 1;

-- OR automatically set to max + 1:
SET @max_id = (SELECT IFNULL(MAX(id), 0) + 1 FROM social_media);
SET @alter_query = CONCAT('ALTER TABLE social_media AUTO_INCREMENT = ', @max_id);
PREPARE stmt FROM @alter_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. Verify auto_increment value
SELECT AUTO_INCREMENT 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'social_media';

-- 7. Test insert
-- INSERT INTO social_media (team_id, platform, url) VALUES (1, 'test', 'https://test.com');
-- SELECT * FROM social_media ORDER BY id DESC LIMIT 1;
-- DELETE FROM social_media WHERE platform = 'test';

-- 8. Verify final data
SELECT COUNT(*) as total_social_links FROM social_media;
SELECT id, team_id, platform, url FROM social_media ORDER BY id DESC LIMIT 10;
