-- Script untuk memperbaiki tabel activities dengan menambahkan AUTO_INCREMENT dan memperbaiki ID yang bernilai 0

-- 1. Tambahkan PRIMARY KEY jika belum ada
ALTER TABLE `activity_gallery` ADD PRIMARY KEY (`id`);

-- 2. Ubah kolom id menjadi AUTO_INCREMENT
ALTER TABLE `activity_gallery` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- 3. Update record dengan id=0 menjadi id yang berurutan
-- Jalankan query berikut berulang kali sampai tidak ada lagi record dengan id=0
UPDATE `activity_gallery` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `activity_gallery`) AS t) WHERE `id` = 0 LIMIT 1;
-- Script untuk memperbaiki tabel activities dengan menambahkan AUTO_INCREMENT dan memperbaiki ID yang bernilai 0

ALTER TABLE `journey_photos` ADD FOREIGN KEY (journey_year_id) REFERENCES journey_years(id) ON DELETE CASCADE;

