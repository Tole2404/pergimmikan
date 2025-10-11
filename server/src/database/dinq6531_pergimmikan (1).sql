-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 23, 2025 at 10:33 PM
-- Server version: 10.11.11-MariaDB-cll-lve
-- PHP Version: 8.3.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dinq6531_pergimmikan`
--

DELIMITER $$
--
-- Procedures
--
$$

$$

DELIMITER ;

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
(5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', '2025-02-22', '03:22:00', 'asasas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius et urna at rutrum. Nullam tempus diam massa, eget lobortis lorem faucibus vel. Praesent eg', 2, '/images/activities/activity-1741812872734-278118088.jpeg', 'completed', '2025-03-11 19:22:40', '2025-03-12 21:01:07'),
(6, 'xsasaa aqxasas', '2025-03-12', '05:43:00', 'asasas', 'asasasaasas', 2, '/images/activities/activity-1741815800374-599411296.jpeg', 'upcoming', '2025-03-12 21:43:20', '2025-03-16 20:10:54'),
(7, 'swsws', '2025-03-19', '07:17:00', 'sswwsws', 'w2w222w', 2, '/images/activities/activity-1742156062989-247338613.jpg', 'completed', '2025-03-16 20:14:22', '2025-03-16 20:14:22');

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
(3, 'Nongkrong', '2025-03-11 13:46:39', '2025-03-11 13:48:59');

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
(17, 7, '/images/activities/gallery/gallery-1742156601746-386805517.jpg', NULL, '2025-03-16 20:23:21', '2025-03-16 20:23:21'),
(18, 7, '/images/activities/gallery/gallery-1742156601755-195265463.jpg', NULL, '2025-03-16 20:23:21', '2025-03-16 20:23:21'),
(19, 7, '/images/activities/gallery/gallery-1742156601767-444787042.jpg', NULL, '2025-03-16 20:23:21', '2025-03-16 20:23:21'),
(20, 7, '/images/activities/gallery/gallery-1742236243119-43855500.jpg', NULL, '2025-03-17 18:30:43', '2025-03-17 18:30:43');

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
(1, 'BUKBER WITH GIMMIK', 'Orang Orang Senang', '2025-03-13', '17:00:00', 'BINTARO', '2025-03-10 22:45:29', '2025-03-11 22:53:45', 'upcoming', 20, '2025-03-13 01:45:00'),
(0, 'Sunatan Ridho', 'Ditunggu kehadirannya yaa, dan semoga tititnya aman', '2025-04-01', '14:30:00', 'Manado', '2025-03-22 18:32:07', '2025-03-22 18:32:07', 'upcoming', 100, '2025-03-27 01:31:00'),
(0, 'Nikahan Ridho', 'Happy Birthday Ridho', '2025-07-24', '10:33:00', 'Ciledug', '2025-03-22 18:33:50', '2025-03-22 18:33:50', 'upcoming', 200, '2025-03-24 06:33:00');

-- --------------------------------------------------------

--
-- Table structure for table `event_participants`
--

CREATE TABLE `event_participants` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('registered','attended','cancelled') NOT NULL DEFAULT 'registered',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_participants`
--

INSERT INTO `event_participants` (`id`, `event_id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 6, 4, 'registered', '2025-03-14 19:40:19', '2025-03-14 19:40:19'),
(2, 1, 4, 'registered', '2025-03-14 19:43:01', '2025-03-14 19:43:01'),
(3, 2, 4, 'registered', '2025-03-14 19:47:28', '2025-03-14 19:47:28'),
(4, 4, 4, 'registered', '2025-03-14 19:50:41', '2025-03-14 19:50:41'),
(5, 5, 4, 'registered', '2025-03-14 19:54:22', '2025-03-14 19:54:22');

-- --------------------------------------------------------

--
-- Table structure for table `failed_login_attempts`
--

CREATE TABLE `failed_login_attempts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `attempt_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `attempt_count` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `featured_journeys`
--

CREATE TABLE `featured_journeys` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `link` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `location` varchar(100) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'Duration in days',
  `difficulty` enum('Easy','Moderate','Hard','Extreme') DEFAULT NULL,
  `category` enum('Mountain','Beach','Underwater','Forest','Cultural','Other') DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `featured_journeys`
--

INSERT INTO `featured_journeys` (`id`, `title`, `description`, `image_path`, `link`, `year`, `month`, `location`, `latitude`, `longitude`, `duration`, `difficulty`, `category`, `featured`, `created_at`, `updated_at`) VALUES
(1, 'Mount Bromo', 'Explore the', '/images/featured/bromo.jpg', '/journey/1', 2024, 11, 'East Java, Indonesia', -7.94250000, 112.95300000, 3, 'Moderate', 'Mountain', 1, '2025-03-15 17:51:34', '2025-03-15 18:17:40'),
(2, 'Komodo Island', 'Adventure to the Komodo dragon habitat and exotic beaches in Flores', '/images/featured/komodo.jpg', '/journey/2', 2023, 8, 'East Nusa Tenggara, Indonesia', -8.58520000, 119.44130000, 5, 'Moderate', 'Beach', 1, '2025-03-15 17:51:34', '2025-03-15 17:51:34'),
(3, 'Raja Ampat', 'Underwater paradise with stunning coral reefs and amazing marine life', '/images/featured/raja-ampat.jpg', '/journey/3', 2023, 11, 'West Papua, Indonesia', -0.50000000, 130.50000000, 7, 'Hard', 'Underwater', 1, '2025-03-15 17:51:34', '2025-03-15 17:51:34');

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

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `caption`, `date`, `author`, `created_at`, `updated_at`) VALUES
(22, 'Tenda', '2024-07-24', 'Lia', '2025-03-22 18:23:57', '2025-03-22 18:23:57');

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
(36, 22, '/images/gallery/gallery-1742667837740-402391266.jpg', 0, '2025-03-22 18:23:57');

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
(11, 3),
(12, 5),
(13, 6),
(14, 1),
(15, 3),
(16, 6),
(17, 3),
(17, 6),
(18, 3),
(19, 1),
(20, 1),
(20, 5),
(21, 1),
(21, 5),
(22, 2),
(22, 3),
(23, 2),
(23, 3);

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
(26, 11, '/images/journey/2023/1741631981328-151602170.jpeg', '', '2025-03-10 18:39:41', '2025-03-10 18:41:48'),
(27, 11, '/images/journey/2023/1741631981330-291386474.jpeg', 'asasa', '2025-03-10 18:39:41', '2025-03-10 18:39:41'),
(28, 11, '/images/journey/2023/1741631981335-584815142.jpeg', 'sasasas', '2025-03-10 18:39:41', '2025-03-10 18:39:41'),
(29, 11, '/images/journey/2023/1741631981336-53651192.jpeg', '', '2025-03-10 18:39:41', '2025-03-10 18:41:48'),
(31, 11, '/images/journey/2023/1741632108107-294746700.jpeg', 'asasas', '2025-03-10 18:41:48', '2025-03-10 18:41:48'),
(32, 13, '/images/journey/2021/1741632133915-361129502.jpeg', NULL, '2025-03-10 18:42:13', '2025-03-10 18:42:13'),
(33, 11, '/images/journey/2023/1741632356060-393442804.jpg', '', '2025-03-10 18:45:56', '2025-03-12 20:20:55'),
(34, 14, '/images/journey/2021/1741632840639-227608710.jpeg', 'coba', '2025-03-10 18:54:00', '2025-03-10 18:54:00'),
(35, 11, '/images/journey/2023/1741810854709-423584525.jpg', NULL, '2025-03-12 20:20:55', '2025-03-12 20:20:55'),
(36, 11, '/images/journey/2023/1741810854859-708337501.jpg', NULL, '2025-03-12 20:20:55', '2025-03-12 20:20:55'),
(37, 11, '/images/journey/2023/1741810855019-245517362.jpg', NULL, '2025-03-12 20:20:55', '2025-03-12 20:20:55'),
(38, 11, '/images/journey/2023/1741810855125-371097783.jpg', NULL, '2025-03-12 20:20:55', '2025-03-12 20:20:55'),
(39, 15, '/images/journey/2022/1741977160544-964268070.jpg', NULL, '2025-03-14 18:32:40', '2025-03-14 18:32:40'),
(40, 15, '/images/journey/2022/1741977160546-337615490.jpg', NULL, '2025-03-14 18:32:40', '2025-03-14 18:32:40'),
(41, 15, '/images/journey/2022/1741977160554-368333935.jpg', NULL, '2025-03-14 18:32:40', '2025-03-14 18:32:40'),
(42, 16, '/images/journey/2025/1742148933746-416404295.jpg', '', '2025-03-16 18:15:33', '2025-03-19 09:57:26'),
(43, 16, '/images/journey/2025/1742148933764-456887417.jpg', '', '2025-03-16 18:15:33', '2025-03-19 09:57:26'),
(44, 17, '/images/journey/2025/1742149171452-894786356.jpg', NULL, '2025-03-16 18:19:31', '2025-03-16 18:19:31'),
(45, 17, '/images/journey/2025/1742149171459-807756587.jpg', NULL, '2025-03-16 18:19:31', '2025-03-16 18:19:31'),
(46, 17, '/images/journey/2025/1742149171465-471673766.jpg', NULL, '2025-03-16 18:19:31', '2025-03-16 18:19:31'),
(48, 20, '/images/journey/2024/1742154595490-793025524.jpg', NULL, '2025-03-16 19:49:55', '2025-03-16 19:49:55'),
(49, 20, '/images/journey/2024/1742154595495-893248661.jpg', NULL, '2025-03-16 19:49:55', '2025-03-16 19:49:55'),
(50, 20, '/images/journey/2024/1742154595513-616567695.jpg', NULL, '2025-03-16 19:49:55', '2025-03-16 19:49:55'),
(51, 20, '/images/journey/2024/1742154595523-768836110.jpg', NULL, '2025-03-16 19:49:55', '2025-03-16 19:49:55'),
(52, 20, '/images/journey/2024/1742154595545-873145762.jpg', NULL, '2025-03-16 19:49:55', '2025-03-16 19:49:55'),
(53, 19, '/images/journey/2025/1742155032329-402571259.jpg', 'sxsx', '2025-03-16 19:57:12', '2025-03-16 19:57:12'),
(54, 19, '/images/journey/2025/1742155070030-722386360.jpg', NULL, '2025-03-16 19:57:50', '2025-03-16 19:57:50'),
(55, 19, '/images/journey/2025/1742155070038-828367477.jpg', NULL, '2025-03-16 19:57:50', '2025-03-16 19:57:50'),
(56, 19, '/images/journey/2025/1742155070045-71590840.jpg', NULL, '2025-03-16 19:57:50', '2025-03-16 19:57:50'),
(0, 16, '/images/journey/2025/1742665379732-518288454.jpg', NULL, '2025-03-22 17:42:59', '2025-03-22 17:42:59');

-- --------------------------------------------------------

--
-- Table structure for table `journey_years`
--

CREATE TABLE `journey_years` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `journey_years`
--

INSERT INTO `journey_years` (`id`, `year`, `title`, `description`, `created_at`, `updated_at`) VALUES
(11, 2023, 'Goes To Jogjaa', 'sasas', '2025-03-10 18:39:41', '2025-03-10 18:39:41'),
(13, 2021, 'XD', 'XD XD XD', '2025-03-10 18:42:13', '2025-03-10 18:42:13'),
(14, 2021, 'Awal mula XD', 'saasasasasasa', '2025-03-10 18:54:00', '2025-03-10 18:54:00'),
(15, 2022, 'Nge Villa', 'apa kek yang enak', '2025-03-14 18:32:40', '2025-03-14 18:32:40'),
(16, 2025, 'tole', 'asaassa', '2025-03-16 18:15:33', '2025-03-19 09:58:07'),
(17, 2025, 'tole', 'asaassa asasas', '2025-03-16 18:19:09', '2025-03-16 18:19:09'),
(19, 2025, 'tole', 'asaasxwx', '2025-03-16 19:45:45', '2025-03-16 19:57:23'),
(20, 2024, 'Coba', 'sss', '2025-03-16 19:49:55', '2025-03-16 19:49:55');

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
(0, 1, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; RMX1911) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36', '2025-03-22 21:41:31', NULL, 'failed');

-- --------------------------------------------------------

--
-- Table structure for table `next_activities`
--

CREATE TABLE `next_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `cost` decimal(12,2) NOT NULL,
  `type` varchar(50) DEFAULT NULL CHECK (`type` in ('basic','premium'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_destinations`
--

CREATE TABLE `next_destinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `next_destinations`
--

INSERT INTO `next_destinations` (`id`, `name`, `image`, `description`) VALUES
(1, 'Tunggul Bayu', '/images/next/team-1741967764160-984928136.jpg', 'saas');

-- --------------------------------------------------------

--
-- Table structure for table `next_destination_costs`
--

CREATE TABLE `next_destination_costs` (
  `id` bigint(20) UNSIGNED NOT NULL,
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

--
-- Dumping data for table `next_destination_costs`
--

INSERT INTO `next_destination_costs` (`id`, `destination_id`, `accommodation_budget`, `accommodation_standard`, `accommodation_luxury`, `transportation_public`, `transportation_private`, `transportation_luxury`, `food_budget`, `food_standard`, `food_luxury`) VALUES
(1, 1, 900000.00, 2000000.00, 11999999.00, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00);

-- --------------------------------------------------------

--
-- Table structure for table `next_destination_highlights`
--

CREATE TABLE `next_destination_highlights` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `highlight` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `next_destination_highlights`
--

INSERT INTO `next_destination_highlights` (`id`, `destination_id`, `highlight`) VALUES
(2, 1, 'asassasasas');

-- --------------------------------------------------------

--
-- Table structure for table `next_seasons`
--

CREATE TABLE `next_seasons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `season_type` varchar(50) DEFAULT NULL CHECK (`season_type` in ('LOW','SHOULDER','PEAK')),
  `months` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_transport_from_jakarta`
--

CREATE TABLE `next_transport_from_jakarta` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `destination_name` varchar(255) NOT NULL,
  `flight_economy` decimal(12,2) DEFAULT NULL,
  `flight_business` decimal(12,2) DEFAULT NULL,
  `flight_first` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `next_transport_from_jakarta`
--

INSERT INTO `next_transport_from_jakarta` (`id`, `destination_name`, `flight_economy`, `flight_business`, `flight_first`) VALUES
(1, 'RINJANI', 200000.00, 900000.00, 1200000.00);

-- --------------------------------------------------------

--
-- Table structure for table `next_users`
--

CREATE TABLE `next_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_user_savings`
--

CREATE TABLE `next_user_savings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `savings` decimal(12,2) NOT NULL,
  `monthly_savings` decimal(12,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_user_trips`
--

CREATE TABLE `next_user_trips` (
  `id` bigint(20) UNSIGNED NOT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `next_user_trip_activities`
--

CREATE TABLE `next_user_trip_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_trip_id` int(11) DEFAULT NULL,
  `activity_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile_images`
--

CREATE TABLE `profile_images` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `profile_images`
--
DELIMITER $$
CREATE TRIGGER `after_profile_image_insert` AFTER INSERT ON `profile_images` FOR EACH ROW BEGIN
    -- Set all previous images to inactive
    UPDATE profile_images 
    SET is_active = false 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id;
    
    -- Update image_url in users table
    UPDATE users 
    SET image_url = NEW.image_url 
    WHERE id = NEW.user_id;
END
$$
DELIMITER ;

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
(1, 'Life is not about the moments we capture, but the stories we create together', 'Pergimmikann', 'Est. 2022', 1, '2025-03-10 23:36:01', '2025-03-22 18:34:47');

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
  `receipt_url` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `transaction_date` date NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `savings`
--

INSERT INTO `savings` (`id`, `user_id`, `amount`, `description`, `receipt_url`, `status`, `transaction_date`, `admin_id`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 250000.00, 'Tabungan Bulanan Januari', '/images/receipts/dummy_receipt_1.jpg', 'approved', '2025-01-15', 2, 'Sudah terverifikasi dan dicatat', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(2, 1, 300000.00, 'Tabungan Bulanan Februari', '/images/receipts/dummy_receipt_2.jpg', 'approved', '2025-02-15', 2, 'Verifikasi lengkap', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(3, 1, 350000.00, 'Tabungan Bulanan Maret', '/images/receipts/dummy_receipt_3.jpg', 'pending', '2025-03-15', NULL, NULL, '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(4, 2, 400000.00, 'Setoran Awal', '/images/receipts/dummy_receipt_4.jpg', 'approved', '2025-01-05', 2, 'OK', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(5, 2, 200000.00, 'Tabungan Rutin', '/images/receipts/dummy_receipt_5.jpg', 'rejected', '2025-02-10', 2, 'Bukti transfer tidak jelas', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(6, 3, 500000.00, 'Tabungan Semester', '/images/receipts/dummy_receipt_6.jpg', 'approved', '2025-01-20', 2, '', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(7, 3, 500000.00, 'Tabungan Semester 2', '/images/receipts/dummy_receipt_7.jpg', 'pending', '2025-03-01', NULL, NULL, '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(8, 4, 150000.00, 'Tabungan Minggu 1', '/images/receipts/dummy_receipt_8.jpg', 'approved', '2025-01-07', 2, 'Verified', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(9, 4, 150000.00, 'Tabungan Minggu 2', '/images/receipts/dummy_receipt_9.jpg', 'approved', '2025-01-14', 2, 'Verified', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(10, 4, 150000.00, 'Tabungan Minggu 3', '/images/receipts/dummy_receipt_10.jpg', 'approved', '2025-01-21', 2, 'Verified', '2025-03-14 21:34:27', '2025-03-14 21:34:27'),
(11, 4, 250000.00, 'Tabungan Bulan April', '/images/receipts/user-4-1742046026068-391351437.jpeg', 'pending', '2025-03-15', NULL, NULL, '2025-03-15 13:40:26', '2025-03-15 13:40:26'),
(12, 1, 100000.00, 'Setoran', '/images/receipts/user-1-1742046495723-11186853.jpg', 'pending', '2025-03-15', NULL, NULL, '2025-03-15 13:48:15', '2025-03-15 13:48:15'),
(13, 1, 100000.00, 'Setoran', '/images/receipts/user-1-1742047157144-866837983.jpg', 'approved', '2025-03-15', 1, NULL, '2025-03-15 13:59:17', '2025-03-15 16:32:17'),
(14, 4, 1200000.00, 'Tabungna tole', '/images/receipts/user-4-1742047923585-398204845.jpg', 'approved', '2025-03-15', 1, NULL, '2025-03-15 14:12:03', '2025-03-15 16:23:35'),
(15, 1, 20000.00, 'Tabungan tole', '/images/receipts/user-1-1742055891489-200024441.jpg', 'pending', '2025-03-15', NULL, NULL, '2025-03-15 16:24:51', '2025-03-15 16:24:51'),
(16, 4, 2000000.00, 'coba', '/images/receipts/user-4-1742056588487-155971995.jpg', 'approved', '2025-03-15', 1, NULL, '2025-03-15 16:36:28', '2025-03-18 14:00:19'),
(17, 4, 21212212.00, 'Tabungna tole', '/images/receipts/user-4-1742056681091-670801256.jpg', 'approved', '2025-03-15', 1, NULL, '2025-03-15 16:38:01', '2025-03-17 19:18:47'),
(18, 4, 99999999.99, 'Tabungan tole', '/images/receipts/user-4-1742056777333-302602739.jpg', 'rejected', '2025-03-15', 1, NULL, '2025-03-15 16:39:37', '2025-03-15 16:46:17'),
(19, 4, 22222.00, 'Tabungan tole', '/images/receipts/user-4-1742056923461-891390395.jpg', 'approved', '2025-03-15', 1, NULL, '2025-03-15 16:42:03', '2025-03-17 19:18:36'),
(20, 4, 1212.00, 'Tabungna tole', '/images/receipts/user-4-1742057075345-942632222.jpg', 'rejected', '2025-03-15', 1, NULL, '2025-03-15 16:44:35', '2025-03-17 19:09:53'),
(21, 5, 200000.00, 'nabung jogja', '/images/receipts/user-5-1742132551650-994820051.jpg', 'approved', '2025-03-16', 1, 'apayak', '2025-03-16 13:42:31', '2025-03-16 13:42:52'),
(22, 5, 200000.00, 'bulanan', '/images/receipts/user-5-1742133561580-769032991.jpg', 'approved', '2025-03-16', 1, 'zszszsz', '2025-03-16 13:59:21', '2025-03-16 20:24:32'),
(23, 4, 2000000.00, 'punya tole', '/images/receipts/user-4-1742237168722-202489827.jpg', 'approved', '2025-03-18', 1, NULL, '2025-03-17 18:46:08', '2025-03-17 19:09:47'),
(24, 4, 1000000.00, 'Setoran', '/images/receipts/user-4-1742309910344-236971237.jpg', 'approved', '2025-03-18', 1, NULL, '2025-03-18 14:58:30', '2025-03-18 15:01:18'),
(25, 4, 1000000.00, 'Setoran', '/images/receipts/user-4-1742310175306-913642722.jpg', 'approved', '2025-03-18', 1, NULL, '2025-03-18 15:02:55', '2025-03-18 15:22:53'),
(26, 4, 1000000.00, 'tabungan', '/images/receipts/user-4-1742311313350-666291058.jpg', 'pending', '2025-03-18', NULL, NULL, '2025-03-18 15:21:53', '2025-03-18 15:21:53'),
(0, 4, 1000000.00, 'coba', '/images/receipts/user-4-1742413401424-693088864.jpg', 'pending', '2025-03-20', NULL, NULL, '2025-03-19 19:43:21', '2025-03-19 19:43:21'),
(0, 4, 50000.00, 'Jajan cilok', '/images/receipts/user-4-1742494678900-325935838.jpg', 'pending', '2025-03-21', NULL, NULL, '2025-03-20 18:17:58', '2025-03-20 18:17:58'),
(0, 4, 50000.00, 'Jajan cilok', '/images/receipts/user-4-1742494680286-75995505.jpg', 'pending', '2025-03-21', NULL, NULL, '2025-03-20 18:18:00', '2025-03-20 18:18:00'),
(0, 4, 1000000.00, 'tabungan ', '/images/receipts/user-4-1742663876663-351739130.jpg', 'pending', '2025-03-23', NULL, NULL, '2025-03-22 17:17:56', '2025-03-22 17:17:56'),
(0, 0, 1000000.00, 'Tabungan', '/images/receipts/user-0-1742668722472-959794389.jpg', 'pending', '2025-03-23', NULL, NULL, '2025-03-22 18:38:42', '2025-03-22 18:38:42'),
(0, 0, 2000000.00, 'Tabungan februari', '/images/receipts/user-0-1742668773587-684381110.jpg', 'pending', '2025-03-23', NULL, NULL, '2025-03-22 18:39:33', '2025-03-22 18:39:33'),
(0, 4, 1000000.00, 'tabungan januari', '/images/receipts/user-4-1742668846392-434736968.jpg', 'pending', '2025-03-23', NULL, NULL, '2025-03-22 18:40:46', '2025-03-22 18:40:46'),
(0, 0, 3000000.00, 'Tabungan tole', '/images/receipts/user-0-1742669050856-356227062.jpg', 'pending', '2025-03-23', NULL, NULL, '2025-03-22 18:44:10', '2025-03-22 18:44:10');

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
(24, 15, 'linkedin', 'aa', '2025-03-14 16:03:20', '2025-03-14 16:03:20'),
(25, 15, 'github', 'aa', '2025-03-14 16:03:20', '2025-03-14 16:03:20'),
(26, 15, 'instagram', 'aa', '2025-03-14 16:03:20', '2025-03-14 16:03:20'),
(27, 16, 'linkedin', 'A', '2025-03-14 16:03:48', '2025-03-14 16:03:48'),
(28, 16, 'github', 'A', '2025-03-14 16:03:48', '2025-03-14 16:03:48'),
(29, 16, 'instagram', 'A', '2025-03-14 16:03:48', '2025-03-14 16:03:48'),
(30, 17, 'linkedin', 'A', '2025-03-14 16:05:17', '2025-03-14 16:05:17'),
(31, 17, 'github', 'A', '2025-03-14 16:05:17', '2025-03-14 16:05:17'),
(32, 17, 'instagram', 'A', '2025-03-14 16:05:17', '2025-03-14 16:05:17'),
(33, 18, 'linkedin', 'a', '2025-03-14 16:05:55', '2025-03-14 16:05:55'),
(34, 18, 'github', 'a', '2025-03-14 16:05:55', '2025-03-14 16:05:55'),
(35, 18, 'instagram', 'a', '2025-03-14 16:05:55', '2025-03-14 16:05:55'),
(36, 19, 'linkedin', 'a', '2025-03-14 16:06:28', '2025-03-14 16:06:28'),
(37, 19, 'github', 'a', '2025-03-14 16:06:28', '2025-03-14 16:06:28'),
(38, 19, 'instagram', 'a', '2025-03-14 16:06:28', '2025-03-14 16:06:28'),
(42, 21, 'linkedin', 'a', '2025-03-14 16:07:41', '2025-03-14 16:07:41'),
(43, 21, 'github', 'a', '2025-03-14 16:07:41', '2025-03-14 16:07:41'),
(44, 21, 'instagram', 'a', '2025-03-14 16:07:41', '2025-03-14 16:07:41'),
(54, 24, 'linkedin', 'a', '2025-03-15 23:21:50', '2025-03-15 23:21:50'),
(55, 24, 'github', 'a', '2025-03-15 23:21:50', '2025-03-15 23:21:50'),
(56, 24, 'instagram', 'a', '2025-03-15 23:21:50', '2025-03-15 23:21:50'),
(69, 25, 'linkedin', 'a', '2025-03-15 23:24:25', '2025-03-15 23:24:25'),
(70, 25, 'github', 'a', '2025-03-15 23:24:25', '2025-03-15 23:24:25'),
(71, 25, 'instagram', 'a', '2025-03-15 23:24:25', '2025-03-15 23:24:25'),
(72, 26, 'linkedin', 'a', '2025-03-15 23:24:49', '2025-03-15 23:24:49'),
(73, 26, 'github', 'a', '2025-03-15 23:24:49', '2025-03-15 23:24:49'),
(74, 26, 'instagram', 'a', '2025-03-15 23:24:49', '2025-03-15 23:24:49'),
(75, 20, 'linkedin', 'a', '2025-03-18 13:46:20', '2025-03-18 13:46:20'),
(76, 20, 'github', 'a', '2025-03-18 13:46:20', '2025-03-18 13:46:20'),
(77, 20, 'instagram', 'a', '2025-03-18 13:46:20', '2025-03-18 13:46:20'),
(84, 22, 'linkedin', 'a', '2025-03-18 13:52:03', '2025-03-18 13:52:03'),
(85, 22, 'github', 'a', '2025-03-18 13:52:03', '2025-03-18 13:52:03'),
(86, 22, 'instagram', 'aa', '2025-03-18 13:52:03', '2025-03-18 13:52:03'),
(0, 23, 'instagram', 'a', '2025-03-19 09:29:03', '2025-03-19 09:29:03'),
(0, 14, 'github', 'a', '2025-03-19 09:40:04', '2025-03-19 09:40:04'),
(0, 0, 'linkedin', 'a', '2025-03-19 13:22:25', '2025-03-19 13:22:25'),
(0, 0, 'github', 'a', '2025-03-19 13:22:25', '2025-03-19 13:22:25'),
(0, 0, 'instagram', 'a', '2025-03-19 13:22:25', '2025-03-19 13:22:25'),
(0, 0, 'instagram', 'a', '2025-03-19 13:33:29', '2025-03-19 13:33:29'),
(0, 0, 'instagram', 'a', '2025-03-19 13:33:30', '2025-03-19 13:33:30'),
(0, 0, 'instagram', 'a', '2025-03-19 13:35:43', '2025-03-19 13:35:43'),
(0, 0, 'instagram', 'a', '2025-03-19 13:35:45', '2025-03-19 13:35:45'),
(0, 0, 'instagram', 'a', '2025-03-19 13:37:07', '2025-03-19 13:37:07'),
(0, 0, 'instagram', 'a', '2025-03-19 13:37:57', '2025-03-19 13:37:57'),
(0, 27, 'linkedin', 'z', '2025-03-22 17:22:08', '2025-03-22 17:22:08'),
(0, 32, 'linkedin', 'a', '2025-03-22 17:23:33', '2025-03-22 17:23:33'),
(0, 0, 'linkedin', 'https://linkedin.com/in/johndoe', '2025-03-22 17:35:42', '2025-03-22 17:35:42'),
(0, 0, 'github', 'https://github.com/johndoe', '2025-03-22 17:35:42', '2025-03-22 17:35:42'),
(0, 0, 'instagram', 'https://instagram.com/johndoe', '2025-03-22 17:35:42', '2025-03-22 17:35:42'),
(0, 0, 'linkedin', 'https://linkedin.com/in/johndoe', '2025-03-22 17:35:43', '2025-03-22 17:35:43'),
(0, 0, 'github', 'https://github.com/johndoe', '2025-03-22 17:35:43', '2025-03-22 17:35:43'),
(0, 0, 'instagram', 'https://instagram.com/johndoe', '2025-03-22 17:35:43', '2025-03-22 17:35:43'),
(0, 35, 'instagram', 'a', '2025-03-22 17:37:16', '2025-03-22 17:37:16'),
(0, 36, 'instagram', 'a', '2025-03-22 17:40:12', '2025-03-22 17:40:12'),
(0, 0, 'instagram', 'aaa', '2025-03-22 17:42:24', '2025-03-22 17:42:24');

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
(7, 'tambah', '2025-03-16 17:19:58');

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
(1, 'superadmin', '$2a$10$A5oXx/E1MMxYjxwi65zACuv0QdR6BIJ5WUwdEdFnC9qNdQdhIFJma', 'Tole ganteng', 'admin@gimmik.com', 'super_admin', 'active', '2025-03-09 18:26:02', '2025-03-10 14:21:39');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
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

INSERT INTO `teams` (`id`, `name`, `role`, `image_url`, `description`, `status`, `created_at`, `updated_at`) VALUES
(14, 'Tunggul Bayu Kusuma', 'Ketua', '/images/team/team-1741963938720-766818546.jpg', 'aaa', 'active', '2025-03-14 14:52:18', '2025-03-19 09:40:02'),
(15, 'Deva Satrya Ramadhan', 'Member', '/images/team/team-1741968200338-359492083.jpg', 'cobaa', 'active', '2025-03-14 16:03:20', '2025-03-14 16:03:20'),
(16, 'Akbar Hidayatullah', 'Member', '/images/team/team-1741968228765-909748946.jpg', 'COBAA', 'active', '2025-03-14 16:03:48', '2025-03-14 16:03:48'),
(17, 'Frasiskus Aldi Jebadu', 'Member', '/images/team/team-1741968317828-476737238.jpg', 'COBAA', 'active', '2025-03-14 16:05:17', '2025-03-14 16:05:17'),
(18, 'Muhammad Darril Fauzi', 'Member', '/images/team/team-1741968355481-777400653.jpg', 'mamama', 'active', '2025-03-14 16:05:55', '2025-03-14 16:05:55'),
(19, 'Miraj Diamond Sundachi', 'Member', '/images/team/team-1741968388716-294597979.jpg', 'mamama', 'active', '2025-03-14 16:06:28', '2025-03-14 16:06:28'),
(20, 'Indira Arifin', 'Momi', '/images/team/team-1742157232310-112141533.jpg', 'mama', 'active', '2025-03-14 16:07:12', '2025-03-16 20:33:52'),
(21, 'Zaki Syifa Nugroho', 'Member', '/images/team/team-1741968461352-447240606.jpg', 'mamama', 'active', '2025-03-14 16:07:41', '2025-03-14 16:07:41'),
(22, 'Zul Widya Pratiwi', 'Momi', '/images/team/team-1741968489339-143755830.jpg', 'asasasas', 'active', '2025-03-14 16:08:09', '2025-03-15 23:16:48'),
(23, 'Lia Agustin Pratiwi', 'Momi', '/images/team/team-1741968519917-451864737.jpg', 'mamama', 'active', '2025-03-14 16:08:39', '2025-03-19 09:29:03'),
(24, 'Fadia Nurmasri', 'Momi', '/images/team/team-1742080910504-901048970.jpg', 'aaa', 'active', '2025-03-15 23:21:50', '2025-03-15 23:21:50'),
(25, 'Maesheilla', 'Momi', '/images/team/team-1742081065125-239093800.jpg', 'aaaa', 'active', '2025-03-15 23:24:25', '2025-03-15 23:24:25'),
(26, 'Fira', 'Momi', '/images/team/team-1742081089926-542898812.jpg', 'aaa', 'active', '2025-03-15 23:24:49', '2025-03-15 23:24:49'),
(27, 'Muhammad Ridho Bareng', 'Member', '/images/team/team-1742664128467-727395223.jpg', 'a', 'active', '2025-03-19 13:19:22', '2025-03-22 17:22:08'),
(27, 'Muhammad Ridho Bareng', 'Member', '/images/team/team-1742664128467-727395223.jpg', 'a', 'active', '2025-03-19 13:19:23', '2025-03-22 17:22:08'),
(28, 'Muhamad Jordi Riawan', 'Member', '/images/team/team-1742664150928-996277772.jpg', 'a', 'active', '2025-03-19 13:21:55', '2025-03-22 17:22:30'),
(31, 'Muhammad Zulfa', 'Member', '/images/team/team-1742664175206-631561468.jpg', '', 'active', '2025-03-19 13:34:21', '2025-03-22 17:22:55'),
(32, 'Muhammad Kahfi Chidani', 'Member', '/images/team/team-1742664213103-200745384.jpg', 'a', 'active', '2025-03-19 13:35:43', '2025-03-22 17:23:33'),
(33, 'Muhammad Raga Pratama', 'Member', '/images/team/team-1742664245618-139753285.jpg', 'a', 'active', '2025-03-19 13:37:07', '2025-03-22 17:24:05'),
(34, 'Toha Hisyamuddin', 'Member', '/images/team/team-1742664272563-412099110.jpg', 'a', 'active', '2025-03-19 13:37:57', '2025-03-22 17:24:32'),
(35, 'Arvan Bukhari', 'Member', '/images/team/team-1742665036420-210711645.jpg', 'Experienced web developer with expertise in React', 'active', '2025-03-22 17:35:42', '2025-03-22 17:37:16'),
(36, 'Farrel andhika', 'Member', '/images/team/team-1742665212692-580386207.jpg', 'a', 'active', '2025-03-22 17:35:43', '2025-03-22 17:40:12'),
(37, 'Farrel andhika', 'Member', '/images/team/team-1742665344921-903694633.jpg', 'aaa', 'active', '2025-03-22 17:42:24', '2025-03-22 17:42:24');

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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `image_url` varchar(255) DEFAULT '/images/team/default-avatar.jpg',
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role_id`, `status`, `image_url`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$YourHashedPasswordHere', 'joel.kojo@gmail.com', 'tole bang BANG', 1, 'active', '/images/profiles/image-1741786998713-191735468.jpeg', 'asasasas', '2025-03-11 16:39:31', '2025-03-17 18:44:20'),
(2, 'joel', '$2a$10$kvTRir/KNHBG/uRt.oL/keWC0l2NUEDAOVUNwn09WSnPC2FUaXEfC', 'joel.koj@gmail.com', 'joell', 5, 'active', '/images/profiles/image-1741787027409-984726080.jpeg', 'test', '2025-03-11 18:34:55', '2025-03-12 13:44:00'),
(3, 'newuser', '$2a$10$50aLHpzOUbEK3VIoE2KKJuJFi/UCcuj5NLBwqvFFm2uQIcHQl2acO', 'newuser@example.comm', 'New User', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-12 13:42:28', '2025-03-12 13:42:47'),
(4, 'tole', '$2a$10$4G8M7eihs1CUhUqjXbqj4OhhWFpSrEj974Ql53Fd35cfE6hovIHBW', 'tole@gmail.com', 'tole bang', 1, 'active', '/images/profiles/image-1742679566085-283252829.jpg', 'xdxdxd', '2025-03-14 18:34:47', '2025-03-22 21:39:26'),
(5, 'fira', '$2a$10$ulGTakaCMmW3LlTi7xpBsewX.1ygXQbUW0vLfGgu0I3dM5PV5cOqu', 'firaa@gmail.com', 'fildzah putri zhafira', 5, 'active', '/images/profiles/image-1742133523064-628754313.jpg', '', '2025-03-16 13:41:33', '2025-03-16 18:06:39'),
(6, 'tunggul', '$2a$10$Oxq/AofxymbF/cbtYnzmdeL.dsz5lKah4YYz5Qtx2NOZ7SKFLXJTC', 'tunggul.bayu@pergimmikan.org', 'Tunggul Bayu Kusuma', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:20:51', '2025-03-22 21:34:05'),
(7, 'deva', '$2a$10$Bt0O6/fon6XNUm7aePKMqu.FiHwc8ZPrPhrXCjHJcugTiiCzocY7.', 'deva.satrya@pergimmikan.org', 'Deva Satrya Ramadhan', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:20:54', '2025-03-22 21:34:05'),
(8, 'akbar', '$2a$10$lQlWhsZNNdKdvqjxoBBtl.PAqcLYwF98yFm1BWTNO8OxlsiRSVzBm', 'akbar.hidayatullah@pergimmikan.org', 'Akbar Hidayatullah', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:20:55', '2025-03-22 21:34:05'),
(9, 'frasiskus', '$2a$10$kxKOYefR/M0bh3xpsqXA/.Wcnu/0uLiq/212AVoun9H/uDgaV4ioy', 'frasiskus.aldi@pergimmikan.org', 'Frasiskus Aldi Jebadu', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:20:57', '2025-03-22 21:34:05'),
(10, 'muhammad', '$2a$10$qwYXEZNKIveDfQKzMSJSOumT75LcUJ/CXyoUisH4Wpq.OCVaY9ZKu', 'muhammad.darril@pergimmikan.org', 'Muhammad Darril Fauzi', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:00', '2025-03-22 21:34:05'),
(11, 'miraj', '$2a$10$9rdGyRBnvbr4ccfuCPiXZuPSjM5H7d4Vbg3mCjIpxW7apjVOwwjxm', 'miraj.diamond@pergimmikan.org', 'Miraj Diamond Sundachi', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:01', '2025-03-22 21:34:05'),
(12, 'indira', '$2a$10$ae1lrrZIT1G8g19Lyb8QJuT2YpHnkm2nhu/7yYWUgnB1oJ/PMxOnO', 'indira.arifin@pergimmikan.org', 'Indira Arifin', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:03', '2025-03-22 21:34:05'),
(13, 'zaki', '$2a$10$vamhM8SiBcWluaGGAtZQBOFbWTPI1.BrzZy1adtoyafIAEBMtNGnS', 'zaki.syifa@pergimmikan.org', 'Zaki Syifa Nugroho', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:04', '2025-03-22 21:34:05'),
(14, 'zul', '$2a$10$Cao0ZMWdtCSbQnhEwOSrTu6mcZhXmnb.nP4NLAmZh4MAlsZU1jj3C', 'zul.widya@pergimmikan.org', 'Zul Widya Pratiwi', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:06', '2025-03-22 21:34:05'),
(15, 'lia', '$2a$10$WhKdmKF9gYIaWtvN5iAekOa9pmrlf7rvkkK3hJy5Aut.QY3Tw9H4u', 'lia.agustin@pergimmikan.org', 'Lia Agustin Pratiwi', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:07', '2025-03-22 21:34:05'),
(16, 'fadia', '$2a$10$AiL9zFPL5WXPckWCXW3OQuOFxAvhkNOsvDxWCVZFFcKv7uqlC4kgO', 'fadia.nurmasri@pergimmikan.org', 'Fadia Nurmasri', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:09', '2025-03-22 21:34:05'),
(17, 'maesheilla', '$2a$10$UeIWsKBc3t8sc4vs8KlSDuAfCkqmwzGGHtToZmSsouRpexyGBp.Ni', 'maesheilla@pergimmikan.org', 'Maesheilla', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:10', '2025-03-22 21:34:05'),
(18, 'jordi', '$2a$10$8jGQ5NOXOd4P40MjEmRGD.45Tbof3M8kkQpUqgutMkj7WJ46QY/X.', 'jordi@pergimmikan.org', 'Jordi', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:13', '2025-03-22 21:34:05'),
(19, 'zulfa', '$2a$10$ZqYsF8EGP.TTu7Z5B/AX5eZBqLMWdRVL9Iru7alGjEoaW3BcqsOie', 'zulfa@pergimmikan.org', 'Zulfa', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:14', '2025-03-22 21:34:05'),
(20, 'kahfi', '$2a$10$1pgwOSAXtXxmqZUF7Ea2g.71PxI9WSWTQePZPcbbBN7dF8SUDw.jK', 'kahfi@pergimmikan.org', 'Kahfi', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:16', '2025-03-22 21:34:05'),
(21, 'raga', '$2a$10$FmzZI9leLWYkxni4udjxpu7wycrFUArHW7XfSXp9Cs26vqgr344kO', 'raga@pergimmikan.org', 'Raga', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:17', '2025-03-22 21:34:05'),
(22, 'ridho', '$2a$10$5DKla7lx/Kusu5cRERnWm.BKG82p5B6pDkDr5r.hE04I9MPFB4qEa', 'ridho@pergimmikan.org', 'Ridho', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:19', '2025-03-22 21:34:05'),
(23, 'toha', '$2a$10$mr2vllpW44L514SJIzFmgujuKasfmDNkbD8yeyFIKaX1fT2NuQwiG', 'toha@pergimmikan.org', 'Toha', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:20', '2025-03-22 21:34:05'),
(24, 'arvan', '$2a$10$QFhBy45c01DW80uomIVeyeHs42ZihwjNt4bsLnCmSvxhSz6qHyQ0y', 'arvan@pergimmikan.org', 'Arvan', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:23', '2025-03-22 21:34:05'),
(25, 'farrel', '$2a$10$aRLLCOCPkAE3NlLvXOC3GeCkn6pDCjx/d1QQ3GMmcIMUrzgNCS88e', 'farrel@pergimmikan.org', 'Farrel', 2, 'active', '/images/profiles/image-1742679245804-610202011.jpg', NULL, '2025-03-22 17:21:23', '2025-03-22 21:34:05'),
(26, 'coba', '$2a$10$4Zgh/JVe0jlp0i305KQO7OdJ3ihCIavH0YB2TRuFtrfHFfNQB0XKK', 'coba@gmail.com', 'coba id', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-23 15:31:22', '2025-03-23 15:31:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_galleries_date` (`date`);

--
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_gallery_images_gallery_id` (`gallery_id`);

--
-- Indexes for table `gallery_tags`
--
ALTER TABLE `gallery_tags`
  ADD PRIMARY KEY (`gallery_id`,`tag_id`),
  ADD KEY `idx_gallery_tags_gallery_id` (`gallery_id`),
  ADD KEY `idx_gallery_tags_tag_id` (`tag_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

-- --------------------------------------------------------

--
-- Structure for view `team_members_view`
--
DROP TABLE IF EXISTS `team_members_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`dinq6531`@`localhost` SQL SECURITY DEFINER VIEW `team_members_view`  AS SELECT `t`.`id` AS `id`, `t`.`name` AS `name`, `t`.`role` AS `role`, `t`.`image_url` AS `image_url`, `t`.`description` AS `description`, `t`.`status` AS `status`, max(case when `sm`.`platform` = 'linkedin' then `sm`.`url` end) AS `linkedin`, max(case when `sm`.`platform` = 'github' then `sm`.`url` end) AS `github`, max(case when `sm`.`platform` = 'instagram' then `sm`.`url` end) AS `instagram` FROM (`teams` `t` left join `social_media` `sm` on(`t`.`id` = `sm`.`team_id`)) GROUP BY `t`.`id` ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Modify users table to add AUTO_INCREMENT and fix IDs
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;
UPDATE `users` SET `id` = (SELECT MAX(`id`) + 1 FROM (SELECT * FROM `users`) AS t) WHERE `id` = 0 LIMIT 1;

-- Add PRIMARY KEY to id column if not exists and set AUTO_INCREMENT
ALTER TABLE `users` ADD PRIMARY KEY (`id`);
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
