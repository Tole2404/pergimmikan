-- FIX: View definer error
-- Run this in phpMyAdmin SQL tab

-- 1. Drop old view
DROP VIEW IF EXISTS team_members_view;

-- 2. Recreate view with current user
CREATE VIEW team_members_view AS
SELECT 
  t.id,
  t.name,
  t.short_name,
  t.role,
  t.image_url,
  t.description,
  t.status,
  t.created_at,
  t.updated_at,
  MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) as linkedin,
  MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) as github,
  MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) as instagram
FROM teams t
LEFT JOIN social_media sm ON t.id = sm.team_id
GROUP BY t.id, t.name, t.short_name, t.role, t.image_url, t.description, t.status, t.created_at, t.updated_at;

-- 3. Test view
SELECT * FROM team_members_view LIMIT 5;
