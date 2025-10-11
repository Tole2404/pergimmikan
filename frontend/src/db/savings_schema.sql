-- Schema Database untuk Aplikasi Tabungan PERGIMMIKAN

-- Tabel savings untuk menyimpan data tabungan
CREATE TABLE savings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  receipt_url VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  admin_id INT,
  admin_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index untuk pencarian yang sering dilakukan
CREATE INDEX idx_user_savings ON savings(user_id);
CREATE INDEX idx_savings_status ON savings(status);
CREATE INDEX idx_transaction_date ON savings(transaction_date);

-- Tabel untuk Log Perubahan Status (tambahan)
CREATE TABLE savings_status_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    savings_id INT NOT NULL,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_by INT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (savings_id) REFERENCES savings(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Stored Procedure untuk Melihat Total Tabungan per Anggota
DELIMITER //
CREATE PROCEDURE GetMemberSavings(IN member_id INT)
BEGIN
    SELECT 
        u.username,
        u.full_name,
        u.image_url,
        SUM(CASE WHEN s.status = 'approved' THEN s.amount ELSE 0 END) AS total_approved,
        SUM(CASE WHEN s.status = 'pending' THEN s.amount ELSE 0 END) AS total_pending,
        COUNT(CASE WHEN s.status = 'approved' THEN 1 END) AS approved_count,
        COUNT(CASE WHEN s.status = 'pending' THEN 1 END) AS pending_count
    FROM 
        users u
    LEFT JOIN 
        savings s ON u.id = s.user_id
    WHERE 
        u.id = member_id
    GROUP BY 
        u.id;
END //
DELIMITER ;

-- Stored Procedure untuk Melihat Riwayat Tabungan per Anggota
DELIMITER //
CREATE PROCEDURE GetMemberSavingsHistory(IN member_id INT, IN limit_count INT)
BEGIN
    SELECT 
        s.id,
        s.amount,
        s.description,
        s.receipt_url,
        s.status,
        s.transaction_date,
        s.created_at,
        s.admin_notes,
        a.username as admin_username
    FROM 
        savings s
    LEFT JOIN 
        users a ON s.admin_id = a.id
    WHERE 
        s.user_id = member_id
    ORDER BY 
        s.created_at DESC
    LIMIT limit_count;
END //
DELIMITER ;

-- Trigger untuk Log Perubahan Status Tabungan
DELIMITER //
CREATE TRIGGER savings_status_log
AFTER UPDATE ON savings
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO savings_status_log (savings_id, old_status, new_status, changed_by, change_date)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.admin_id, NOW());
    END IF;
END //
DELIMITER ;

-- Contoh Data Dummy untuk Testing (menggunakan ID user yang sudah ada)
INSERT INTO savings (user_id, amount, description, receipt_url, status, transaction_date) VALUES
(1, 150000, 'Setoran pribadi', '/images/receipts/receipt1.jpg', 'approved', '2023-10-15'),
(1, 250000, 'Bonus akhir tahun', '/images/receipts/receipt2.jpg', 'approved', '2023-11-22'),
(2, 300000, 'Setoran bulanan', '/images/receipts/receipt3.jpg', 'approved', '2024-01-05'),
(2, 200000, 'Tabungan mingguan', '/images/receipts/receipt4.jpg', 'pending', '2024-02-12'),
(3, 500000, 'Tabungan THR', '/images/receipts/receipt5.jpg', 'pending', '2024-03-01');
