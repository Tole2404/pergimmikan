-- ============================================================================
-- ENTRANCE FEES & SIMAKSI - BIAYA MASUK & IZIN PENDAKIAN
-- ============================================================================
-- Data real dari berbagai sumber resmi (Oktober 2024)
-- ============================================================================

-- Update entrance_fee di mountain_tracks table
-- Harga sudah termasuk di track data, tapi ini untuk update jika ada perubahan

-- ============================================================================
-- RINJANI (TAMAN NASIONAL GUNUNG RINJANI)
-- ============================================================================
-- SIMAKSI wajib, harga berbeda WNI dan WNA

UPDATE mountain_tracks SET 
  entrance_fee = 150000,
  entrance_fee_source = 'BTNGR (Balai Taman Nasional Gunung Rinjani) 2024'
WHERE mountain_id = 1 AND track_code = 'SMB'; -- Sembalun

UPDATE mountain_tracks SET 
  entrance_fee = 150000,
  entrance_fee_source = 'BTNGR (Balai Taman Nasional Gunung Rinjani) 2024'
WHERE mountain_id = 1 AND track_code = 'SNR'; -- Senaru

-- Note: WNA = Rp 250.000 (weekday), Rp 300.000 (weekend)

-- ============================================================================
-- SEMERU (TAMAN NASIONAL BROMO TENGGER SEMERU)
-- ============================================================================
-- SIMAKSI wajib + kuota harian (max 500 orang/hari)

UPDATE mountain_tracks SET 
  entrance_fee = 32000,
  entrance_fee_source = 'TNBTS (Taman Nasional Bromo Tengger Semeru) 2024'
WHERE mountain_id = 2 AND track_code = 'RNP'; -- Ranupane

UPDATE mountain_tracks SET 
  entrance_fee = 32000,
  entrance_fee_source = 'TNBTS (Taman Nasional Bromo Tengger Semeru) 2024'
WHERE mountain_id = 2 AND track_code = 'BRN'; -- Burno

-- Note: Booking online wajib via https://kunjung.tnbts.id
-- Kuota: 500 pendaki/hari (weekday), 600 pendaki/hari (weekend)

-- ============================================================================
-- MERAPI (TAMAN NASIONAL GUNUNG MERAPI)
-- ============================================================================
-- Tidak ada SIMAKSI resmi, tapi ada retribusi desa

UPDATE mountain_tracks SET 
  entrance_fee = 25000,
  entrance_fee_source = 'Retribusi Desa Selo 2024'
WHERE mountain_id = 3 AND track_code = 'SLO'; -- Selo

UPDATE mountain_tracks SET 
  entrance_fee = 30000,
  entrance_fee_source = 'Retribusi Desa Kaliurang 2024'
WHERE mountain_id = 3 AND track_code = 'KLU'; -- Kaliurang

UPDATE mountain_tracks SET 
  entrance_fee = 25000,
  entrance_fee_source = 'Retribusi Desa Babadan 2024'
WHERE mountain_id = 3 AND track_code = 'BBD'; -- Babadan

-- Note: Status Merapi berubah-ubah, cek BPPTKG sebelum mendaki

-- ============================================================================
-- BROMO (TAMAN NASIONAL BROMO TENGGER SEMERU)
-- ============================================================================

UPDATE mountain_tracks SET 
  entrance_fee = 29000,
  entrance_fee_source = 'TNBTS 2024 (Weekday)'
WHERE mountain_id = 4; -- Semua jalur Bromo

-- Note: Weekend = Rp 34.000, WNA = Rp 320.000

-- ============================================================================
-- MERBABU (TAMAN NASIONAL GUNUNG MERBABU)
-- ============================================================================
-- SIMAKSI wajib via online

UPDATE mountain_tracks SET 
  entrance_fee = 20000,
  entrance_fee_source = 'TNGM (Taman Nasional Gunung Merbabu) 2024'
WHERE mountain_id = 5 AND track_code = 'SLO'; -- Selo

UPDATE mountain_tracks SET 
  entrance_fee = 20000,
  entrance_fee_source = 'TNGM (Taman Nasional Gunung Merbabu) 2024'
WHERE mountain_id = 5 AND track_code = 'WKS'; -- Wekas

UPDATE mountain_tracks SET 
  entrance_fee = 20000,
  entrance_fee_source = 'TNGM (Taman Nasional Gunung Merbabu) 2024'
WHERE mountain_id = 5 AND track_code = 'CTL'; -- Cunthel

UPDATE mountain_tracks SET 
  entrance_fee = 20000,
  entrance_fee_source = 'TNGM (Taman Nasional Gunung Merbabu) 2024'
WHERE mountain_id = 5 AND track_code = 'TKL'; -- Thekelan

UPDATE mountain_tracks SET 
  entrance_fee = 20000,
  entrance_fee_source = 'TNGM (Taman Nasional Gunung Merbabu) 2024'
WHERE mountain_id = 5 AND track_code = 'SWT'; -- Suwanting

-- Note: Booking via https://merbabu.tngunungmerbabu.id
-- Kuota: Berbeda per jalur

-- ============================================================================
-- LAWU (TAHURA RADEN SOERJO)
-- ============================================================================

UPDATE mountain_tracks SET 
  entrance_fee = 15000,
  entrance_fee_source = 'Retribusi Cemoro Sewu 2024'
WHERE mountain_id = 6 AND track_code = 'CMS'; -- Cemoro Sewu

UPDATE mountain_tracks SET 
  entrance_fee = 15000,
  entrance_fee_source = 'Retribusi Candi Cetho 2024'
WHERE mountain_id = 6 AND track_code = 'CCT'; -- Candi Cetho

-- ============================================================================
-- SINDORO (PERHUTANI)
-- ============================================================================

UPDATE mountain_tracks SET 
  entrance_fee = 25000,
  entrance_fee_source = 'Retribusi Kledung Pass 2024'
WHERE mountain_id = 7 AND track_code = 'KLD'; -- Kledung

UPDATE mountain_tracks SET 
  entrance_fee = 25000,
  entrance_fee_source = 'Retribusi Sigedang 2024'
WHERE mountain_id = 7 AND track_code = 'SGD'; -- Sigedang

-- ============================================================================
-- SUMBING (PERHUTANI)
-- ============================================================================

UPDATE mountain_tracks SET 
  entrance_fee = 25000,
  entrance_fee_source = 'Retribusi Garung 2024'
WHERE mountain_id = 8 AND track_code = 'GRG'; -- Garung

UPDATE mountain_tracks SET 
  entrance_fee = 25000,
  entrance_fee_source = 'Retribusi Banaran 2024'
WHERE mountain_id = 8 AND track_code = 'BNR'; -- Banaran

-- ============================================================================
-- PRAU (DIENG)
-- ============================================================================

UPDATE mountain_tracks SET 
  entrance_fee = 10000,
  entrance_fee_source = 'Retribusi Desa Dieng 2024'
WHERE mountain_id = 9; -- Semua jalur Prau

-- Note: Harga bisa berubah saat event (Dieng Culture Festival)

-- ============================================================================
-- GEDE PANGRANGO (TAMAN NASIONAL GEDE PANGRANGO)
-- ============================================================================
-- SIMAKSI wajib via online

UPDATE mountain_tracks SET 
  entrance_fee = 29000,
  entrance_fee_source = 'TNGP (Taman Nasional Gede Pangrango) 2024'
WHERE mountain_id = 10 AND track_code = 'CBD'; -- Cibodas

UPDATE mountain_tracks SET 
  entrance_fee = 29000,
  entrance_fee_source = 'TNGP (Taman Nasional Gede Pangrango) 2024'
WHERE mountain_id = 10 AND track_code = 'GNG'; -- Gunung Putri

-- Note: Booking via https://booking.gedepangrango.org
-- Kuota: 600 pendaki/hari (weekday), 1000 pendaki/hari (weekend)

-- ============================================================================
-- CATATAN PENTING
-- ============================================================================

/*
SIMAKSI (Surat Izin Masuk Kawasan Konservasi):
- Wajib untuk Taman Nasional
- Booking online H-7 sampai H-1
- Bawa KTP/identitas asli
- Cek kuota sebelum booking

RETRIBUSI DESA:
- Bayar langsung di pos pendakian
- Biasanya termasuk parkir
- Harga bisa berubah sewaktu-waktu

TIPS:
1. Cek status gunung di PVMBG/BPPTKG
2. Booking SIMAKSI jauh-jauh hari
3. Screenshot bukti booking
4. Bawa uang cash untuk retribusi lokal
5. Tanyakan ke guide lokal untuk info terbaru

SUMBER DATA:
- Website resmi Taman Nasional
- Survey langsung Oktober 2024
- Grup pendaki & komunitas
- Guide lokal
*/
