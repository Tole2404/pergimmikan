-- MySQL Schema for Featured Journeys
-- This schema creates the necessary table to support the featured journeys functionality

-- Create featured_journeys table
CREATE TABLE featured_journeys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    link VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    duration INT COMMENT 'Duration in days',
    difficulty ENUM('Easy', 'Moderate', 'Hard', 'Extreme'),
    category ENUM('Mountain', 'Beach', 'Underwater', 'Forest', 'Cultural', 'Other'),
    featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (translated to English)
INSERT INTO featured_journeys (title, description, image_path, link, year, month, location, latitude, longitude, duration, difficulty, category) 
VALUES 
(
    'Mount Bromo', 
    'Explore the beauty of Mount Bromo with spectacular sunrise views',
    '/images/featured/bromo.jpg',
    '/journey/1',
    2024, 
    3,
    'East Java, Indonesia',
    -7.9425,
    112.9530,
    3,
    'Moderate',
    'Mountain'
),
(
    'Komodo Island', 
    'Adventure to the Komodo dragon habitat and exotic beaches in Flores',
    '/images/featured/komodo.jpg',
    '/journey/2',
    2023,
    8,
    'East Nusa Tenggara, Indonesia',
    -8.5852,
    119.4413,
    5,
    'Moderate',
    'Beach'
),
(
    'Raja Ampat', 
    'Underwater paradise with stunning coral reefs and amazing marine life',
    '/images/featured/raja-ampat.jpg',
    '/journey/3',
    2023,
    11,
    'West Papua, Indonesia',
    -0.5000,
    130.5000,
    7,
    'Hard',
    'Underwater'
);
