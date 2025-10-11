CREATE TABLE activity_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO activity_categories (name) VALUES
('Social'),
('Workshop'),
('Community Service');

CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    status ENUM('upcoming', 'completed') NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES activity_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activity_gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO activities (title, date, time, location, description, category_id, image_url, status) VALUES
(
    'Buka Puasa Bersama 2024',
    '2024-03-15',
    '17:30:00',
    'Warung Kopi Pesisir',
    'Join us for a heartwarming iftar gathering where we''ll share stories, break bread together, and celebrate the spirit of Ramadan.',
    1,
    '/images/activities/bukber-2024.jpg',
    'upcoming'
),
(
    'Photography Night',
    '2024-03-20',
    '19:00:00',
    'Pergimmikan Studio',
    'An evening of sharing photography techniques, editing tips, and stories behind our favorite shots. Bring your camera!',
    2,
    '/images/activities/photo-night.jpg',
    'upcoming'
),
(
    'Beach Cleanup & Photo Walk',
    '2024-04-05',
    '06:00:00',
    'Pantai Ancol',
    'Combine our love for photography with environmental care. Let''s capture beautiful moments while keeping our beaches clean.',
    3,
    '/images/activities/beach-cleanup.jpg',
    'upcoming'
),
(
    'Monthly Coffee & Create',
    '2024-03-08',
    '10:00:00',
    'Kopi Kenangan',
    'Our regular creative meetup. Bring your laptop, camera, or just yourself. Let''s create something amazing together!',
    1,
    '/images/activities/coffee-create.jpg',
    'completed'
);

INSERT INTO activity_gallery (activity_id, image_url, caption) VALUES
(1, '/images/activities/bukber-2024/1.jpg', 'Breaking fast together'),
(1, '/images/activities/bukber-2024/2.jpg', 'Evening prayers'),
(1, '/images/activities/bukber-2024/3.jpg', 'Community gathering'),
(2, '/images/activities/photo-night/1.jpg', 'Learning composition'),
(2, '/images/activities/photo-night/2.jpg', 'Camera settings workshop'),
(2, '/images/activities/photo-night/3.jpg', 'Group photo session'),
(3, '/images/activities/beach-cleanup/1.jpg', 'Morning cleanup'),
(3, '/images/activities/beach-cleanup/2.jpg', 'Beach photography'),
(3, '/images/activities/beach-cleanup/3.jpg', 'Team photo'),
(4, '/images/activities/coffee-create/1.jpg', 'Coffee and cameras'),
(4, '/images/activities/coffee-create/2.jpg', 'Creative discussion'),
(4, '/images/activities/coffee-create/3.jpg', 'Photo review session');
