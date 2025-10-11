-- Add telegram_id and telegram_username to users table
ALTER TABLE users 
ADD COLUMN telegram_id VARCHAR(50) NULL UNIQUE AFTER email,
ADD COLUMN telegram_username VARCHAR(100) NULL AFTER telegram_id;

-- Add index for faster lookup
CREATE INDEX idx_telegram_id ON users(telegram_id);

-- Sample: Update existing user with telegram ID
-- UPDATE users SET telegram_id = '123456789', telegram_username = '@username' WHERE id = 1;
