-- Buat tabel roles untuk menyimpan daftar role
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buat tabel users untuk menyimpan data pengguna
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Menggunakan 255 untuk hash password
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    role_id INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    image_url VARCHAR(255) DEFAULT '/images/team/default-avatar.jpg', -- Default profile image
    bio TEXT, -- Tambahkan kolom bio
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buat tabel profile_images untuk menyimpan history gambar profil
CREATE TABLE profile_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buat tabel login_history untuk mencatat riwayat login
CREATE TABLE login_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL, -- IPv6 bisa mencapai 45 karakter
    user_agent VARCHAR(255), -- Browser dan sistem operasi pengguna
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    login_status ENUM('success', 'failed') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buat tabel failed_login_attempts untuk keamanan
CREATE TABLE failed_login_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attempt_count INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator dengan akses penuh ke sistem'),
('member', 'Anggota tim regular'),
('moderator', 'Moderator dengan akses terbatas'),
('contributor', 'Kontributor konten');

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, role_id, image_url, bio) VALUES
('admin', '$2b$10$YourHashedPasswordHere', 'admin@pergimmikan.com', 'Administrator', 1, '/images/team/default-avatar.jpg', 'Administrator Pergimmikan');

-- Insert sample profile image for admin
INSERT INTO profile_images (user_id, image_url, is_active) VALUES
(1, '/images/team/default-avatar.jpg', true);

-- Buat index untuk optimasi query
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_time ON login_history(login_time);
CREATE INDEX idx_failed_attempts ON failed_login_attempts(username, ip_address);
CREATE INDEX idx_profile_images_user ON profile_images(user_id);
CREATE INDEX idx_profile_images_active ON profile_images(user_id, is_active);

-- Trigger untuk update image_url di users saat menambah profile image baru
DELIMITER //
CREATE TRIGGER after_profile_image_insert
AFTER INSERT ON profile_images
FOR EACH ROW
BEGIN
    -- Set semua image sebelumnya menjadi tidak aktif
    UPDATE profile_images 
    SET is_active = false 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id;
    
    -- Update image_url di users
    UPDATE users 
    SET image_url = NEW.image_url 
    WHERE id = NEW.user_id;
END//
DELIMITER ;
