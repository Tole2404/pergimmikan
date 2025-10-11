-- Create galleries table
CREATE TABLE galleries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caption VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create gallery_images table for multiple images per gallery
CREATE TABLE gallery_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    gallery_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE
);

-- Create tags table for categorizing galleries
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create junction table for gallery-tag relationship
CREATE TABLE gallery_tags (
    gallery_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (gallery_id, tag_id),
    FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_galleries_date ON galleries(date);
CREATE INDEX idx_gallery_images_gallery_id ON gallery_images(gallery_id);
CREATE INDEX idx_gallery_tags_gallery_id ON gallery_tags(gallery_id);
CREATE INDEX idx_gallery_tags_tag_id ON gallery_tags(tag_id);

-- Insert sample data
INSERT INTO galleries (caption, date, author) VALUES
('Summer Gathering', '2021-06-15', 'John'),
('Winter Adventure', '2022-12-20', 'Sarah'),
('Spring Festival', '2022-03-25', 'Mike'),
('Beach Escape', '2023-07-10', 'Emma'),
('Mountain Trip', '2023-08-05', 'David'),
('Night Stories', '2024-01-15', 'Lisa');

-- Insert sample tags
INSERT INTO tags (name) VALUES
('Event'),
('Nature'),
('Adventure'),
('Gathering'),
('Festival');

-- Insert sample gallery images
INSERT INTO gallery_images (gallery_id, image_url, is_main) VALUES
(1, '/images/gallery/moment1.jpeg', true),
(2, '/images/gallery/moment1.jpeg', true),
(3, '/images/gallery/moment1.jpeg', true),
(4, '/images/gallery/moment1.jpeg', true),
(5, '/images/gallery/moment1.jpeg', true),
(6, '/images/gallery/moment1.jpeg', true);

-- Link galleries with tags
INSERT INTO gallery_tags (gallery_id, tag_id) VALUES
(1, 1), -- Summer Gathering - Event
(1, 4), -- Summer Gathering - Gathering
(2, 3), -- Winter Adventure - Adventure
(3, 5), -- Spring Festival - Festival
(4, 2), -- Beach Escape - Nature
(5, 2), -- Mountain Trip - Nature
(5, 3), -- Mountain Trip - Adventure
(6, 1); -- Night Stories - Event
