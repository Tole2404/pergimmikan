-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2026 at 07:42 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_pergimmikan`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` enum('Hotel','Homestay','Camping Ground','Basecamp','Villa') NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `price_per_night` int(11) DEFAULT NULL,
  `price_notes` text DEFAULT NULL,
  `facilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'WiFi, Hot Water, Breakfast, etc' CHECK (json_valid(`facilities`)),
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_whatsapp` varchar(50) DEFAULT NULL,
  `booking_url` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `reviews_count` int(11) DEFAULT 0,
  `is_recommended` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accommodations`
--

INSERT INTO `accommodations` (`id`, `mountain_id`, `name`, `type`, `location`, `price_per_night`, `price_notes`, `facilities`, `contact_phone`, `contact_whatsapp`, `booking_url`, `rating`, `reviews_count`, `is_recommended`, `created_at`) VALUES
(1, 1, 'Sembalun Homestay', 'Homestay', 'Sembalun Village', 100000, 'Per kamar (2-3 orang)', '[\"WiFi\", \"Hot Water\", \"Breakfast\", \"Parking\"]', '081234567890', '081234567890', NULL, 4.5, 0, 1, '2025-10-14 16:45:55'),
(2, 1, 'Rinjani Lodge', 'Hotel', 'Sembalun Village', 250000, 'Per kamar', '[\"WiFi\", \"Hot Water\", \"Breakfast\", \"AC\", \"Restaurant\"]', '081234567891', '081234567891', NULL, 4.7, 0, 1, '2025-10-14 16:45:55'),
(3, 2, 'Ranupane Homestay', 'Homestay', 'Ranupane', 80000, 'Per kamar (2-3 orang)', '[\"Hot Water\", \"Breakfast\", \"Parking\"]', '081234567892', '081234567892', NULL, 4.3, 0, 1, '2025-10-14 16:45:55'),
(4, 3, 'Selo Homestay', 'Homestay', 'Selo, Boyolali', 75000, 'Per kamar', '[\"Hot Water\", \"Breakfast\", \"View Merapi\"]', '081234567893', '081234567893', NULL, 4.4, 0, 1, '2025-10-14 16:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `status` enum('upcoming','completed') NOT NULL DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `title`, `date`, `time`, `location`, `description`, `category_id`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(10, 'Bukber 4', '2025-03-11', '18:00:00', 'BUFEYA - THANKS BREW CAFE', 'Bukber 2025', 2, '/images/activities/activity-1744056529920-838694365.jpg', 'completed', '2025-04-07 20:06:16', '2025-04-07 20:08:49'),
(11, 'Teman nongkrong', '2025-04-10', '19:00:00', 'Ciledug - puti beta', 'Halal Bihalal🙏', 3, '/images/activities/activity-1744475531673-179240506.jpeg', 'completed', '2025-04-12 16:32:11', '2025-04-12 16:32:11'),
(12, 'Bakar bakaran', '2025-01-08', '17:00:00', 'Griya ciledug', 'Tahun baruan bakar bakaran😁', 3, '/images/activities/activity-1744476213146-912873049.jpeg', 'completed', '2025-04-12 16:43:33', '2025-04-12 16:43:33'),
(13, 'Angkringan faqil', '2024-06-30', '22:30:00', 'Bates ', 'Angkringan faqil', 3, '/images/activities/activity-1744476923415-278912466.jpeg', 'completed', '2025-04-12 16:55:23', '2025-04-12 16:55:23'),
(14, '24042024', '2024-04-24', '20:30:00', 'Senopati', '24042024', 3, '/images/activities/activity-1744477197623-398516818.jpeg', 'completed', '2025-04-12 16:59:57', '2025-04-12 16:59:57'),
(15, 'Bukber 2024', '2024-03-25', '18:00:00', 'Bar burger', 'Bukber 2024', 2, '/images/activities/activity-1744477389409-642011047.jpeg', 'completed', '2025-04-12 17:03:09', '2025-04-12 17:03:09'),
(16, 'Temu kangen 2024', '2024-03-10', '20:00:00', 'Coffee ubud village', 'Temu kangen', 3, '/images/activities/activity-1744477716463-717072649.jpeg', 'upcoming', '2025-04-12 17:08:36', '2025-04-12 17:08:36'),
(17, 'Goes to pik', '2024-02-02', '18:30:00', 'Pantai indah kapik', 'Gabut xixi', 3, '/images/activities/activity-1744477961106-914578354.jpeg', 'completed', '2025-04-12 17:12:41', '2025-04-12 17:12:41'),
(18, 'Bandung', '2024-01-16', '11:15:00', 'Bandung', 'Gabut ke bandung', 3, '/images/activities/activity-1744478240170-49052267.jpeg', 'completed', '2025-04-12 17:17:20', '2025-04-12 17:17:20'),
(19, 'Ultah deva', '2023-12-21', '18:30:00', 'Bar burger', 'Birthday deva', 3, '/images/activities/activity-1744478581328-148534753.jpeg', 'completed', '2025-04-12 17:23:01', '2025-04-12 17:23:01'),
(20, 'Rapat besarr', '2023-10-23', '20:20:00', 'Gandaria', 'Rapat gajelas', 3, '/images/activities/activity-1744478840686-405286108.jpeg', 'completed', '2025-04-12 17:27:20', '2025-04-12 17:27:20'),
(21, 'Pameran kandang ayam', '2023-10-04', '19:30:00', 'Grha budi luhur', 'Kandang ayam aja dipamerin xixi', 1, '/images/activities/activity-1744479103622-954009336.jpeg', 'completed', '2025-04-12 17:31:43', '2025-04-12 17:31:43'),
(22, 'Gabut ke cibis', '2023-07-28', '18:32:00', 'Cvis park - colandak timur', 'Gabut parah', 3, '/images/activities/activity-1744479304350-254755957.jpeg', 'completed', '2025-04-12 17:35:04', '2025-04-12 17:35:04'),
(23, 'Kunjungan cocacola', '2023-07-20', '12:30:00', 'Bekasi', 'Kunjungan pabrik cocacola - bank sampah budi luhur', 1, '/images/activities/activity-1744479690255-85732794.jpeg', 'completed', '2025-04-12 17:41:30', '2025-04-12 17:41:30'),
(24, 'Bukber 2023', '2023-04-07', '18:00:00', 'Coffee menjulang - ciledug', 'Bukber tahun 2023', 2, '/images/activities/activity-1744479979456-701586541.jpeg', 'completed', '2025-04-12 17:46:19', '2025-04-12 17:46:19'),
(25, 'Pemilihan dosen smt 4', '2023-02-01', '19:00:00', 'Menjulang - ciledug', 'Pemilihan dosen tahun 2024', 3, '/images/activities/activity-1744480292945-942541136.jpeg', 'completed', '2025-04-12 17:51:32', '2025-04-12 17:51:32'),
(26, 'Batik day', '2022-11-13', '11:50:00', 'Kampus budi luhur', 'Hari batik nasional', 1, '/images/activities/activity-1744480698363-149299517.jpeg', 'completed', '2025-04-12 17:58:18', '2025-04-12 17:58:18'),
(30, 'coba update', '2025-04-24', '04:20:00', 'kreo', 'coba update aja', 1, '/images/activities/activity-1751043514025-126791578.jpg', 'upcoming', '2025-06-27 16:53:10', '2025-06-27 16:58:34'),
(31, 'judul aktivitas', '2025-09-02', '19:00:00', 'ciledug', 'coba', 1, '/images/activities/activity-1751649271114-691128882.jpg', 'upcoming', '2025-07-04 17:14:31', '2025-07-04 17:14:31');

-- --------------------------------------------------------

--
-- Table structure for table `activity_categories`
--

CREATE TABLE `activity_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_categories`
--

INSERT INTO `activity_categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Social', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(2, 'Bukber', '2025-03-11 13:46:39', '2025-03-11 13:49:34'),
(3, 'Nongkrong', '2025-03-11 13:46:39', '2025-03-11 13:48:59'),
(4, 'coba', '2025-04-04 16:01:42', '2025-04-04 16:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `activity_gallery`
--

CREATE TABLE `activity_gallery` (
  `id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_gallery`
--

INSERT INTO `activity_gallery` (`id`, `activity_id`, `image_url`, `caption`, `created_at`, `updated_at`) VALUES
(13, 5, '/images/activities/gallery/gallery-1741720960683-824888730.jpeg', NULL, '2025-03-11 19:22:40', '2025-03-11 19:22:40'),
(14, 5, '/images/activities/gallery/gallery-1741720960683-123074599.jpeg', NULL, '2025-03-11 19:22:40', '2025-03-11 19:22:40'),
(15, 5, '/images/activities/gallery/gallery-1741720960684-884010575.jpeg', NULL, '2025-03-11 19:22:40', '2025-03-11 19:22:40'),
(85, 10, '/images/activities/gallery/gallery-1744056378460-921467787.JPG', NULL, '2025-04-07 20:06:18', '2025-04-07 20:06:18'),
(86, 10, '/images/activities/gallery/gallery-1744056379127-783878949.JPG', NULL, '2025-04-07 20:06:19', '2025-04-07 20:06:19'),
(87, 10, '/images/activities/gallery/gallery-1744056379612-582065429.JPG', NULL, '2025-04-07 20:06:19', '2025-04-07 20:06:19'),
(88, 10, '/images/activities/gallery/gallery-1744056380429-816052741.JPG', NULL, '2025-04-07 20:06:20', '2025-04-07 20:06:20'),
(89, 10, '/images/activities/gallery/gallery-1744056380801-584072568.JPG', NULL, '2025-04-07 20:06:20', '2025-04-07 20:06:20'),
(90, 10, '/images/activities/gallery/gallery-1744056381274-933239182.JPG', NULL, '2025-04-07 20:06:21', '2025-04-07 20:06:21'),
(91, 10, '/images/activities/gallery/gallery-1744056381613-599971877.JPG', NULL, '2025-04-07 20:06:21', '2025-04-07 20:06:21'),
(92, 10, '/images/activities/gallery/gallery-1744056382104-432068360.JPG', NULL, '2025-04-07 20:06:22', '2025-04-07 20:06:22'),
(93, 10, '/images/activities/gallery/gallery-1744056383174-540136396.JPG', NULL, '2025-04-07 20:06:23', '2025-04-07 20:06:23'),
(94, 10, '/images/activities/gallery/gallery-1744056383571-645432741.JPG', NULL, '2025-04-07 20:06:23', '2025-04-07 20:06:23'),
(95, 10, '/images/activities/gallery/gallery-1744056384024-59233084.JPG', NULL, '2025-04-07 20:06:24', '2025-04-07 20:06:24'),
(96, 10, '/images/activities/gallery/gallery-1744056384575-754736116.JPG', NULL, '2025-04-07 20:06:24', '2025-04-07 20:06:24'),
(97, 10, '/images/activities/gallery/gallery-1744056385325-267925565.jpg', NULL, '2025-04-07 20:06:25', '2025-04-07 20:06:25'),
(98, 10, '/images/activities/gallery/gallery-1744056386073-771783739.jpg', NULL, '2025-04-07 20:06:26', '2025-04-07 20:06:26'),
(99, 10, '/images/activities/gallery/gallery-1744056386784-714450624.jpg', NULL, '2025-04-07 20:06:26', '2025-04-07 20:06:26'),
(100, 10, '/images/activities/gallery/gallery-1744056387590-464509847.jpg', NULL, '2025-04-07 20:06:27', '2025-04-07 20:06:27'),
(101, 10, '/images/activities/gallery/gallery-1744056390163-929832242.jpg', NULL, '2025-04-07 20:06:30', '2025-04-07 20:06:30'),
(102, 10, '/images/activities/gallery/gallery-1744056393074-374862525.jpg', NULL, '2025-04-07 20:06:33', '2025-04-07 20:06:33'),
(103, 10, '/images/activities/gallery/gallery-1744056393801-414728505.jpg', NULL, '2025-04-07 20:06:33', '2025-04-07 20:06:33'),
(104, 10, '/images/activities/gallery/gallery-1744056394497-195807103.jpg', NULL, '2025-04-07 20:06:34', '2025-04-07 20:06:34'),
(105, 10, '/images/activities/gallery/gallery-1744056395807-136380610.jpg', NULL, '2025-04-07 20:06:35', '2025-04-07 20:06:35'),
(106, 10, '/images/activities/gallery/gallery-1744056396219-234935185.jpg', NULL, '2025-04-07 20:06:36', '2025-04-07 20:06:36'),
(107, 10, '/images/activities/gallery/gallery-1744056397714-906757351.jpg', NULL, '2025-04-07 20:06:37', '2025-04-07 20:06:37'),
(108, 10, '/images/activities/gallery/gallery-1744056398827-953058.jpg', NULL, '2025-04-07 20:06:38', '2025-04-07 20:06:38'),
(109, 10, '/images/activities/gallery/gallery-1744056399102-836355477.jpg', NULL, '2025-04-07 20:06:39', '2025-04-07 20:06:39'),
(110, 10, '/images/activities/gallery/gallery-1744056399527-537554189.jpg', NULL, '2025-04-07 20:06:39', '2025-04-07 20:06:39'),
(111, 10, '/images/activities/gallery/gallery-1744056399813-864723624.jpg', NULL, '2025-04-07 20:06:39', '2025-04-07 20:06:39'),
(112, 10, '/images/activities/gallery/gallery-1744056400553-425782588.jpg', NULL, '2025-04-07 20:06:40', '2025-04-07 20:06:40'),
(113, 10, '/images/activities/gallery/gallery-1744056400992-906264108.jpg', NULL, '2025-04-07 20:06:40', '2025-04-07 20:06:40'),
(114, 10, '/images/activities/gallery/gallery-1744056401306-409836045.jpg', NULL, '2025-04-07 20:06:41', '2025-04-07 20:06:41'),
(115, 10, '/images/activities/gallery/gallery-1744056401730-530594829.jpg', NULL, '2025-04-07 20:06:41', '2025-04-07 20:06:41'),
(116, 10, '/images/activities/gallery/gallery-1744056402153-890222079.jpg', NULL, '2025-04-07 20:06:42', '2025-04-07 20:06:42'),
(117, 10, '/images/activities/gallery/gallery-1744056402567-686813807.jpg', NULL, '2025-04-07 20:06:42', '2025-04-07 20:06:42'),
(118, 10, '/images/activities/gallery/gallery-1744056403086-843944023.jpg', NULL, '2025-04-07 20:06:43', '2025-04-07 20:06:43'),
(120, 10, '/images/activities/gallery/gallery-1744056404037-922198158.jpg', NULL, '2025-04-07 20:06:44', '2025-04-07 20:06:44'),
(121, 10, '/images/activities/gallery/gallery-1744056404838-348940055.jpg', NULL, '2025-04-07 20:06:44', '2025-04-07 20:06:44'),
(122, 10, '/images/activities/gallery/gallery-1744056405135-36402909.jpg', NULL, '2025-04-07 20:06:45', '2025-04-07 20:06:45'),
(123, 10, '/images/activities/gallery/gallery-1744056405361-638700718.jpg', NULL, '2025-04-07 20:06:45', '2025-04-07 20:06:45'),
(124, 10, '/images/activities/gallery/gallery-1744056405686-989279907.jpg', NULL, '2025-04-07 20:06:45', '2025-04-07 20:06:45'),
(125, 10, '/images/activities/gallery/gallery-1744056406280-227469968.jpg', NULL, '2025-04-07 20:06:46', '2025-04-07 20:06:46'),
(126, 10, '/images/activities/gallery/gallery-1744056406546-857994212.jpg', NULL, '2025-04-07 20:06:46', '2025-04-07 20:06:46'),
(127, 10, '/images/activities/gallery/gallery-1744056407170-388451876.jpg', NULL, '2025-04-07 20:06:47', '2025-04-07 20:06:47'),
(128, 10, '/images/activities/gallery/gallery-1744056407665-924646298.jpg', NULL, '2025-04-07 20:06:47', '2025-04-07 20:06:47'),
(129, 10, '/images/activities/gallery/gallery-1744056407931-658857841.jpg', NULL, '2025-04-07 20:06:47', '2025-04-07 20:06:47'),
(130, 11, '/images/activities/gallery/gallery-1744475565285-257648392.jpeg', NULL, '2025-04-12 16:32:45', '2025-04-12 16:32:45'),
(131, 11, '/images/activities/gallery/gallery-1744475566163-522093286.jpeg', NULL, '2025-04-12 16:32:46', '2025-04-12 16:32:46'),
(132, 11, '/images/activities/gallery/gallery-1744475567030-648879216.jpeg', NULL, '2025-04-12 16:32:47', '2025-04-12 16:32:47'),
(133, 11, '/images/activities/gallery/gallery-1744475567768-198569306.jpeg', NULL, '2025-04-12 16:32:47', '2025-04-12 16:32:47'),
(134, 11, '/images/activities/gallery/gallery-1744475569291-654082799.jpeg', NULL, '2025-04-12 16:32:49', '2025-04-12 16:32:49'),
(135, 11, '/images/activities/gallery/gallery-1744475570158-604680426.jpeg', NULL, '2025-04-12 16:32:50', '2025-04-12 16:32:50'),
(136, 11, '/images/activities/gallery/gallery-1744475571958-4501252.jpeg', NULL, '2025-04-12 16:32:51', '2025-04-12 16:32:51'),
(137, 11, '/images/activities/gallery/gallery-1744475574022-760032934.jpeg', NULL, '2025-04-12 16:32:54', '2025-04-12 16:32:54'),
(138, 12, '/images/activities/gallery/gallery-1744476311962-786891566.jpeg', NULL, '2025-04-12 16:45:11', '2025-04-12 16:45:11'),
(139, 12, '/images/activities/gallery/gallery-1744476313035-779420007.jpeg', NULL, '2025-04-12 16:45:13', '2025-04-12 16:45:13'),
(140, 12, '/images/activities/gallery/gallery-1744476313956-75773968.jpeg', NULL, '2025-04-12 16:45:13', '2025-04-12 16:45:13'),
(141, 12, '/images/activities/gallery/gallery-1744476314821-609111584.jpeg', NULL, '2025-04-12 16:45:14', '2025-04-12 16:45:14'),
(142, 12, '/images/activities/gallery/gallery-1744476315509-849332490.jpeg', NULL, '2025-04-12 16:45:15', '2025-04-12 16:45:15'),
(143, 12, '/images/activities/gallery/gallery-1744476316146-710354563.jpeg', NULL, '2025-04-12 16:45:16', '2025-04-12 16:45:16'),
(144, 12, '/images/activities/gallery/gallery-1744476316914-423810125.jpeg', NULL, '2025-04-12 16:45:16', '2025-04-12 16:45:16'),
(145, 12, '/images/activities/gallery/gallery-1744476317311-333024925.jpeg', NULL, '2025-04-12 16:45:17', '2025-04-12 16:45:17'),
(146, 12, '/images/activities/gallery/gallery-1744476317820-871170628.jpeg', NULL, '2025-04-12 16:45:17', '2025-04-12 16:45:17'),
(147, 12, '/images/activities/gallery/gallery-1744476318211-800745997.jpeg', NULL, '2025-04-12 16:45:18', '2025-04-12 16:45:18'),
(148, 12, '/images/activities/gallery/gallery-1744476318833-101312523.jpeg', NULL, '2025-04-12 16:45:18', '2025-04-12 16:45:18'),
(149, 12, '/images/activities/gallery/gallery-1744476319301-79757661.jpeg', NULL, '2025-04-12 16:45:19', '2025-04-12 16:45:19'),
(150, 12, '/images/activities/gallery/gallery-1744476319732-955260870.jpeg', NULL, '2025-04-12 16:45:19', '2025-04-12 16:45:19'),
(151, 12, '/images/activities/gallery/gallery-1744476320200-328127111.jpeg', NULL, '2025-04-12 16:45:20', '2025-04-12 16:45:20'),
(152, 12, '/images/activities/gallery/gallery-1744476320574-418635821.jpeg', NULL, '2025-04-12 16:45:20', '2025-04-12 16:45:20'),
(153, 12, '/images/activities/gallery/gallery-1744476320978-794418926.jpeg', NULL, '2025-04-12 16:45:20', '2025-04-12 16:45:20'),
(154, 12, '/images/activities/gallery/gallery-1744476321316-26633102.jpeg', NULL, '2025-04-12 16:45:21', '2025-04-12 16:45:21'),
(155, 12, '/images/activities/gallery/gallery-1744476321724-608142297.jpeg', NULL, '2025-04-12 16:45:21', '2025-04-12 16:45:21'),
(156, 12, '/images/activities/gallery/gallery-1744476322039-672944688.jpeg', NULL, '2025-04-12 16:45:22', '2025-04-12 16:45:22'),
(157, 12, '/images/activities/gallery/gallery-1744476322439-769463295.jpeg', NULL, '2025-04-12 16:45:22', '2025-04-12 16:45:22'),
(158, 12, '/images/activities/gallery/gallery-1744476322749-635495995.jpeg', NULL, '2025-04-12 16:45:22', '2025-04-12 16:45:22'),
(159, 12, '/images/activities/gallery/gallery-1744476323123-313518907.jpeg', NULL, '2025-04-12 16:45:23', '2025-04-12 16:45:23'),
(160, 12, '/images/activities/gallery/gallery-1744476323529-335423496.jpeg', NULL, '2025-04-12 16:45:23', '2025-04-12 16:45:23'),
(161, 12, '/images/activities/gallery/gallery-1744476323907-194489078.jpeg', NULL, '2025-04-12 16:45:23', '2025-04-12 16:45:23'),
(162, 12, '/images/activities/gallery/gallery-1744476324394-84089332.jpeg', NULL, '2025-04-12 16:45:24', '2025-04-12 16:45:24'),
(163, 12, '/images/activities/gallery/gallery-1744476324855-239299190.jpeg', NULL, '2025-04-12 16:45:24', '2025-04-12 16:45:24'),
(164, 12, '/images/activities/gallery/gallery-1744476325591-627395455.jpeg', NULL, '2025-04-12 16:45:25', '2025-04-12 16:45:25'),
(165, 12, '/images/activities/gallery/gallery-1744476327714-13085439.jpeg', NULL, '2025-04-12 16:45:27', '2025-04-12 16:45:27'),
(166, 12, '/images/activities/gallery/gallery-1744476331596-74387990.jpeg', NULL, '2025-04-12 16:45:31', '2025-04-12 16:45:31'),
(167, 13, '/images/activities/gallery/gallery-1744476958748-410052924.jpeg', NULL, '2025-04-12 16:55:58', '2025-04-12 16:55:58'),
(168, 13, '/images/activities/gallery/gallery-1744476959562-999268390.jpeg', NULL, '2025-04-12 16:55:59', '2025-04-12 16:55:59'),
(169, 13, '/images/activities/gallery/gallery-1744476960096-695892709.jpeg', NULL, '2025-04-12 16:56:00', '2025-04-12 16:56:00'),
(170, 13, '/images/activities/gallery/gallery-1744476960636-349242578.jpeg', NULL, '2025-04-12 16:56:00', '2025-04-12 16:56:00'),
(171, 13, '/images/activities/gallery/gallery-1744476961128-256434401.jpeg', NULL, '2025-04-12 16:56:01', '2025-04-12 16:56:01'),
(172, 13, '/images/activities/gallery/gallery-1744476961550-79632884.jpeg', NULL, '2025-04-12 16:56:01', '2025-04-12 16:56:01'),
(173, 13, '/images/activities/gallery/gallery-1744476962010-173012432.jpeg', NULL, '2025-04-12 16:56:02', '2025-04-12 16:56:02'),
(174, 14, '/images/activities/gallery/gallery-1744477244136-440697459.jpeg', NULL, '2025-04-12 17:00:44', '2025-04-12 17:00:44'),
(175, 14, '/images/activities/gallery/gallery-1744477244425-287293240.jpeg', NULL, '2025-04-12 17:00:44', '2025-04-12 17:00:44'),
(176, 14, '/images/activities/gallery/gallery-1744477244737-187231551.jpeg', NULL, '2025-04-12 17:00:44', '2025-04-12 17:00:44'),
(177, 14, '/images/activities/gallery/gallery-1744477245129-738567216.jpeg', NULL, '2025-04-12 17:00:45', '2025-04-12 17:00:45'),
(178, 14, '/images/activities/gallery/gallery-1744477245494-373449779.jpeg', NULL, '2025-04-12 17:00:45', '2025-04-12 17:00:45'),
(179, 14, '/images/activities/gallery/gallery-1744477245854-440802165.jpeg', NULL, '2025-04-12 17:00:45', '2025-04-12 17:00:45'),
(180, 14, '/images/activities/gallery/gallery-1744477246094-827174066.jpeg', NULL, '2025-04-12 17:00:46', '2025-04-12 17:00:46'),
(181, 14, '/images/activities/gallery/gallery-1744477246341-177594132.jpeg', NULL, '2025-04-12 17:00:46', '2025-04-12 17:00:46'),
(182, 14, '/images/activities/gallery/gallery-1744477246742-207527613.jpeg', NULL, '2025-04-12 17:00:46', '2025-04-12 17:00:46'),
(183, 14, '/images/activities/gallery/gallery-1744477247036-660709345.jpeg', NULL, '2025-04-12 17:00:47', '2025-04-12 17:00:47'),
(184, 14, '/images/activities/gallery/gallery-1744477247276-301992871.jpeg', NULL, '2025-04-12 17:00:47', '2025-04-12 17:00:47'),
(185, 14, '/images/activities/gallery/gallery-1744477248018-389645878.jpeg', NULL, '2025-04-12 17:00:48', '2025-04-12 17:00:48'),
(186, 14, '/images/activities/gallery/gallery-1744477248247-388839877.jpeg', NULL, '2025-04-12 17:00:48', '2025-04-12 17:00:48'),
(187, 14, '/images/activities/gallery/gallery-1744477248529-280075703.jpeg', NULL, '2025-04-12 17:00:48', '2025-04-12 17:00:48'),
(188, 14, '/images/activities/gallery/gallery-1744477248881-641437948.jpeg', NULL, '2025-04-12 17:00:48', '2025-04-12 17:00:48'),
(189, 14, '/images/activities/gallery/gallery-1744477249213-6424771.jpeg', NULL, '2025-04-12 17:00:49', '2025-04-12 17:00:49'),
(190, 15, '/images/activities/gallery/gallery-1744477430341-726690784.jpeg', NULL, '2025-04-12 17:03:50', '2025-04-12 17:03:50'),
(191, 15, '/images/activities/gallery/gallery-1744477431623-893648026.jpeg', NULL, '2025-04-12 17:03:51', '2025-04-12 17:03:51'),
(192, 15, '/images/activities/gallery/gallery-1744477432821-627089619.jpeg', NULL, '2025-04-12 17:03:52', '2025-04-12 17:03:52'),
(193, 15, '/images/activities/gallery/gallery-1744477433844-342770943.jpeg', NULL, '2025-04-12 17:03:53', '2025-04-12 17:03:53'),
(194, 15, '/images/activities/gallery/gallery-1744477434841-744674717.jpeg', NULL, '2025-04-12 17:03:54', '2025-04-12 17:03:54'),
(195, 15, '/images/activities/gallery/gallery-1744477435829-247516851.jpeg', NULL, '2025-04-12 17:03:55', '2025-04-12 17:03:55'),
(196, 15, '/images/activities/gallery/gallery-1744477436337-50447768.jpeg', NULL, '2025-04-12 17:03:56', '2025-04-12 17:03:56'),
(197, 15, '/images/activities/gallery/gallery-1744477436875-650972793.jpeg', NULL, '2025-04-12 17:03:56', '2025-04-12 17:03:56'),
(198, 15, '/images/activities/gallery/gallery-1744477437407-994562308.jpeg', NULL, '2025-04-12 17:03:57', '2025-04-12 17:03:57'),
(199, 15, '/images/activities/gallery/gallery-1744477437847-82536256.jpeg', NULL, '2025-04-12 17:03:57', '2025-04-12 17:03:57'),
(200, 16, '/images/activities/gallery/gallery-1744477723978-826402717.jpeg', NULL, '2025-04-12 17:08:43', '2025-04-12 17:08:43'),
(201, 16, '/images/activities/gallery/gallery-1744477730583-127221735.jpeg', NULL, '2025-04-12 17:08:50', '2025-04-12 17:08:50'),
(202, 16, '/images/activities/gallery/gallery-1744477731350-529577906.jpeg', NULL, '2025-04-12 17:08:51', '2025-04-12 17:08:51'),
(203, 16, '/images/activities/gallery/gallery-1744477732056-98090022.jpeg', NULL, '2025-04-12 17:08:52', '2025-04-12 17:08:52'),
(204, 16, '/images/activities/gallery/gallery-1744477732828-465871324.jpeg', NULL, '2025-04-12 17:08:52', '2025-04-12 17:08:52'),
(205, 16, '/images/activities/gallery/gallery-1744477733537-742230512.jpeg', NULL, '2025-04-12 17:08:53', '2025-04-12 17:08:53'),
(206, 16, '/images/activities/gallery/gallery-1744477734209-727051073.jpeg', NULL, '2025-04-12 17:08:54', '2025-04-12 17:08:54'),
(207, 16, '/images/activities/gallery/gallery-1744477734941-836302974.jpeg', NULL, '2025-04-12 17:08:54', '2025-04-12 17:08:54'),
(208, 16, '/images/activities/gallery/gallery-1744477735865-102537568.jpeg', NULL, '2025-04-12 17:08:55', '2025-04-12 17:08:55'),
(209, 16, '/images/activities/gallery/gallery-1744477736828-971002246.jpeg', NULL, '2025-04-12 17:08:56', '2025-04-12 17:08:56'),
(210, 16, '/images/activities/gallery/gallery-1744477737430-264092163.jpeg', NULL, '2025-04-12 17:08:57', '2025-04-12 17:08:57'),
(211, 16, '/images/activities/gallery/gallery-1744477738569-396583422.jpeg', NULL, '2025-04-12 17:08:58', '2025-04-12 17:08:58'),
(212, 16, '/images/activities/gallery/gallery-1744477739451-762876975.jpeg', NULL, '2025-04-12 17:08:59', '2025-04-12 17:08:59'),
(213, 17, '/images/activities/gallery/gallery-1744477998483-499469201.jpeg', NULL, '2025-04-12 17:13:18', '2025-04-12 17:13:18'),
(214, 17, '/images/activities/gallery/gallery-1744477999926-321425293.png', NULL, '2025-04-12 17:13:19', '2025-04-12 17:13:19'),
(215, 17, '/images/activities/gallery/gallery-1744478000475-566070287.jpeg', NULL, '2025-04-12 17:13:20', '2025-04-12 17:13:20'),
(216, 17, '/images/activities/gallery/gallery-1744478001400-475929348.jpeg', NULL, '2025-04-12 17:13:21', '2025-04-12 17:13:21'),
(217, 17, '/images/activities/gallery/gallery-1744478002241-237151961.jpeg', NULL, '2025-04-12 17:13:22', '2025-04-12 17:13:22'),
(218, 17, '/images/activities/gallery/gallery-1744478002893-163600734.jpeg', NULL, '2025-04-12 17:13:22', '2025-04-12 17:13:22'),
(219, 17, '/images/activities/gallery/gallery-1744478003413-261770879.jpeg', NULL, '2025-04-12 17:13:23', '2025-04-12 17:13:23'),
(220, 17, '/images/activities/gallery/gallery-1744478003985-500337629.jpeg', NULL, '2025-04-12 17:13:23', '2025-04-12 17:13:23'),
(221, 17, '/images/activities/gallery/gallery-1744478005009-508977563.jpeg', NULL, '2025-04-12 17:13:25', '2025-04-12 17:13:25'),
(222, 17, '/images/activities/gallery/gallery-1744478005941-347320956.jpeg', NULL, '2025-04-12 17:13:25', '2025-04-12 17:13:25'),
(223, 17, '/images/activities/gallery/gallery-1744478007027-82777120.jpeg', NULL, '2025-04-12 17:13:27', '2025-04-12 17:13:27'),
(224, 17, '/images/activities/gallery/gallery-1744478007914-183059738.jpeg', NULL, '2025-04-12 17:13:27', '2025-04-12 17:13:27'),
(225, 17, '/images/activities/gallery/gallery-1744478009417-109487791.jpeg', NULL, '2025-04-12 17:13:29', '2025-04-12 17:13:29'),
(226, 18, '/images/activities/gallery/gallery-1744478271000-4963049.jpeg', NULL, '2025-04-12 17:17:51', '2025-04-12 17:17:51'),
(227, 18, '/images/activities/gallery/gallery-1744478271672-773328874.jpeg', NULL, '2025-04-12 17:17:51', '2025-04-12 17:17:51'),
(228, 18, '/images/activities/gallery/gallery-1744478272729-5273911.jpeg', NULL, '2025-04-12 17:17:52', '2025-04-12 17:17:52'),
(229, 18, '/images/activities/gallery/gallery-1744478274644-164916150.jpeg', NULL, '2025-04-12 17:17:54', '2025-04-12 17:17:54'),
(230, 18, '/images/activities/gallery/gallery-1744478276520-291548894.jpeg', NULL, '2025-04-12 17:17:56', '2025-04-12 17:17:56'),
(231, 18, '/images/activities/gallery/gallery-1744478277940-375474453.jpeg', NULL, '2025-04-12 17:17:57', '2025-04-12 17:17:57'),
(232, 18, '/images/activities/gallery/gallery-1744478278426-818616984.jpeg', NULL, '2025-04-12 17:17:58', '2025-04-12 17:17:58'),
(233, 18, '/images/activities/gallery/gallery-1744478279002-160431456.jpeg', NULL, '2025-04-12 17:17:59', '2025-04-12 17:17:59'),
(234, 18, '/images/activities/gallery/gallery-1744478279555-514228878.jpeg', NULL, '2025-04-12 17:17:59', '2025-04-12 17:17:59'),
(235, 18, '/images/activities/gallery/gallery-1744478280376-259214391.jpeg', NULL, '2025-04-12 17:18:00', '2025-04-12 17:18:00'),
(236, 18, '/images/activities/gallery/gallery-1744478281244-253149093.jpeg', NULL, '2025-04-12 17:18:01', '2025-04-12 17:18:01'),
(237, 18, '/images/activities/gallery/gallery-1744478281791-185284398.jpeg', NULL, '2025-04-12 17:18:01', '2025-04-12 17:18:01'),
(238, 18, '/images/activities/gallery/gallery-1744478282243-153874312.jpeg', NULL, '2025-04-12 17:18:02', '2025-04-12 17:18:02'),
(239, 18, '/images/activities/gallery/gallery-1744478282805-743466939.jpeg', NULL, '2025-04-12 17:18:02', '2025-04-12 17:18:02'),
(240, 18, '/images/activities/gallery/gallery-1744478283306-374927136.jpeg', NULL, '2025-04-12 17:18:03', '2025-04-12 17:18:03'),
(241, 18, '/images/activities/gallery/gallery-1744478283676-550007037.jpeg', NULL, '2025-04-12 17:18:03', '2025-04-12 17:18:03'),
(242, 18, '/images/activities/gallery/gallery-1744478283981-478037913.jpeg', NULL, '2025-04-12 17:18:03', '2025-04-12 17:18:03'),
(243, 19, '/images/activities/gallery/gallery-1744478614606-561665395.jpeg', NULL, '2025-04-12 17:23:34', '2025-04-12 17:23:34'),
(244, 19, '/images/activities/gallery/gallery-1744478615522-367950793.jpeg', NULL, '2025-04-12 17:23:35', '2025-04-12 17:23:35'),
(245, 19, '/images/activities/gallery/gallery-1744478616710-658234057.jpeg', NULL, '2025-04-12 17:23:36', '2025-04-12 17:23:36'),
(246, 19, '/images/activities/gallery/gallery-1744478617384-947002771.jpeg', NULL, '2025-04-12 17:23:37', '2025-04-12 17:23:37'),
(247, 19, '/images/activities/gallery/gallery-1744478617879-803161692.jpeg', NULL, '2025-04-12 17:23:37', '2025-04-12 17:23:37'),
(248, 19, '/images/activities/gallery/gallery-1744478619010-553591811.jpeg', NULL, '2025-04-12 17:23:39', '2025-04-12 17:23:39'),
(249, 19, '/images/activities/gallery/gallery-1744478619786-511288495.jpeg', NULL, '2025-04-12 17:23:39', '2025-04-12 17:23:39'),
(250, 19, '/images/activities/gallery/gallery-1744478620488-817976817.jpeg', NULL, '2025-04-12 17:23:40', '2025-04-12 17:23:40'),
(251, 19, '/images/activities/gallery/gallery-1744478621053-115538395.jpeg', NULL, '2025-04-12 17:23:41', '2025-04-12 17:23:41'),
(252, 19, '/images/activities/gallery/gallery-1744478621532-853298079.jpeg', NULL, '2025-04-12 17:23:41', '2025-04-12 17:23:41'),
(253, 19, '/images/activities/gallery/gallery-1744478622219-358175708.jpeg', NULL, '2025-04-12 17:23:42', '2025-04-12 17:23:42'),
(254, 19, '/images/activities/gallery/gallery-1744478622765-990177332.jpeg', NULL, '2025-04-12 17:23:42', '2025-04-12 17:23:42'),
(255, 19, '/images/activities/gallery/gallery-1744478623194-406609870.jpeg', NULL, '2025-04-12 17:23:43', '2025-04-12 17:23:43'),
(256, 19, '/images/activities/gallery/gallery-1744478623494-273943284.jpeg', NULL, '2025-04-12 17:23:43', '2025-04-12 17:23:43'),
(257, 20, '/images/activities/gallery/gallery-1744478853399-929821469.jpeg', NULL, '2025-04-12 17:27:33', '2025-04-12 17:27:33'),
(258, 20, '/images/activities/gallery/gallery-1744478853753-608626255.jpeg', NULL, '2025-04-12 17:27:33', '2025-04-12 17:27:33'),
(259, 20, '/images/activities/gallery/gallery-1744478854293-211602123.jpeg', NULL, '2025-04-12 17:27:34', '2025-04-12 17:27:34'),
(260, 21, '/images/activities/gallery/gallery-1744479122297-556419051.jpeg', NULL, '2025-04-12 17:32:02', '2025-04-12 17:32:02'),
(261, 21, '/images/activities/gallery/gallery-1744479122673-410716304.jpeg', NULL, '2025-04-12 17:32:02', '2025-04-12 17:32:02'),
(262, 21, '/images/activities/gallery/gallery-1744479123109-727337762.jpeg', NULL, '2025-04-12 17:32:03', '2025-04-12 17:32:03'),
(263, 21, '/images/activities/gallery/gallery-1744479123537-785544408.jpeg', NULL, '2025-04-12 17:32:03', '2025-04-12 17:32:03'),
(264, 21, '/images/activities/gallery/gallery-1744479123909-572646365.jpeg', NULL, '2025-04-12 17:32:03', '2025-04-12 17:32:03'),
(265, 21, '/images/activities/gallery/gallery-1744479124396-987535674.jpeg', NULL, '2025-04-12 17:32:04', '2025-04-12 17:32:04'),
(266, 21, '/images/activities/gallery/gallery-1744479124979-416238549.jpeg', NULL, '2025-04-12 17:32:04', '2025-04-12 17:32:04'),
(267, 21, '/images/activities/gallery/gallery-1744479125653-625515844.jpeg', NULL, '2025-04-12 17:32:05', '2025-04-12 17:32:05'),
(268, 21, '/images/activities/gallery/gallery-1744479126392-240776654.jpeg', NULL, '2025-04-12 17:32:06', '2025-04-12 17:32:06'),
(269, 22, '/images/activities/gallery/gallery-1744479327127-154113216.jpeg', NULL, '2025-04-12 17:35:27', '2025-04-12 17:35:27'),
(270, 22, '/images/activities/gallery/gallery-1744479327776-568860408.jpeg', NULL, '2025-04-12 17:35:27', '2025-04-12 17:35:27'),
(271, 22, '/images/activities/gallery/gallery-1744479328187-877581994.jpeg', NULL, '2025-04-12 17:35:28', '2025-04-12 17:35:28'),
(272, 22, '/images/activities/gallery/gallery-1744479328499-635264614.jpeg', NULL, '2025-04-12 17:35:28', '2025-04-12 17:35:28'),
(273, 22, '/images/activities/gallery/gallery-1744479328804-878351049.jpeg', NULL, '2025-04-12 17:35:28', '2025-04-12 17:35:28'),
(274, 22, '/images/activities/gallery/gallery-1744479329219-62928477.jpeg', NULL, '2025-04-12 17:35:29', '2025-04-12 17:35:29'),
(275, 22, '/images/activities/gallery/gallery-1744479329537-732565915.jpeg', NULL, '2025-04-12 17:35:29', '2025-04-12 17:35:29'),
(276, 22, '/images/activities/gallery/gallery-1744479329909-644911773.jpeg', NULL, '2025-04-12 17:35:29', '2025-04-12 17:35:29'),
(277, 22, '/images/activities/gallery/gallery-1744479330298-778197032.jpeg', NULL, '2025-04-12 17:35:30', '2025-04-12 17:35:30'),
(278, 22, '/images/activities/gallery/gallery-1744479330664-27945004.jpeg', NULL, '2025-04-12 17:35:30', '2025-04-12 17:35:30'),
(279, 22, '/images/activities/gallery/gallery-1744479331001-696743864.jpeg', NULL, '2025-04-12 17:35:31', '2025-04-12 17:35:31'),
(280, 22, '/images/activities/gallery/gallery-1744479331331-45027583.jpeg', NULL, '2025-04-12 17:35:31', '2025-04-12 17:35:31'),
(281, 22, '/images/activities/gallery/gallery-1744479331694-823666146.jpeg', NULL, '2025-04-12 17:35:31', '2025-04-12 17:35:31'),
(282, 23, '/images/activities/gallery/gallery-1744479732103-961462997.jpeg', NULL, '2025-04-12 17:42:12', '2025-04-12 17:42:12'),
(283, 23, '/images/activities/gallery/gallery-1744479735572-163303589.jpeg', NULL, '2025-04-12 17:42:15', '2025-04-12 17:42:15'),
(284, 23, '/images/activities/gallery/gallery-1744479738614-180890077.jpeg', NULL, '2025-04-12 17:42:18', '2025-04-12 17:42:18'),
(285, 23, '/images/activities/gallery/gallery-1744479741730-608352495.jpeg', NULL, '2025-04-12 17:42:21', '2025-04-12 17:42:21'),
(286, 23, '/images/activities/gallery/gallery-1744479743551-305337427.jpeg', NULL, '2025-04-12 17:42:23', '2025-04-12 17:42:23'),
(287, 23, '/images/activities/gallery/gallery-1744479746519-949155468.jpeg', NULL, '2025-04-12 17:42:26', '2025-04-12 17:42:26'),
(288, 23, '/images/activities/gallery/gallery-1744479750663-563918492.jpeg', NULL, '2025-04-12 17:42:30', '2025-04-12 17:42:30'),
(289, 23, '/images/activities/gallery/gallery-1744479752859-292166013.jpeg', NULL, '2025-04-12 17:42:32', '2025-04-12 17:42:32'),
(290, 23, '/images/activities/gallery/gallery-1744479754008-392450064.jpeg', NULL, '2025-04-12 17:42:34', '2025-04-12 17:42:34'),
(291, 23, '/images/activities/gallery/gallery-1744479755285-423871786.jpeg', NULL, '2025-04-12 17:42:35', '2025-04-12 17:42:35'),
(292, 23, '/images/activities/gallery/gallery-1744479758529-416850017.jpeg', NULL, '2025-04-12 17:42:38', '2025-04-12 17:42:38'),
(293, 23, '/images/activities/gallery/gallery-1744479759730-620234322.jpeg', NULL, '2025-04-12 17:42:39', '2025-04-12 17:42:39'),
(294, 23, '/images/activities/gallery/gallery-1744479760731-36858080.jpeg', NULL, '2025-04-12 17:42:40', '2025-04-12 17:42:40'),
(295, 23, '/images/activities/gallery/gallery-1744479761349-875407513.jpeg', NULL, '2025-04-12 17:42:41', '2025-04-12 17:42:41'),
(296, 23, '/images/activities/gallery/gallery-1744479762545-385156577.jpeg', NULL, '2025-04-12 17:42:42', '2025-04-12 17:42:42'),
(297, 23, '/images/activities/gallery/gallery-1744479763641-686355373.jpeg', NULL, '2025-04-12 17:42:43', '2025-04-12 17:42:43'),
(298, 23, '/images/activities/gallery/gallery-1744479764462-836889756.jpeg', NULL, '2025-04-12 17:42:44', '2025-04-12 17:42:44'),
(299, 23, '/images/activities/gallery/gallery-1744479765370-720618815.jpeg', NULL, '2025-04-12 17:42:45', '2025-04-12 17:42:45'),
(300, 23, '/images/activities/gallery/gallery-1744479766324-996310898.jpeg', NULL, '2025-04-12 17:42:46', '2025-04-12 17:42:46'),
(301, 23, '/images/activities/gallery/gallery-1744479767608-710333103.jpeg', NULL, '2025-04-12 17:42:47', '2025-04-12 17:42:47'),
(302, 23, '/images/activities/gallery/gallery-1744479768279-162556575.jpeg', NULL, '2025-04-12 17:42:48', '2025-04-12 17:42:48'),
(303, 23, '/images/activities/gallery/gallery-1744479768933-335219954.jpeg', NULL, '2025-04-12 17:42:48', '2025-04-12 17:42:48'),
(304, 23, '/images/activities/gallery/gallery-1744479769343-470011117.jpeg', NULL, '2025-04-12 17:42:49', '2025-04-12 17:42:49'),
(305, 23, '/images/activities/gallery/gallery-1744479770426-565417855.jpeg', NULL, '2025-04-12 17:42:50', '2025-04-12 17:42:50'),
(306, 23, '/images/activities/gallery/gallery-1744479773084-331773488.jpeg', NULL, '2025-04-12 17:42:53', '2025-04-12 17:42:53'),
(307, 24, '/images/activities/gallery/gallery-1744480043937-280948475.jpeg', NULL, '2025-04-12 17:47:23', '2025-04-12 17:47:23'),
(308, 24, '/images/activities/gallery/gallery-1744480044985-715917142.jpeg', NULL, '2025-04-12 17:47:24', '2025-04-12 17:47:24'),
(309, 24, '/images/activities/gallery/gallery-1744480046347-467890922.jpeg', NULL, '2025-04-12 17:47:26', '2025-04-12 17:47:26'),
(310, 24, '/images/activities/gallery/gallery-1744480047227-448777520.jpeg', NULL, '2025-04-12 17:47:27', '2025-04-12 17:47:27'),
(311, 24, '/images/activities/gallery/gallery-1744480048187-748154608.jpeg', NULL, '2025-04-12 17:47:28', '2025-04-12 17:47:28'),
(312, 24, '/images/activities/gallery/gallery-1744480048773-405743321.jpeg', NULL, '2025-04-12 17:47:28', '2025-04-12 17:47:28'),
(313, 24, '/images/activities/gallery/gallery-1744480049322-882746246.jpeg', NULL, '2025-04-12 17:47:29', '2025-04-12 17:47:29'),
(314, 24, '/images/activities/gallery/gallery-1744480050142-262456986.jpeg', NULL, '2025-04-12 17:47:30', '2025-04-12 17:47:30'),
(315, 24, '/images/activities/gallery/gallery-1744480050755-507167236.jpeg', NULL, '2025-04-12 17:47:30', '2025-04-12 17:47:30'),
(316, 24, '/images/activities/gallery/gallery-1744480051478-596043152.jpeg', NULL, '2025-04-12 17:47:31', '2025-04-12 17:47:31'),
(317, 24, '/images/activities/gallery/gallery-1744480052267-470366881.jpeg', NULL, '2025-04-12 17:47:32', '2025-04-12 17:47:32'),
(318, 24, '/images/activities/gallery/gallery-1744480052897-125664682.jpeg', NULL, '2025-04-12 17:47:32', '2025-04-12 17:47:32'),
(319, 24, '/images/activities/gallery/gallery-1744480053476-869014445.jpeg', NULL, '2025-04-12 17:47:33', '2025-04-12 17:47:33'),
(320, 24, '/images/activities/gallery/gallery-1744480054085-952647573.jpeg', NULL, '2025-04-12 17:47:34', '2025-04-12 17:47:34'),
(321, 24, '/images/activities/gallery/gallery-1744480055254-266462733.jpeg', NULL, '2025-04-12 17:47:35', '2025-04-12 17:47:35'),
(322, 24, '/images/activities/gallery/gallery-1744480055903-358098736.jpeg', NULL, '2025-04-12 17:47:35', '2025-04-12 17:47:35'),
(323, 24, '/images/activities/gallery/gallery-1744480056429-149454144.jpeg', NULL, '2025-04-12 17:47:36', '2025-04-12 17:47:36'),
(324, 24, '/images/activities/gallery/gallery-1744480057032-259392172.jpeg', NULL, '2025-04-12 17:47:37', '2025-04-12 17:47:37'),
(325, 24, '/images/activities/gallery/gallery-1744480057460-86619788.jpeg', NULL, '2025-04-12 17:47:37', '2025-04-12 17:47:37'),
(326, 24, '/images/activities/gallery/gallery-1744480058155-904243672.jpeg', NULL, '2025-04-12 17:47:38', '2025-04-12 17:47:38'),
(327, 24, '/images/activities/gallery/gallery-1744480058642-647138754.jpeg', NULL, '2025-04-12 17:47:38', '2025-04-12 17:47:38'),
(328, 24, '/images/activities/gallery/gallery-1744480059427-653305638.jpeg', NULL, '2025-04-12 17:47:39', '2025-04-12 17:47:39'),
(329, 24, '/images/activities/gallery/gallery-1744480060128-762678952.jpeg', NULL, '2025-04-12 17:47:40', '2025-04-12 17:47:40'),
(330, 24, '/images/activities/gallery/gallery-1744480060695-961965271.jpeg', NULL, '2025-04-12 17:47:40', '2025-04-12 17:47:40'),
(331, 24, '/images/activities/gallery/gallery-1744480061281-409942909.jpeg', NULL, '2025-04-12 17:47:41', '2025-04-12 17:47:41'),
(332, 24, '/images/activities/gallery/gallery-1744480061887-998363659.jpeg', NULL, '2025-04-12 17:47:41', '2025-04-12 17:47:41'),
(333, 24, '/images/activities/gallery/gallery-1744480062497-746728081.jpeg', NULL, '2025-04-12 17:47:42', '2025-04-12 17:47:42'),
(334, 24, '/images/activities/gallery/gallery-1744480063089-740489482.jpeg', NULL, '2025-04-12 17:47:43', '2025-04-12 17:47:43'),
(335, 24, '/images/activities/gallery/gallery-1744480063938-412870219.jpeg', NULL, '2025-04-12 17:47:43', '2025-04-12 17:47:43'),
(336, 24, '/images/activities/gallery/gallery-1744480064609-834702254.jpeg', NULL, '2025-04-12 17:47:44', '2025-04-12 17:47:44'),
(337, 24, '/images/activities/gallery/gallery-1744480065249-479864213.jpeg', NULL, '2025-04-12 17:47:45', '2025-04-12 17:47:45'),
(338, 24, '/images/activities/gallery/gallery-1744480065763-963388366.jpeg', NULL, '2025-04-12 17:47:45', '2025-04-12 17:47:45'),
(339, 24, '/images/activities/gallery/gallery-1744480066332-996828967.jpeg', NULL, '2025-04-12 17:47:46', '2025-04-12 17:47:46'),
(340, 24, '/images/activities/gallery/gallery-1744480066894-919514343.jpeg', NULL, '2025-04-12 17:47:46', '2025-04-12 17:47:46'),
(341, 24, '/images/activities/gallery/gallery-1744480067500-163724923.jpeg', NULL, '2025-04-12 17:47:47', '2025-04-12 17:47:47'),
(342, 24, '/images/activities/gallery/gallery-1744480067986-24204584.jpeg', NULL, '2025-04-12 17:47:47', '2025-04-12 17:47:47'),
(343, 24, '/images/activities/gallery/gallery-1744480068680-13444802.jpeg', NULL, '2025-04-12 17:47:48', '2025-04-12 17:47:48'),
(344, 24, '/images/activities/gallery/gallery-1744480069620-435337355.jpeg', NULL, '2025-04-12 17:47:49', '2025-04-12 17:47:49'),
(345, 24, '/images/activities/gallery/gallery-1744480070758-496874818.jpeg', NULL, '2025-04-12 17:47:50', '2025-04-12 17:47:50'),
(346, 24, '/images/activities/gallery/gallery-1744480071628-314844639.png', NULL, '2025-04-12 17:47:51', '2025-04-12 17:47:51'),
(347, 24, '/images/activities/gallery/gallery-1744480072040-734598825.jpeg', NULL, '2025-04-12 17:47:52', '2025-04-12 17:47:52'),
(348, 25, '/images/activities/gallery/gallery-1744480310372-36410363.jpeg', NULL, '2025-04-12 17:51:50', '2025-04-12 17:51:50'),
(349, 25, '/images/activities/gallery/gallery-1744480310939-427132438.jpeg', NULL, '2025-04-12 17:51:50', '2025-04-12 17:51:50'),
(350, 25, '/images/activities/gallery/gallery-1744480311415-693531851.jpeg', NULL, '2025-04-12 17:51:51', '2025-04-12 17:51:51'),
(351, 25, '/images/activities/gallery/gallery-1744480311811-136285185.jpeg', NULL, '2025-04-12 17:51:51', '2025-04-12 17:51:51'),
(352, 25, '/images/activities/gallery/gallery-1744480312272-863035239.jpeg', NULL, '2025-04-12 17:51:52', '2025-04-12 17:51:52'),
(353, 25, '/images/activities/gallery/gallery-1744480312703-698141611.jpeg', NULL, '2025-04-12 17:51:52', '2025-04-12 17:51:52'),
(354, 25, '/images/activities/gallery/gallery-1744480313348-540626632.jpeg', NULL, '2025-04-12 17:51:53', '2025-04-12 17:51:53'),
(355, 26, '/images/activities/gallery/gallery-1744480724427-236856886.jpeg', NULL, '2025-04-12 17:58:44', '2025-04-12 17:58:44'),
(356, 26, '/images/activities/gallery/gallery-1744480725210-377373871.jpeg', NULL, '2025-04-12 17:58:45', '2025-04-12 17:58:45'),
(357, 26, '/images/activities/gallery/gallery-1744480726520-615708680.jpeg', NULL, '2025-04-12 17:58:46', '2025-04-12 17:58:46'),
(358, 26, '/images/activities/gallery/gallery-1744480727703-478884164.jpeg', NULL, '2025-04-12 17:58:47', '2025-04-12 17:58:47'),
(359, 26, '/images/activities/gallery/gallery-1744480728298-463158675.jpeg', NULL, '2025-04-12 17:58:48', '2025-04-12 17:58:48'),
(360, 26, '/images/activities/gallery/gallery-1744480728960-867588141.jpeg', NULL, '2025-04-12 17:58:48', '2025-04-12 17:58:48'),
(361, 26, '/images/activities/gallery/gallery-1744480730206-688279163.jpeg', NULL, '2025-04-12 17:58:50', '2025-04-12 17:58:50'),
(362, 26, '/images/activities/gallery/gallery-1744480730773-173245103.jpeg', NULL, '2025-04-12 17:58:50', '2025-04-12 17:58:50'),
(363, 26, '/images/activities/gallery/gallery-1744480731445-495387541.jpeg', NULL, '2025-04-12 17:58:51', '2025-04-12 17:58:51'),
(364, 26, '/images/activities/gallery/gallery-1744480732115-817099275.jpeg', NULL, '2025-04-12 17:58:52', '2025-04-12 17:58:52'),
(365, 26, '/images/activities/gallery/gallery-1744480732832-703876031.jpeg', NULL, '2025-04-12 17:58:52', '2025-04-12 17:58:52'),
(366, 26, '/images/activities/gallery/gallery-1744480733444-263026136.jpeg', NULL, '2025-04-12 17:58:53', '2025-04-12 17:58:53'),
(367, 26, '/images/activities/gallery/gallery-1744480734144-728459513.jpeg', NULL, '2025-04-12 17:58:54', '2025-04-12 17:58:54'),
(370, 31, '/images/activities/gallery/gallery-1760125479902-20185948.jpeg', NULL, '2025-10-10 19:44:39', '2025-10-10 19:44:39');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content_type` varchar(50) NOT NULL COMMENT 'journey, gallery, activity',
  `content_id` int(11) NOT NULL COMMENT 'ID of the content being commented on',
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL COMMENT 'For nested replies',
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content_type`, `content_id`, `user_id`, `parent_id`, `comment`, `created_at`, `updated_at`) VALUES
(1, 'journey', 95, 7, NULL, 'test', '2025-10-10 19:15:47', '2025-10-10 19:15:47');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_checklist`
--

CREATE TABLE `equipment_checklist` (
  `id` int(11) NOT NULL,
  `category` enum('Pakaian','Peralatan Tidur','Peralatan Masak','Navigasi','P3K','Lain-lain') NOT NULL,
  `item_name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('Wajib','Penting','Opsional') DEFAULT 'Penting',
  `for_difficulty` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Which difficulty levels need this' CHECK (json_valid(`for_difficulty`)),
  `can_be_rented` tinyint(1) DEFAULT 0,
  `typical_rental_price` int(11) DEFAULT NULL,
  `typical_purchase_price` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment_checklist`
--

INSERT INTO `equipment_checklist` (`id`, `category`, `item_name`, `description`, `priority`, `for_difficulty`, `can_be_rented`, `typical_rental_price`, `typical_purchase_price`, `created_at`) VALUES
(1, 'Pakaian', 'Jaket Gunung / Windbreaker', 'Jaket anti angin dan air', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 25000, 200000, '2025-10-14 16:45:55'),
(2, 'Pakaian', 'Celana Gunung', 'Celana panjang quick dry', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 150000, '2025-10-14 16:45:55'),
(3, 'Pakaian', 'Kaos Kaki Tebal', 'Kaos kaki hiking', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 50000, '2025-10-14 16:45:55'),
(4, 'Pakaian', 'Sepatu Gunung', 'Sepatu hiking anti slip', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 400000, '2025-10-14 16:45:55'),
(5, 'Pakaian', 'Sarung Tangan', 'Sarung tangan tebal', 'Penting', '[\"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 50000, '2025-10-14 16:45:55'),
(6, 'Pakaian', 'Buff / Masker', 'Pelindung wajah dari debu', 'Penting', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 30000, '2025-10-14 16:45:55'),
(7, 'Peralatan Tidur', 'Carrier 50-70L', 'Tas gunung besar', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 50000, 500000, '2025-10-14 16:45:55'),
(8, 'Peralatan Tidur', 'Tenda', 'Tenda 2-3 orang', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 50000, 800000, '2025-10-14 16:45:55'),
(9, 'Peralatan Tidur', 'Sleeping Bag', 'Sleeping bag suhu dingin', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 30000, 300000, '2025-10-14 16:45:55'),
(10, 'Peralatan Tidur', 'Matras', 'Matras lipat / foam', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 15000, 100000, '2025-10-14 16:45:55'),
(11, 'Peralatan Masak', 'Kompor Portable + Gas', 'Kompor camping', 'Wajib', '[\"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 30000, 200000, '2025-10-14 16:45:55'),
(12, 'Peralatan Masak', 'Nesting / Alat Masak', 'Set alat masak portable', 'Wajib', '[\"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 20000, 150000, '2025-10-14 16:45:55'),
(13, 'Peralatan Masak', 'Sendok Garpu', 'Alat makan', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 20000, '2025-10-14 16:45:55'),
(14, 'Navigasi', 'Headlamp + Baterai Cadangan', 'Senter kepala', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 15000, 100000, '2025-10-14 16:45:55'),
(15, 'Navigasi', 'Trekking Pole', 'Tongkat gunung', 'Penting', '[\"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 1, 15000, 150000, '2025-10-14 16:45:55'),
(16, 'Navigasi', 'GPS / Kompas', 'Alat navigasi', 'Penting', '[\"Sulit\", \"Sangat Sulit\"]', 0, 0, 200000, '2025-10-14 16:45:55'),
(17, 'P3K', 'Obat-obatan Pribadi', 'Obat rutin, vitamin', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 50000, '2025-10-14 16:45:55'),
(18, 'P3K', 'P3K Kit', 'Kotak P3K lengkap', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 100000, '2025-10-14 16:45:55'),
(19, 'P3K', 'Sunblock & Lip Balm', 'Pelindung kulit', 'Penting', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 50000, '2025-10-14 16:45:55'),
(20, 'Lain-lain', 'Botol Minum 1-2L', 'Botol air', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 50000, '2025-10-14 16:45:55'),
(21, 'Lain-lain', 'Makanan & Snack', 'Logistik makanan', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 100000, '2025-10-14 16:45:55'),
(22, 'Lain-lain', 'Plastik Sampah', 'Kantong sampah', 'Wajib', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 5000, '2025-10-14 16:45:55'),
(23, 'Lain-lain', 'Powerbank', 'Charger portable', 'Penting', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 150000, '2025-10-14 16:45:55'),
(24, 'Lain-lain', 'Kamera / HP', 'Dokumentasi', 'Opsional', '[\"Mudah\", \"Sedang\", \"Sulit\", \"Sangat Sulit\"]', 0, 0, 2000000, '2025-10-14 16:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_rental`
--

CREATE TABLE `equipment_rental` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `category` enum('Carrier','Tenda','Sleeping Bag','Kompor','Tracking Pole','Headlamp','Lainnya') DEFAULT 'Lainnya',
  `price_per_day` int(11) DEFAULT 0,
  `stock_quantity` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment_rental`
--

INSERT INTO `equipment_rental` (`id`, `mountain_id`, `equipment_name`, `category`, `price_per_day`, `stock_quantity`, `description`, `is_available`, `created_at`, `updated_at`) VALUES
(1, 9, 'Carrier 32', 'Carrier', 2, 2, 'dcc', 1, '2025-10-15 18:33:54', '2025-10-15 18:33:54');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  `max_participants` int(11) DEFAULT NULL,
  `registration_deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `created_at`, `updated_at`, `status`, `max_participants`, `registration_deadline`) VALUES
(1, 'BUKBER WITH GIMMIK', 'Orang Orang Senang', '2025-03-12', '17:00:00', 'BINTARO 9', '2025-03-10 22:45:29', '2025-03-30 20:30:59', 'completed', 20, '2025-03-12 18:45:00'),
(3, 'ss', 'xxx', '2025-10-16', '05:59:00', 'ws', '2025-10-10 18:59:49', '2025-10-15 18:49:38', 'completed', 22, '2025-10-12 01:59:00');

-- --------------------------------------------------------

--
-- Table structure for table `food_estimates`
--

CREATE TABLE `food_estimates` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `breakfast_cost` int(11) DEFAULT 15000,
  `lunch_cost` int(11) DEFAULT 20000,
  `dinner_cost` int(11) DEFAULT 20000,
  `snack_cost` int(11) DEFAULT 10000,
  `water_cost` int(11) DEFAULT 5000,
  `food_availability` text DEFAULT NULL COMMENT 'Warung di basecamp, bawa dari kota, dll',
  `recommendations` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `food_estimates`
--

INSERT INTO `food_estimates` (`id`, `mountain_id`, `duration_days`, `breakfast_cost`, `lunch_cost`, `dinner_cost`, `snack_cost`, `water_cost`, `food_availability`, `recommendations`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 20000, 25000, 25000, 15000, 10000, 'Warung di Sembalun, bawa logistik sendiri untuk di gunung', 'Bawa makanan instan, air mineral cukup, porter bisa bawa logistik', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(2, 2, 4, 15000, 20000, 20000, 10000, 8000, 'Warung di Ranupane, bawa logistik untuk 4 hari', 'Makanan ringan, mie instan, air mineral, gas untuk masak', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(3, 3, 1, 15000, 20000, 20000, 10000, 5000, 'Warung di Selo, bisa beli sebelum naik', 'Cukup bawa snack dan air mineral', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(4, 4, 2, 20000, 25000, 25000, 15000, 10000, 'Banyak warung di Cemoro Lawang', 'Makanan mudah didapat, harga sedikit mahal', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(5, 5, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Selo, bawa logistik untuk 2 hari', 'Makanan instan, air mineral, gas', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(6, 6, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Cemoro Sewu', 'Bawa logistik sendiri lebih aman', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(7, 7, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Kledung', 'Bawa makanan instan', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(8, 8, 2, 15000, 20000, 20000, 10000, 8000, 'Warung di Garung', 'Bawa logistik sendiri', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(9, 9, 1, 15000, 20000, 20000, 10000, 5000, 'Warung di Patak Banteng', 'Cukup bawa snack', '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(10, 10, 2, 20000, 25000, 25000, 15000, 10000, 'Warung di Cibodas', 'Bawa logistik untuk 2 hari', '2025-10-14 16:45:55', '2025-10-14 16:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` int(11) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `author` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL,
  `gallery_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `gallery_id`, `image_url`, `is_main`, `created_at`) VALUES
(85, 52, '/images/gallery/gallery-1744057280839-340908132.jpg', 0, '2025-04-07 20:21:20'),
(86, 53, '/images/gallery/gallery-1744057294375-793408740.jpg', 0, '2025-04-07 20:21:34'),
(88, 55, '/images/gallery/gallery-1744057479359-693112019.jpg', 0, '2025-04-07 20:24:39'),
(89, 56, '/images/gallery/gallery-1744057528019-19530867.jpg', 0, '2025-04-07 20:25:28'),
(90, 57, '/images/gallery/gallery-1744057564757-957276494.jpg', 0, '2025-04-07 20:26:04'),
(91, 58, '/images/gallery/gallery-1744473849731-863407500.jpeg', 0, '2025-04-12 16:04:09'),
(92, 59, '/images/gallery/gallery-1744473963479-393056858.jpeg', 0, '2025-04-12 16:06:03'),
(93, 60, '/images/gallery/gallery-1744474559972-258811134.jpeg', 0, '2025-04-12 16:15:59'),
(94, 61, '/images/gallery/gallery-1744474932195-218020603.jpeg', 0, '2025-04-12 16:22:12'),
(96, 63, '/images/gallery/gallery-1751041009012-364795574.jpg', 0, '2025-06-27 16:16:49'),
(98, 65, '/images/gallery/gallery-1751041093581-196651656.jpg', 0, '2025-06-27 16:18:13'),
(101, 68, '/images/gallery/gallery-1751041181330-743448488.jpg', 0, '2025-06-27 16:19:41'),
(102, 64, '/images/gallery/gallery-1752231178626-35298313.jpeg', 0, '2025-07-11 10:52:58');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_tags`
--

CREATE TABLE `gallery_tags` (
  `gallery_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_tags`
--

INSERT INTO `gallery_tags` (`gallery_id`, `tag_id`) VALUES
(52, 2),
(58, 2),
(59, 2),
(52, 3),
(53, 3),
(55, 3),
(58, 3),
(56, 8),
(57, 8),
(60, 8);

-- --------------------------------------------------------

--
-- Table structure for table `journey_photos`
--

CREATE TABLE `journey_photos` (
  `id` int(11) NOT NULL,
  `journey_year_id` int(11) NOT NULL,
  `image_src` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `journey_photos`
--

INSERT INTO `journey_photos` (`id`, `journey_year_id`, `image_src`, `caption`, `created_at`, `updated_at`) VALUES
(434, 92, '/images/journey/2024/1744051484617-502773329', '', '2025-04-07 18:44:44', '2025-04-07 18:44:44'),
(435, 92, '/images/journey/2024/1744051486630-417295040', '', '2025-04-07 18:44:46', '2025-04-07 18:44:46'),
(436, 92, '/images/journey/2024/1744051488451-245477557', '', '2025-04-07 18:44:48', '2025-04-07 18:44:48'),
(437, 92, '/images/journey/2024/1744051490085-522664239.jpg', '', '2025-04-07 18:44:50', '2025-04-07 18:44:50'),
(438, 92, '/images/journey/2024/1744051605959-811524004', '', '2025-04-07 18:46:45', '2025-04-07 18:46:45'),
(439, 92, '/images/journey/2024/1744051607751-440847614', '', '2025-04-07 18:46:47', '2025-04-07 18:46:47'),
(440, 92, '/images/journey/2024/1744051609550-947205629', '', '2025-04-07 18:46:49', '2025-04-07 18:46:49'),
(441, 92, '/images/journey/2024/1744051611373-962765380', '', '2025-04-07 18:46:51', '2025-04-07 18:46:51'),
(442, 92, '/images/journey/2024/1744051613237-793248410', '', '2025-04-07 18:46:53', '2025-04-07 18:46:53'),
(443, 92, '/images/journey/2024/1744051615228-949582739', '', '2025-04-07 18:46:55', '2025-04-07 18:46:55'),
(444, 92, '/images/journey/2024/1744051617275-290731303', '', '2025-04-07 18:46:57', '2025-04-07 18:46:57'),
(445, 92, '/images/journey/2024/1744051619170-980653962', '', '2025-04-07 18:46:59', '2025-04-07 18:46:59'),
(446, 92, '/images/journey/2024/1744051621325-495368173', '', '2025-04-07 18:47:01', '2025-04-07 18:47:01'),
(447, 92, '/images/journey/2024/1744051623580-317764387', '', '2025-04-07 18:47:03', '2025-04-07 18:47:03'),
(448, 92, '/images/journey/2024/1744051625667-856247462', '', '2025-04-07 18:47:05', '2025-04-07 18:47:05'),
(449, 92, '/images/journey/2024/1744051627625-826201052', '', '2025-04-07 18:47:07', '2025-04-07 18:47:07'),
(450, 92, '/images/journey/2024/1744051629743-949811038', '', '2025-04-07 18:47:09', '2025-04-07 18:47:09'),
(451, 92, '/images/journey/2024/1744051631895-12840318', '', '2025-04-07 18:47:11', '2025-04-07 18:47:11'),
(452, 92, '/images/journey/2024/1744051634024-902661501', '', '2025-04-07 18:47:14', '2025-04-07 18:47:14'),
(453, 92, '/images/journey/2024/1744051635714-760236200', '', '2025-04-07 18:47:15', '2025-04-07 18:47:15'),
(454, 92, '/images/journey/2024/1744051637421-996136092', '', '2025-04-07 18:47:17', '2025-04-07 18:47:17'),
(455, 92, '/images/journey/2024/1744051639260-441764739', '', '2025-04-07 18:47:19', '2025-04-07 18:47:19'),
(456, 92, '/images/journey/2024/1744051641169-302523211', '', '2025-04-07 18:47:21', '2025-04-07 18:47:21'),
(457, 92, '/images/journey/2024/1744051643048-269215633', '', '2025-04-07 18:47:23', '2025-04-07 18:47:23'),
(458, 92, '/images/journey/2024/1744051644794-686746068', '', '2025-04-07 18:47:24', '2025-04-07 18:47:24'),
(459, 92, '/images/journey/2024/1744051646553-252519098', '', '2025-04-07 18:47:26', '2025-04-07 18:47:26'),
(460, 92, '/images/journey/2024/1744051648297-66927558', '', '2025-04-07 18:47:28', '2025-04-07 18:47:28'),
(461, 92, '/images/journey/2024/1744051650297-936263301', '', '2025-04-07 18:47:30', '2025-04-07 18:47:30'),
(462, 92, '/images/journey/2024/1744051652139-42523130', '', '2025-04-07 18:47:32', '2025-04-07 18:47:32'),
(463, 92, '/images/journey/2024/1744051653993-937850609', '', '2025-04-07 18:47:34', '2025-04-07 18:47:34'),
(464, 92, '/images/journey/2024/1744051655578-710489440', '', '2025-04-07 18:47:35', '2025-04-07 18:47:35'),
(465, 92, '/images/journey/2024/1744051657535-188994783', '', '2025-04-07 18:47:37', '2025-04-07 18:47:37'),
(466, 92, '/images/journey/2024/1744051659231-340010101', '', '2025-04-07 18:47:39', '2025-04-07 18:47:39'),
(467, 92, '/images/journey/2024/1744051661090-69306699', '', '2025-04-07 18:47:41', '2025-04-07 18:47:41'),
(468, 92, '/images/journey/2024/1744051662877-474508997', '', '2025-04-07 18:47:42', '2025-04-07 18:47:42'),
(469, 92, '/images/journey/2024/1744051664662-736901599', '', '2025-04-07 18:47:44', '2025-04-07 18:47:44'),
(470, 92, '/images/journey/2024/1744051666389-726925048', '', '2025-04-07 18:47:46', '2025-04-07 18:47:46'),
(471, 92, '/images/journey/2024/1744051668095-929900443', '', '2025-04-07 18:47:48', '2025-04-07 18:47:48'),
(472, 92, '/images/journey/2024/1744051669909-631695758', '', '2025-04-07 18:47:49', '2025-04-07 18:47:49'),
(473, 92, '/images/journey/2024/1744051671624-105311088', '', '2025-04-07 18:47:51', '2025-04-07 18:47:51'),
(474, 92, '/images/journey/2024/1744051674617-666111219', '', '2025-04-07 18:47:54', '2025-04-07 18:47:54'),
(475, 92, '/images/journey/2024/1744051676282-851937475', '', '2025-04-07 18:47:56', '2025-04-07 18:47:56'),
(476, 92, '/images/journey/2024/1744051677861-563064489', '', '2025-04-07 18:47:57', '2025-04-07 18:47:57'),
(477, 92, '/images/journey/2024/1744051879264-93290872.jpg', '', '2025-04-07 18:51:19', '2025-04-07 18:51:19'),
(479, 92, '/images/journey/2024/1744052245752-973480874', '', '2025-04-07 18:57:25', '2025-04-07 18:57:25'),
(480, 92, '/images/journey/2024/1744052247461-693987764', '', '2025-04-07 18:57:27', '2025-04-07 18:57:27'),
(481, 92, '/images/journey/2024/1744052249775-352437631.jpg', '', '2025-04-07 18:57:29', '2025-04-07 18:57:29'),
(482, 92, '/images/journey/2024/1744052251940-107655628.jpg', '', '2025-04-07 18:57:31', '2025-04-07 18:57:31'),
(483, 92, '/images/journey/2024/1744052254218-432281697.jpg', '', '2025-04-07 18:57:34', '2025-04-07 18:57:34'),
(484, 92, '/images/journey/2024/1744052256585-849286806.jpg', '', '2025-04-07 18:57:36', '2025-04-07 18:57:36'),
(485, 92, '/images/journey/2024/1744052258659-661632593', '', '2025-04-07 18:57:38', '2025-04-07 18:57:38'),
(486, 92, '/images/journey/2024/1744052260855-441091408', '', '2025-04-07 18:57:40', '2025-04-07 18:57:40'),
(487, 92, '/images/journey/2024/1744052264404-583130942', '', '2025-04-07 18:57:44', '2025-04-07 18:57:44'),
(488, 92, '/images/journey/2024/1744052266625-839734480', '', '2025-04-07 18:57:46', '2025-04-07 18:57:46'),
(494, 92, '/images/journey/2024/1744052281047-147638601', '', '2025-04-07 18:58:01', '2025-04-07 18:58:01'),
(498, 92, '/images/journey/2024/1744052290909-495876460', '', '2025-04-07 18:58:10', '2025-04-07 18:58:10'),
(499, 92, '/images/journey/2024/1744052293367-556255109', '', '2025-04-07 18:58:13', '2025-04-07 18:58:13'),
(500, 92, '/images/journey/2024/1744052295699-346932554', '', '2025-04-07 18:58:15', '2025-04-07 18:58:15'),
(501, 92, '/images/journey/2024/1744052298110-404287026', '', '2025-04-07 18:58:18', '2025-04-07 18:58:18'),
(502, 92, '/images/journey/2024/1744052300925-178629665', '', '2025-04-07 18:58:20', '2025-04-07 18:58:20'),
(503, 92, '/images/journey/2024/1744052303167-406789390', '', '2025-04-07 18:58:23', '2025-04-07 18:58:23'),
(505, 92, '/images/journey/2024/1744052306654-667525787', '', '2025-04-07 18:58:26', '2025-04-07 18:58:26'),
(506, 92, '/images/journey/2024/1744052309135-567103514', '', '2025-04-07 18:58:29', '2025-04-07 18:58:29'),
(507, 92, '/images/journey/2024/1744052311503-786914602', '', '2025-04-07 18:58:31', '2025-04-07 18:58:31'),
(508, 92, '/images/journey/2024/1744052314228-396170813', '', '2025-04-07 18:58:34', '2025-04-07 18:58:34'),
(510, 92, '/images/journey/2024/1744052318901-772908740', '', '2025-04-07 18:58:38', '2025-04-07 18:58:38'),
(511, 92, '/images/journey/2024/1744052321445-243575789', '', '2025-04-07 18:58:41', '2025-04-07 18:58:41'),
(513, 92, '/images/journey/2024/1744052325891-359076001', '', '2025-04-07 18:58:45', '2025-04-07 18:58:45'),
(514, 92, '/images/journey/2024/1744052327921-9183759', '', '2025-04-07 18:58:47', '2025-04-07 18:58:47'),
(517, 92, '/images/journey/2024/1744052335573-877467070', '', '2025-04-07 18:58:55', '2025-04-07 18:58:55'),
(520, 92, '/images/journey/2024/1744052342743-295336672', '', '2025-04-07 18:59:02', '2025-04-07 18:59:02'),
(521, 92, '/images/journey/2024/1744052344099-951356271', '', '2025-04-07 18:59:04', '2025-04-07 18:59:04'),
(524, 92, '/images/journey/2024/1744052350980-119281668', '', '2025-04-07 18:59:10', '2025-04-07 18:59:10'),
(525, 92, '/images/journey/2024/1744052353176-558705946', '', '2025-04-07 18:59:13', '2025-04-07 18:59:13'),
(526, 92, '/images/journey/2024/1744052355586-8719505', '', '2025-04-07 18:59:15', '2025-04-07 18:59:15'),
(527, 92, '/images/journey/2024/1744052357897-877087233', '', '2025-04-07 18:59:17', '2025-04-07 18:59:17'),
(528, 92, '/images/journey/2024/1744052360788-88552366', '', '2025-04-07 18:59:20', '2025-04-07 18:59:20'),
(534, 92, '/images/journey/2024/1744054931405-788460795', '', '2025-04-07 19:42:11', '2025-04-07 19:42:11'),
(535, 92, '/images/journey/2024/1744055008328-815591457', '', '2025-04-07 19:43:28', '2025-04-07 19:43:28'),
(536, 92, '/images/journey/2024/1744055008753-790696033', '', '2025-04-07 19:43:28', '2025-04-07 19:43:28'),
(537, 92, '/images/journey/2024/1744055008849-738912899', '', '2025-04-07 19:43:28', '2025-04-07 19:43:28'),
(538, 92, '/images/journey/2024/1744055009211-242567335', '', '2025-04-07 19:43:29', '2025-04-07 19:43:29'),
(539, 92, '/images/journey/2024/1744055009444-553566343', '', '2025-04-07 19:43:29', '2025-04-07 19:43:29'),
(540, 92, '/images/journey/2024/1744055009764-25879348', '', '2025-04-07 19:43:29', '2025-04-07 19:43:29'),
(541, 92, '/images/journey/2024/1744055010430-106563635', '', '2025-04-07 19:43:30', '2025-04-07 19:43:30'),
(542, 92, '/images/journey/2024/1744055010705-277422351', '', '2025-04-07 19:43:30', '2025-04-07 19:43:30'),
(543, 92, '/images/journey/2024/1744055011049-711615552', '', '2025-04-07 19:43:31', '2025-04-07 19:43:31'),
(544, 92, '/images/journey/2024/1744055011345-861892841', '', '2025-04-07 19:43:31', '2025-04-07 19:43:31'),
(545, 92, '/images/journey/2024/1744055011803-250432154', '', '2025-04-07 19:43:31', '2025-04-07 19:43:31'),
(546, 92, '/images/journey/2024/1744055012211-354537818', '', '2025-04-07 19:43:32', '2025-04-07 19:43:32'),
(547, 92, '/images/journey/2024/1744055012593-148860721', '', '2025-04-07 19:43:32', '2025-04-07 19:43:32'),
(548, 92, '/images/journey/2024/1744055012996-937588757', '', '2025-04-07 19:43:32', '2025-04-07 19:43:32'),
(549, 92, '/images/journey/2024/1744055013168-625478323', '', '2025-04-07 19:43:33', '2025-04-07 19:43:33'),
(550, 92, '/images/journey/2024/1744055013571-188721582', '', '2025-04-07 19:43:33', '2025-04-07 19:43:33'),
(551, 92, '/images/journey/2024/1744055013865-288962346', '', '2025-04-07 19:43:33', '2025-04-07 19:43:33'),
(552, 92, '/images/journey/2024/1744055014356-684086065', '', '2025-04-07 19:43:34', '2025-04-07 19:43:34'),
(553, 92, '/images/journey/2024/1744055015468-521563457', '', '2025-04-07 19:43:35', '2025-04-07 19:43:35'),
(554, 92, '/images/journey/2024/1744055015833-30448219', '', '2025-04-07 19:43:35', '2025-04-07 19:43:35'),
(555, 92, '/images/journey/2024/1744055016211-653631585', '', '2025-04-07 19:43:36', '2025-04-07 19:43:36'),
(556, 92, '/images/journey/2024/1744055017065-960573355', '', '2025-04-07 19:43:37', '2025-04-07 19:43:37'),
(557, 92, '/images/journey/2024/1744055017571-364884622', '', '2025-04-07 19:43:37', '2025-04-07 19:43:37'),
(558, 92, '/images/journey/2024/1744055017791-429376694', '', '2025-04-07 19:43:37', '2025-04-07 19:43:37'),
(559, 92, '/images/journey/2024/1744055106731-374180846', '', '2025-04-07 19:45:06', '2025-04-07 19:45:06'),
(560, 92, '/images/journey/2024/1744055106977-261436992', '', '2025-04-07 19:45:06', '2025-04-07 19:45:06'),
(561, 92, '/images/journey/2024/1744055107786-592747991', '', '2025-04-07 19:45:07', '2025-04-07 19:45:07'),
(562, 92, '/images/journey/2024/1744055108136-650062615', '', '2025-04-07 19:45:08', '2025-04-07 19:45:08'),
(563, 92, '/images/journey/2024/1744055108689-669992757', '', '2025-04-07 19:45:08', '2025-04-07 19:45:08'),
(564, 92, '/images/journey/2024/1744055109003-937731503', '', '2025-04-07 19:45:09', '2025-04-07 19:45:09'),
(565, 92, '/images/journey/2024/1744055109328-816454594', '', '2025-04-07 19:45:09', '2025-04-07 19:45:09'),
(566, 92, '/images/journey/2024/1744055109742-276559997', '', '2025-04-07 19:45:09', '2025-04-07 19:45:09'),
(567, 92, '/images/journey/2024/1744055110344-426790712', '', '2025-04-07 19:45:10', '2025-04-07 19:45:10'),
(568, 92, '/images/journey/2024/1744055110619-323077854', '', '2025-04-07 19:45:10', '2025-04-07 19:45:10'),
(569, 92, '/images/journey/2024/1744055110852-40814425', '', '2025-04-07 19:45:10', '2025-04-07 19:45:10'),
(570, 92, '/images/journey/2024/1744055111049-413312577', '', '2025-04-07 19:45:11', '2025-04-07 19:45:11'),
(571, 92, '/images/journey/2024/1744055111573-505651341', '', '2025-04-07 19:45:11', '2025-04-07 19:45:11'),
(572, 92, '/images/journey/2024/1744055112086-641543662', '', '2025-04-07 19:45:12', '2025-04-07 19:45:12'),
(573, 92, '/images/journey/2024/1744055112397-454557933', '', '2025-04-07 19:45:12', '2025-04-07 19:45:12'),
(574, 92, '/images/journey/2024/1744055113085-579534086', '', '2025-04-07 19:45:13', '2025-04-07 19:45:13'),
(575, 92, '/images/journey/2024/1744055114031-426303333', '', '2025-04-07 19:45:14', '2025-04-07 19:45:14'),
(576, 92, '/images/journey/2024/1744055114354-101543650', '', '2025-04-07 19:45:14', '2025-04-07 19:45:14'),
(577, 92, '/images/journey/2024/1744055114785-546861529', '', '2025-04-07 19:45:14', '2025-04-07 19:45:14'),
(578, 92, '/images/journey/2024/1744055115182-688109414', '', '2025-04-07 19:45:15', '2025-04-07 19:45:15'),
(579, 92, '/images/journey/2024/1744055115563-280878363', '', '2025-04-07 19:45:15', '2025-04-07 19:45:15'),
(580, 92, '/images/journey/2024/1744055116936-283961981', '', '2025-04-07 19:45:16', '2025-04-07 19:45:16'),
(581, 92, '/images/journey/2024/1744055117632-32308582', '', '2025-04-07 19:45:17', '2025-04-07 19:45:17'),
(582, 92, '/images/journey/2024/1744055118423-813243457', '', '2025-04-07 19:45:18', '2025-04-07 19:45:18'),
(583, 92, '/images/journey/2024/1744055118849-974934594', '', '2025-04-07 19:45:18', '2025-04-07 19:45:18'),
(584, 92, '/images/journey/2024/1744055119258-583607881', '', '2025-04-07 19:45:19', '2025-04-07 19:45:19'),
(585, 92, '/images/journey/2024/1744055119848-884289569', '', '2025-04-07 19:45:19', '2025-04-07 19:45:19'),
(586, 92, '/images/journey/2024/1744055120507-946595969', '', '2025-04-07 19:45:20', '2025-04-07 19:45:20'),
(587, 92, '/images/journey/2024/1744055120927-626573049', '', '2025-04-07 19:45:20', '2025-04-07 19:45:20'),
(588, 92, '/images/journey/2024/1744055121383-229085971', '', '2025-04-07 19:45:21', '2025-04-07 19:45:21'),
(589, 92, '/images/journey/2024/1744055121667-322611664', '', '2025-04-07 19:45:21', '2025-04-07 19:45:21'),
(590, 92, '/images/journey/2024/1744055122854-933024112', '', '2025-04-07 19:45:22', '2025-04-07 19:45:22'),
(591, 92, '/images/journey/2024/1744055123503-839872887', '', '2025-04-07 19:45:23', '2025-04-07 19:45:23'),
(592, 92, '/images/journey/2024/1744055123985-352966355', '', '2025-04-07 19:45:23', '2025-04-07 19:45:23'),
(593, 92, '/images/journey/2024/1744055124494-149897297', '', '2025-04-07 19:45:24', '2025-04-07 19:45:24'),
(594, 92, '/images/journey/2024/1744055124943-198346890', '', '2025-04-07 19:45:24', '2025-04-07 19:45:24'),
(595, 92, '/images/journey/2024/1744055125404-82916737', '', '2025-04-07 19:45:25', '2025-04-07 19:45:25'),
(596, 92, '/images/journey/2024/1744055125927-934023116', '', '2025-04-07 19:45:25', '2025-04-07 19:45:25'),
(597, 92, '/images/journey/2024/1744055126464-426070045', '', '2025-04-07 19:45:26', '2025-04-07 19:45:26'),
(598, 92, '/images/journey/2024/1744055126999-266939494', '', '2025-04-07 19:45:27', '2025-04-07 19:45:27'),
(599, 92, '/images/journey/2024/1744055127407-837498574', '', '2025-04-07 19:45:27', '2025-04-07 19:45:27'),
(600, 92, '/images/journey/2024/1744055127609-93881261', '', '2025-04-07 19:45:27', '2025-04-07 19:45:27'),
(601, 92, '/images/journey/2024/1744055127886-6986238', '', '2025-04-07 19:45:27', '2025-04-07 19:45:27'),
(602, 92, '/images/journey/2024/1744055128122-847880692', '', '2025-04-07 19:45:28', '2025-04-07 19:45:28'),
(603, 92, '/images/journey/2024/1744055128312-825841194', '', '2025-04-07 19:45:28', '2025-04-07 19:45:28'),
(604, 92, '/images/journey/2024/1744055330822-278986251', '', '2025-04-07 19:48:50', '2025-04-07 19:48:50'),
(605, 92, '/images/journey/2024/1744055331145-191131430', '', '2025-04-07 19:48:51', '2025-04-07 19:48:51'),
(606, 92, '/images/journey/2024/1744055331719-855562052', '', '2025-04-07 19:48:51', '2025-04-07 19:48:51'),
(607, 92, '/images/journey/2024/1744055332123-897859222', '', '2025-04-07 19:48:52', '2025-04-07 19:48:52'),
(608, 92, '/images/journey/2024/1744055332384-562579117', '', '2025-04-07 19:48:52', '2025-04-07 19:48:52'),
(609, 92, '/images/journey/2024/1744055332957-311976460', '', '2025-04-07 19:48:52', '2025-04-07 19:48:52'),
(610, 92, '/images/journey/2024/1744055333293-173747772', '', '2025-04-07 19:48:53', '2025-04-07 19:48:53'),
(611, 92, '/images/journey/2024/1744055333576-905899706', '', '2025-04-07 19:48:53', '2025-04-07 19:48:53'),
(612, 92, '/images/journey/2024/1744055333898-206669450', '', '2025-04-07 19:48:53', '2025-04-07 19:48:53'),
(613, 92, '/images/journey/2024/1744055334622-346222943', '', '2025-04-07 19:48:54', '2025-04-07 19:48:54'),
(614, 92, '/images/journey/2024/1744055336010-13232998', '', '2025-04-07 19:48:56', '2025-04-07 19:48:56'),
(615, 92, '/images/journey/2024/1744055337221-622009607', '', '2025-04-07 19:48:57', '2025-04-07 19:48:57'),
(616, 92, '/images/journey/2024/1744055337606-259948238', '', '2025-04-07 19:48:57', '2025-04-07 19:48:57'),
(617, 92, '/images/journey/2024/1744055338632-622594388', '', '2025-04-07 19:48:58', '2025-04-07 19:48:58'),
(618, 92, '/images/journey/2024/1744055339766-543029110', '', '2025-04-07 19:48:59', '2025-04-07 19:48:59'),
(619, 92, '/images/journey/2024/1744055340797-563353004', '', '2025-04-07 19:49:00', '2025-04-07 19:49:00'),
(620, 92, '/images/journey/2024/1744055342858-200551052', '', '2025-04-07 19:49:02', '2025-04-07 19:49:02'),
(622, 92, '/images/journey/2024/1744055344544-848710669', '', '2025-04-07 19:49:04', '2025-04-07 19:49:04'),
(623, 92, '/images/journey/2024/1744055345111-980823496', '', '2025-04-07 19:49:05', '2025-04-07 19:49:05'),
(624, 92, '/images/journey/2024/1744055346191-42807121', '', '2025-04-07 19:49:06', '2025-04-07 19:49:06'),
(625, 92, '/images/journey/2024/1744055347269-521817500', '', '2025-04-07 19:49:07', '2025-04-07 19:49:07'),
(626, 92, '/images/journey/2024/1744055347919-874933996', '', '2025-04-07 19:49:07', '2025-04-07 19:49:07'),
(627, 92, '/images/journey/2024/1744055348486-155927597', '', '2025-04-07 19:49:08', '2025-04-07 19:49:08'),
(628, 92, '/images/journey/2024/1744055349196-310567822', '', '2025-04-07 19:49:09', '2025-04-07 19:49:09'),
(629, 92, '/images/journey/2024/1744055350324-276430629', '', '2025-04-07 19:49:10', '2025-04-07 19:49:10'),
(630, 92, '/images/journey/2024/1744055351147-59907558', '', '2025-04-07 19:49:11', '2025-04-07 19:49:11'),
(631, 92, '/images/journey/2024/1744055352196-880512674', '', '2025-04-07 19:49:12', '2025-04-07 19:49:12'),
(632, 92, '/images/journey/2024/1744055353207-774603147', '', '2025-04-07 19:49:13', '2025-04-07 19:49:13'),
(633, 92, '/images/journey/2024/1744055354345-500427920', '', '2025-04-07 19:49:14', '2025-04-07 19:49:14'),
(634, 92, '/images/journey/2024/1744055355293-797267740', '', '2025-04-07 19:49:15', '2025-04-07 19:49:15'),
(635, 92, '/images/journey/2024/1744055356327-726642127', '', '2025-04-07 19:49:16', '2025-04-07 19:49:16'),
(636, 92, '/images/journey/2024/1744055357586-684035760', '', '2025-04-07 19:49:17', '2025-04-07 19:49:17'),
(637, 92, '/images/journey/2024/1744055358312-751629571', '', '2025-04-07 19:49:18', '2025-04-07 19:49:18'),
(638, 92, '/images/journey/2024/1744055359510-999468871', '', '2025-04-07 19:49:19', '2025-04-07 19:49:19'),
(639, 92, '/images/journey/2024/1744055360592-611280637', '', '2025-04-07 19:49:20', '2025-04-07 19:49:20'),
(640, 92, '/images/journey/2024/1744055361441-968153427', '', '2025-04-07 19:49:21', '2025-04-07 19:49:21'),
(641, 92, '/images/journey/2024/1744055362375-503148069', '', '2025-04-07 19:49:22', '2025-04-07 19:49:22'),
(642, 92, '/images/journey/2024/1744055363634-986533468', '', '2025-04-07 19:49:23', '2025-04-07 19:49:23'),
(643, 92, '/images/journey/2024/1744055365040-628105505', '', '2025-04-07 19:49:25', '2025-04-07 19:49:25'),
(644, 92, '/images/journey/2024/1744055366052-406644846', '', '2025-04-07 19:49:26', '2025-04-07 19:49:26'),
(645, 92, '/images/journey/2024/1744055367319-624952953', '', '2025-04-07 19:49:27', '2025-04-07 19:49:27'),
(646, 92, '/images/journey/2024/1744055368097-253070678', '', '2025-04-07 19:49:28', '2025-04-07 19:49:28'),
(647, 92, '/images/journey/2024/1744055369082-786215435', '', '2025-04-07 19:49:29', '2025-04-07 19:49:29'),
(648, 92, '/images/journey/2024/1744055370241-132786591', '', '2025-04-07 19:49:30', '2025-04-07 19:49:30'),
(649, 92, '/images/journey/2024/1744055371353-825082568', '', '2025-04-07 19:49:31', '2025-04-07 19:49:31'),
(650, 92, '/images/journey/2024/1744055372335-870196721', '', '2025-04-07 19:49:32', '2025-04-07 19:49:32'),
(651, 92, '/images/journey/2024/1744055373091-425428555', '', '2025-04-07 19:49:33', '2025-04-07 19:49:33'),
(652, 92, '/images/journey/2024/1744055373924-663397087', '', '2025-04-07 19:49:33', '2025-04-07 19:49:33'),
(653, 92, '/images/journey/2024/1744055374771-372404051', '', '2025-04-07 19:49:34', '2025-04-07 19:49:34'),
(654, 92, '/images/journey/2024/1744055375765-780502104', '', '2025-04-07 19:49:35', '2025-04-07 19:49:35'),
(655, 92, '/images/journey/2024/1744055376845-169700468', '', '2025-04-07 19:49:36', '2025-04-07 19:49:36'),
(656, 92, '/images/journey/2024/1744055377853-636388934', '', '2025-04-07 19:49:37', '2025-04-07 19:49:37'),
(657, 92, '/images/journey/2024/1744055378884-136407336', '', '2025-04-07 19:49:38', '2025-04-07 19:49:38'),
(658, 92, '/images/journey/2024/1744055379675-574396977', '', '2025-04-07 19:49:39', '2025-04-07 19:49:39'),
(659, 92, '/images/journey/2024/1744055380634-840510059', '', '2025-04-07 19:49:40', '2025-04-07 19:49:40'),
(660, 92, '/images/journey/2024/1744055381436-8891138', '', '2025-04-07 19:49:41', '2025-04-07 19:49:41'),
(661, 92, '/images/journey/2024/1744055382482-867035274', '', '2025-04-07 19:49:42', '2025-04-07 19:49:42'),
(662, 92, '/images/journey/2024/1744055385206-34677844', '', '2025-04-07 19:49:45', '2025-04-07 19:49:45'),
(663, 92, '/images/journey/2024/1744055386283-241802670', '', '2025-04-07 19:49:46', '2025-04-07 19:49:46'),
(664, 92, '/images/journey/2024/1744055386985-394186143', '', '2025-04-07 19:49:46', '2025-04-07 19:49:46'),
(665, 92, '/images/journey/2024/1744055388086-639760134', '', '2025-04-07 19:49:48', '2025-04-07 19:49:48'),
(666, 92, '/images/journey/2024/1744055390255-12975784', '', '2025-04-07 19:49:50', '2025-04-07 19:49:50'),
(667, 92, '/images/journey/2024/1744055391559-850864944', '', '2025-04-07 19:49:51', '2025-04-07 19:49:51'),
(668, 92, '/images/journey/2024/1744055395328-365125123', '', '2025-04-07 19:49:55', '2025-04-07 19:49:55'),
(669, 92, '/images/journey/2024/1744055396224-129529196', '', '2025-04-07 19:49:56', '2025-04-07 19:49:56'),
(670, 92, '/images/journey/2024/1744055397782-82945158', '', '2025-04-07 19:49:57', '2025-04-07 19:49:57'),
(671, 92, '/images/journey/2024/1744055398517-202497724', '', '2025-04-07 19:49:58', '2025-04-07 19:49:58'),
(672, 92, '/images/journey/2024/1744055398952-781127081', '', '2025-04-07 19:49:58', '2025-04-07 19:49:58'),
(673, 92, '/images/journey/2024/1744055399455-496967380', '', '2025-04-07 19:49:59', '2025-04-07 19:49:59'),
(677, 93, '/images/journey/2023/1744056976001-711194591.jpg', '', '2025-04-07 20:16:16', '2025-04-07 20:16:16'),
(678, 93, '/images/journey/2023/1744056976950-414880033.jpg', '', '2025-04-07 20:16:16', '2025-04-07 20:16:16'),
(679, 93, '/images/journey/2023/1744056977815-535493175.jpg', '', '2025-04-07 20:16:17', '2025-04-07 20:16:17'),
(680, 93, '/images/journey/2023/1744056978722-303318105.jpg', '', '2025-04-07 20:16:18', '2025-04-07 20:16:18'),
(681, 93, '/images/journey/2023/1744056980124-361676645.jpg', '', '2025-04-07 20:16:20', '2025-04-07 20:16:20'),
(682, 93, '/images/journey/2023/1744056980496-778002481.jpg', '', '2025-04-07 20:16:20', '2025-04-07 20:16:20'),
(689, 93, '/images/journey/2023/1744480978994-215791798', '', '2025-04-12 18:02:58', '2025-04-12 18:02:58'),
(690, 93, '/images/journey/2023/1744480979559-254593229', '', '2025-04-12 18:02:59', '2025-04-12 18:02:59'),
(691, 93, '/images/journey/2023/1744480979959-901770182', '', '2025-04-12 18:02:59', '2025-04-12 18:02:59'),
(692, 93, '/images/journey/2023/1744480980576-889414461', '', '2025-04-12 18:03:00', '2025-04-12 18:03:00'),
(693, 93, '/images/journey/2023/1744480980980-289607919', '', '2025-04-12 18:03:00', '2025-04-12 18:03:00'),
(694, 93, '/images/journey/2023/1744480981707-643553621', '', '2025-04-12 18:03:01', '2025-04-12 18:03:01'),
(695, 93, '/images/journey/2023/1744480982388-212901335', '', '2025-04-12 18:03:02', '2025-04-12 18:03:02'),
(696, 93, '/images/journey/2023/1744480983001-742314717', '', '2025-04-12 18:03:03', '2025-04-12 18:03:03'),
(697, 93, '/images/journey/2023/1744480983810-21833247', '', '2025-04-12 18:03:03', '2025-04-12 18:03:03'),
(698, 93, '/images/journey/2023/1744480984583-606633202', '', '2025-04-12 18:03:04', '2025-04-12 18:03:04'),
(699, 93, '/images/journey/2023/1744480985021-740363495', '', '2025-04-12 18:03:05', '2025-04-12 18:03:05'),
(700, 93, '/images/journey/2023/1744480985305-895295830', '', '2025-04-12 18:03:05', '2025-04-12 18:03:05'),
(701, 93, '/images/journey/2023/1744480985758-857287468', '', '2025-04-12 18:03:05', '2025-04-12 18:03:05'),
(702, 93, '/images/journey/2023/1744480986208-334085991', '', '2025-04-12 18:03:06', '2025-04-12 18:03:06'),
(703, 93, '/images/journey/2023/1744480986696-123554774', '', '2025-04-12 18:03:06', '2025-04-12 18:03:06'),
(704, 93, '/images/journey/2023/1744480987382-888174017', '', '2025-04-12 18:03:07', '2025-04-12 18:03:07'),
(705, 93, '/images/journey/2023/1744480988011-945396550', '', '2025-04-12 18:03:08', '2025-04-12 18:03:08'),
(706, 93, '/images/journey/2023/1744480988452-806917414', '', '2025-04-12 18:03:08', '2025-04-12 18:03:08'),
(707, 93, '/images/journey/2023/1744480988849-548214995', '', '2025-04-12 18:03:08', '2025-04-12 18:03:08'),
(708, 93, '/images/journey/2023/1744480989963-46792422.jpeg', '', '2025-04-12 18:03:09', '2025-04-12 18:03:09'),
(709, 93, '/images/journey/2023/1744480990677-836192408', '', '2025-04-12 18:03:10', '2025-04-12 18:03:10'),
(710, 93, '/images/journey/2023/1744480991738-122266026', '', '2025-04-12 18:03:11', '2025-04-12 18:03:11'),
(711, 93, '/images/journey/2023/1744480992341-196877835', '', '2025-04-12 18:03:12', '2025-04-12 18:03:12'),
(712, 95, '/images/journey/2022/1744481114005-814639210.jpeg', '', '2025-04-12 18:05:14', '2025-04-12 18:05:14'),
(713, 95, '/images/journey/2022/1744481114338-379958572.jpeg', '', '2025-04-12 18:05:14', '2025-04-12 18:05:14'),
(714, 95, '/images/journey/2022/1744481114658-426174386.jpeg', '', '2025-04-12 18:05:14', '2025-04-12 18:05:14'),
(715, 95, '/images/journey/2022/1744481114862-934304701.jpeg', '', '2025-04-12 18:05:14', '2025-04-12 18:05:14'),
(716, 95, '/images/journey/2022/1744481115169-794695411.jpeg', '', '2025-04-12 18:05:15', '2025-04-12 18:05:15'),
(717, 95, '/images/journey/2022/1744481115492-397876889.jpeg', '', '2025-04-12 18:05:15', '2025-04-12 18:05:15'),
(718, 95, '/images/journey/2022/1744481116190-586537387.jpeg', '', '2025-04-12 18:05:16', '2025-04-12 18:05:16'),
(719, 95, '/images/journey/2022/1744481116544-150837521.jpeg', '', '2025-04-12 18:05:16', '2025-04-12 18:05:16'),
(720, 95, '/images/journey/2022/1744481116687-818687723.jpeg', '', '2025-04-12 18:05:16', '2025-04-12 18:05:16'),
(721, 95, '/images/journey/2022/1744481116898-141389349.jpeg', '', '2025-04-12 18:05:16', '2025-04-12 18:05:16'),
(722, 95, '/images/journey/2022/1744481117062-574472475.jpeg', '', '2025-04-12 18:05:17', '2025-04-12 18:05:17'),
(723, 95, '/images/journey/2022/1744481117333-557253476.jpeg', '', '2025-04-12 18:05:17', '2025-04-12 18:05:17'),
(724, 95, '/images/journey/2022/1744481117709-271608571', '', '2025-04-12 18:05:17', '2025-04-12 18:05:17'),
(725, 95, '/images/journey/2022/1744481118090-95487931', '', '2025-04-12 18:05:18', '2025-04-12 18:05:18'),
(726, 95, '/images/journey/2022/1744481118514-219473767.jpeg', '', '2025-04-12 18:05:18', '2025-04-12 18:05:18'),
(727, 95, '/images/journey/2022/1744481118786-765226947.jpeg', '', '2025-04-12 18:05:18', '2025-04-12 18:05:18'),
(728, 95, '/images/journey/2022/1744481119090-478882135.jpeg', '', '2025-04-12 18:05:19', '2025-04-12 18:05:19'),
(729, 95, '/images/journey/2022/1744481119532-774507820.jpeg', '', '2025-04-12 18:05:19', '2025-04-12 18:05:19'),
(730, 95, '/images/journey/2022/1744481119980-802836948.jpeg', '', '2025-04-12 18:05:19', '2025-04-12 18:05:19'),
(731, 95, '/images/journey/2022/1744481120159-448855337.jpeg', '', '2025-04-12 18:05:20', '2025-04-12 18:05:20'),
(732, 95, '/images/journey/2022/1744481121270-830716303.jpeg', '', '2025-04-12 18:05:21', '2025-04-12 18:05:21'),
(733, 95, '/images/journey/2022/1744481122179-249938321.jpeg', '', '2025-04-12 18:05:22', '2025-04-12 18:05:22'),
(734, 95, '/images/journey/2022/1744481123055-418632329.jpeg', '', '2025-04-12 18:05:23', '2025-04-12 18:05:23'),
(738, 91, '/images/journey/2025/1760120934389-697563991.png', '', '2025-10-10 18:28:54', '2025-10-10 18:28:54'),
(742, 100, '/images/journey/2021/1760122287617-422450103.png', '', '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(743, 91, '/images/journey/2025/1760128239034-657443671.png', '', '2025-10-10 20:30:39', '2025-10-10 20:30:39'),
(744, 101, '/images/journey/2020/1760129282493-384402072.png', '', '2025-10-10 20:48:02', '2025-10-10 20:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `journey_years`
--

CREATE TABLE `journey_years` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `destination_type` varchar(50) DEFAULT NULL COMMENT 'gunung, pantai, hutan, air_terjun, etc'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `journey_years`
--

INSERT INTO `journey_years` (`id`, `year`, `title`, `description`, `location`, `created_at`, `updated_at`, `latitude`, `longitude`, `destination_type`) VALUES
(91, 2025, 'Coming soon', 'MERBUBUB', 'Gunung Merbabu', '2025-04-07 15:16:00', '2025-10-10 20:51:00', -7.45243770, 110.44081980, 'gunung'),
(92, 2024, 'Bandungin', 'Camping day', 'Bandung, Jawa Barat', '2025-04-07 15:17:39', '2025-10-10 20:18:28', -6.91750000, 107.61910000, 'hutan'),
(93, 2023, 'Jogjain', 'jogja', 'Yogyakarta', '2025-04-07 15:18:43', '2025-10-10 20:18:28', -7.79560000, 110.36950000, 'hutan'),
(95, 2022, 'Villain', 'Puncak bogor', 'Villain', '2025-04-07 20:20:46', '2025-10-10 20:18:10', NULL, NULL, NULL),
(100, 2021, 'zzz', 'zzz', 'zzz', '2025-10-10 18:51:27', '2025-10-10 20:18:10', NULL, NULL, NULL),
(101, 2020, 'SWWS', 'WSSWSW', NULL, '2025-10-10 20:48:02', '2025-10-10 20:48:02', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `legacies`
--

CREATE TABLE `legacies` (
  `id` int(11) NOT NULL,
  `year` varchar(4) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `legacies`
--

INSERT INTO `legacies` (`id`, `year`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, '2021', 'The Genesis', 'Where dreamers united to create something extraordinary', '2025-03-10 23:14:45', '2025-03-10 23:28:16'),
(2, '2022', 'The Collective Spirit', 'Every frame tells a story, every moment becomes legendary', '2025-03-10 23:14:45', '2025-03-10 23:14:45'),
(3, '2023', 'Beyond Boundaries', 'Breaking limits, setting trends, making history together', '2025-03-10 23:14:45', '2025-03-10 23:14:45'),
(4, '2024', 'Legacy in Motion', 'Not just capturing moments, but creating timeless memories', '2025-03-10 23:14:45', '2025-03-10 23:14:45'),
(5, '2025', 'Future Perfect', 'Innovating the art of visual storytelling, one frame at a time', '2025-03-10 23:14:45', '2025-03-10 23:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `local_transportation`
--

CREATE TABLE `local_transportation` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `from_location` varchar(200) NOT NULL COMMENT 'Station/Terminal/Airport',
  `to_location` varchar(200) NOT NULL COMMENT 'Basecamp/Village',
  `transport_type` enum('Ojek','Angkot','Travel','Sewa Mobil','Jalan Kaki') NOT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `distance_km` decimal(5,1) DEFAULT NULL,
  `cost_per_person` int(11) DEFAULT NULL,
  `cost_notes` text DEFAULT NULL,
  `operating_hours` varchar(100) DEFAULT NULL,
  `availability_notes` text DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL COMMENT 'Contact info for booking',
  `is_recommended` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `local_transportation`
--

INSERT INTO `local_transportation` (`id`, `mountain_id`, `from_location`, `to_location`, `transport_type`, `duration_minutes`, `distance_km`, `cost_per_person`, `cost_notes`, `operating_hours`, `availability_notes`, `contact_info`, `is_recommended`, `created_at`) VALUES
(7, 1, 'Bandara Lombok (LOP)', 'Sembalun Village', '', 120, 80.0, 150000, 'Door to door, nyaman, recommended', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(8, 1, 'Bandara Lombok (LOP)', 'Sembalun Village', '', 120, 80.0, 100000, 'Lebih murah, cocok solo traveler', '06:00-20:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(9, 1, 'Mataram City', 'Sembalun Village', 'Sewa Mobil', 150, 85.0, 500000, 'Per mobil (6-7 orang), split cost = 70-80rb/orang', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(10, 1, 'Senggigi', 'Sembalun Village', '', 180, 100.0, 120000, 'Dari area wisata Senggigi', '06:00-18:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(11, 2, 'Terminal Arjosari Malang', 'Tumpang', 'Angkot', 60, 35.0, 10000, 'Angkot reguler, murah!', '05:00-17:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(12, 2, 'Tumpang', 'Ranupane', '', 120, 45.0, 40000, 'Ojek lokal, bisa nego', '05:00-16:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(13, 2, 'Malang Kota', 'Ranupane', '', 180, 80.0, 150000, 'Per orang, langsung ke basecamp, nyaman', '04:00-14:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(14, 2, 'Stasiun Malang', 'Ranupane', 'Travel', 180, 80.0, 200000, 'Door to door, AC, paling nyaman', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(15, 3, 'Terminal Jombor Jogja', 'Selo', '', 90, 45.0, 20000, 'Bus reguler ke Boyolali, turun Selo', '05:00-17:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(16, 3, 'Jogja Kota', 'Selo', '', 90, 45.0, 50000, 'Ojek online/konvensional', '24 jam', NULL, NULL, 1, '2025-10-14 17:11:35'),
(17, 3, 'Stasiun Tugu Jogja', 'Selo (New Selo)', '', 90, 45.0, 75000, 'Rental motor per hari, lebih fleksibel', '24 jam (rental)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(18, 3, 'Bandara Jogja', 'Selo', 'Travel', 120, 60.0, 150000, 'Door to door dari bandara', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(19, 4, 'Terminal Probolinggo', 'Sukapura', 'Angkot', 60, 30.0, 15000, 'Angkot reguler', '06:00-18:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(20, 4, 'Sukapura', 'Cemoro Lawang', '', 30, 15.0, 15000, 'Ojek lokal, murah', '05:00-20:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(21, 4, 'Probolinggo', 'Cemoro Lawang', '', 90, 45.0, 100000, 'Per orang, langsung ke basecamp', '03:00-22:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(22, 4, 'Surabaya', 'Cemoro Lawang', 'Travel', 180, 120.0, 150000, 'Door to door dari Surabaya', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(23, 5, 'Terminal Boyolali', 'Selo', 'Angkot', 45, 20.0, 10000, 'Angkot reguler', '06:00-17:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(24, 5, 'Solo/Jogja', 'Selo', '', 90, 45.0, 50000, 'Ojek online/konvensional', '24 jam', NULL, NULL, 1, '2025-10-14 17:11:35'),
(25, 5, 'Jogja', 'Selo', 'Travel', 90, 45.0, 75000, 'Door to door', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(26, 6, 'Terminal Magetan', 'Cemoro Sewu', 'Angkot', 60, 25.0, 15000, 'Angkot reguler', '06:00-17:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(27, 6, 'Magetan/Karanganyar', 'Cemoro Sewu', '', 60, 25.0, 40000, 'Ojek lokal', '05:00-19:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(28, 6, 'Solo', 'Cemoro Sewu', 'Travel', 120, 60.0, 100000, 'Door to door dari Solo', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(29, 7, 'Terminal Temanggung', 'Kledung', 'Angkot', 45, 20.0, 12000, 'Angkot reguler, jarang', '07:00-16:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(30, 7, 'Temanggung', 'Kledung', '', 45, 20.0, 35000, 'Ojek lokal, mudah dapat', '05:00-19:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(31, 7, 'Wonosobo', 'Kledung', 'Travel', 60, 30.0, 75000, 'Door to door', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(32, 8, 'Terminal Wonosobo', 'Garung', 'Angkot', 60, 25.0, 15000, 'Angkot reguler, jarang', '07:00-16:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(33, 8, 'Wonosobo', 'Garung', '', 60, 25.0, 40000, 'Ojek lokal', '05:00-19:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(34, 8, 'Wonosobo', 'Garung', '', 60, 25.0, 60000, 'Rental motor per hari', '24 jam (rental)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(35, 9, 'Terminal Wonosobo', 'Dieng', 'Angkot', 45, 25.0, 15000, 'Angkot reguler ke Dieng', '06:00-18:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(36, 9, 'Dieng', 'Patak Banteng', '', 15, 8.0, 20000, 'Ojek lokal, banyak tersedia', '05:00-20:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(37, 9, 'Wonosobo', 'Patak Banteng', 'Travel', 60, 33.0, 50000, 'Langsung ke basecamp', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35'),
(38, 10, 'Terminal Cianjur', 'Cibodas', 'Angkot', 60, 20.0, 20000, 'Angkot reguler', '06:00-18:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(39, 10, 'Cipanas', 'Cibodas', '', 30, 10.0, 25000, 'Ojek lokal', '05:00-20:00', NULL, NULL, 1, '2025-10-14 17:11:35'),
(40, 10, 'Jakarta/Bogor', 'Cibodas', 'Travel', 180, 100.0, 150000, 'Door to door dari Jakarta', '24 jam (booking)', NULL, NULL, 1, '2025-10-14 17:11:35');

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `logout_time` timestamp NULL DEFAULT NULL,
  `login_status` enum('success','failed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `login_history`
--

INSERT INTO `login_history` (`id`, `user_id`, `ip_address`, `user_agent`, `login_time`, `logout_time`, `login_status`) VALUES
(1, 2, '::1', 'PostmanRuntime/7.43.0', '2025-03-11 18:35:15', NULL, 'success'),
(2, 2, '::1', 'PostmanRuntime/7.43.0', '2025-03-11 21:28:24', NULL, 'success'),
(3, 2, '::1', 'PostmanRuntime/7.43.0', '2025-03-11 21:34:36', NULL, 'success'),
(4, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-11 21:35:10', NULL, 'success'),
(5, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-11 21:38:19', NULL, 'success'),
(6, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-11 21:39:23', NULL, 'success'),
(7, 2, '::1', 'PostmanRuntime/7.43.0', '2025-03-12 13:34:58', NULL, 'failed'),
(8, 2, '::1', 'PostmanRuntime/7.43.0', '2025-03-12 13:36:01', NULL, 'success'),
(9, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-12 13:43:38', NULL, 'success'),
(10, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-14 18:33:30', NULL, 'failed'),
(11, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-14 18:33:34', NULL, 'failed'),
(12, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-14 18:34:00', NULL, 'failed'),
(13, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-14 18:34:05', NULL, 'failed'),
(14, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-14 18:34:58', NULL, 'success'),
(15, 4, '::1', 'PostmanRuntime/7.43.0', '2025-03-14 21:46:18', NULL, 'failed'),
(16, 4, '::1', 'PostmanRuntime/7.43.0', '2025-03-14 21:46:40', NULL, 'success'),
(17, 4, '::1', 'PostmanRuntime/7.43.0', '2025-03-15 13:38:34', NULL, 'success'),
(18, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-15 13:44:35', NULL, 'success'),
(19, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-15 14:07:55', NULL, 'success'),
(20, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-15 16:34:30', NULL, 'success'),
(21, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:39:35', NULL, 'failed'),
(22, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:39:39', NULL, 'failed'),
(23, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:40:33', NULL, 'failed'),
(24, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:40:39', NULL, 'failed'),
(25, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:40:41', NULL, 'failed'),
(26, 5, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:41:44', NULL, 'success'),
(27, 5, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 13:51:10', NULL, 'success'),
(28, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-16 15:46:28', NULL, 'success'),
(29, 4, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-17 18:45:26', NULL, 'success'),
(30, 4, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-17 19:25:27', NULL, 'success'),
(31, 1, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-17 19:29:38', NULL, 'failed'),
(32, 1, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-17 19:29:42', NULL, 'failed'),
(33, 4, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-17 19:29:50', NULL, 'success'),
(34, 4, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-17 19:32:01', NULL, 'success'),
(35, 4, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/15.0 Mobile/15A5370a Safari/602.1', '2025-03-17 22:16:39', NULL, 'success'),
(36, 4, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/15.0 Mobile/15A5370a Safari/602.1', '2025-03-17 22:19:24', NULL, 'success'),
(37, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-18 14:51:03', NULL, 'success'),
(38, 4, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-18 14:59:26', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-19 05:03:26', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-19 06:31:15', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-19 07:31:24', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-19 07:31:37', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-19 14:25:38', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-19 19:36:16', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-19 19:36:30', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-20 18:11:05', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-20 18:14:15', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-20 18:14:27', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-20 23:10:18', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 17:16:00', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-22 18:38:09', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-22 18:40:15', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-22 18:41:25', NULL, 'failed'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-22 18:41:32', NULL, 'failed'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-22 18:41:42', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 19:31:23', NULL, 'failed'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 19:31:38', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:35:10', NULL, 'failed'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:35:23', NULL, 'failed'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:35:35', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:36:17', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:37:06', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:37:47', NULL, 'success'),
(0, 0, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:40:16', NULL, 'success'),
(0, 2, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:40:54', NULL, 'failed'),
(0, 2, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:41:05', NULL, 'failed'),
(0, 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:41:17', NULL, 'failed'),
(0, 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:41:23', NULL, 'failed'),
(0, 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:41:31', NULL, 'failed'),
(0, 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-23 15:54:50', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-23 21:44:14', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-23 21:44:41', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:45:08', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-23 21:45:38', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:45:46', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:45:58', NULL, 'failed'),
(0, 9, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:46:12', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:46:57', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:47:10', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-03-23 21:47:23', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-23 21:47:57', NULL, 'success'),
(0, 9, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-23 21:51:27', NULL, 'success'),
(0, 25, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-24 01:14:45', NULL, 'failed'),
(0, 25, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-03-24 01:15:04', NULL, 'success'),
(0, 19, '127.0.0.1', 'PostmanRuntime/7.43.3', '2025-03-28 20:13:18', NULL, 'success'),
(0, 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-28 20:20:06', NULL, 'success'),
(0, 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-28 20:21:22', NULL, 'success'),
(0, 19, '127.0.0.1', 'PostmanRuntime/7.43.3', '2025-03-29 15:49:42', NULL, 'success'),
(0, 19, '127.0.0.1', 'PostmanRuntime/7.43.3', '2025-03-29 16:29:31', NULL, 'success'),
(0, 19, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-03-29 16:30:48', NULL, 'success'),
(0, 19, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-03-29 16:53:54', NULL, 'failed'),
(0, 19, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-03-29 16:54:02', NULL, 'failed'),
(0, 19, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-03-29 16:54:05', NULL, 'success'),
(0, 19, '127.0.0.1', 'PostmanRuntime/7.43.3', '2025-04-01 12:53:21', NULL, 'success'),
(0, 19, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-04-04 18:52:33', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-04-08 06:04:35', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-04-08 06:04:40', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 07:00:44', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 07:00:53', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 07:01:03', NULL, 'success'),
(0, 21, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:20:26', NULL, 'success'),
(0, 21, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:23:40', NULL, 'success'),
(0, 8, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:25:32', NULL, 'success'),
(0, 8, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:28:57', NULL, 'failed'),
(0, 8, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:29:05', NULL, 'success'),
(0, 15, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:35:28', NULL, 'success'),
(0, 23, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1', '2025-04-08 14:35:32', NULL, 'success'),
(0, 15, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1', '2025-04-08 14:43:01', NULL, 'success'),
(0, 14, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36', '2025-04-08 14:44:09', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:49:26', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:49:34', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:49:49', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:50:38', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-08 14:51:58', NULL, 'success'),
(0, 16, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '2025-04-08 14:55:10', NULL, 'success'),
(0, 15, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-04-08 16:25:37', NULL, 'success'),
(0, 14, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1', '2025-04-08 16:27:36', NULL, 'success'),
(0, 19, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-10 12:06:29', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '2025-04-10 12:44:36', NULL, 'failed'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '2025-04-10 12:44:47', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-12 15:26:01', NULL, 'success'),
(0, 13, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', '2025-04-12 15:35:04', NULL, 'success'),
(0, 8, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.118 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.18.1-go', '2025-04-12 18:51:32', NULL, 'success'),
(0, 4, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1', '2025-04-23 09:42:16', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-24 07:40:08', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', '2025-04-24 07:41:57', NULL, 'success'),
(0, 15, '127.0.0.1', 'PostmanRuntime/7.43.3', '2025-04-28 17:24:42', NULL, 'success'),
(0, 15, '127.0.0.1', 'PostmanRuntime/7.43.3', '2025-04-28 18:24:34', NULL, 'success'),
(0, 15, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '2025-04-28 18:41:05', NULL, 'failed'),
(0, 15, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '2025-04-28 18:41:09', NULL, 'failed'),
(0, 15, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '2025-04-28 18:41:14', NULL, 'success'),
(0, 14, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-07 10:42:56', NULL, 'success'),
(0, 8, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1', '2025-05-21 06:30:46', NULL, 'success'),
(0, 19, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-25 14:50:53', NULL, 'success'),
(0, 4, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-25 19:47:42', NULL, 'failed'),
(0, 9, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-25 19:47:56', NULL, 'success'),
(0, 9, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-25 19:51:45', NULL, 'success'),
(0, 9, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-25 19:52:11', NULL, 'success'),
(0, 9, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-05-25 19:59:32', NULL, 'success'),
(0, 9, '127.0.0.1', 'PostmanRuntime/7.43.4', '2025-05-26 13:33:02', NULL, 'success'),
(0, 13, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-05-28 11:20:30', NULL, 'success'),
(0, 7, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '2025-05-31 06:22:46', NULL, 'success'),
(0, 13, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-06 14:35:38', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-13 11:07:43', NULL, 'failed'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-13 11:07:48', NULL, 'success'),
(0, 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-13 12:37:25', NULL, 'success'),
(0, 8, '127.0.0.1', 'Dart/3.7 (dart:io)', '2025-06-16 14:05:22', NULL, 'success'),
(0, 8, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-16 14:09:21', NULL, 'success'),
(0, 19, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-19 14:11:48', NULL, 'success'),
(0, 19, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-20 09:11:20', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '2025-06-25 08:08:51', NULL, 'success'),
(0, 19, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-11 10:50:09', NULL, 'success'),
(0, 4, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 18:26:47', NULL, 'failed'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 18:26:59', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 18:47:13', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 18:50:37', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 18:55:24', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 21:45:55', NULL, 'success'),
(0, 5, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 21:48:07', NULL, 'failed'),
(0, 5, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 21:48:16', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 21:48:49', NULL, 'success'),
(0, 7, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 22:19:15', NULL, 'success');

-- --------------------------------------------------------

--
-- Table structure for table `mountains`
--

CREATE TABLE `mountains` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `elevation` int(11) DEFAULT NULL COMMENT 'in meters (mdpl)',
  `difficulty` enum('Mudah','Sedang','Sulit','Sangat Sulit') DEFAULT 'Sedang',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `basecamp_name` varchar(200) DEFAULT NULL,
  `basecamp_accommodation_fee` int(11) DEFAULT 10000 COMMENT 'Accommodation fee per person per night at basecamp (in IDR)',
  `basecamp_address` text DEFAULT NULL,
  `typical_duration_days` int(11) DEFAULT 2 COMMENT 'Typical trip duration',
  `best_months` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Best months to climb ["Jan", "Feb", ...]' CHECK (json_valid(`best_months`)),
  `entrance_fee` int(11) DEFAULT 0,
  `entrance_fee_source` varchar(255) DEFAULT NULL COMMENT 'Source/reference for entrance fee',
  `simaksi_fee` int(11) DEFAULT 0 COMMENT 'Permit fee',
  `simaksi_fee_source` varchar(255) DEFAULT NULL,
  `parking_fee` int(11) DEFAULT 0,
  `porter_fee_per_day` int(11) DEFAULT 0,
  `porter_fee_source` varchar(255) DEFAULT NULL COMMENT 'Porter price reference',
  `guide_fee_per_day` int(11) DEFAULT 0,
  `guide_fee_source` varchar(255) DEFAULT NULL COMMENT 'Guide price reference',
  `price_last_updated` date DEFAULT NULL COMMENT 'Last price update date',
  `description` text DEFAULT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Key highlights' CHECK (json_valid(`highlights`)),
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mountains`
--

INSERT INTO `mountains` (`id`, `name`, `province`, `city`, `elevation`, `difficulty`, `latitude`, `longitude`, `basecamp_name`, `basecamp_accommodation_fee`, `basecamp_address`, `typical_duration_days`, `best_months`, `entrance_fee`, `entrance_fee_source`, `simaksi_fee`, `simaksi_fee_source`, `parking_fee`, `porter_fee_per_day`, `porter_fee_source`, `guide_fee_per_day`, `guide_fee_source`, `price_last_updated`, `description`, `highlights`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Gunung Rinjani', 'Nusa Tenggara Barat', 'Lombok Timur', 3726, 'Sulit', -8.41160000, 116.45720000, 'Sembalun Village', 10000, 'Desa Sembalun Lawang, Lombok Timur', 3, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\", \"Okt\"]', 150000, 'BTNGR Official rinjaninationalpark.com - Tiket Wisatawan Domestik (2024)', 150000, 'SIMAKSI Online simaksi.id - Wajib untuk semua pendaki (2024)', 5000, 350000, 'Rinjani Trek Center & HPI Lombok - Harga standar porter bersertifikat (2024)', 400000, 'Asosiasi Guide Rinjani resmi - Harga guide bersertifikat (2024)', '2024-10-14', 'Gunung Rinjani adalah gunung berapi tertinggi kedua di Indonesia dengan Danau Segara Anak yang memukau.', '[\"Danau Segara Anak\", \"Puncak Rinjani 3726 mdpl\", \"Air Terjun Tiu Kelep\", \"Sunrise spektakuler\"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 17:11:35'),
(2, 'Gunung Semeru', 'Jawa Timur', 'Lumajang', 3676, 'Sangat Sulit', -8.10770000, 112.92250000, 'Ranu Pani', 10000, 'Desa Ranupane, Lumajang', 4, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\"]', 32000, 'TNBTS Official tnbts.id - Tiket Masuk Weekday (Weekend 37.500) (2024)', 32000, 'SIMAKSI Online simaksi.id - Wajib untuk pendaki Semeru (2024)', 5000, 300000, 'HPI Malang & Porter Ranupane - Harga standar porter lokal (2024)', 350000, 'Asosiasi Guide Semeru Ranupane - Guide bersertifikat (2024)', '2024-10-14', 'Mahameru, gunung tertinggi di Pulau Jawa dengan kawah Jonggring Saloko yang aktif.', '[\"Puncak Mahameru 3676 mdpl\", \"Ranu Kumbolo\", \"Oro-oro Ombo\", \"Kawah Jonggring Saloko\"]', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 17:11:35'),
(3, 'Gunung Merapi', 'DI Yogyakarta', 'Sleman', 2930, 'Sedang', -7.54070000, 110.44600000, 'Selo', 10000, 'Desa Selo, Boyolali', 1, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\", \"Okt\"]', 25000, 'Desa Selo & Balai TN Merapi - Tiket masuk jalur Selo (2024)', 0, 'Tidak diperlukan SIMAKSI untuk Merapi jalur Selo (2024)', 5000, 200000, 'Porter Selo - Harga standar porter lokal Merapi (2024)', 250000, 'Asosiasi Guide Merapi Selo & New Selo - Guide lokal (2024)', '2024-10-14', 'Gunung api paling aktif di Indonesia dengan pemandangan sunrise yang memukau.', '[\"Sunrise di puncak\", \"Bunker Kaliadem\", \"Lava tour\", \"Dekat Jogja\"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 17:11:35'),
(4, 'Gunung Bromo', 'Jawa Timur', 'Probolinggo', 2329, 'Mudah', -7.94250000, 112.95300000, 'Cemoro Lawang', 10000, 'Desa Cemoro Lawang, Probolinggo', 2, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\", \"Okt\"]', 34000, 'TNBTS Official - Tiket Bromo Weekday (Weekend 39.000) (2024)', 0, 'Tidak diperlukan SIMAKSI untuk Bromo (wisata umum) (2024)', 5000, 0, 'Porter tidak umum digunakan di Bromo (jalur mudah) (2024)', 200000, 'Guide Bromo Cemoro Lawang - Harga standar guide lokal (2024)', '2024-10-14', 'Gunung berapi ikonik dengan lautan pasir dan sunrise legendaris.', '[\"Sunrise Penanjakan\", \"Lautan Pasir\", \"Kawah Bromo\", \"Bukit Teletubbies\"]', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 17:11:35'),
(5, 'Gunung Merbabu', 'Jawa Tengah', 'Boyolali', 3145, 'Sedang', -7.45500000, 110.44000000, 'Selo', 10000, 'Desa Selo, Boyolali', 2, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\", \"Okt\"]', 20000, NULL, 0, NULL, 5000, 200000, NULL, 250000, NULL, NULL, 'Gunung dengan savana luas dan pemandangan 360 derajat.', '[\"Sabana luas\", \"View Merapi-Merbabu\", \"Sunrise cantik\", \"Jalur beragam\"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(6, 'Gunung Lawu', 'Jawa Tengah', 'Karanganyar', 3265, 'Sedang', -7.62500000, 111.19200000, 'Cemoro Sewu', 10000, 'Cemoro Sewu, Magetan', 2, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\"]', 15000, NULL, 0, NULL, 5000, 200000, NULL, 250000, NULL, NULL, 'Gunung mistis dengan berbagai situs sejarah dan candi.', '[\"Candi Cetho\", \"Sunrise\", \"Jalur mistis\", \"Puncak Hargo Dumilah\"]', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(7, 'Gunung Sindoro', 'Jawa Tengah', 'Wonosobo', 3153, 'Sulit', -7.30000000, 109.99200000, 'Kledung', 10000, 'Desa Kledung, Temanggung', 2, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\"]', 15000, NULL, 0, NULL, 5000, 200000, NULL, 250000, NULL, NULL, 'Gunung kembar Sumbing dengan jalur menantang dan pemandangan indah.', '[\"Puncak Sundoro\", \"View Dieng\", \"Jalur menantang\", \"Savana\"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(8, 'Gunung Sumbing', 'Jawa Tengah', 'Wonosobo', 3371, 'Sulit', -7.38400000, 110.07300000, 'Garung', 10000, 'Desa Garung, Wonosobo', 2, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\"]', 15000, NULL, 0, NULL, 5000, 200000, NULL, 250000, NULL, NULL, 'Gunung tertinggi ketiga di Jawa dengan jalur terjal.', '[\"Puncak tertinggi ke-3 Jawa\", \"View Sindoro\", \"Jalur ekstrem\", \"Sunrise\"]', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(9, 'Gunung Prau', 'Jawa Tengah', 'Wonosobo', 2565, 'Mudah', -7.18600000, 109.92000000, 'Patak Banteng', 10000, 'Patak Banteng, Wonosobo', 1, '[\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\", \"Okt\", \"Nov\", \"Des\"]', 10000, NULL, 0, NULL, 5000, 150000, NULL, 200000, NULL, NULL, 'Gunung ramah pemula dengan savana luas dan camping ground indah.', '[\"Savana luas\", \"Camping ground\", \"Ramah pemula\", \"Sunrise Dieng\"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(10, 'Gunung Gede Pangrango', 'Jawa Barat', 'Cianjur', 2958, 'Sedang', -6.78200000, 106.98000000, 'Cibodas', 10000, 'Cibodas, Cianjur', 2, '[\"Apr\", \"Mei\", \"Jun\", \"Jul\", \"Agu\", \"Sep\"]', 29000, NULL, 0, NULL, 5000, 200000, NULL, 250000, NULL, NULL, 'Taman Nasional dengan keanekaragaman hayati tinggi.', '[\"Alun-alun Suryakencana\", \"Telaga Biru\", \"Air Terjun Cibeureum\", \"Hutan tropis\"]', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', 1, '2025-10-14 16:45:55', '2025-10-14 16:45:55'),
(11, 'coba', 'Jawa Tengah', NULL, 2134, 'Mudah', NULL, NULL, 'anwar', 10000, NULL, 2, '[]', 1222, NULL, 0, NULL, 0, 222, NULL, 2, NULL, NULL, 'xxd', NULL, 'https://static.promediateknologi.id/crop/0x42:736x538/750x500/webp/photo/p1/192/2024/08/14/83-4187415083.jpg', 1, '2025-10-15 17:44:46', '2025-10-15 17:44:46');

-- --------------------------------------------------------

--
-- Table structure for table `mountain_tracks`
--

CREATE TABLE `mountain_tracks` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `track_name` varchar(100) NOT NULL COMMENT 'Nama jalur (e.g., Sembalun, Senaru)',
  `track_code` varchar(20) DEFAULT NULL COMMENT 'Kode jalur (e.g., SMB, SNR)',
  `basecamp_name` varchar(100) NOT NULL,
  `basecamp_address` text DEFAULT NULL,
  `basecamp_latitude` decimal(10,8) DEFAULT NULL,
  `basecamp_longitude` decimal(11,8) DEFAULT NULL,
  `difficulty` enum('Mudah','Sedang','Sulit','Sangat Sulit') NOT NULL,
  `typical_duration_days` int(11) DEFAULT 2,
  `distance_km` decimal(5,2) DEFAULT NULL COMMENT 'Total jarak track (km)',
  `elevation_gain` int(11) DEFAULT NULL COMMENT 'Total pendakian (meter)',
  `entrance_fee` int(11) DEFAULT 0,
  `entrance_fee_source` varchar(255) DEFAULT NULL,
  `guide_fee_per_day` int(11) DEFAULT 0,
  `guide_fee_source` varchar(255) DEFAULT NULL,
  `porter_fee_per_day` int(11) DEFAULT 0,
  `porter_fee_source` varchar(255) DEFAULT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Highlight jalur ini' CHECK (json_valid(`highlights`)),
  `best_for` varchar(255) DEFAULT NULL COMMENT 'Cocok untuk siapa (pemula, expert, dll)',
  `scenery_type` varchar(100) DEFAULT NULL COMMENT 'Jenis pemandangan (hutan, savana, dll)',
  `is_open` tinyint(1) DEFAULT 1 COMMENT 'Jalur buka/tutup',
  `is_recommended` tinyint(1) DEFAULT 0,
  `popularity_rank` int(11) DEFAULT 0 COMMENT '1=paling populer',
  `notes` text DEFAULT NULL,
  `last_updated` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `gmaps_link` text DEFAULT NULL,
  `basecamp_accommodation_fee` int(11) DEFAULT 10000,
  `estimated_hours` decimal(5,2) DEFAULT 0.00,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mountain_tracks`
--

INSERT INTO `mountain_tracks` (`id`, `mountain_id`, `track_name`, `track_code`, `basecamp_name`, `basecamp_address`, `basecamp_latitude`, `basecamp_longitude`, `difficulty`, `typical_duration_days`, `distance_km`, `elevation_gain`, `entrance_fee`, `entrance_fee_source`, `guide_fee_per_day`, `guide_fee_source`, `porter_fee_per_day`, `porter_fee_source`, `highlights`, `best_for`, `scenery_type`, `is_open`, `is_recommended`, `popularity_rank`, `notes`, `last_updated`, `created_at`, `updated_at`, `gmaps_link`, `basecamp_accommodation_fee`, `estimated_hours`, `description`) VALUES
(1, 1, 'Jalur Sembalun', 'SMB', 'Sembalun Village', 'Desa Sembalun Lawang, Lombok Timur', -8.35000000, 116.50000000, 'Sulit', 3, 22.50, 2426, 150000, 'BTNGR (Balai Taman Nasional Gunung Rinjani) 2024', 400000, 'Asosiasi Guide Rinjani 2024', 350000, 'HPI Lombok 2024', '[\"Danau Segara Anak\", \"Puncak Rinjani\", \"Sunrise terbaik\", \"Jalur terpopuler\"]', 'Pendaki berpengalaman, sunrise hunter', 'Savana, hutan pinus, danau vulkanik', 1, 1, 1, 'Jalur paling populer, start dari savana, view terbaik', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(2, 1, 'Jalur Senaru', 'SNR', 'Senaru Village', 'Desa Senaru, Lombok Utara', -8.32000000, 116.41000000, 'Sangat Sulit', 3, 24.00, 2526, 150000, 'BTNGR (Balai Taman Nasional Gunung Rinjani) 2024', 400000, 'Asosiasi Guide Rinjani 2024', 350000, 'HPI Lombok 2024', '[\"Air Terjun Sendang Gile\", \"Danau Segara Anak\", \"Hutan lebat\", \"Lebih menantang\"]', 'Pendaki expert, petualang', 'Hutan tropis lebat, air terjun', 1, 0, 2, 'Jalur lebih sulit, start dari hutan, lebih sepi', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(3, 2, 'Jalur Ranupane', 'RNP', 'Ranu Pani', 'Desa Ranupane, Lumajang', -8.05000000, 112.95000000, 'Sangat Sulit', 4, 28.00, 1476, 32000, 'TNBTS (Taman Nasional Bromo Tengger Semeru) 2024', 350000, 'Asosiasi Guide Semeru 2024', 300000, 'HPI Malang 2024', '[\"Ranu Kumbolo\", \"Oro-oro Ombo\", \"Puncak Mahameru\", \"Jalur klasik\"]', 'Pendaki berpengalaman', 'Danau, savana, pasir vulkanik', 1, 1, 1, 'Jalur klasik paling populer via Ranu Kumbolo', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(4, 2, 'Jalur Burno', 'BRN', 'Burno', 'Desa Burno, Malang', -8.07000000, 112.93000000, 'Sangat Sulit', 4, 30.00, 1576, 32000, 'TNBTS (Taman Nasional Bromo Tengger Semeru) 2024', 350000, 'Asosiasi Guide Semeru 2024', 300000, 'HPI Malang 2024', '[\"Jalur alternatif\", \"Lebih sepi\", \"View berbeda\"]', 'Pendaki expert, mencari tantangan', 'Hutan, savana', 0, 0, 2, 'Jalur alternatif, sering tutup, lebih sepi', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(5, 3, 'Jalur Selo (New Selo)', 'SLO', 'Selo Basecamp', 'Desa Selo, Boyolali', -7.52000000, 110.42000000, 'Sedang', 1, 8.00, 1700, 25000, 'Retribusi Desa Selo 2024', 250000, 'Asosiasi Guide Merapi Selo 2024', 200000, 'Porter Selo 2024', '[\"Jalur paling populer\", \"Sunrise terbaik\", \"Dekat dari Jogja/Solo\"]', 'Pemula hingga expert', 'Hutan pinus, pasir vulkanik', 1, 1, 1, 'Jalur paling populer dan mudah diakses', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(6, 3, 'Jalur Kaliurang', 'KLU', 'Kaliurang', 'Kaliurang, Sleman, Yogyakarta', -7.58000000, 110.43000000, 'Sulit', 1, 10.00, 1800, 30000, 'Retribusi Desa Kaliurang 2024', 250000, 'Guide Kaliurang 2024', 200000, 'Porter Kaliurang 2024', '[\"Jalur klasik\", \"Lebih panjang\", \"View berbeda\"]', 'Pendaki berpengalaman', 'Hutan, pasir vulkanik', 1, 0, 2, 'Jalur klasik dari sisi Jogja', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(7, 3, 'Jalur Babadan', 'BBD', 'Babadan', 'Babadan, Magelang', -7.51000000, 110.41000000, 'Sedang', 1, 9.00, 1750, 25000, 'Retribusi Desa Babadan 2024', 250000, 'Guide Babadan 2024', 200000, 'Porter Babadan 2024', '[\"Jalur alternatif\", \"Lebih sepi\"]', 'Pendaki sedang', 'Hutan, pasir', 1, 0, 3, 'Jalur alternatif dari sisi Magelang', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(8, 4, 'Jalur Cemoro Lawang', 'CML', 'Cemoro Lawang', 'Cemoro Lawang, Probolinggo', -7.94000000, 112.95000000, 'Mudah', 1, 5.00, 400, 29000, 'TNBTS 2024 (Weekday)', 200000, 'Guide Bromo 2024', 0, 'Tidak perlu porter (jalur mudah)', '[\"Lautan pasir\", \"Sunrise Penanjakan\", \"Kawah Bromo\", \"Paling populer\"]', 'Semua level, wisatawan', 'Lautan pasir, kawah aktif', 1, 1, 1, 'Jalur paling mudah dan populer untuk wisata', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(9, 4, 'Jalur Wonokitri', 'WNK', 'Wonokitri', 'Wonokitri, Pasuruan', -7.92000000, 112.93000000, 'Mudah', 1, 6.00, 450, 29000, 'TNBTS 2024 (Weekday)', 200000, 'Guide Wonokitri 2024', 0, 'Tidak perlu porter', '[\"Alternatif Cemoro Lawang\", \"Lebih sepi\", \"View bagus\"]', 'Semua level', 'Lautan pasir', 1, 0, 2, 'Jalur alternatif lebih sepi', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(10, 5, 'Jalur Selo', 'SLO', 'Selo', 'Desa Selo, Boyolali', -7.45000000, 110.42000000, 'Sedang', 2, 12.00, 1600, 20000, 'TNGM (Taman Nasional Gunung Merbabu) 2024', 250000, 'Guide Merbabu Selo 2024', 200000, 'Porter Selo 2024', '[\"Jalur paling populer\", \"Savana luas\", \"Sunrise di Sabana 1\"]', 'Pemula hingga expert', 'Savana, hutan pinus', 1, 1, 1, 'Jalur paling populer dengan savana luas', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(11, 5, 'Jalur Wekas', 'WKS', 'Wekas', 'Wekas, Boyolali', -7.44000000, 110.43000000, 'Sedang', 2, 11.00, 1550, 20000, 'TNGM (Taman Nasional Gunung Merbabu) 2024', 250000, 'Guide Wekas 2024', 200000, 'Porter Wekas 2024', '[\"Jalur pendek\", \"Lebih cepat\"]', 'Pendaki sedang', 'Hutan, savana', 1, 0, 2, 'Jalur lebih pendek dari Selo', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(12, 5, 'Jalur Cunthel', 'CTL', 'Cunthel', 'Cunthel, Semarang', -7.43000000, 110.44000000, 'Sulit', 2, 13.00, 1650, 20000, 'TNGM (Taman Nasional Gunung Merbabu) 2024', 250000, 'Guide Cunthel 2024', 200000, 'Porter Cunthel 2024', '[\"Jalur menantang\", \"Lebih sepi\"]', 'Pendaki berpengalaman', 'Hutan lebat', 1, 0, 3, 'Jalur lebih sulit dan sepi', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(13, 5, 'Jalur Thekelan', 'TKL', 'Thekelan', 'Thekelan, Magelang', -7.46000000, 110.41000000, 'Sedang', 2, 12.50, 1580, 20000, 'TNGM (Taman Nasional Gunung Merbabu) 2024', 250000, 'Guide Thekelan 2024', 200000, 'Porter Thekelan 2024', '[\"Jalur alternatif\", \"View bagus\"]', 'Pendaki sedang', 'Hutan, savana', 1, 0, 4, 'Jalur alternatif dari Magelang', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(14, 5, 'Jalur Suwanting', 'SWT', 'Suwanting', 'Suwanting, Kopeng, Semarang', -7.47000000, 110.45000000, 'Sedang', 2, 11.50, 1570, 20000, 'TNGM (Taman Nasional Gunung Merbabu) 2024', 250000, 'Guide Suwanting 2024', 200000, 'Porter Suwanting 2024', '[\"Jalur populer\", \"Savana cantik\", \"Camping ground bagus\"]', 'Pemula hingga sedang', 'Savana, hutan pinus', 1, 1, 2, 'Jalur populer kedua setelah Selo, savana luas', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(15, 6, 'Jalur Cemoro Sewu', 'CMS', 'Cemoro Sewu', 'Cemoro Sewu, Magetan', -7.63000000, 111.19000000, 'Sedang', 1, 8.00, 1300, 15000, 'Retribusi Cemoro Sewu 2024', 200000, 'Guide Lawu 2024', 150000, 'Porter Cemoro Sewu 2024', '[\"Jalur paling populer\", \"Candi Cetho\", \"Sunrise bagus\"]', 'Pemula hingga sedang', 'Hutan pinus, candi', 1, 1, 1, 'Jalur paling populer dari Magetan', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(16, 6, 'Jalur Candi Cetho', 'CCT', 'Candi Cetho', 'Candi Cetho, Karanganyar', -7.62000000, 111.18000000, 'Sedang', 1, 9.00, 1350, 15000, 'Retribusi Candi Cetho 2024', 200000, 'Guide Cetho 2024', 150000, 'Porter Cetho 2024', '[\"Lewat Candi Cetho\", \"Jalur spiritual\", \"View berbeda\"]', 'Pendaki sedang', 'Hutan, candi', 1, 0, 2, 'Jalur alternatif lewat Candi Cetho', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(17, 7, 'Jalur Kledung', 'KLD', 'Kledung', 'Kledung, Temanggung', -7.30000000, 110.08000000, 'Sulit', 1, 10.00, 1800, 25000, 'Retribusi Kledung Pass 2024', 200000, 'Guide Sindoro 2024', 150000, 'Porter Kledung 2024', '[\"Jalur paling populer\", \"Savana luas\", \"Puncak kembar\"]', 'Pendaki berpengalaman', 'Savana, hutan', 1, 1, 1, 'Jalur paling populer Sindoro', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(18, 7, 'Jalur Sigedang', 'SGD', 'Sigedang', 'Sigedang, Temanggung', -7.29000000, 110.07000000, 'Sulit', 1, 11.00, 1850, 25000, 'Retribusi Sigedang 2024', 200000, 'Guide Sigedang 2024', 150000, 'Porter Sigedang 2024', '[\"Jalur alternatif\", \"Lebih sepi\"]', 'Pendaki expert', 'Hutan, savana', 1, 0, 2, 'Jalur alternatif lebih menantang', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(19, 8, 'Jalur Garung', 'GRG', 'Garung', 'Garung, Wonosobo', -7.38000000, 110.07000000, 'Sulit', 1, 11.00, 1900, 25000, 'Retribusi Garung 2024', 200000, 'Guide Sumbing 2024', 150000, 'Porter Garung 2024', '[\"Jalur paling populer\", \"Savana\", \"View Sindoro\"]', 'Pendaki berpengalaman', 'Savana, hutan', 1, 1, 1, 'Jalur paling populer Sumbing', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(20, 8, 'Jalur Banaran', 'BNR', 'Banaran', 'Banaran, Wonosobo', -7.37000000, 110.06000000, 'Sangat Sulit', 1, 12.00, 1950, 25000, 'Retribusi Banaran 2024', 200000, 'Guide Banaran 2024', 150000, 'Porter Banaran 2024', '[\"Jalur menantang\", \"Lebih sepi\", \"Expert only\"]', 'Pendaki expert', 'Hutan lebat', 1, 0, 2, 'Jalur lebih sulit untuk expert', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(21, 9, 'Jalur Patak Banteng', 'PTB', 'Patak Banteng', 'Patak Banteng, Dieng', -7.20000000, 109.92000000, 'Mudah', 1, 4.00, 600, 10000, 'Retribusi Desa Dieng 2024', 150000, 'Guide Prau 2024', 100000, 'Porter Patak Banteng 2024', '[\"Jalur paling populer\", \"Mudah\", \"Sunrise hunting\", \"Instagramable\"]', 'Pemula, keluarga', 'Savana, bukit', 1, 1, 1, 'Jalur termudah dan terpopuler', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(22, 9, 'Jalur Igirmranak', 'IGR', 'Igirmranak', 'Igirmranak, Dieng', -7.19000000, 109.91000000, 'Mudah', 1, 5.00, 650, 10000, 'Retribusi Desa Dieng 2024', 150000, 'Guide Igirmranak 2024', 100000, 'Porter Igirmranak 2024', '[\"Jalur alternatif\", \"View bagus\"]', 'Pemula', 'Savana', 1, 0, 2, 'Jalur alternatif sedikit lebih panjang', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 19:37:02', NULL, 10000, 0.00, NULL),
(23, 10, 'Jalur Cibodas', 'CBD', 'Cibodas', 'Cibodas, Cianjur', -6.74000000, 107.01000000, 'Sedang', 2, 14.00, 1700, 29000, 'TNGP (Taman Nasional Gede Pangrango) 2024', 250000, 'Guide Cibodas 2024', 200000, 'Porter Cibodas 2024', '[\"Jalur paling populer\", \"Air terjun Cibeureum\", \"Hutan tropis\", \"Alun-alun Suryakencana\"]', 'Pemula hingga sedang', 'Hutan tropis, air terjun', 1, 1, 1, 'Jalur paling populer dan klasik', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 21:14:06', 'https://www.google.com/maps/place/Basecamp+Abah+Anwar/@-6.7563966,107.0072996,16.01z/data=!4m6!3m5!1s0x2e69b3e3b55eda99:0x9069c9f7c853d80c!8m2!3d-6.7557097!4d107.0097149!16s%2Fg%2F11hdrwtddr?entry=tts&g_ep=EgoyMDI1MTAxMi4wIPu8ASoASAFQAw%3D%3D&skid=ea1fea42-90d0-4b12-9f62-5427725c5277', 10000, 0.00, NULL),
(24, 10, 'Jalur Gunung Putri', 'GPT', 'Gunung Putri', 'Gunung Putri, Bogor', -6.72000000, 106.99000000, 'Sulit', 2, 16.00, 1800, 30000, 'TN Gede Pangrango 2024', 250000, 'Guide Gunung Putri 2024', 200000, 'Porter Gunung Putri 2024', '[\"Jalur menantang\", \"Lebih sepi\", \"View berbeda\"]', 'Pendaki berpengalaman', 'Hutan lebat', 1, 2, 2, 'Jalur lebih sulit dan sepi', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 21:29:37', NULL, 10000, 0.00, NULL),
(25, 10, 'Jalur Salabintana', 'SLB', 'Salabintana', 'Salabintana, Sukabumi', -6.76000000, 107.03000000, 'Sangat Sulit', 2, 18.00, 1900, 30000, 'TN Gede Pangrango 2024', 250000, 'Guide Salabintana 2024', 200000, 'Porter Salabintana 2024', '[\"Jalur expert\", \"Paling menantang\", \"Jarang digunakan\"]', 'Pendaki expert', 'Hutan lebat, terjal', 1, 0, 3, 'Jalur paling sulit, untuk expert', '2024-10-14', '2025-10-14 17:57:46', '2025-10-14 17:57:46', NULL, 10000, 0.00, NULL),
(26, 9, 'via vallen', NULL, 'cc', NULL, NULL, NULL, 'Mudah', 2, 2.00, NULL, 222, NULL, 222, NULL, 222, NULL, NULL, NULL, NULL, 1, 0, 1, NULL, NULL, '2025-10-15 18:43:42', '2025-10-15 18:43:42', NULL, 10000, 2.00, 'crrece');

-- --------------------------------------------------------

--
-- Table structure for table `next_activities`
--

CREATE TABLE `next_activities` (
  `id` int(11) NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `cost` decimal(12,2) NOT NULL,
  `type` enum('basic','premium') DEFAULT 'basic',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_destinations`
--

CREATE TABLE `next_destinations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_destination_costs`
--

CREATE TABLE `next_destination_costs` (
  `id` int(11) NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `accommodation_budget` decimal(12,2) DEFAULT NULL,
  `accommodation_standard` decimal(12,2) DEFAULT NULL,
  `accommodation_luxury` decimal(12,2) DEFAULT NULL,
  `transportation_public` decimal(12,2) DEFAULT NULL,
  `transportation_private` decimal(12,2) DEFAULT NULL,
  `transportation_luxury` decimal(12,2) DEFAULT NULL,
  `food_budget` decimal(12,2) DEFAULT NULL,
  `food_standard` decimal(12,2) DEFAULT NULL,
  `food_luxury` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_destination_highlights`
--

CREATE TABLE `next_destination_highlights` (
  `id` int(11) NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `highlight` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_seasons`
--

CREATE TABLE `next_seasons` (
  `id` int(11) NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `season_type` enum('LOW','SHOULDER','PEAK') NOT NULL,
  `months` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_transport_from_jakarta`
--

CREATE TABLE `next_transport_from_jakarta` (
  `id` int(11) NOT NULL,
  `destination_name` varchar(255) NOT NULL,
  `flight_economy` decimal(12,2) DEFAULT NULL,
  `flight_business` decimal(12,2) DEFAULT NULL,
  `flight_first` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_users`
--

CREATE TABLE `next_users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_user_savings`
--

CREATE TABLE `next_user_savings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `savings` decimal(12,2) NOT NULL,
  `monthly_savings` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_user_trips`
--

CREATE TABLE `next_user_trips` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `accommodation_type` varchar(50) NOT NULL,
  `transportation_type` varchar(50) NOT NULL,
  `flight_class` varchar(50) NOT NULL,
  `food_preference` varchar(50) NOT NULL,
  `season` varchar(50) NOT NULL,
  `group_size` int(11) NOT NULL,
  `total_cost` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_user_trip_activities`
--

CREATE TABLE `next_user_trip_activities` (
  `id` int(11) NOT NULL,
  `user_trip_id` int(11) DEFAULT NULL,
  `activity_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 27, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(2, 26, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(3, 25, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(4, 24, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(5, 23, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(6, 22, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(7, 21, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(8, 20, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(9, 19, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(10, 18, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(11, 17, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(12, 16, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(13, 15, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(14, 14, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(15, 13, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(16, 12, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(17, 11, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(18, 10, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(19, 9, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(20, 8, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(22, 6, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(23, 5, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(24, 4, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(25, 3, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(26, 2, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:35:28', '2025-10-10 18:35:28'),
(27, 1, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 1, '2025-10-10 18:35:28', '2025-10-10 19:32:29'),
(28, 27, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(29, 26, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(30, 25, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(31, 24, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(32, 23, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(33, 22, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(34, 21, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(35, 20, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(36, 19, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(37, 18, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(38, 17, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(39, 16, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(40, 15, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(41, 14, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(42, 13, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(43, 12, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(44, 11, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(45, 10, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(46, 9, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(47, 8, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(49, 6, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(50, 5, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(51, 4, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(52, 3, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(53, 2, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 0, '2025-10-10 18:36:08', '2025-10-10 18:36:08'),
(54, 1, 'system', '🎉 Notification System Test', 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.', '/', 1, '2025-10-10 18:36:08', '2025-10-10 19:32:29'),
(55, 27, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(56, 26, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(57, 25, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(58, 24, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(59, 23, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(60, 22, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(61, 21, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(62, 20, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(63, 19, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(64, 18, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(65, 17, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(66, 16, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(67, 15, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(68, 14, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(69, 13, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(70, 12, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(71, 11, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(72, 10, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(73, 9, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(74, 8, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(75, 7, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 1, '2025-10-10 18:51:27', '2025-10-10 18:51:47'),
(76, 6, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(77, 5, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(78, 4, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(79, 3, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(80, 2, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 0, '2025-10-10 18:51:27', '2025-10-10 18:51:27'),
(81, 1, 'journey', 'New Journey Posted! 📖', 'tunggul just shared a new journey: \"zzz\"', '/journey/100', 1, '2025-10-10 18:51:27', '2025-10-10 19:32:29'),
(82, 27, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(83, 26, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(84, 25, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(85, 24, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(86, 23, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(87, 22, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(88, 21, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(89, 20, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(90, 19, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(91, 18, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(92, 17, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(93, 16, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(94, 15, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(95, 14, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(96, 13, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(97, 12, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(98, 11, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(99, 10, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(100, 9, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(101, 8, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(102, 7, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 1, '2025-10-10 18:59:49', '2025-10-10 19:02:13'),
(103, 6, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(104, 5, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(105, 4, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(106, 3, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(107, 2, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 0, '2025-10-10 18:59:49', '2025-10-10 18:59:49'),
(108, 1, 'event', 'New Event Scheduled! 📅', '\"ss\" is scheduled for 16 Oktober 2025', '/events', 1, '2025-10-10 18:59:49', '2025-10-10 19:32:29'),
(109, 27, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(110, 26, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(111, 25, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(112, 24, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(113, 23, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(114, 22, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(115, 21, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(116, 20, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(117, 19, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(118, 18, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(119, 17, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(120, 16, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(121, 15, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(122, 14, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(123, 13, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(124, 12, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(125, 11, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(126, 10, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(127, 9, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(128, 8, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(129, 7, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(130, 6, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(131, 5, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(132, 4, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(133, 3, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(134, 2, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(135, 1, 'journey', 'New Journey Posted! 📖', 'superadmin just shared a new journey: \"SWWS\"', '/journey/101', 0, '2025-10-10 20:48:02', '2025-10-10 20:48:02'),
(136, 7, 'savings', 'Savings Update 💰', 'Your deposit of Rp 1.311 has been recorded', '/savings', 0, '2025-10-10 21:49:08', '2025-10-10 21:49:08'),
(137, 7, 'savings', 'Savings Update 💰', 'Your deposit of Rp 879 has been recorded', '/savings', 0, '2025-10-10 21:53:52', '2025-10-10 21:53:52'),
(138, 7, 'savings', 'Savings Update 💰', 'Your deposit of Rp 3.455 has been recorded', '/savings', 0, '2025-10-10 21:59:38', '2025-10-10 21:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `author_name` varchar(100) NOT NULL,
  `author_title` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `text`, `author_name`, `author_title`, `is_featured`, `created_at`, `updated_at`) VALUES
(3, 'ree', 'xx', 'xxx', 1, '2025-10-10 18:12:47', '2025-10-10 18:14:18');

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `content_type` varchar(50) NOT NULL COMMENT 'journey, gallery, activity, comment',
  `content_id` int(11) NOT NULL COMMENT 'ID of the content being reacted to',
  `user_id` int(11) NOT NULL,
  `reaction_type` varchar(20) NOT NULL COMMENT 'like, love, laugh, wow, sad, angry',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reactions`
--

INSERT INTO `reactions` (`id`, `content_type`, `content_id`, `user_id`, `reaction_type`, `created_at`) VALUES
(1, 'journey', 95, 7, 'like', '2025-10-10 19:16:48');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrator dengan akses penuh ke sistem', '2025-03-11 16:39:31', '2025-03-11 16:39:31'),
(2, 'member', 'Anggota tim regular', '2025-03-11 16:39:31', '2025-03-11 16:39:31'),
(3, 'moderator', 'Moderator dengan akses terbatas', '2025-03-11 16:39:31', '2025-03-11 16:39:31'),
(4, 'contributor', 'Kontributor konten', '2025-03-11 16:39:31', '2025-03-11 16:39:31'),
(5, 'momi', '', '2025-03-11 18:34:26', '2025-03-11 18:34:26'),
(6, 'aasa', 'sasasas', '2025-03-12 13:29:57', '2025-03-12 13:29:57'),
(7, 'cobas', 'asas', '2025-03-12 13:42:54', '2025-03-12 13:42:54'),
(8, 'cobaz', 'asas', '2025-03-12 16:31:55', '2025-03-12 16:31:55');

-- --------------------------------------------------------

--
-- Table structure for table `savings`
--

CREATE TABLE `savings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `receipt_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `jenis_transaksi` enum('setoran','penarikan') DEFAULT 'setoran',
  `transaction_date` date NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `savings`
--

INSERT INTO `savings` (`id`, `user_id`, `amount`, `description`, `receipt_url`, `status`, `jenis_transaksi`, `transaction_date`, `admin_id`, `admin_notes`, `created_at`, `updated_at`) VALUES
(60, 21, 30000.00, 'Tabungan Pertama', '/images/receipts/user-21-1744122086075-304946312.jpg', 'approved', 'setoran', '2025-04-08', 1, '', '2025-04-08 14:21:26', '2025-06-19 14:35:14'),
(61, 8, 20000.00, 'Tabungan bulan april', '/images/receipts/user-8-1744122406472-207849839.jpg', 'approved', 'setoran', '2025-04-08', 1, NULL, '2025-04-08 14:26:46', '2025-04-08 14:28:09'),
(64, 15, 50000.00, 'Nabung bulanan', '/images/receipts/user-15-1744123741459-365556278.jpeg', 'approved', 'setoran', '2025-04-08', 1, 'Good jull', '2025-04-08 14:49:01', '2025-04-08 14:50:02'),
(65, 5, 20000.00, 'tabungan bulanan', '/images/receipts/user-5-1744124045415-576757947.png', 'approved', 'setoran', '2025-04-08', 1, 'Mantap firaa', '2025-04-08 14:54:05', '2025-04-08 14:56:40'),
(67, 8, 80000.00, 'Nabung', '/images/receipts/user-8-1747809136105-753704220.jpeg', 'approved', 'setoran', '2025-05-21', 1, 'Good', '2025-05-21 06:32:16', '2025-05-21 06:33:41'),
(68, 7, 200000.00, 'setoran bulan juni', '/images/receipts/user-7-1751039085792-263231275.jpg', 'approved', 'setoran', '2025-06-27', 1, NULL, '2025-06-27 15:44:45', '2025-06-27 16:10:54'),
(69, 7, 1311.00, 'ddee', '/images/receipts/user-7-1760132948145-774056059.jpg', 'rejected', 'setoran', '2025-10-11', 1, NULL, '2025-10-10 21:49:08', '2025-10-10 21:53:33'),
(70, 7, 879.00, 'j', '/images/receipts/user-7-1760133232168-835704353.png', 'rejected', 'setoran', '2025-10-11', 1, NULL, '2025-10-10 21:53:52', '2025-10-10 21:57:54'),
(71, 7, 3455.00, 'rrfrfrf', '/images/receipts/user-7-1760133577564-422099439.png', 'pending', 'setoran', '2025-10-11', NULL, NULL, '2025-10-10 21:59:37', '2025-10-10 21:59:37'),
(72, 7, 500000.00, 'Test', 'https://api.telegram.org/file/bot7965205336:AAHUBm3ccLhYIqT_MQRao7YH6sGb-8k6Mao/photos/file_0.jpg', 'pending', 'setoran', '2025-10-10', NULL, NULL, '2025-10-10 22:24:25', '2025-10-10 22:24:25'),
(73, 7, 400000.00, 'Iyaa', 'https://api.telegram.org/file/bot7965205336:AAHUBm3ccLhYIqT_MQRao7YH6sGb-8k6Mao/photos/file_0.jpg', 'pending', 'setoran', '2025-10-10', NULL, NULL, '2025-10-10 22:26:46', '2025-10-10 22:26:46'),
(74, 7, 70000.00, 'Oke', 'https://api.telegram.org/file/bot7965205336:AAHUBm3ccLhYIqT_MQRao7YH6sGb-8k6Mao/photos/file_0.jpg', 'pending', 'setoran', '2025-10-10', NULL, NULL, '2025-10-10 22:29:21', '2025-10-10 22:29:21'),
(75, 7, 300000.00, 'Oke', 'https://api.telegram.org/file/bot7965205336:AAHUBm3ccLhYIqT_MQRao7YH6sGb-8k6Mao/photos/file_0.jpg', 'pending', 'setoran', '2025-10-10', NULL, NULL, '2025-10-10 22:32:20', '2025-10-10 22:32:20'),
(76, 7, 30000.00, 'Jsjaja', 'https://api.telegram.org/file/bot7965205336:AAHUBm3ccLhYIqT_MQRao7YH6sGb-8k6Mao/photos/file_0.jpg', 'pending', 'setoran', '2025-10-10', NULL, NULL, '2025-10-10 22:33:54', '2025-10-10 22:33:54');

-- --------------------------------------------------------

--
-- Table structure for table `seo_settings`
--

CREATE TABLE `seo_settings` (
  `id` int(11) NOT NULL,
  `page_type` varchar(50) NOT NULL COMMENT 'home, team, journey, gallery, etc',
  `page_id` int(11) DEFAULT NULL COMMENT 'Specific page ID (for journey, team member, etc)',
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `twitter_title` varchar(255) DEFAULT NULL,
  `twitter_description` text DEFAULT NULL,
  `twitter_image` varchar(500) DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `robots` varchar(50) DEFAULT 'index, follow',
  `structured_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Custom structured data' CHECK (json_valid(`structured_data`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo_settings`
--

INSERT INTO `seo_settings` (`id`, `page_type`, `page_id`, `title`, `description`, `keywords`, `og_title`, `og_description`, `og_image`, `twitter_title`, `twitter_description`, `twitter_image`, `canonical_url`, `robots`, `structured_data`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'home', NULL, 'PERGIMMIKAN - Sekumpulan Pertemanan Mengabadikan Momen Trip dan Nongkrong', 'PERGIMMIKAN adalah komunitas petualangan dan persahabatan yang mengabadikan setiap momen perjalanan dan kebersamaan. Bergabunglah dengan tim kami dalam petualangan mendaki gunung, traveling, dan nongkrong bersama.', 'PERGIMMIKAN, komunitas pendaki, traveling Indonesia, adventure community, hiking Indonesia, komunitas petualangan, tim pendaki gunung, traveling bersama, nongkrong bareng, komunitas anak muda', 'PERGIMMIKAN - Komunitas Petualangan dan Persahabatan', 'Bergabunglah dengan PERGIMMIKAN dalam petualangan mendaki gunung, traveling, dan mengabadikan momen kebersamaan.', NULL, NULL, NULL, NULL, 'https://pergimmikan.site', 'index, follow', NULL, 1, '2025-10-14 13:55:47', '2025-10-14 13:55:47'),
(3, 'journey', NULL, 'Cerita Perjalanan PERGIMMIKAN - Petualangan di Indonesia', 'Baca cerita perjalanan dan petualangan tim PERGIMMIKAN di berbagai destinasi Indonesia. Dari mendaki gunung hingga traveling ke tempat-tempat eksotis.', 'cerita perjalanan, petualangan PERGIMMIKAN, traveling Indonesia, mendaki gunung, trip Indonesia, adventure stories', 'Cerita Perjalanan PERGIMMIKAN', 'Baca cerita perjalanan dan petualangan tim PERGIMMIKAN di berbagai destinasi Indonesia.', NULL, NULL, NULL, NULL, 'https://pergimmikan.site/journey', 'index, follow', NULL, 1, '2025-10-14 13:55:47', '2025-10-14 13:55:47'),
(4, 'gallery', NULL, 'Galeri Foto PERGIMMIKAN - Dokumentasi Petualangan', 'Lihat galeri foto perjalanan dan petualangan tim PERGIMMIKAN. Dokumentasi lengkap dari setiap trip dan momen kebersamaan kami.', 'galeri PERGIMMIKAN, foto perjalanan, dokumentasi petualangan, foto traveling, galeri pendakian', 'Galeri Foto PERGIMMIKAN', 'Lihat galeri foto perjalanan dan petualangan tim PERGIMMIKAN.', NULL, NULL, NULL, NULL, 'https://pergimmikan.site/gallery', 'index, follow', NULL, 1, '2025-10-14 13:55:47', '2025-10-14 13:55:47'),
(5, 'about', NULL, 'Tentang PERGIMMIKAN - Komunitas Petualangan Indonesia', 'PERGIMMIKAN adalah komunitas yang didirikan untuk mengabadikan momen perjalanan dan kebersamaan. Kami percaya bahwa setiap petualangan adalah cerita yang layak diabadikan.', 'tentang PERGIMMIKAN, komunitas petualangan, sejarah PERGIMMIKAN, visi misi PERGIMMIKAN', 'Tentang PERGIMMIKAN', 'Kenali lebih dekat komunitas petualangan PERGIMMIKAN.', NULL, NULL, NULL, NULL, 'https://pergimmikan.site/about', 'index, follow', NULL, 1, '2025-10-14 13:55:47', '2025-10-14 13:55:47'),
(6, 'team', NULL, 'Team - Gimmik', 'Tim PERGIMMIKAN: Tunggul, Deva, Akbar, Frasiskus, Darril, Miraj, Indira, Zaki, Zul, Lia, Fadia, Mae, Fira, Jordi, Zulfa, Kahfi, Raga, Ridho, Toha, Arvan, Farrel, Fadil, Tole Ganteng, Tole, KING KAHFI, Black Mamba, julpa, Gimmik terus, Bayu, idhoo, parel.', 'PERGIMMIKAN team, tim PERGIMMIKAN, Tunggul Bayu Kusuma, Deva Satrya Ramadhan, Akbar Hidayatullah, Frasiskus Aldi Jebadu, Muhammad Darril Fauzi, Miraj Diamond Sundachi, Indira Arifin, Zaki Syifa Nugroho, Zul Widya Pratiwi, Lia Agustin Pratiwi, Fadia Nurmasri, Maesheilla, Fildzah Putri Zhafirah Awliya, Muhamad Jordi Iawan, Muhammad Zulfa, Muhammad Kahfi ChidNI, Muhammad Raga Pratama, Muhammad Ridho Bareng, Toha Hisyamuddin, Arvan Bukhari Putra Maulana, Farrel, Fadil Satria Widodo, Tunggul, Deva, Akbar, Frasiskus, Muhammad, Miraj, Indira, Zaki, Zul, Lia, Fadia, Fira, Jordi, Zulfa, Kahfi, Raga, Ridho, Toha, Arvan, Farrel, Fadil, anggota PERGIMMIKAN, team pendaki PERGIMMIKAN, Ketua PERGIMMIKAN, Member PERGIMMIKAN, Momi PERGIMMIKAN, komunitas pendaki Indonesia, tim petualang Indonesia, pendaki gunung Indonesia, traveling Indonesia, adventure team Indonesia, komunitas outdoor Indonesia, fotografer petualangan, videografer outdoor, dokumentasi perjalanan, cerita pendakian, trip organizer Indonesia, komunitas anak muda petualang, hiking team Indonesia, mountain climbing Indonesia, outdoor adventure Indonesia, backpacker Indonesia, nature photography Indonesia, travel blogger Indonesia, petualangan alam Indonesia, pendaki Semeru, pendaki Rinjani, pendaki Bromo, tim ekspedisi gunung, komunitas pecinta alam, adventure photographer Indonesia, outdoor videographer, travel content creator, pendakian gunung Jawa, pendakian gunung Sumatera, pendakian gunung Bali, komunitas traveling, group hiking Indonesia, tim adventure Indonesia, pendaki profesional Indonesia, guide pendakian, porter gunung, basecamp organizer, open trip organizer, private trip organizer, paket pendakian, jasa pendakian gunung, rental alat outdoor, sewa carrier, sewa tenda camping, komunitas backpacker, solo traveler Indonesia, group traveler, family trip organizer, corporate outing, team building outdoor, outbound training, leadership camp, survival training, jungle trekking, rock climbing Indonesia, rappelling, canyoning, rafting team, camping ground, glamping Indonesia, eco tourism, sustainable travel, responsible tourism, leave no trace Indonesia, mountain conservation, pelestarian alam, edukasi lingkungan, volunteer pendakian, clean mountain movement, sampah pendakian, etika mendaki, tips pendakian pemula, persiapan mendaki gunung, perlengkapan pendakian, gear outdoor Indonesia, review alat pendaki, rekomendasi carrier, sepatu gunung terbaik, jaket outdoor, sleeping bag Indonesia, kompor portable, makanan pendakian, logistik pendakian, rute pendakian, jalur pendakian, peta gunung Indonesia, cuaca gunung, musim pendakian, izin pendakian, SIMAKSI online, booking pendakian, jadwal pendakian, kuota pendakian, biaya pendakian, estimasi waktu pendaki, tingkat kesulitan gunung, gunung untuk pemula, gunung menantang, seven summits Indonesia, puncak tertinggi Indonesia, gunung berapi aktif, gunung sacred, spiritual journey, sunrise hunting, golden hour photography, milky way photography, astro photography, landscape photography, drone photography gunung, videography pendakian, cinematic video, vlog pendakian, YouTube pendaki, Instagram pendaki, TikTok outdoor, content creator outdoor, influencer petualangan, brand ambassador outdoor, sponsor pendakian, partnership outdoor, kolaborasi pendaki, komunitas fotografer, komunitas videografer, workshop fotografi outdoor, kelas editing video, tutorial photography, gear review, product testing outdoor, endorsement outdoor gear, affiliate outdoor, dropship alat camping, reseller outdoor equipment, distributor outdoor Indonesia, toko outdoor, marketplace outdoor, e-commerce outdoor, online shop pendaki, official store outdoor, authentic outdoor gear, original outdoor brand, trusted outdoor seller, fast delivery outdoor, COD outdoor equipment, cicilan outdoor gear, promo outdoor, diskon alat camping, sale outdoor equipment, clearance sale outdoor, bundling package outdoor, starter pack pendaki, complete set camping, rental package outdoor, sewa paket lengkap, all-in package trip, full service trip organizer, custom trip planner, personalized adventure, tailor made trip, exclusive trip, private guide, personal porter, VIP trip service, luxury camping, premium outdoor experience, high-end outdoor gear, professional outdoor service, certified guide, licensed tour operator, registered trip organizer, legal outdoor business, insured trip, safety guarantee, emergency response team, rescue team, SAR pendakian, first aid training, wilderness first responder, outdoor survival skill, navigation training, map reading, compass usage, GPS outdoor, tracking device, emergency beacon, satellite phone, communication outdoor, walkie talkie, radio komunikasi, signal booster, power bank outdoor, solar charger, portable generator, lighting outdoor, headlamp, senter tactical, lantern camping, emergency light, safety equipment, safety gear, protective equipment, helmet climbing, harness safety, carabiner, rope climbing, webbing, quickdraw, belay device, ascender, descender, pulley system, rescue equipment, medical kit outdoor, medicine pendakian, altitude sickness, AMS prevention, acclimatization, hydration system, water filter, water purifier, water treatment, cooking system outdoor, stove camping, fuel outdoor, cookware camping, utensils outdoor, food storage, bear canister, dry bag, waterproof bag, stuff sack, compression bag, packing cube, organizer bag, toiletries outdoor, hygiene outdoor, sanitation camping, waste management, trash bag, biodegradable soap, eco-friendly product, sustainable gear, green outdoor, zero waste camping, minimalist packing, ultralight gear, lightweight equipment, compact outdoor, foldable gear, multifunctional tool, Swiss army knife, multi-tool outdoor, repair kit, maintenance outdoor, gear care, equipment cleaning, storage outdoor, organization outdoor, inventory outdoor, checklist pendakian, packing list, preparation guide, training program, fitness pendaki, stamina building, endurance training, cardio workout, strength training, flexibility exercise, yoga outdoor, meditation mountain, mindfulness nature, mental preparation, motivation pendaki, inspirasi petualangan, quotes pendaki, cerita inspiratif, pengalaman mendaki, testimoni pendaki, review trip, rating trip organizer, feedback customer, customer satisfaction, best trip organizer, recommended guide, trusted porter, professional service, excellent service, 5 star rating, top rated, highly recommended, best seller trip, popular destination, trending mountain, viral pendakian, famous peak, iconic mountain, legendary summit, historic climb, record breaking, fastest ascent, youngest climber, oldest climber, female climber, solo female traveler, women adventure, ladies trip, girls getaway, couple trip, honeymoon adventure, romantic camping, family adventure, kids friendly trip, senior citizen trip, disability friendly, accessible outdoor, inclusive adventure, diversity outdoor, multicultural team, international climber, foreign tourist, domestic tourist, local guide, indigenous knowledge, traditional wisdom, cultural experience, local cuisine, traditional food, authentic experience, immersive travel, experiential tourism, educational trip, learning journey, skill development, personal growth, character building, confidence building, fear conquering, limit pushing, challenge accepted, adventure awaits, explore Indonesia, discover nature, embrace wilderness, connect with nature, back to nature, escape city, digital detox, unplugged vacation, off grid living, remote destination, hidden gem, secret spot, undiscovered place, virgin forest, pristine nature, untouched wilderness, paradise found, heaven on earth, bucket list destination, must visit place, once in lifetime, unforgettable experience, memorable journey, life changing trip, transformative adventure, soul searching, self discovery, finding purpose, meaning of life, happiness journey, joy of climbing, thrill of adventure, adrenaline rush, extreme sport, adventure sport, outdoor recreation, nature activity, wilderness activity, mountain activity, forest activity, river activity, lake activity, beach activity, island hopping, volcano tour, crater exploration, hot spring, waterfall hunting, cave exploration, spelunking, bird watching, wildlife spotting, flora fauna, biodiversity, ecosystem, conservation area, national park, nature reserve, protected forest, UNESCO site, world heritage, natural wonder, geological formation, unique landscape, scenic view, panoramic vista, breathtaking scenery, stunning view, magnificent landscape, spectacular nature, beautiful Indonesia, amazing Indonesia, wonderful Indonesia, incredible Indonesia, paradise Indonesia, tropical paradise, equatorial nature, biodiversity hotspot, mega diverse country, archipelago adventure, island nation, maritime culture, coastal living, mountain living, highland culture, lowland culture, urban outdoor, suburban adventure, rural exploration, village tourism, agro tourism, eco village, sustainable community, green living, organic farming, permaculture, homesteading, off grid community, intentional community, commune living, simple living, minimalist lifestyle, frugal living, budget travel, cheap trip, affordable adventure, economical trip, value for money, best deal, special offer, early bird discount, group discount, member benefit, loyalty program, referral bonus, cashback, voucher, coupon code, promo code, flash sale, limited offer, exclusive deal, VIP access, premium membership, gold member, platinum member, diamond member, elite member, founder member, lifetime member, annual membership, monthly subscription, pay per trip, flexible payment, installment plan, zero interest, easy payment, secure payment, trusted payment, verified payment, guaranteed refund, money back guarantee, satisfaction guarantee, quality assurance, ISO certified, award winning, certified excellence, industry leader, market leader, number one, best in class, top choice, preferred partner, official partner, authorized dealer, licensed operator, registered business, legal entity, tax compliant, transparent pricing, no hidden cost, all inclusive, comprehensive package, complete service, full support, 24/7 customer service, responsive support, helpful staff, friendly team, professional crew, experienced guide, knowledgeable porter, skilled photographer, talented videographer, creative content, quality content, engaging story, inspiring journey, motivational content, educational material, informative guide, detailed itinerary, clear instruction, easy booking, simple registration, quick confirmation, instant reply, fast response, efficient service, reliable partner, dependable team, trustworthy organizer, credible company, reputable brand, established business, proven track record, successful trips, satisfied customers, happy clients, positive reviews, excellent feedback, high rating, strong recommendation, word of mouth, viral marketing, organic growth, community driven, customer centric, value driven, mission driven, vision driven, purpose driven, passion driven, adventure driven, nature driven, sustainability driven, innovation driven, technology driven, digital platform, mobile app, web application, online booking system, reservation system, payment gateway, integrated system, automated process, streamlined operation, efficient workflow, optimized process, best practice, standard operating procedure, quality control, continuous improvement, innovation culture, learning organization, knowledge sharing, skill transfer, capacity building, empowerment, collaboration, partnership, networking, community building, ecosystem development, industry development, market development, business growth, scalable model, sustainable business, profitable venture, social enterprise, impact business, triple bottom line, people planet profit, conscious capitalism, responsible business, ethical practice, fair trade, living wage, decent work, safe workplace, healthy environment, work life balance, employee welfare, team culture, company value, brand identity, unique selling point, competitive advantage, market position, brand awareness, brand recognition, brand loyalty, customer retention, customer acquisition, lead generation, conversion rate, sales funnel, marketing strategy, digital marketing, social media marketing, content marketing, SEO optimization, search engine ranking, Google visibility, online presence, digital footprint, web traffic, engagement rate, follower growth, community engagement, user generated content, testimonial video, case study, success story, before after, transformation story, impact story, behind the scene, day in life, team introduction, member profile, founder story, company history, milestone achievement, anniversary celebration, special event, launching event, grand opening, soft opening, pre-launch, coming soon, sneak peek, teaser, announcement, news update, press release, media coverage, publication, feature article, interview, podcast, webinar, online seminar, workshop, training, course, certification, accreditation, license, permit, registration, membership, subscription, newsletter, email marketing, SMS marketing, WhatsApp marketing, Telegram channel, Discord community, Facebook group, Instagram community, Twitter thread, LinkedIn network, YouTube channel, TikTok account, blog post, article, guide, tutorial, how to, tips tricks, hack, secret, insider, expert advice, pro tip, best practice, lesson learned, mistake avoid, do dont, checklist, template, framework, model, system, process, method, technique, strategy, tactic, approach, solution, answer, resource, tool, software, application, platform, service, product, equipment, gear, accessory, merchandise, souvenir, gift, prize, reward, incentive, benefit, advantage, value, quality, excellence, perfection, mastery, expertise, professionalism, dedication, commitment, passion, love, care, respect, integrity, honesty, transparency, authenticity, genuineness, sincerity, trust, reliability, dependability, consistency, stability, security, safety, protection, insurance, guarantee, warranty, assurance, confidence, peace of mind, comfort, convenience, ease, simplicity, clarity, understanding, knowledge, wisdom, insight, awareness, consciousness, mindfulness, presence, attention, focus, concentration, determination, perseverance, persistence, resilience, strength, courage, bravery, confidence, self-belief, self-trust, self-love, self-care, self-improvement, self-development, personal development, professional development, career development, skill development, talent development, potential realization, goal achievement, dream fulfillment, vision realization, mission accomplishment, purpose discovery, meaning creation, value generation, impact creation, legacy building, contribution making, difference making, change creating, transformation driving, innovation leading, excellence pursuing, greatness achieving, success attaining, victory celebrating, triumph enjoying, joy experiencing, happiness feeling, satisfaction gaining, fulfillment achieving, contentment reaching, peace finding, harmony creating, balance maintaining, wellness promoting, health improving, fitness enhancing, vitality boosting, energy increasing, stamina building, endurance developing, strength gaining, power growing, capability expanding, capacity increasing, potential unleashing, talent discovering, skill mastering, knowledge acquiring, wisdom gaining, experience accumulating, learning continuing, growing evolving, developing progressing, advancing moving, improving enhancing, optimizing maximizing, excelling surpassing, achieving accomplishing, succeeding winning, thriving flourishing, prospering blooming\', PERGIMMIKAN Jogja, PERGIMMIKAN Yogyakarta, PERGIMMIKAN Bandung, PERGIMMIKAN Jakarta, PERGIMMIKAN Surabaya, pendaki Jogja, pendaki Bandung, hiking Jogja, hiking Bandung, komunitas outdoor Jogja, komunitas outdoor Bandung, Gunung Merapi, Gunung Merbabu, Gunung Lawu, Gunung Semeru, Gunung Rinjani, Gunung Bromo, Gunung Sindoro, Gunung Sumbing, Gunung Slamet, Gunung Ciremai, Gunung Gede Pangrango, Gunung Papandayan, pendakian Merapi, pendakian Semeru, pendakian Rinjani, trip Jogja, trip Bandung, trip Malang, trip Lombok, basecamp Merapi, basecamp Semeru, jalur pendakian Merapi, jalur pendakian Semeru, open trip Jogja, open trip Bandung, private trip Jogja, paket pendakian Merapi, paket pendakian Semeru', 'Tim PERGIMMIKAN - Komunitas Petualang Indonesia', 'Kenali anggota tim PERGIMMIKAN: Tunggul, Deva, Akbar, Frasiskus, Muhammad, Miraj, Indira, Zaki, Zul, Lia, Fadia, Fira, Jordi, Zulfa, Kahfi, Raga, Ridho, Toha, Arvan, Farrel, Fadil. Komunitas petualang Indonesia.', '', '', '', '', 'https://pergimmikan.site/team', 'index, follow', NULL, 1, '2025-10-14 15:46:01', '2025-10-14 16:29:47'),
(7, 'trip-calculator', NULL, 'Trip Calculator - Hitung Biaya Pendakian Gunung | PERGIMMIKAN', 'Rencanakan pendakian gunung Anda dengan mudah! Hitung estimasi biaya transportasi, \nperalatan, dan jalur pendakian. Dapatkan rekomendasi gunung terdekat dari lokasi \nAnda dengan Trip Calculator PERGIMMIKAN', 'Primary Keywords: - kalkulator pendakian - biaya pendakian gunung - trip planner indonesia - estimasi biaya hiking  Secondary Keywords: - peralatan hiking - transportasi gunung - jalur pendakian - rental alat gunung - gunung terdekat - kalkulator biaya mendaki - perencanaan pendakian - sewa peralatan gunung - transportasi ke gunung - jalur hiking indonesia - gunung di indonesia - pendakian gunung jawa - biaya mendaki gunung - tips pendakian - persiapan mendaki gunung', '', '', '', '', '', '', 'https://pergimmikan.site/next', 'index, follow', NULL, 1, '2025-10-15 20:16:35', '2025-10-15 20:16:35');

-- --------------------------------------------------------

--
-- Table structure for table `seo_templates`
--

CREATE TABLE `seo_templates` (
  `id` int(11) NOT NULL,
  `template_name` varchar(100) NOT NULL,
  `title_template` varchar(500) NOT NULL COMMENT 'Use {variable} for dynamic content',
  `description_template` text DEFAULT NULL,
  `keywords_template` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo_templates`
--

INSERT INTO `seo_templates` (`id`, `template_name`, `title_template`, `description_template`, `keywords_template`, `created_at`, `updated_at`) VALUES
(1, 'journey_detail', '{title} - Cerita Perjalanan PERGIMMIKAN', 'Baca cerita perjalanan {title} oleh tim PERGIMMIKAN. Petualangan di {location} yang penuh dengan pengalaman menarik dan momen tak terlupakan.', '{title}, perjalanan {location}, petualangan PERGIMMIKAN, traveling {location}', '2025-10-14 13:55:47', '2025-10-14 13:55:47'),
(2, 'team_member', '{name} - Tim PERGIMMIKAN', 'Kenali {name}, anggota tim PERGIMMIKAN dengan peran sebagai {role}. {description}', '{name}, tim PERGIMMIKAN, {role}, anggota PERGIMMIKAN', '2025-10-14 13:55:47', '2025-10-14 13:55:47'),
(3, 'gallery_album', '{title} - Galeri PERGIMMIKAN', 'Lihat foto-foto dari {title}. Dokumentasi lengkap perjalanan di {location} bersama tim PERGIMMIKAN.', '{title}, galeri {location}, foto perjalanan, dokumentasi PERGIMMIKAN', '2025-10-14 13:55:47', '2025-10-14 13:55:47');

-- --------------------------------------------------------

--
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `platform` enum('linkedin','github','instagram') NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_media`
--

INSERT INTO `social_media` (`id`, `team_id`, `platform`, `url`, `created_at`, `updated_at`) VALUES
(5, 14, 'linkedin', 'as', '2025-10-14 15:07:22', '2025-10-14 15:07:22'),
(6, 14, 'github', 'asa', '2025-10-14 15:07:22', '2025-10-14 15:07:22'),
(7, 21, 'github', 'asas', '2025-10-14 15:07:29', '2025-10-14 15:07:29');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES
(1, 'Event', '2025-03-10 19:35:24'),
(2, 'Nature', '2025-03-10 19:35:24'),
(3, 'Adventure', '2025-03-10 19:35:24'),
(4, 'Gathering', '2025-03-10 19:35:24'),
(5, 'Festival', '2025-03-10 19:35:24'),
(6, 'Coba', '2025-03-10 19:50:29'),
(7, 'tambah', '2025-03-16 17:19:58'),
(8, 'celebration', '2025-04-07 20:23:27');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_api_keys`
--

CREATE TABLE `tbl_api_keys` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`permissions`)),
  `expires_at` datetime DEFAULT NULL,
  `last_used` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_loginadmin`
--

CREATE TABLE `tbl_loginadmin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('super_admin','admin') DEFAULT 'admin',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_loginadmin`
--

INSERT INTO `tbl_loginadmin` (`id`, `username`, `password`, `nama_lengkap`, `email`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', '$2a$10$23kxJxYcB.dGe66O6MtAl.We8oj5Jc2ISCWRRWs50adDaaWfeDCHe', 'Tole ganteng', 'admin@gimmik.com', 'super_admin', 'active', '2025-03-09 18:26:02', '2025-06-27 16:04:31');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `short_name` varchar(50) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `short_name`, `role`, `image_url`, `description`, `status`, `created_at`, `updated_at`) VALUES
(14, 'Tunggul Bayu Kusuma', 'bayu', 'Ketua', '/images/team/team-1743368176721-395585350.jpg', 'apa yak', 'active', '2025-03-14 14:52:18', '2025-10-14 15:07:22'),
(15, 'Deva Satrya Ramadhan', NULL, 'Member', '/images/team/team-1741968200338-359492083.jpg', 'cobaa', 'active', '2025-03-14 16:03:20', '2025-03-14 16:03:20'),
(16, 'Akbar Hidayatullah', NULL, 'Member', '/images/team/team-1741968228765-909748946.jpg', 'COBAA', 'active', '2025-03-14 16:03:48', '2025-03-14 16:03:48'),
(17, 'Frasiskus Aldi Jebadu', NULL, 'Member', '/images/team/team-1741968317828-476737238.jpg', 'COBAA', 'active', '2025-03-14 16:05:17', '2025-03-14 16:05:17'),
(18, 'Muhammad Darril Fauzi', NULL, 'Member', '/images/team/team-1741968355481-777400653.jpg', 'mamama', 'active', '2025-03-14 16:05:55', '2025-03-14 16:05:55'),
(19, 'Miraj Diamond Sundachi', NULL, 'Member', '/images/team/team-1741968388716-294597979.jpg', 'mamama', 'active', '2025-03-14 16:06:28', '2025-03-14 16:06:28'),
(20, 'Indira Arifin', 'Indira', 'Momi', '/images/team/team-1760454063396-24347898.jpg', 'mama', 'active', '2025-03-14 16:07:12', '2025-10-14 15:01:03'),
(21, 'Zaki Syifa Nugroho', NULL, 'Member', '/images/team/team-1741968461352-447240606.jpg', 'mamama', 'active', '2025-03-14 16:07:41', '2025-03-14 16:07:41'),
(22, 'Zul Widya Pratiwi', NULL, 'Momi', '/images/team/team-1743367062760-60092814.jpg', 'asasasas', 'active', '2025-03-14 16:08:09', '2025-03-30 20:37:42'),
(23, 'Lia Agustin Pratiwi', NULL, 'Momi', '/images/team/team-1743367103105-278650371.jpg', 'mamama', 'active', '2025-03-14 16:08:39', '2025-03-30 20:38:23'),
(24, 'Fadia Nurmasri', NULL, 'Momi', '/images/team/team-1743367131494-816939639.jpg', 'aaa', 'active', '2025-03-15 23:21:50', '2025-03-30 20:38:51'),
(25, 'Maesheilla', NULL, 'Momi', '/images/team/team-1743367173250-661617199.jpg', 'aaaa', 'active', '2025-03-15 23:24:25', '2025-03-30 20:39:33'),
(26, 'Fira', 'TestShort', 'Momi', '/images/team/team-1743367223007-861941279.jpg', 'aaa', 'active', '2025-03-15 23:24:49', '2025-10-14 14:51:42'),
(28, 'Muhamad Jordi Riawan', NULL, 'Member', '/images/team/team-1743367292782-173892296.jpg', 'a', 'active', '2025-03-19 13:21:55', '2025-03-30 20:41:32'),
(31, 'Muhammad Zulfa', NULL, 'Member', '/images/team/team-1743367318206-669254352.jpg', '', 'active', '2025-03-19 13:34:21', '2025-03-30 20:41:58'),
(32, 'Muhammad Kahfi Chidani', NULL, 'Member', '/images/team/team-1743367380409-54451947.jpg', 'a', 'active', '2025-03-19 13:35:43', '2025-03-30 20:43:00'),
(33, 'Muhammad Raga Pratama', 'raga', 'Member', '/images/team/team-1743367404138-548547398.jpg', 'a', 'active', '2025-03-19 13:37:07', '2025-10-14 15:24:13'),
(34, 'Toha Hisyamuddin', NULL, 'Member', '/images/team/team-1743367426341-598805942.jpg', 'a', 'active', '2025-03-19 13:37:57', '2025-03-30 20:43:46'),
(35, 'Arvan Bukhari', NULL, 'Member', '/images/team/team-1743367446052-343141296.jpg', 'Experienced web developer with expertise in React', 'active', '2025-03-22 17:35:42', '2025-03-30 20:44:06'),
(36, 'Muhammad ridho bareng', NULL, 'Member', '/images/team/team-1744481557612-848335932.jpeg', '', 'active', '2025-04-12 18:12:37', '2025-04-12 18:12:37');

--
-- Triggers `teams`
--
DELIMITER $$
CREATE TRIGGER `fix_team_id` BEFORE INSERT ON `teams` FOR EACH ROW BEGIN
  IF NEW.id = 0 OR NEW.id IS NULL THEN
    SET NEW.id = (SELECT IFNULL(MAX(id) + 1, 1) FROM teams);
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `team_members_view`
-- (See below for the actual view)
--
CREATE TABLE `team_members_view` (
`id` int(11)
,`name` varchar(100)
,`short_name` varchar(50)
,`role` varchar(100)
,`image_url` varchar(255)
,`description` text
,`status` enum('active','inactive')
,`created_at` timestamp
,`updated_at` timestamp
,`linkedin` varchar(255)
,`github` varchar(255)
,`instagram` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `transportation_operators`
--

CREATE TABLE `transportation_operators` (
  `id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL COMMENT 'FK to transportation_routes',
  `operator_name` varchar(100) NOT NULL COMMENT 'Nama operator (KAI, Garuda, dll)',
  `service_class` varchar(50) DEFAULT NULL COMMENT 'Kelas layanan (Ekonomi, Bisnis, Eksekutif)',
  `price` int(11) NOT NULL COMMENT 'Harga per orang',
  `facilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Fasilitas ["AC", "Meal", "WiFi", "Bagasi"]' CHECK (json_valid(`facilities`)),
  `duration_hours` decimal(4,1) DEFAULT NULL COMMENT 'Durasi perjalanan (jam)',
  `departure_times` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Jam keberangkatan' CHECK (json_valid(`departure_times`)),
  `booking_url` varchar(255) DEFAULT NULL COMMENT 'Link booking online',
  `booking_phone` varchar(50) DEFAULT NULL COMMENT 'Nomor booking',
  `is_recommended` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `notes` text DEFAULT NULL,
  `last_updated` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transportation_operators`
--

INSERT INTO `transportation_operators` (`id`, `route_id`, `operator_name`, `service_class`, `price`, `facilities`, `duration_hours`, `departure_times`, `booking_url`, `booking_phone`, `is_recommended`, `is_active`, `notes`, `last_updated`) VALUES
(9, 396, 'KAI - Argo Dwipangga', 'Eksekutif', 250000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\", \"WiFi\"]', 7.5, '[\"08:00\", \"20:00\"]', 'https://kai.id', NULL, 1, 1, NULL, '2024-10-14'),
(10, 396, 'KAI - Taksaka', 'Eksekutif', 230000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\"]', 7.5, '[\"07:30\", \"19:30\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(11, 396, 'KAI - Turangga', 'Bisnis', 150000, '[\"AC\", \"Snack\", \"Reclining Seat\"]', 8.0, '[\"08:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(12, 396, 'KAI - Ekonomi AC', 'Ekonomi', 100000, '[\"AC\", \"Toilet\"]', 9.0, '[\"06:00\", \"14:00\", \"22:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(13, 397, 'KAI - Argo Bromo Anggrek', 'Eksekutif', 350000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\", \"WiFi\", \"Entertainment\"]', 8.0, '[\"08:00\", \"20:00\"]', 'https://kai.id', NULL, 1, 1, NULL, '2024-10-14'),
(14, 397, 'KAI - Bima', 'Eksekutif', 320000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\"]', 8.5, '[\"07:00\", \"19:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(15, 397, 'KAI - Ekonomi AC', 'Ekonomi', 150000, '[\"AC\", \"Toilet\"]', 10.0, '[\"05:00\", \"13:00\", \"21:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(16, 398, 'Garuda Indonesia', 'Ekonomi', 1200000, '[\"Meal\", \"Bagasi 20kg\", \"In-flight Entertainment\", \"Refundable\"]', 2.5, '[\"06:00\", \"10:00\", \"14:00\", \"18:00\"]', 'https://garuda-indonesia.com', NULL, 1, 1, NULL, '2024-10-14'),
(17, 398, 'Lion Air', 'Ekonomi', 800000, '[\"Bagasi 20kg\", \"Snack\"]', 2.5, '[\"05:30\", \"09:30\", \"13:30\", \"17:30\", \"21:30\"]', 'https://lionair.co.id', NULL, 0, 1, NULL, '2024-10-14'),
(18, 398, 'Citilink', 'Ekonomi', 700000, '[\"Bagasi 20kg\"]', 2.5, '[\"07:00\", \"11:00\", \"15:00\"]', 'https://citilink.co.id', NULL, 0, 1, NULL, '2024-10-14'),
(19, 398, 'Batik Air', 'Ekonomi', 950000, '[\"Meal\", \"Bagasi 20kg\", \"Refundable\"]', 2.5, '[\"08:00\", \"12:00\", \"16:00\"]', 'https://batikair.com', NULL, 0, 1, NULL, '2024-10-14'),
(20, 399, 'Pahala Kencana', 'Eksekutif', 200000, '[\"AC\", \"Meal\", \"Toilet\", \"Reclining Seat\", \"WiFi\", \"Entertainment\"]', 8.0, '[\"18:00\", \"19:00\", \"20:00\"]', NULL, NULL, 1, 1, NULL, '2024-10-14'),
(21, 399, 'Sinar Jaya', 'Bisnis', 150000, '[\"AC\", \"Snack\", \"Toilet\", \"Reclining Seat\"]', 9.0, '[\"17:00\", \"18:00\", \"19:00\", \"20:00\"]', NULL, NULL, 0, 1, NULL, '2024-10-14'),
(22, 399, 'Nusantara', 'Ekonomi AC', 120000, '[\"AC\", \"Toilet\"]', 10.0, '[\"18:00\", \"20:00\", \"22:00\"]', NULL, NULL, 0, 1, NULL, '2024-10-14'),
(23, 400, 'X-Trans', 'Eksekutif', 120000, '[\"AC\", \"Reclining Seat\", \"Door to Door\", \"WiFi\"]', 2.5, '[\"00:00\"]', NULL, '081234567890', 1, 1, NULL, '2024-10-14'),
(24, 400, 'Cipaganti', 'Eksekutif', 100000, '[\"AC\", \"Reclining Seat\", \"Door to Door\"]', 3.0, '[\"00:00\"]', 'https://cipaganti.co.id', '082345678901', 0, 1, NULL, '2024-10-14'),
(25, 400, 'Baraya Travel', 'Eksekutif', 90000, '[\"AC\", \"Reclining Seat\"]', 3.0, '[\"00:00\"]', NULL, '083456789012', 0, 1, NULL, '2024-10-14'),
(30, 401, 'KAI - Argo Dwipangga', 'Eksekutif', 250000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\", \"WiFi\"]', 7.5, '[\"08:00\", \"20:00\"]', 'https://kai.id', NULL, 1, 1, NULL, '2024-10-14'),
(31, 401, 'KAI - Taksaka', 'Eksekutif', 230000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\"]', 7.5, '[\"07:30\", \"19:30\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(32, 401, 'KAI - Turangga', 'Bisnis', 150000, '[\"AC\", \"Snack\", \"Reclining Seat\"]', 8.0, '[\"08:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(33, 401, 'KAI - Ekonomi AC', 'Ekonomi', 100000, '[\"AC\", \"Toilet\"]', 9.0, '[\"06:00\", \"14:00\", \"22:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(34, 402, 'KAI - Argo Bromo Anggrek', 'Eksekutif', 350000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\", \"WiFi\", \"Entertainment\"]', 8.0, '[\"08:00\", \"20:00\"]', 'https://kai.id', NULL, 1, 1, NULL, '2024-10-14'),
(35, 402, 'KAI - Bima', 'Eksekutif', 320000, '[\"AC\", \"Meal\", \"Reclining Seat\", \"Power Outlet\"]', 8.5, '[\"07:00\", \"19:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(36, 402, 'KAI - Ekonomi AC', 'Ekonomi', 150000, '[\"AC\", \"Toilet\"]', 10.0, '[\"05:00\", \"13:00\", \"21:00\"]', 'https://kai.id', NULL, 0, 1, NULL, '2024-10-14'),
(37, 403, 'Garuda Indonesia', 'Ekonomi', 1200000, '[\"Meal\", \"Bagasi 20kg\", \"In-flight Entertainment\", \"Refundable\"]', 2.5, '[\"06:00\", \"10:00\", \"14:00\", \"18:00\"]', 'https://garuda-indonesia.com', NULL, 1, 1, NULL, '2024-10-14'),
(38, 403, 'Lion Air', 'Ekonomi', 800000, '[\"Bagasi 20kg\", \"Snack\"]', 2.5, '[\"05:30\", \"09:30\", \"13:30\", \"17:30\", \"21:30\"]', 'https://lionair.co.id', NULL, 0, 1, NULL, '2024-10-14'),
(39, 403, 'Citilink', 'Ekonomi', 700000, '[\"Bagasi 20kg\"]', 2.5, '[\"07:00\", \"11:00\", \"15:00\"]', 'https://citilink.co.id', NULL, 0, 1, NULL, '2024-10-14'),
(40, 403, 'Batik Air', 'Ekonomi', 950000, '[\"Meal\", \"Bagasi 20kg\", \"Refundable\"]', 2.5, '[\"08:00\", \"12:00\", \"16:00\"]', 'https://batikair.com', NULL, 0, 1, NULL, '2024-10-14'),
(41, 404, 'Pahala Kencana', 'Eksekutif', 200000, '[\"AC\", \"Meal\", \"Toilet\", \"Reclining Seat\", \"WiFi\", \"Entertainment\"]', 8.0, '[\"18:00\", \"19:00\", \"20:00\"]', NULL, NULL, 1, 1, NULL, '2024-10-14'),
(42, 404, 'Sinar Jaya', 'Bisnis', 150000, '[\"AC\", \"Snack\", \"Toilet\", \"Reclining Seat\"]', 9.0, '[\"17:00\", \"18:00\", \"19:00\", \"20:00\"]', NULL, NULL, 0, 1, NULL, '2024-10-14'),
(43, 404, 'Nusantara', 'Ekonomi AC', 120000, '[\"AC\", \"Toilet\"]', 10.0, '[\"18:00\", \"20:00\", \"22:00\"]', NULL, NULL, 0, 1, NULL, '2024-10-14'),
(44, 405, 'X-Trans', 'Eksekutif', 120000, '[\"AC\", \"Reclining Seat\", \"Door to Door\", \"WiFi\"]', 2.5, '[\"00:00\"]', NULL, '081234567890', 1, 1, NULL, '2024-10-14'),
(45, 405, 'Cipaganti', 'Eksekutif', 100000, '[\"AC\", \"Reclining Seat\", \"Door to Door\"]', 3.0, '[\"00:00\"]', 'https://cipaganti.co.id', '082345678901', 0, 1, NULL, '2024-10-14'),
(46, 405, 'Baraya Travel', 'Eksekutif', 90000, '[\"AC\", \"Reclining Seat\"]', 3.0, '[\"00:00\"]', NULL, '083456789012', 0, 1, NULL, '2024-10-14');

-- --------------------------------------------------------

--
-- Table structure for table `transportation_routes`
--

CREATE TABLE `transportation_routes` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `from_city` varchar(100) NOT NULL COMMENT 'Jakarta, Bandung, Surabaya, etc',
  `to_location` varchar(100) NOT NULL,
  `transport_type` enum('Pesawat','Kereta','Bus','Travel','Mobil Pribadi') NOT NULL,
  `transport_name` varchar(200) DEFAULT NULL COMMENT 'Airline/Bus company name',
  `route_description` text DEFAULT NULL COMMENT 'Detailed route',
  `duration_hours` decimal(4,1) DEFAULT NULL COMMENT 'Travel time in hours',
  `distance_km` int(11) DEFAULT NULL,
  `cost_min` int(11) DEFAULT NULL COMMENT 'Minimum cost in IDR',
  `cost_max` int(11) DEFAULT NULL COMMENT 'Maximum cost in IDR',
  `cost_notes` text DEFAULT NULL COMMENT 'Cost breakdown/notes',
  `departure_times` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Available departure times' CHECK (json_valid(`departure_times`)),
  `frequency` varchar(100) DEFAULT NULL COMMENT 'Daily, 3x/week, etc',
  `booking_info` text DEFAULT NULL COMMENT 'How to book this transport',
  `booking_url` varchar(255) DEFAULT NULL,
  `booking_phone` varchar(50) DEFAULT NULL,
  `is_recommended` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estimated_hours` decimal(5,2) DEFAULT 0.00,
  `base_price` int(11) DEFAULT 0,
  `is_roundtrip_available` tinyint(1) DEFAULT 1,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transportation_routes`
--

INSERT INTO `transportation_routes` (`id`, `mountain_id`, `from_city`, `to_location`, `transport_type`, `transport_name`, `route_description`, `duration_hours`, `distance_km`, `cost_min`, `cost_max`, `cost_notes`, `departure_times`, `frequency`, `booking_info`, `booking_url`, `booking_phone`, `is_recommended`, `created_at`, `updated_at`, `estimated_hours`, `base_price`, `is_roundtrip_available`, `description`) VALUES
(341, 1, 'Jakarta', 'mendolo', 'Pesawat', 'Lion Air / Garuda / Citilink / Batik Air', 'Jakarta (CGK/HLP) → Lombok (LOP)', 2.5, 1200, 500000, 1500000, 'Harga bervariasi, booking H-30 lebih murah. Promo sering 400-600rb', '[\"06:00\", \"10:00\", \"14:00\", \"18:00\", \"20:00\"]', '10-15 flight/hari', 'Traveloka, Tiket.com, website maskapai', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-15 18:26:12', 0.00, 2, 1, NULL),
(342, 1, 'Jakarta', '', '', 'Lorena / Gunung Harta / Pahala Kencana', 'Jakarta → Bali (bus) → Padang Bai → Lembar (ferry) → Mataram', 24.0, 1400, 300000, 500000, 'Perjalanan panjang tapi hemat. Termasuk ferry', '[\"15:00\", \"16:00\", \"17:00\"]', 'Daily 3-4 bus', 'Terminal Kampung Rambutan, online', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(343, 2, 'Jakarta', '', 'Kereta', 'Gajayana / Bima / Jayabaya', 'Jakarta (Gambir/Pasar Senen) → Malang', 8.0, 800, 150000, 350000, 'Ekonomi 150rb, Bisnis 250rb, Eksekutif 350rb. Nyaman!', '[\"07:00\", \"15:00\", \"19:00\"]', 'Daily 3-4 kereta', 'KAI Access app, stasiun', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(344, 2, 'Jakarta', '', 'Pesawat', 'Lion Air / Citilink / Batik Air', 'Jakarta (CGK/HLP) → Malang (MLG)', 1.5, 800, 400000, 1200000, 'Tercepat tapi mahal. Promo bisa 300-500rb', '[\"06:00\", \"12:00\", \"18:00\"]', '3-5 flight/hari', 'Traveloka, Tiket.com', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(345, 2, 'Jakarta', '', 'Bus', 'Pahala Kencana / Lorena / Gunung Harta', 'Jakarta → Malang langsung', 12.0, 800, 200000, 350000, 'Ekonomi 200rb, VIP 350rb. Overnight', '[\"16:00\", \"17:00\", \"18:00\", \"19:00\"]', 'Daily 10+ bus', 'Terminal Kampung Rambutan', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(346, 3, 'Jakarta', '', 'Kereta', 'Taksaka / Argo Dwipangga / Argo Lawu', 'Jakarta (Gambir) → Yogyakarta (Tugu/Lempuyangan)', 8.0, 560, 150000, 350000, 'Ekonomi 150rb, Bisnis 250rb, Eksekutif 350rb', '[\"07:00\", \"19:00\", \"20:00\"]', 'Daily 3-4 kereta', 'KAI Access app', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(347, 3, 'Jakarta', '', 'Pesawat', 'Garuda / Lion / Citilink / Batik Air', 'Jakarta (CGK/HLP) → Yogyakarta (JOG)', 1.5, 560, 400000, 1200000, 'Tercepat. Promo sering 300-500rb', '[\"06:00\", \"09:00\", \"12:00\", \"15:00\", \"18:00\"]', '15+ flight/hari', 'Traveloka, Tiket.com', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(348, 3, 'Jakarta', '', 'Bus', 'Pahala Kencana / Sinar Jaya / Lorena', 'Jakarta → Yogyakarta langsung', 10.0, 560, 150000, 300000, 'Ekonomi 150rb, VIP 300rb', '[\"16:00\", \"17:00\", \"18:00\", \"19:00\", \"20:00\"]', 'Daily 15+ bus', 'Terminal Kampung Rambutan', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(349, 4, 'Jakarta', '', 'Kereta', 'Gajayana / Bima', 'Jakarta → Probolinggo', 9.0, 850, 150000, 350000, 'Turun Probolinggo, lanjut ke Bromo', '[\"07:00\", \"15:00\", \"19:00\"]', 'Daily 3 kereta', 'KAI Access app', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(350, 4, 'Jakarta', '', 'Bus', 'Pahala Kencana / Lorena', 'Jakarta → Probolinggo', 14.0, 850, 200000, 350000, 'Overnight, langsung ke Probolinggo', '[\"16:00\", \"17:00\", \"18:00\"]', 'Daily 5+ bus', 'Terminal Kampung Rambutan', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(351, 4, 'Jakarta', '', '', 'Pesawat ke Surabaya + Travel', 'Jakarta → Surabaya (pesawat) → Bromo (travel)', 5.0, 850, 600000, 1500000, 'Pesawat 400-1jt + travel 200-500rb', '[\"06:00\", \"09:00\", \"12:00\"]', 'Multiple daily', 'Traveloka + travel Surabaya', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(352, 5, 'Jakarta', '', 'Kereta', 'Argo Lawu / Bengawan', 'Jakarta → Solo Balapan', 8.0, 550, 150000, 350000, 'Turun Solo, lanjut ke Selo', '[\"07:00\", \"20:00\"]', 'Daily 2 kereta', 'KAI Access app', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(353, 5, 'Jakarta', '', 'Bus', 'Pahala Kencana / Sinar Jaya', 'Jakarta → Solo', 10.0, 550, 150000, 300000, 'Overnight ke Solo', '[\"17:00\", \"18:00\", \"19:00\"]', 'Daily 5+ bus', 'Terminal Kampung Rambutan', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(354, 6, 'Jakarta', '', 'Kereta', 'Argo Lawu / Bengawan', 'Jakarta → Solo Balapan', 8.0, 600, 150000, 350000, 'Turun Solo, lanjut ke Cemoro Sewu', '[\"07:00\", \"20:00\"]', 'Daily 2 kereta', 'KAI Access app', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(355, 6, 'Jakarta', '', 'Bus', 'Pahala Kencana', 'Jakarta → Solo/Magetan', 10.0, 600, 150000, 300000, 'Overnight', '[\"17:00\", \"18:00\"]', 'Daily 3+ bus', 'Terminal Kampung Rambutan', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(356, 7, 'Jakarta', '', 'Bus', 'Sinar Jaya / Nusantara', 'Jakarta → Wonosobo', 10.0, 450, 150000, 250000, 'Langsung ke Wonosobo', '[\"17:00\", \"18:00\"]', 'Daily 2-3 bus', 'Terminal Kampung Rambutan', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(357, 8, 'Jakarta', '', 'Bus', 'Sinar Jaya / Nusantara', 'Jakarta → Wonosobo', 10.0, 450, 150000, 250000, 'Langsung ke Wonosobo', '[\"17:00\", \"18:00\"]', 'Daily 2-3 bus', 'Terminal Kampung Rambutan', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(358, 9, 'Jakarta', '', 'Bus', 'Sinar Jaya / Nusantara', 'Jakarta → Wonosobo', 10.0, 450, 150000, 250000, 'Langsung ke Wonosobo, lanjut Dieng', '[\"17:00\", \"18:00\"]', 'Daily 2-3 bus', 'Terminal Kampung Rambutan', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(359, 10, 'Jakarta', '', 'Bus', 'Budiman / Primajasa', 'Jakarta → Cianjur', 4.0, 120, 50000, 100000, 'Ekonomi 50rb, AC 100rb', '[\"06:00\", \"08:00\", \"10:00\", \"12:00\", \"14:00\", \"16:00\", \"18:00\", \"20:00\"]', 'Setiap 30 menit', 'Terminal Kampung Rambutan', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(360, 10, 'Jakarta', '', 'Travel', 'Travel Jakarta-Cianjur', 'Jakarta → Cibodas langsung', 3.0, 120, 150000, 200000, 'Door to door, nyaman', '[\"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\", \"17:00\", \"19:00\", \"21:00\"]', 'On demand', 'Booking online/WA', NULL, NULL, 1, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(361, 10, 'Jakarta', '', '', 'Rental + Driver', 'Jakarta → Cibodas', 3.0, 120, 600000, 800000, 'Per mobil (6-7 orang), split cost', '[\"00:00\"]', 'On demand 24 jam', 'Rental mobil Jakarta', NULL, NULL, 0, '2025-10-14 18:32:47', '2025-10-14 18:32:47', 0.00, 0, 1, NULL),
(362, 10, 'Jakarta', '', '', 'Motor Pribadi', 'Jakarta → Cibodas', 3.5, 120, 80000, 120000, 'Bensin + Tol + Parkir (PP)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(363, 10, 'Jakarta', '', 'Mobil Pribadi', 'Mobil Pribadi', 'Jakarta → Cibodas', 3.0, 120, 200000, 300000, 'Bensin + Tol + Parkir (PP)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(364, 3, 'Bandung', '', 'Kereta', 'Turangga / Mutiara Selatan', 'Bandung → Yogyakarta', 7.0, 420, 100000, 250000, 'Ekonomi 100rb, Bisnis 250rb', '[\"08:00\", \"20:00\"]', 'Daily 2 kereta', 'KAI Access app', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(365, 3, 'Bandung', '', 'Bus', 'Pahala Kencana / Sinar Jaya', 'Bandung → Yogyakarta', 8.0, 420, 120000, 200000, 'Overnight', '[\"18:00\", \"19:00\"]', 'Daily 3+ bus', 'Terminal Leuwi Panjang', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(366, 2, 'Bandung', '', 'Kereta', 'Mutiara Selatan', 'Bandung → Malang', 10.0, 700, 120000, 300000, 'Via Surabaya', '[\"08:00\"]', 'Daily 1 kereta', 'KAI Access app', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(367, 2, 'Bandung', '', 'Bus', 'Pahala Kencana', 'Bandung → Malang', 14.0, 700, 150000, 250000, 'Overnight', '[\"17:00\", \"18:00\"]', 'Daily 2+ bus', 'Terminal Leuwi Panjang', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(368, 10, 'Bandung', '', 'Bus', 'Budiman / Primajasa', 'Bandung → Cianjur', 2.0, 80, 30000, 60000, 'Ekonomi 30rb, AC 60rb', '[\"06:00\", \"08:00\", \"10:00\", \"12:00\", \"14:00\", \"16:00\", \"18:00\", \"20:00\"]', 'Setiap 30 menit', 'Terminal Leuwi Panjang', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(369, 10, 'Bandung', '', 'Travel', 'Travel Bandung-Cianjur', 'Bandung → Cibodas', 2.0, 80, 100000, 150000, 'Door to door', '[\"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\", \"17:00\", \"19:00\", \"21:00\"]', 'On demand', 'Booking online', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(370, 2, 'Surabaya', '', 'Bus', 'Eka / Jaya Utama', 'Surabaya → Malang', 3.0, 90, 30000, 60000, 'Ekonomi 30rb, AC 60rb', '[\"05:00\", \"06:00\", \"07:00\", \"08:00\", \"10:00\", \"12:00\", \"14:00\", \"16:00\", \"18:00\", \"20:00\"]', 'Setiap 30 menit', 'Terminal Purabaya', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(371, 2, 'Surabaya', '', 'Kereta', 'Kereta Lokal', 'Surabaya → Malang', 2.0, 90, 15000, 30000, 'Termurah!', '[\"06:00\", \"08:00\", \"10:00\", \"12:00\", \"14:00\", \"16:00\", \"18:00\"]', 'Setiap 1-2 jam', 'Stasiun Gubeng/Pasar Turi', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(372, 2, 'Surabaya', '', 'Travel', 'Travel Surabaya-Malang', 'Surabaya → Malang', 2.0, 90, 80000, 120000, 'Door to door, cepat', '[\"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\", \"17:00\", \"19:00\", \"21:00\"]', 'On demand', 'Booking online', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(373, 4, 'Surabaya', '', 'Bus', 'Bus Probolinggo', 'Surabaya → Probolinggo', 2.5, 100, 30000, 60000, 'Ekonomi 30rb, AC 60rb', '[\"05:00\", \"06:00\", \"07:00\", \"08:00\", \"09:00\", \"10:00\", \"12:00\", \"14:00\", \"16:00\", \"18:00\", \"20:00\"]', 'Setiap 1 jam', 'Terminal Purabaya', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(374, 4, 'Surabaya', '', 'Travel', 'Bromo Travel', 'Surabaya → Cemoro Lawang', 3.0, 120, 150000, 250000, 'Langsung ke Bromo', '[\"03:00\", \"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\"]', 'Multiple daily', 'Booking online', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(375, 4, 'Surabaya', '', '', 'Rental + Driver', 'Surabaya → Bromo', 3.0, 120, 500000, 700000, 'Per mobil (6-7 orang)', '[\"00:00\"]', 'On demand 24 jam', 'Rental Surabaya', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(376, 1, 'Surabaya', '', 'Pesawat', 'Lion Air / Citilink / Batik Air', 'Surabaya (SUB) → Lombok (LOP)', 1.5, 500, 400000, 1000000, 'Promo sering 300-500rb', '[\"06:00\", \"10:00\", \"14:00\", \"18:00\"]', '8-10 flight/hari', 'Traveloka, Tiket.com', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(377, 1, 'Surabaya', '', '', 'Bus ke Bali + Ferry', 'Surabaya → Bali → Lombok', 18.0, 600, 250000, 400000, 'Termasuk ferry', '[\"16:00\", \"17:00\"]', 'Daily 2-3 bus', 'Terminal Purabaya', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(378, 3, 'Yogyakarta', '', '', 'Bus Jogja-Boyolali', 'Yogyakarta → Selo', 2.0, 45, 20000, 30000, 'Bus reguler', '[\"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\", \"17:00\"]', 'Setiap 1-2 jam', 'Terminal Jombor', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(379, 3, 'Yogyakarta', '', '', 'Gojek / Grab', 'Yogyakarta → Selo', 1.5, 45, 50000, 80000, 'Ojek online', '[\"00:00\"]', 'On demand 24 jam', 'App Gojek/Grab', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(380, 3, 'Yogyakarta', '', '', 'Rental Motor', 'Yogyakarta → Selo', 1.5, 45, 75000, 100000, 'Per hari, lebih fleksibel', '[\"00:00\"]', 'On demand 24 jam', 'Rental Jogja', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(381, 5, 'Yogyakarta', '', '', 'Bus Jogja-Boyolali', 'Yogyakarta → Selo', 2.0, 45, 20000, 30000, 'Bus reguler', '[\"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\", \"17:00\"]', 'Setiap 1-2 jam', 'Terminal Jombor', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(382, 5, 'Yogyakarta', '', 'Travel', 'Merbabu Travel', 'Yogyakarta → Selo', 1.5, 45, 75000, 100000, 'Door to door', '[\"00:00\"]', 'On demand 24 jam', 'Booking online', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(383, 2, 'Yogyakarta', '', 'Bus', 'Pahala Kencana / Eka', 'Yogyakarta → Malang', 8.0, 400, 100000, 180000, 'Overnight', '[\"18:00\", \"19:00\"]', 'Daily 2+ bus', 'Terminal Giwangan', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(384, 2, 'Malang', '', '', 'Angkot Tumpang + Ojek', 'Malang → Tumpang → Ranupane', 4.0, 80, 50000, 70000, 'Paling murah! Angkot 10rb + Ojek 40rb', '[\"05:00\", \"06:00\", \"07:00\", \"08:00\", \"09:00\", \"10:00\", \"11:00\", \"12:00\", \"13:00\", \"14:00\", \"15:00\", \"16:00\"]', 'Reguler', 'Terminal Arjosari', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(385, 2, 'Malang', '', '', 'Jeep Hardtop Ranupane', 'Malang → Ranupane langsung', 3.0, 80, 150000, 200000, 'Per orang, nyaman', '[\"04:00\", \"05:00\", \"06:00\", \"07:00\", \"08:00\", \"09:00\", \"10:00\", \"11:00\", \"12:00\", \"13:00\", \"14:00\"]', 'Multiple daily', 'Booking online/WA', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(386, 2, 'Malang', '', 'Travel', 'Semeru Travel', 'Malang → Ranupane door to door', 3.0, 80, 200000, 250000, 'Paling nyaman, AC', '[\"00:00\"]', 'On demand 24 jam', 'Booking online', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(387, 4, 'Malang', '', 'Travel', 'Bromo Travel Malang', 'Malang → Cemoro Lawang', 2.5, 60, 150000, 200000, 'Langsung ke Bromo', '[\"03:00\", \"05:00\", \"07:00\", \"09:00\", \"11:00\", \"13:00\", \"15:00\"]', 'Multiple daily', 'Booking online', NULL, NULL, 1, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(388, 1, 'Jakarta', '', '', 'Motor Pribadi', 'Jakarta → Lombok (Ferry Bali)', 36.0, 1400, 300000, 500000, 'Bensin + Tol + Ferry (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(389, 1, 'Jakarta', '', 'Mobil Pribadi', 'Mobil Pribadi', 'Jakarta → Lombok (Ferry Bali)', 36.0, 1400, 800000, 1200000, 'Bensin + Tol + Ferry (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(390, 2, 'Surabaya', '', '', 'Motor Pribadi', 'Surabaya → Ranupane', 6.0, 180, 80000, 120000, 'Bensin + Parkir (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(391, 2, 'Surabaya', '', 'Mobil Pribadi', 'Mobil Pribadi', 'Surabaya → Ranupane', 6.0, 180, 200000, 300000, 'Bensin + Parkir (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(392, 3, 'Yogyakarta', '', '', 'Motor Pribadi', 'Yogyakarta → Selo', 2.0, 50, 30000, 50000, 'Bensin + Parkir (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(393, 3, 'Yogyakarta', '', 'Mobil Pribadi', 'Mobil Pribadi', 'Yogyakarta → Selo', 2.0, 50, 80000, 120000, 'Bensin + Parkir (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(394, 2, 'Malang', '', '', 'Motor Pribadi', 'Malang → Ranupane', 4.0, 80, 50000, 80000, 'Bensin + Parkir (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(395, 2, 'Malang', '', 'Mobil Pribadi', 'Mobil Pribadi', 'Malang → Ranupane', 4.0, 80, 120000, 180000, 'Bensin + Parkir (PP sudah termasuk)', '[\"00:00\"]', 'Kapan saja', 'Siapkan SIM & STNK', NULL, NULL, 0, '2025-10-14 18:32:48', '2025-10-14 18:32:48', 0.00, 0, 1, NULL),
(396, 3, 'Jakarta', '', 'Kereta', 'KAI Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 7.5, 560, 100000, 250000, 'Berbagai kelas tersedia', '[\"08:00\", \"20:00\"]', 'Multiple daily', 'https://kai.id', NULL, NULL, 1, '2025-10-14 19:54:08', '2025-10-14 19:54:08', 0.00, 0, 1, NULL),
(397, 2, 'Jakarta', '', 'Kereta', 'KAI Jakarta-Surabaya', 'Jakarta → Surabaya (untuk Semeru)', 8.0, 730, 150000, 350000, 'Berbagai kelas tersedia', '[\"08:00\", \"20:00\"]', 'Multiple daily', 'https://kai.id', NULL, NULL, 1, '2025-10-14 19:54:08', '2025-10-14 19:54:08', 0.00, 0, 1, NULL),
(398, 1, 'Jakarta', '', 'Pesawat', 'Jakarta-Lombok Flight', 'Jakarta → Lombok (untuk Rinjani)', 2.5, 1100, 700000, 1200000, 'Berbagai maskapai tersedia', '[\"06:00\", \"10:00\", \"14:00\"]', 'Multiple daily', 'Traveloka/Tiket.com', NULL, NULL, 1, '2025-10-14 19:54:08', '2025-10-14 19:54:08', 0.00, 0, 1, NULL),
(399, 3, 'Jakarta', '', 'Bus', 'Bus Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 9.0, 560, 120000, 200000, 'Bus malam, berbagai kelas', '[\"18:00\", \"19:00\", \"20:00\"]', 'Multiple evening', 'Langsung di terminal', NULL, NULL, 1, '2025-10-14 19:54:08', '2025-10-14 19:54:08', 0.00, 0, 1, NULL),
(400, 10, 'Jakarta', '', 'Travel', 'Travel Jakarta-Bandung', 'Jakarta → Bandung (untuk Gede Pangrango)', 3.0, 150, 90000, 120000, 'Door to door service', '[\"00:00\"]', 'On demand 24 jam', 'Booking online/WA', NULL, NULL, 1, '2025-10-14 19:54:08', '2025-10-14 19:54:08', 0.00, 0, 1, NULL),
(401, 3, 'Jakarta', '', 'Kereta', 'KAI Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 7.5, 560, 100000, 250000, 'Berbagai kelas tersedia', '[\"08:00\", \"20:00\"]', 'Multiple daily', 'https://kai.id', NULL, NULL, 1, '2025-10-14 20:01:50', '2025-10-14 20:01:50', 0.00, 0, 1, NULL),
(402, 2, 'Jakarta', '', 'Kereta', 'KAI Jakarta-Surabaya', 'Jakarta → Surabaya (untuk Semeru)', 8.0, 730, 150000, 350000, 'Berbagai kelas tersedia', '[\"08:00\", \"20:00\"]', 'Multiple daily', 'https://kai.id', NULL, NULL, 1, '2025-10-14 20:01:50', '2025-10-14 20:01:50', 0.00, 0, 1, NULL),
(403, 1, 'Jakarta', '', 'Pesawat', 'Jakarta-Lombok Flight', 'Jakarta → Lombok (untuk Rinjani)', 2.5, 1100, 700000, 1200000, 'Berbagai maskapai tersedia', '[\"06:00\", \"10:00\", \"14:00\"]', 'Multiple daily', 'Traveloka/Tiket.com', NULL, NULL, 1, '2025-10-14 20:01:50', '2025-10-14 20:01:50', 0.00, 0, 1, NULL),
(404, 3, 'Jakarta', '', 'Bus', 'Bus Jakarta-Yogyakarta', 'Jakarta → Yogyakarta (untuk Merapi)', 9.0, 560, 120000, 200000, 'Bus malam, berbagai kelas', '[\"18:00\", \"19:00\", \"20:00\"]', 'Multiple evening', 'Langsung di terminal', NULL, NULL, 1, '2025-10-14 20:01:50', '2025-10-14 20:01:50', 0.00, 0, 1, NULL),
(405, 10, 'Jakarta', '', 'Travel', 'Travel Jakarta-Bandung', 'Jakarta → Bandung (untuk Gede Pangrango)', 3.0, 150, 90000, 120000, 'Door to door service', '[\"00:00\"]', 'On demand 24 jam', 'Booking online/WA', NULL, NULL, 1, '2025-10-14 20:01:50', '2025-10-14 20:01:50', 0.00, 0, 1, NULL),
(406, 9, 'Jakarta', 'mendolo', 'Bus', NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-10-15 18:25:54', '2025-10-15 18:25:54', 2.00, 2, 1, 'dccdc'),
(407, 5, 'ss', 'ss', 'Bus', NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-10-15 18:26:57', '2025-10-15 18:26:57', 2.00, 2, 1, 'ww');

-- --------------------------------------------------------

--
-- Table structure for table `trip_calculations`
--

CREATE TABLE `trip_calculations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `mountain_id` int(11) NOT NULL,
  `from_city` varchar(100) NOT NULL,
  `num_people` int(11) NOT NULL DEFAULT 1,
  `duration_days` int(11) NOT NULL,
  `transport_type` varchar(50) DEFAULT NULL,
  `need_guide` tinyint(1) DEFAULT 0,
  `need_porter` tinyint(1) DEFAULT 0,
  `need_equipment_rental` tinyint(1) DEFAULT 0,
  `need_accommodation` tinyint(1) DEFAULT 0,
  `cost_breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Detailed cost breakdown' CHECK (json_valid(`cost_breakdown`)),
  `total_cost` int(11) NOT NULL,
  `cost_per_person` int(11) NOT NULL,
  `selected_itinerary_id` int(11) DEFAULT NULL,
  `custom_notes` text DEFAULT NULL,
  `calculation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_booked` tinyint(1) DEFAULT 0,
  `booking_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trip_calculations`
--

INSERT INTO `trip_calculations` (`id`, `user_id`, `user_email`, `mountain_id`, `from_city`, `num_people`, `duration_days`, `transport_type`, `need_guide`, `need_porter`, `need_equipment_rental`, `need_accommodation`, `cost_breakdown`, `total_cost`, `cost_per_person`, `selected_itinerary_id`, `custom_notes`, `calculation_date`, `is_booked`, `booking_date`) VALUES
(1, NULL, NULL, 8, 'Jakarta', 4, 2, '', 0, 0, 0, 1, '{\"transportation\":{\"main\":0,\"local\":0},\"permits\":80000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":584000,\"accommodation\":0,\"miscellaneous\":66400}', 730400, 182600, NULL, NULL, '2025-10-14 16:46:35', 0, NULL),
(2, NULL, NULL, 10, 'Jakarta', 4, 2, '', 1, 0, 0, 0, '{\"transportation\":{\"main\":0,\"local\":0},\"permits\":136000,\"guide\":500000,\"porter\":0,\"equipment\":0,\"food\":760000,\"accommodation\":0,\"miscellaneous\":139600}', 1535600, 383900, NULL, NULL, '2025-10-14 17:02:30', 0, NULL),
(3, NULL, NULL, 10, 'Jakarta', 4, 2, '', 1, 0, 0, 0, '{\"transportation\":{\"main\":0,\"local\":80000},\"permits\":136000,\"guide\":500000,\"porter\":0,\"equipment\":0,\"food\":760000,\"accommodation\":0,\"miscellaneous\":147600}', 1623600, 405900, NULL, NULL, '2025-10-14 17:11:52', 0, NULL),
(4, NULL, NULL, 10, 'Jakarta', 4, 1, '', 0, 1, 0, 0, '{\"transportation\":{\"main\":0,\"local\":80000},\"permits\":136000,\"guide\":0,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":89600}', 985600, 246400, NULL, NULL, '2025-10-14 17:13:27', 0, NULL),
(5, NULL, NULL, 10, 'Jakarta', 4, 1, '', 0, 1, 0, 0, '{\"transportation\":{\"main\":0,\"local\":80000},\"permits\":136000,\"guide\":0,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":89600}', 985600, 246400, NULL, NULL, '2025-10-14 17:13:48', 0, NULL),
(6, NULL, NULL, 10, 'Jakarta', 4, 1, 'Bus', 0, 1, 0, 0, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":136000,\"guide\":0,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":119600}', 1315600, 328900, NULL, NULL, '2025-10-14 17:23:18', 0, NULL),
(7, NULL, NULL, 10, 'Jakarta', 4, 1, 'Bus', 1, 1, 0, 0, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":136000,\"guide\":250000,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":144600}', 1590600, 397650, NULL, NULL, '2025-10-14 17:26:23', 0, NULL),
(8, NULL, NULL, 10, 'Jakarta', 4, 1, 'Bus', 1, 1, 1, 0, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":136000,\"guide\":250000,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":144600}', 1590600, 397650, NULL, NULL, '2025-10-14 17:26:56', 0, NULL),
(9, NULL, NULL, 5, 'Jakarta', 4, 1, 'Bus', 1, 1, 1, 0, '{\"transportation\":{\"main\":900000,\"local\":40000},\"permits\":100000,\"guide\":250000,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":197000}', 2167000, 541750, NULL, NULL, '2025-10-14 17:30:48', 0, NULL),
(10, NULL, NULL, 6, 'Bandung', 4, 1, '', 1, 1, 1, 1, '{\"transportation\":{\"main\":0,\"local\":60000},\"permits\":80000,\"guide\":250000,\"porter\":400000,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":107000}', 1177000, 294250, NULL, NULL, '2025-10-14 17:39:36', 0, NULL),
(11, NULL, NULL, 5, 'Jakarta', 4, 2, 'Kereta', 1, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":40000},\"permits\":100000,\"guide\":500000,\"porter\":0,\"equipment\":0,\"food\":584000,\"accommodation\":0,\"miscellaneous\":222400}', 2446400, 611600, NULL, NULL, '2025-10-14 19:13:24', 0, NULL),
(12, NULL, NULL, 5, 'Jakarta', 4, 2, 'Kereta', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":40000},\"permits\":100000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":584000,\"accommodation\":0,\"miscellaneous\":172400}', 1896400, 474100, NULL, NULL, '2025-10-14 19:20:24', 0, NULL),
(13, NULL, NULL, 5, 'Jakarta', 4, 2, 'Bus', 0, 0, 1, 1, '{\"transportation\":{\"main\":900000,\"local\":40000},\"permits\":100000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":584000,\"accommodation\":0,\"miscellaneous\":162400}', 1786400, 446600, NULL, NULL, '2025-10-14 19:39:48', 0, NULL),
(14, NULL, NULL, 5, 'Jakarta', 4, 2, 'Kereta', 0, 0, 1, 1, '{\"transportation\":{\"main\":1000000,\"local\":40000},\"permits\":100000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":584000,\"accommodation\":0,\"miscellaneous\":172400}', 1896400, 474100, NULL, NULL, '2025-10-14 19:40:32', 0, NULL),
(15, NULL, NULL, 2, 'Jakarta', 4, 4, 'Kereta', 0, 0, 0, 1, '{\"transportation\":{\"main\":1000000,\"local\":40000},\"permits\":128000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":1168000,\"accommodation\":40000,\"miscellaneous\":237600}', 2613600, 653400, NULL, NULL, '2025-10-14 19:43:25', 0, NULL),
(16, NULL, NULL, 9, 'Jakarta', 4, 1, 'Bus', 0, 0, 0, 0, '{\"transportation\":{\"main\":800000,\"local\":60000},\"permits\":40000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":118000}', 1298000, 324500, NULL, NULL, '2025-10-14 19:57:30', 0, NULL),
(17, NULL, NULL, 1, 'Jakarta', 4, 3, 'Pesawat', 0, 0, 0, 0, '{\"transportation\":{\"main\":4000000,\"local\":600000},\"permits\":600000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":1140000,\"accommodation\":0,\"miscellaneous\":634000}', 6974000, 1743500, NULL, NULL, '2025-10-14 20:01:25', 0, NULL),
(18, NULL, NULL, 10, 'Jakarta', 4, 2, 'Bus', 0, 0, 0, 0, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":116000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":760000,\"accommodation\":0,\"miscellaneous\":125600}', 1381600, 345400, NULL, NULL, '2025-10-14 21:50:58', 0, NULL),
(19, NULL, NULL, 10, 'Jakarta', 4, 2, 'Mobil Pribadi', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":80000},\"permits\":116000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":760000,\"accommodation\":0,\"miscellaneous\":195600}', 2151600, 537900, NULL, NULL, '2025-10-14 22:10:02', 0, NULL),
(20, NULL, NULL, 10, 'Jakarta', 4, 1, 'Bus', 0, 0, 0, 0, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":116000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":280000,\"accommodation\":0,\"miscellaneous\":77600}', 853600, 213400, NULL, NULL, '2025-10-15 16:51:23', 0, NULL),
(21, NULL, NULL, 10, 'Jakarta', 4, 2, 'Bus', 0, 0, 0, 0, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":116000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":760000,\"accommodation\":0,\"miscellaneous\":125600}', 1381600, 345400, NULL, NULL, '2025-10-15 16:55:32', 0, NULL),
(22, NULL, NULL, 10, 'Jakarta', 4, 2, '', 1, 1, 1, 1, '{\"transportation\":{\"main\":0,\"local\":80000},\"permits\":116000,\"guide\":500000,\"porter\":400000,\"equipment\":270000,\"food\":760000,\"accommodation\":40000,\"miscellaneous\":216600}', 2382600, 595650, NULL, NULL, '2025-10-15 16:56:57', 0, NULL),
(23, NULL, NULL, 10, 'Jakarta', 4, 2, 'Bus', 1, 1, 1, 1, '{\"transportation\":{\"main\":300000,\"local\":80000},\"permits\":116000,\"guide\":500000,\"porter\":400000,\"equipment\":180000,\"food\":0,\"accommodation\":40000,\"miscellaneous\":0}', 1616000, 404000, NULL, NULL, '2025-10-15 17:03:31', 0, NULL),
(24, NULL, NULL, 3, 'Jakarta', 4, 1, 'Kereta', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":80000},\"permits\":100000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 1180000, 295000, NULL, NULL, '2025-10-15 17:09:03', 0, NULL),
(25, NULL, NULL, 3, 'Jakarta', 4, 1, 'Kereta', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":80000},\"permits\":100000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 1180000, 295000, NULL, NULL, '2025-10-15 17:10:03', 0, NULL),
(26, NULL, NULL, 3, 'Jakarta', 4, 1, 'Kereta', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":80000},\"permits\":100000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 1180000, 295000, NULL, NULL, '2025-10-15 17:17:04', 0, NULL),
(27, NULL, NULL, 9, 'Jakarta', 4, 1, 'Bus', 0, 0, 0, 1, '{\"transportation\":{\"main\":800000,\"local\":60000},\"permits\":40000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":40000,\"miscellaneous\":0}', 940000, 235000, NULL, NULL, '2025-10-15 18:45:20', 0, NULL),
(0, NULL, NULL, 5, 'Jakarta', 4, 1, 'Kereta', 1, 0, 0, 1, '{\"transportation\":{\"main\":1000000,\"local\":40000},\"permits\":80000,\"guide\":250000,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":40000,\"miscellaneous\":0}', 1410000, 352500, NULL, NULL, '2025-10-15 20:32:22', 0, NULL),
(0, NULL, NULL, 8, 'Jakarta', 4, 2, 'Bus', 1, 0, 0, 0, '{\"transportation\":{\"main\":800000,\"local\":60000},\"permits\":100000,\"guide\":400000,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 1360000, 340000, NULL, NULL, '2025-10-16 03:54:22', 0, NULL),
(0, NULL, NULL, 11, 'Jakarta', 4, 2, '', 0, 1, 0, 1, '{\"transportation\":{\"main\":0,\"local\":0},\"permits\":4888,\"guide\":0,\"porter\":1332,\"equipment\":0,\"food\":0,\"accommodation\":40000,\"miscellaneous\":0}', 46220, 11555, NULL, NULL, '2025-10-16 04:58:31', 0, NULL),
(0, NULL, NULL, 9, 'Jakarta', 4, 4, 'Bus', 0, 1, 0, 1, '{\"transportation\":{\"main\":800000,\"local\":60000},\"permits\":40000,\"guide\":0,\"porter\":400000,\"equipment\":0,\"food\":0,\"accommodation\":40000,\"miscellaneous\":0}', 1340000, 335000, NULL, NULL, '2025-10-16 05:20:22', 0, NULL),
(0, NULL, NULL, 9, 'Jakarta', 4, 1, 'Bus', 0, 0, 0, 0, '{\"transportation\":{\"main\":800000,\"local\":60000},\"permits\":40000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 900000, 225000, NULL, NULL, '2025-10-16 08:32:31', 0, NULL),
(0, NULL, NULL, 10, 'Jakarta', 4, 2, 'Mobil Pribadi', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":80000},\"permits\":120000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 1200000, 300000, NULL, NULL, '2025-10-16 08:56:02', 0, NULL),
(0, NULL, NULL, 6, 'Jakarta', 4, 2, 'Kereta', 0, 0, 0, 0, '{\"transportation\":{\"main\":1000000,\"local\":60000},\"permits\":60000,\"guide\":0,\"porter\":0,\"equipment\":0,\"food\":0,\"accommodation\":0,\"miscellaneous\":0}', 1120000, 280000, NULL, NULL, '2025-10-16 14:37:33', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `trip_itineraries`
--

CREATE TABLE `trip_itineraries` (
  `id` int(11) NOT NULL,
  `mountain_id` int(11) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `itinerary_detail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Day by day schedule' CHECK (json_valid(`itinerary_detail`)),
  `difficulty_level` enum('Mudah','Sedang','Sulit','Sangat Sulit') DEFAULT NULL,
  `fitness_required` varchar(100) DEFAULT NULL,
  `best_for` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Pemula, Keluarga, Solo, Group, etc' CHECK (json_valid(`best_for`)),
  `tips` text DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telegram_id` varchar(50) DEFAULT NULL,
  `telegram_username` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `image_url` varchar(255) DEFAULT '/images/team/default-avatar.jpg',
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `telegram_id`, `telegram_username`, `full_name`, `role_id`, `status`, `image_url`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$YourHashedPasswordHere', 'joel.kojo@gmail.com', NULL, NULL, 'tole bang BANG', 1, 'active', '/images/profiles/image-1741786998713-191735468.jpeg', 'asasasas', '2025-03-11 16:39:31', '2025-03-17 18:44:20'),
(2, 'joel', '$2a$10$kvTRir/KNHBG/uRt.oL/keWC0l2NUEDAOVUNwn09WSnPC2FUaXEfC', 'joel.koj@gmail.com', NULL, NULL, 'joell', 5, 'active', '/images/profiles/image-1741787027409-984726080.jpeg', 'test', '2025-03-11 18:34:55', '2025-03-12 13:44:00'),
(3, 'newuser', '$2a$10$50aLHpzOUbEK3VIoE2KKJuJFi/UCcuj5NLBwqvFFm2uQIcHQl2acO', 'newuser@example.comm', NULL, NULL, 'New User', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-12 13:42:28', '2025-03-12 13:42:47'),
(4, 'tole', '$2a$10$4G8M7eihs1CUhUqjXbqj4OhhWFpSrEj974Ql53Fd35cfE6hovIHBW', 'tole@gmail.com', NULL, NULL, 'tole bang', 1, 'active', '/images/profiles/image-1744092307091-662196439.jpg', 'xdxdxd', '2025-03-14 18:34:47', '2025-04-08 06:05:07'),
(5, 'fira', '$2a$10$ulGTakaCMmW3LlTi7xpBsewX.1ygXQbUW0vLfGgu0I3dM5PV5cOqu', 'firaa@gmail.com', NULL, NULL, 'fildzah putri zhafira', 5, 'active', '/images/profiles/image-1742133523064-628754313.jpg', '', '2025-03-16 13:41:33', '2025-03-16 18:06:39'),
(6, 'coba', '$2a$10$O5eApL8k4.u.gdYg.2oDtO8XoA6yyucEfu3y5sOi5trISm.h3HyM.', 'coba@gmail.com', NULL, NULL, 'coba test', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:48:51', '2025-03-23 15:48:51'),
(7, 'tunggul', '$2a$10$UP7HxufMF2SYvQ03Iq1Vi.LNb52Z1MvGedENePybfKnabVqV2IGJm', 'tunggul2404@gmail.com', '1340614803', 'toleee', 'Tunggul Bayu Kusuma', 2, 'active', '/images/profiles/image-1751037248693-318555586.jpg', NULL, '2025-03-23 15:49:30', '2025-10-10 22:14:19'),
(8, 'deva', '$2a$10$ztixXtRm16EcKfeD8C5klOi5gFPjPftgMqx.CegfNLY4KqmfGSR/q', 'deva.satrya@pergimmikan.org', NULL, NULL, 'Deva Satrya ', 2, 'active', '/images/profiles/image-1750082736036-209778813.jpg', NULL, '2025-03-23 15:49:33', '2025-06-16 14:11:51'),
(9, 'akbar', '$2a$10$MIb.GGac8BCgC49xxRXRw.DjPqtyuRwZ7hSUO5BQQL6lnaBzpZ4MK', 'akbar.hidayatullah@pergimmikan.org', NULL, NULL, 'Akbar Hidayatulla', 2, 'active', '/images/profiles/image-1748203146002-809968571.jpg', NULL, '2025-03-23 15:49:34', '2025-05-25 19:59:06'),
(10, 'frasiskus', '$2a$10$GSJ4gTB/ve1VBYJJ4ix.Penfp3jmXVAS376SbAcSyODvRWyY0lbJa', 'frasiskus.aldi@pergimmikan.org', NULL, NULL, 'Frasiskus Aldi Jebadu', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:38', '2025-03-23 15:49:38'),
(11, 'darril', '$2a$10$lkBZYGo2V3Fya7i7KXDDA.v4.6MBjfFY9NFF/7gnl1eHIoqkkivGG', 'muhammad.darril@pergimmikan.org', NULL, NULL, 'Muhammad Darril Fauzi', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:39', '2025-04-12 15:55:57'),
(12, 'miraj', '$2a$10$mrI74PFs522NVszCFC5J6u0VPGdF3dZ2s0tBmoFoLi5RUU5HEj0li', 'miraj.diamond@pergimmikan.org', NULL, NULL, 'Miraj Diamond Sundachi', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:41', '2025-03-23 15:49:41'),
(13, 'indira', '$2a$10$EneX3QTCq4oo.aI0jrWkteb8N6wvS7zJLeup85vikfgzRxfyIeiey', 'indira.arifin@pergimmikan.org', NULL, NULL, 'Indira Arifin', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:42', '2025-03-23 15:49:42'),
(14, 'zaki', '$2a$10$ufAPrsjIMtPyaLCxOITs9OIvP2jJMbxwSzoZ6enflA6CuungC0tlO', 'zaki.syifa@pergimmikan.org', NULL, NULL, 'Zaki Syifa Nugroho', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:44', '2025-03-23 15:49:44'),
(15, 'zul', '$2a$10$wQint3j3ZyDoWe37O3UKO.WE47KMUYntRv6G2I54hZubD9RluXgMq', 'zul.widya@pergimmikan.org', NULL, NULL, 'Zul Widya Pratiwi', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:45', '2025-03-23 15:49:45'),
(16, 'lia', '$2a$10$SONOPGOOIB9x5v72/CAnceKrhTp4yxXUsZw4tz1XkqVzzdZA438p.', 'lia.agustin@pergimmikan.org', NULL, NULL, 'Lia Agustin Pratiwi', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:47', '2025-03-23 15:49:47'),
(17, 'fadia', '$2a$10$vsEnPIChnkQhkjtZm5/F2ehsJtVSueLM2XWgMA1z0rbMx7q/SHqp.', 'fadia.nurmasri@pergimmikan.org', NULL, NULL, 'Fadia Nurmasri', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:48', '2025-03-23 15:49:48'),
(18, 'maesheilla', '$2a$10$FOVob/.QIp8cduh1sa4bHuot33sycVN66wv002wynvR7u0SOJVRuO', 'maesheilla@pergimmikan.org', NULL, NULL, 'Maesheilla', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:50', '2025-03-23 15:49:50'),
(19, 'jordi', '$2a$10$xKPAp1dgfV8SHql6kXoQlu7/I3bisu95A6eueMQw0vJu0DQUkvtQ6', 'jordi@pergimmikan.org', NULL, NULL, 'Jordi', 2, 'active', '/images/profiles/image-1743193229211-626623405.jpeg', NULL, '2025-03-23 15:49:54', '2025-03-28 20:20:29'),
(20, 'zulfa', '$2a$10$DuyBdy4nhb9pDJ.c/G5aFu9k/b1hdB/Z76EiVq2PR6j2LG9UlslUu', 'zulfa@pergimmikan.org', NULL, NULL, 'Zulfa', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:56', '2025-03-23 15:49:56'),
(21, 'kahfi', '$2a$10$hH6hYMPJtd.XNXOZJnIgYe6IxFmd6fhs4eRW7DYR./k0e8nlgsB6S', 'kahfi@pergimmikan.org', NULL, NULL, 'Kahfi', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:49:57', '2025-03-23 15:49:57'),
(22, 'raga', '$2a$10$wQOxHEwB7db8KQbilz174uiU/HGk.3aiHDjWJaVqDh3moMCTHUNNi', 'raga@pergimmikan.org', NULL, NULL, 'Raga', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:50:00', '2025-03-23 15:50:00'),
(23, 'ridho', '$2a$10$khOCEXh9hhaLZLjo.O.VBOyMN71qQWTz0WaX3.IWBUOefX6kLgTXG', 'ridho@pergimmikan.org', NULL, NULL, 'Ridho', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:50:02', '2025-03-23 15:50:02'),
(24, 'toha', '$2a$10$vLUxO0FT2GdFV4fLokrNe.fjKde.6F4iFtx3F1dA.h9NkRYrIe8U6', 'toha@pergimmikan.org', NULL, NULL, 'Toha', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:50:04', '2025-03-23 15:50:04'),
(25, 'arvan', '$2a$10$oYRJ4g4gvrmAuyz6OfKvf.xHFDlApHZ/nALQUBOaKIe66oAhD4eNq', 'arvan@pergimmikan.org', NULL, NULL, 'Arvan', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:50:05', '2025-03-23 15:50:05'),
(26, 'farrel', '$2a$10$DgAnKDbgUl1MSWuy6zyBZeO1unRoAQKGAe3D1S4Wgr1/A2.rbcmMu', 'farrel@pergimmikan.org', NULL, NULL, 'Farrel', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:50:08', '2025-03-23 15:50:08'),
(27, 'fadil', '$2a$10$N10g34nlLG2FTMiaFTI1xuzVMWPimSV0ejD1NBvlu6ZL9eFglTL4m', 'fadil@pergimmikan.org', NULL, NULL, 'Fadil', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:50:09', '2025-03-23 15:50:09');

-- --------------------------------------------------------

--
-- Structure for view `team_members_view`
--
DROP TABLE IF EXISTS `team_members_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`dinq6531`@`localhost` SQL SECURITY DEFINER VIEW `team_members_view`  AS SELECT `t`.`id` AS `id`, `t`.`name` AS `name`, `t`.`short_name` AS `short_name`, `t`.`role` AS `role`, `t`.`image_url` AS `image_url`, `t`.`description` AS `description`, `t`.`status` AS `status`, `t`.`created_at` AS `created_at`, `t`.`updated_at` AS `updated_at`, max(case when `sm`.`platform` = 'linkedin' then `sm`.`url` end) AS `linkedin`, max(case when `sm`.`platform` = 'github' then `sm`.`url` end) AS `github`, max(case when `sm`.`platform` = 'instagram' then `sm`.`url` end) AS `instagram` FROM (`teams` `t` left join `social_media` `sm` on(`t`.`id` = `sm`.`team_id`)) GROUP BY `t`.`id`, `t`.`name`, `t`.`short_name`, `t`.`role`, `t`.`image_url`, `t`.`description`, `t`.`status`, `t`.`created_at`, `t`.`updated_at` ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
