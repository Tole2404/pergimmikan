-- Create legacy table
CREATE TABLE legacies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(4) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial legacy data
INSERT INTO legacies (year, title, description) VALUES
('2021', 'The Genesis', 'Where dreamers united to create something extraordinary'),
('2022', 'The Collective Spirit', 'Every frame tells a story, every moment becomes legendary'),
('2023', 'Beyond Boundaries', 'Breaking limits, setting trends, making history together'),
('2024', 'Legacy in Motion', 'Not just capturing moments, but creating timeless memories'),
('2025', 'Future Perfect', 'Innovating the art of visual storytelling, one frame at a time');

-- Add index for better query performance
CREATE INDEX idx_legacy_year ON legacies(year);
