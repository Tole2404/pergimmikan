-- Savings Tables Migration
-- Run this SQL in your database

-- 1. Savings Accounts Table
CREATE TABLE IF NOT EXISTS savings_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  journey_id INT NULL,
  title VARCHAR(255) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  monthly_target DECIMAL(15,2) NULL,
  target_date DATE NULL,
  auto_debit BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(50) NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Savings Transactions Table
CREATE TABLE IF NOT EXISTS savings_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  savings_account_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type ENUM('deposit', 'withdrawal') DEFAULT 'deposit',
  payment_method VARCHAR(50) NOT NULL,
  payment_id VARCHAR(100) NULL,
  proof_image VARCHAR(255) NULL,
  notes TEXT NULL,
  status ENUM('pending', 'approved', 'rejected', 'failed') DEFAULT 'pending',
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  rejection_reason TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (savings_account_id) REFERENCES savings_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Indexes for better performance
CREATE INDEX idx_savings_user ON savings_accounts(user_id);
CREATE INDEX idx_savings_status ON savings_accounts(status);
CREATE INDEX idx_transactions_account ON savings_transactions(savings_account_id);
CREATE INDEX idx_transactions_user ON savings_transactions(user_id);
CREATE INDEX idx_transactions_status ON savings_transactions(status);
CREATE INDEX idx_transactions_created ON savings_transactions(created_at);

-- 4. Insert sample data (optional)
-- INSERT INTO savings_accounts (user_id, title, target_amount, current_amount, status) 
-- VALUES (1, 'Gunung Rinjani 2025', 3000000, 0, 'active');
