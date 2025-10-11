-- Insert some dummy data for testing
INSERT INTO `savings` 
(`user_id`, `amount`, `description`, `receipt_url`, `status`, `transaction_date`, `admin_id`, `admin_notes`)
VALUES
(1, 250000, 'Tabungan Bulanan Januari', '/images/receipts/dummy_receipt_1.jpg', 'approved', '2025-01-15', 2, 'Sudah terverifikasi dan dicatat'),
(1, 300000, 'Tabungan Bulanan Februari', '/images/receipts/dummy_receipt_2.jpg', 'approved', '2025-02-15', 2, 'Verifikasi lengkap'),
(1, 350000, 'Tabungan Bulanan Maret', '/images/receipts/dummy_receipt_3.jpg', 'pending', '2025-03-15', NULL, NULL),
(2, 400000, 'Setoran Awal', '/images/receipts/dummy_receipt_4.jpg', 'approved', '2025-01-05', 2, 'OK'),
(2, 200000, 'Tabungan Rutin', '/images/receipts/dummy_receipt_5.jpg', 'rejected', '2025-02-10', 2, 'Bukti transfer tidak jelas'),
(3, 500000, 'Tabungan Semester', '/images/receipts/dummy_receipt_6.jpg', 'approved', '2025-01-20', 2, ''),
(3, 500000, 'Tabungan Semester 2', '/images/receipts/dummy_receipt_7.jpg', 'pending', '2025-03-01', NULL, NULL),
(4, 150000, 'Tabungan Minggu 1', '/images/receipts/dummy_receipt_8.jpg', 'approved', '2025-01-07', 2, 'Verified'),
(4, 150000, 'Tabungan Minggu 2', '/images/receipts/dummy_receipt_9.jpg', 'approved', '2025-01-14', 2, 'Verified'),
(4, 150000, 'Tabungan Minggu 3', '/images/receipts/dummy_receipt_10.jpg', 'approved', '2025-01-21', 2, 'Verified');
