-- ============================================================================
-- ADD PRICE SOURCE COLUMNS - Safe Update (No Data Loss)
-- ============================================================================
-- Run this BEFORE running REAL-PRICES-UPDATE.sql
-- ============================================================================

-- Add columns to mountains table
ALTER TABLE mountains 
ADD COLUMN IF NOT EXISTS entrance_fee_source VARCHAR(255) COMMENT 'Source/reference for entrance fee' AFTER entrance_fee,
ADD COLUMN IF NOT EXISTS simaksi_fee_source VARCHAR(255) AFTER simaksi_fee,
ADD COLUMN IF NOT EXISTS porter_fee_source VARCHAR(255) COMMENT 'Porter price reference' AFTER porter_fee_per_day,
ADD COLUMN IF NOT EXISTS guide_fee_source VARCHAR(255) COMMENT 'Guide price reference' AFTER guide_fee_per_day,
ADD COLUMN IF NOT EXISTS price_last_updated DATE COMMENT 'Last price update date' AFTER guide_fee_source;

-- Add columns to equipment_rental table
ALTER TABLE equipment_rental
ADD COLUMN IF NOT EXISTS website_url VARCHAR(255) COMMENT 'Official website' AFTER contact_whatsapp,
ADD COLUMN IF NOT EXISTS price_source VARCHAR(255) COMMENT 'Price reference/source' AFTER deposit_required,
ADD COLUMN IF NOT EXISTS price_last_updated DATE AFTER price_source;

-- Add columns to transportation_routes table
ALTER TABLE transportation_routes
ADD COLUMN IF NOT EXISTS booking_info TEXT COMMENT 'How to book this transport' AFTER frequency;

-- Add columns to local_transportation table
ALTER TABLE local_transportation
ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255) COMMENT 'Contact info for booking' AFTER availability_notes;

-- Verify columns added
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'pergimmikan' 
  AND TABLE_NAME = 'mountains' 
  AND COLUMN_NAME LIKE '%source%';

SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'pergimmikan' 
  AND TABLE_NAME = 'transportation_routes' 
  AND COLUMN_NAME = 'booking_info';

SELECT 'All columns added successfully!' AS Status;
