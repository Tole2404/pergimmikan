CREATE TABLE activity_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add foreign key to activities table
ALTER TABLE activities ADD COLUMN category_id INT;
ALTER TABLE activities ADD FOREIGN KEY (category_id) REFERENCES activity_categories(id);
