-- Table: next_destinations
CREATE TABLE IF NOT EXISTS next_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: next_destination_highlights
CREATE TABLE IF NOT EXISTS next_destination_highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    highlight VARCHAR(255) NOT NULL,
    FOREIGN KEY (destination_id) REFERENCES next_destinations(id) ON DELETE CASCADE
);

-- Table: next_destination_costs
CREATE TABLE IF NOT EXISTS next_destination_costs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    accommodation_budget DECIMAL(12, 2),
    accommodation_standard DECIMAL(12, 2),
    accommodation_luxury DECIMAL(12, 2),
    transportation_public DECIMAL(12, 2),
    transportation_private DECIMAL(12, 2),
    transportation_luxury DECIMAL(12, 2),
    food_budget DECIMAL(12, 2),
    food_standard DECIMAL(12, 2),
    food_luxury DECIMAL(12, 2),
    FOREIGN KEY (destination_id) REFERENCES next_destinations(id) ON DELETE CASCADE
);

-- Table: next_activities
CREATE TABLE IF NOT EXISTS next_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    type ENUM('basic', 'premium') DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES next_destinations(id) ON DELETE CASCADE
);

-- Table: next_seasons
CREATE TABLE IF NOT EXISTS next_seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    season_type ENUM('LOW', 'SHOULDER', 'PEAK') NOT NULL,
    months VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES next_destinations(id) ON DELETE CASCADE
);

-- Table: next_transport_from_jakarta
CREATE TABLE IF NOT EXISTS next_transport_from_jakarta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_name VARCHAR(255) NOT NULL,
    flight_economy DECIMAL(12, 2),
    flight_business DECIMAL(12, 2),
    flight_first DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: next_users
CREATE TABLE IF NOT EXISTS next_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: next_user_trips
CREATE TABLE IF NOT EXISTS next_user_trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    destination_id INT,
    duration INT NOT NULL,
    accommodation_type VARCHAR(50) NOT NULL,
    transportation_type VARCHAR(50) NOT NULL,
    flight_class VARCHAR(50) NOT NULL,
    food_preference VARCHAR(50) NOT NULL,
    season VARCHAR(50) NOT NULL,
    group_size INT NOT NULL,
    total_cost DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES next_users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES next_destinations(id) ON DELETE CASCADE
);

-- Table: next_user_trip_activities
CREATE TABLE IF NOT EXISTS next_user_trip_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_trip_id INT,
    activity_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_trip_id) REFERENCES next_user_trips(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES next_activities(id) ON DELETE CASCADE
);

-- Table: next_user_savings
CREATE TABLE IF NOT EXISTS next_user_savings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    savings DECIMAL(12, 2) NOT NULL,
    monthly_savings DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES next_users(id) ON DELETE CASCADE
);
