-- Add basecamp_accommodation_fee column to mountains table
-- This stores the accommodation fee per person per night at the basecamp

ALTER TABLE mountains 
ADD COLUMN basecamp_accommodation_fee INT DEFAULT 10000 AFTER basecamp_name;

-- Update existing records with default value
UPDATE mountains 
SET basecamp_accommodation_fee = 10000 
WHERE basecamp_accommodation_fee IS NULL;

-- Add comment to column
ALTER TABLE mountains 
MODIFY COLUMN basecamp_accommodation_fee INT DEFAULT 10000 
COMMENT 'Accommodation fee per person per night at basecamp (in IDR)';
