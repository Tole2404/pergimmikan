-- Create events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    max_participants INT DEFAULT NULL,
    registration_deadline DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event_participants table for tracking registrations
CREATE TABLE event_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'cancelled', 'attended') DEFAULT 'registered',
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(iad) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);

-- Insert sample data
INSERT INTO events (title, description, event_date, event_time, location, status, max_participants, registration_deadline)
VALUES 
    ('Gathering Semester Baru', 'Menyambut semester baru dengan kebersamaan dan berbagi cerita', '2025-03-20', '15:00:00', 'Kampus ITS', 'upcoming', 50, '2025-03-19 12:00:00'),
    ('Workshop Photography', 'Belajar teknik fotografi bersama photographer profesional', '2025-04-05', '13:00:00', 'Lab Multimedia', 'upcoming', 30, '2025-04-04 12:00:00'),
    ('Charity Event', 'Berbagi kebahagiaan melalui dokumentasi sosial', '2025-04-15', '09:00:00', 'Taman Bungkul', 'upcoming', 100, '2025-04-14 12:00:00');
