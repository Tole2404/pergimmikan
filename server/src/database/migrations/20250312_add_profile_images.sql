-- Add image_url and bio columns to users table
ALTER TABLE users
ADD COLUMN image_url VARCHAR(255) DEFAULT '/images/team/default-avatar.jpg' AFTER status,
ADD COLUMN bio TEXT AFTER image_url;

-- Create profile_images table
CREATE TABLE profile_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for optimization
CREATE INDEX idx_profile_images_user ON profile_images(user_id);
CREATE INDEX idx_profile_images_active ON profile_images(user_id, is_active);

-- Create trigger to manage profile images
DELIMITER //
CREATE TRIGGER after_profile_image_insert
AFTER INSERT ON profile_images
FOR EACH ROW
BEGIN
    -- Set all previous images to inactive
    UPDATE profile_images 
    SET is_active = false 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id;
    
    -- Update image_url in users table
    UPDATE users 
    SET image_url = NEW.image_url 
    WHERE id = NEW.user_id;
END//
DELIMITER ;

-- Insert default profile images for existing users
INSERT INTO profile_images (user_id, image_url, is_active)
SELECT id, '/images/team/default-avatar.jpg', true
FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM profile_images);

-- Rollback script if needed
-- DROP TRIGGER IF EXISTS after_profile_image_insert;
-- DROP TABLE IF EXISTS profile_images;
-- ALTER TABLE users DROP COLUMN bio;
-- ALTER TABLE users DROP COLUMN image_url;
