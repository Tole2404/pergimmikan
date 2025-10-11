-- Migrasi untuk mengizinkan kolom receipt_url bernilai NULL
ALTER TABLE savings MODIFY COLUMN receipt_url VARCHAR(255) NULL;
