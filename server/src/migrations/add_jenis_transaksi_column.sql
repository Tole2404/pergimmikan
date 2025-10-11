-- Migrasi untuk menambahkan kolom jenis_transaksi pada tabel savings
ALTER TABLE savings ADD COLUMN jenis_transaksi ENUM('setoran', 'penarikan') DEFAULT 'setoran' AFTER status;

-- Update data yang sudah ada
UPDATE savings SET jenis_transaksi = 'setoran' WHERE jenis_transaksi IS NULL;
