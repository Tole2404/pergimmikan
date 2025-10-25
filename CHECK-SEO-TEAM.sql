-- Check SEO settings for team page

-- 1. Check if team SEO exists
SELECT * FROM seo_settings WHERE page_type = 'team';

-- 2. Check all SEO settings
SELECT page_type, title, LEFT(keywords, 100) as keywords_preview 
FROM seo_settings;

-- 3. Update team SEO with member names (if needed)
-- UPDATE seo_settings 
-- SET keywords = 'PERGIMMIKAN team, Tunggul, Zul, Rizki, [add all member names], tim pendaki Indonesia'
-- WHERE page_type = 'team';
