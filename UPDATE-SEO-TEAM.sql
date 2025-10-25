-- UPDATE SEO SETTINGS FOR TEAM PAGE
-- Copy keywords dari output script, atau gunakan template di bawah

-- 1. Check current SEO
SELECT page_type, title, keywords, description FROM seo_settings WHERE page_type = 'team';

-- 2. UPDATE dengan keywords lengkap
UPDATE seo_settings 
SET 
  title = 'Tim PERGIMMIKAN - Anggota Petualang dan Pendaki Gunung Indonesia',
  
  description = 'Kenali tim PERGIMMIKAN: komunitas petualang dan pendaki gunung Indonesia yang solid dan berpengalaman. Terdiri dari fotografer, videografer, pendaki, dan travel enthusiast yang siap berbagi cerita petualangan.',
  
  keywords = 'PERGIMMIKAN team, tim PERGIMMIKAN, Tunggul Rayu Kusuma, Deva Satya Ramadhan, Akbar Hidayatullah, Fransiskus Akli Jebadu, Muhammad Darryl Fauzi, Miraj Diamond Suradachi, Indra Arifin, Zaki Syifa Naygroho, Zul Widya Pratiwi, Lia Agustin Pratiwi, Fadia Nurmasri, Tunggul, Deva, Akbar, Darryl, Miraj, Indra, Zaki, Zul, Lia, Fadia, anggota PERGIMMIKAN, team pendaki PERGIMMIKAN, Ketua PERGIMMIKAN, Member PERGIMMIKAN, Momi PERGIMMIKAN, komunitas pendaki Indonesia, tim petualang Indonesia, pendaki gunung Indonesia, traveling Indonesia, adventure team Indonesia, komunitas outdoor Indonesia, fotografer petualangan, videografer outdoor, dokumentasi perjalanan, cerita pendakian, trip organizer Indonesia, komunitas anak muda petualang, hiking team Indonesia, mountain climbing Indonesia, outdoor adventure Indonesia, backpacker Indonesia, nature photography Indonesia, travel blogger Indonesia, petualangan alam Indonesia, pendaki Semeru, pendaki Rinjani, pendaki Bromo, tim ekspedisi gunung, komunitas pecinta alam, adventure photographer Indonesia, outdoor videographer, travel content creator, pendakian gunung Jawa, pendakian gunung Sumatera, pendakian gunung Bali, komunitas traveling, group hiking Indonesia, tim adventure Indonesia',
  
  og_title = 'Tim PERGIMMIKAN - Komunitas Petualang Indonesia',
  
  og_description = 'Kenali anggota tim PERGIMMIKAN: Tunggul, Deva, Akbar, Darryl, Miraj, Indra, Zaki, Zul, Lia, Fadia dan lainnya. Komunitas petualang dan pendaki gunung Indonesia.',
  
  canonical_url = 'https://pergimmikan.site/team',
  
  is_active = 1

WHERE page_type = 'team';

-- 3. Verify update
SELECT page_type, title, LEFT(keywords, 200) as keywords_preview FROM seo_settings WHERE page_type = 'team';

-- 4. Check if keywords include member names
SELECT 
  page_type,
  CASE 
    WHEN keywords LIKE '%Tunggul%' THEN '✅ Tunggul found'
    ELSE '❌ Tunggul not found'
  END as tunggul_check,
  CASE 
    WHEN keywords LIKE '%Zul%' THEN '✅ Zul found'
    ELSE '❌ Zul not found'
  END as zul_check,
  CASE 
    WHEN keywords LIKE '%Fadia%' THEN '✅ Fadia found'
    ELSE '❌ Fadia not found'
  END as fadia_check
FROM seo_settings 
WHERE page_type = 'team';
