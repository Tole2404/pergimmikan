-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(255) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_title VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default quote
INSERT INTO quotes (text, author_name, author_title, is_featured) VALUES 
('Life is not about the moments we capture, but the stories we create together.', 'Pergimmikan', 'Est. 2021', true);
