-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2025 at 10:05 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_gimmik`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(11) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('upcoming','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `title`, `date`, `time`, `location`, `description`, `category_id`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Buka Puasa Bersama 2024', '2024-03-15', '17:30:00', 'Warung Kopi Pesisir', 'Join us for a heartwarming iftar gathering where we\'ll share stories, break bread together, and celebrate the spirit of Ramadan.', 1, '/images/activities/bukber-2024.jpg', 'upcoming', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(2, 'Photography Night', '2024-03-20', '19:00:00', 'Pergimmikan Studio', 'An evening of sharing photography techniques, editing tips, and stories behind our favorite shots. Bring your camera!', 2, '/images/activities/photo-night.jpg', 'upcoming', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(3, 'Beach Cleanup & Photo Walk', '2024-04-05', '06:00:00', 'Pantai Ancol', 'Combine our love for photography with environmental care. Let\'s capture beautiful moments while keeping our beaches clean.', 3, '/images/activities/beach-cleanup.jpg', 'upcoming', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(4, 'Monthly Coffee & Create', '2024-03-08', '10:00:00', 'Kopi Kenangan', 'Our regular creative meetup. Bring your laptop, camera, or just yourself. Let\'s create something amazing together!', 1, '/images/activities/coffee-create.jpg', 'completed', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', '2025-02-22', '03:22:00', 'asasas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius et urna at rutrum. Nullam tempus diam massa, eget lobortis lorem faucibus vel. Praesent eg', 2, '/images/activities/activity-1741812872734-278118088.jpeg', 'completed', '2025-03-11 19:22:40', '2025-03-12 21:01:07'),
(6, 'xsasaa aqxasas', '2025-03-13', '05:43:00', 'asasas', 'asasasaasas', 2, '/images/activities/activity-1741815800374-599411296.jpeg', 'upcoming', '2025-03-12 21:43:20', '2025-03-12 21:43:20');

-- --------------------------------------------------------

--
-- Table structure for table `activity_categories`
--

CREATE TABLE `activity_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_gallery`
--

INSERT INTO `activity_gallery` (`id`, `activity_id`, `image_url`, `caption`, `created_at`, `updated_at`) VALUES
(1, 1, '/images/activities/bukber-2024/1.jpg', 'Breaking fast together', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(2, 1, '/images/activities/bukber-2024/2.jpg', 'Evening prayers', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(3, 1, '/images/activities/bukber-2024/3.jpg', 'Community gathering', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(4, 2, '/images/activities/photo-night/1.jpg', 'Learning composition', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(5, 2, '/images/activities/photo-night/2.jpg', 'Camera settings workshop', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(6, 2, '/images/activities/photo-night/3.jpg', 'Group photo session', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(7, 3, '/images/activities/beach-cleanup/1.jpg', 'Morning cleanup', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(8, 3, '/images/activities/beach-cleanup/2.jpg', 'Beach photography', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(9, 3, '/images/activities/beach-cleanup/3.jpg', 'Team photo', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(10, 4, '/images/activities/coffee-create/1.jpg', 'Coffee and cameras', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(11, 4, '/images/activities/coffee-create/2.jpg', 'Creative discussion', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(12, 4, '/images/activities/coffee-create/3.jpg', 'Photo review session', '2025-03-11 13:46:39', '2025-03-11 13:46:39'),
(13, 5, '/images/activities/gallery/gallery-1741720960683-824888730.jpeg', NULL, '2025-03-11 19:22:40', '2025-03-11 19:22:40'),
(14, 5, '/images/activities/gallery/gallery-1741720960683-123074599.jpeg', NULL, '2025-03-11 19:22:40', '2025-03-11 19:22:40'),
(15, 5, '/images/activities/gallery/gallery-1741720960684-884010575.jpeg', NULL, '2025-03-11 19:22:40', '2025-03-11 19:22:40');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('upcoming','ongoing','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'upcoming',
  `max_participants` int(11) DEFAULT NULL,
  `registration_deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `created_at`, `updated_at`, `status`, `max_participants`, `registration_deadline`) VALUES
(1, 'BUKBER WITH GIMMIK', 'Orang Orang Senang', '2025-03-13', '17:00:00', 'BINTARO', '2025-03-10 22:45:29', '2025-03-11 22:53:45', 'upcoming', 20, '2025-03-13 01:45:00'),
(2, 'XXEXESX', 'XEXXEXXX', '2025-03-12', '07:45:00', 'XEEXEXEX', '2025-03-10 22:46:02', '2025-03-10 23:01:05', 'upcoming', 22, '2025-03-11 22:45:00'),
(4, 'WSSW', 'WSSWW', '2025-03-12', '07:46:00', 'DXDXDXDX', '2025-03-10 22:46:41', '2025-03-10 22:46:41', 'upcoming', 22, '2025-03-18 05:46:00'),
(5, 'SSS', 'SSSS', '2025-03-08', '09:00:00', 'SSS', '2025-03-10 23:00:57', '2025-03-10 23:00:57', 'upcoming', 22, '2025-03-13 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `failed_login_attempts`
--

CREATE TABLE `failed_login_attempts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempt_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `attempt_count` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `caption`, `date`, `author`, `created_at`, `updated_at`) VALUES
(11, '123', '2025-03-12', 'tolee', '2025-03-12 16:55:40', '2025-03-12 16:55:40'),
(12, 'qwqwq', '2025-03-13', 'qwqwq', '2025-03-12 18:33:29', '2025-03-12 18:33:29'),
(13, 'qwqwq', '2025-03-14', 'qwqwqw', '2025-03-12 18:33:41', '2025-03-12 18:33:41'),
(14, 'qqqw', '2025-03-04', 'wqqw', '2025-03-12 18:33:49', '2025-03-12 18:33:49');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `gallery_id`, `image_url`, `is_main`, `created_at`) VALUES
(11, 11, '/images/gallery/gallery-1741798540037-721622981.jpeg', 0, '2025-03-12 16:55:40');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_tags`
--

CREATE TABLE `gallery_tags` (
  `gallery_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gallery_tags`
--

INSERT INTO `gallery_tags` (`gallery_id`, `tag_id`) VALUES
(11, 3),
(12, 5),
(13, 6),
(14, 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(38, 11, '/images/journey/2023/1741810855125-371097783.jpg', NULL, '2025-03-12 20:20:55', '2025-03-12 20:20:55');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `journey_years`
--

INSERT INTO `journey_years` (`id`, `year`, `title`, `description`, `created_at`, `updated_at`) VALUES
(11, 2023, 'Goes To Jogjaa', 'sasas', '2025-03-10 18:39:41', '2025-03-10 18:39:41'),
(13, 2021, 'XD', 'XD XD XD', '2025-03-10 18:42:13', '2025-03-10 18:42:13'),
(14, 2021, 'Awal mula XD', 'saasasasasasa', '2025-03-10 18:54:00', '2025-03-10 18:54:00');

-- --------------------------------------------------------

--
-- Table structure for table `legacies`
--

CREATE TABLE `legacies` (
  `id` int(11) NOT NULL,
  `year` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
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
(5, '2025', 'Future Perfect', 'Innovating the art of visual storytelling, one frame at a time', '2025-03-10 23:14:45', '2025-03-10 23:14:45'),
(6, '2026', 'sss', 'sss', '2025-03-10 23:28:25', '2025-03-10 23:28:25');

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `logout_time` timestamp NULL DEFAULT NULL,
  `login_status` enum('success','failed') COLLATE utf8mb4_unicode_ci NOT NULL
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
(9, 2, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '2025-03-12 13:43:38', NULL, 'success');

-- --------------------------------------------------------

--
-- Table structure for table `profile_images`
--

CREATE TABLE `profile_images` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `text`, `author_name`, `author_title`, `is_featured`, `created_at`, `updated_at`) VALUES
(1, 'Life is not about the moments we capture, but the stories we create together.', 'Pergimmikann', 'Est. 2021', 1, '2025-03-10 23:36:01', '2025-03-10 23:48:45');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `platform` enum('linkedin','github','instagram') NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES
(1, 'Event', '2025-03-10 19:35:24'),
(2, 'Nature', '2025-03-10 19:35:24'),
(3, 'Adventure', '2025-03-10 19:35:24'),
(4, 'Gathering', '2025-03-10 19:35:24'),
(5, 'Festival', '2025-03-10 19:35:24'),
(6, 'Coba', '2025-03-10 19:50:29');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Stand-in structure for view `team_members_view`
-- (See below for the actual view)
--
CREATE TABLE `team_members_view` (
`id` int(11)
,`name` varchar(100)
,`role` varchar(100)
,`image_url` varchar(255)
,`description` text
,`status` enum('active','inactive')
,`linkedin` varchar(255)
,`github` varchar(255)
,`instagram` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/images/team/default-avatar.jpg',
  `bio` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role_id`, `status`, `image_url`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$YourHashedPasswordHere', 'joel.kojo@gmail.com', 'joelll', 1, 'active', '/images/profiles/image-1741786998713-191735468.jpeg', 'asasasas', '2025-03-11 16:39:31', '2025-03-12 13:43:18'),
(2, 'joel', '$2a$10$kvTRir/KNHBG/uRt.oL/keWC0l2NUEDAOVUNwn09WSnPC2FUaXEfC', 'joel.koj@gmail.com', 'joell', 5, 'active', '/images/profiles/image-1741787027409-984726080.jpeg', 'test', '2025-03-11 18:34:55', '2025-03-12 13:44:00'),
(3, 'newuser', '$2a$10$50aLHpzOUbEK3VIoE2KKJuJFi/UCcuj5NLBwqvFFm2uQIcHQl2acO', 'newuser@example.comm', 'New User', 2, 'active', '/images/team/default-avatar.jpg', NULL, '2025-03-12 13:42:28', '2025-03-12 13:42:47');

-- --------------------------------------------------------

--
-- Structure for view `team_members_view`
--
DROP TABLE IF EXISTS `team_members_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `team_members_view`  AS SELECT `t`.`id` AS `id`, `t`.`name` AS `name`, `t`.`role` AS `role`, `t`.`image_url` AS `image_url`, `t`.`description` AS `description`, `t`.`status` AS `status`, max(case when `sm`.`platform` = 'linkedin' then `sm`.`url` end) AS `linkedin`, max(case when `sm`.`platform` = 'github' then `sm`.`url` end) AS `github`, max(case when `sm`.`platform` = 'instagram' then `sm`.`url` end) AS `instagram` FROM (`teams` `t` left join `social_media` `sm` on(`t`.`id` = `sm`.`team_id`)) GROUP BY `t`.`id``id`  ;

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
-- Indexes for table `activity_categories`
--
ALTER TABLE `activity_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `activity_gallery`
--
ALTER TABLE `activity_gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_failed_attempts` (`username`,`ip_address`);

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
-- Indexes for table `journey_photos`
--
ALTER TABLE `journey_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `journey_year_id` (`journey_year_id`);

--
-- Indexes for table `journey_years`
--
ALTER TABLE `journey_years`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `legacies`
--
ALTER TABLE `legacies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_legacy_year` (`year`);

--
-- Indexes for table `login_history`
--
ALTER TABLE `login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_login_history_user` (`user_id`),
  ADD KEY `idx_login_history_time` (`login_time`);

--
-- Indexes for table `profile_images`
--
ALTER TABLE `profile_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_profile_images_user` (`user_id`),
  ADD KEY `idx_profile_images_active` (`user_id`,`is_active`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_platform_per_team` (`team_id`,`platform`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tbl_loginadmin`
--
ALTER TABLE `tbl_loginadmin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `idx_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `activity_categories`
--
ALTER TABLE `activity_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `activity_gallery`
--
ALTER TABLE `activity_gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `journey_photos`
--
ALTER TABLE `journey_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `journey_years`
--
ALTER TABLE `journey_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `legacies`
--
ALTER TABLE `legacies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `login_history`
--
ALTER TABLE `login_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `profile_images`
--
ALTER TABLE `profile_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_loginadmin`
--
ALTER TABLE `tbl_loginadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `activity_categories` (`id`);

--
-- Constraints for table `activity_gallery`
--
ALTER TABLE `activity_gallery`
  ADD CONSTRAINT `activity_gallery_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gallery_tags`
--
ALTER TABLE `gallery_tags`
  ADD CONSTRAINT `gallery_tags_ibfk_1` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gallery_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journey_photos`
--
ALTER TABLE `journey_photos`
  ADD CONSTRAINT `journey_photos_ibfk_1` FOREIGN KEY (`journey_year_id`) REFERENCES `journey_years` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `login_history`
--
ALTER TABLE `login_history`
  ADD CONSTRAINT `login_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profile_images`
--
ALTER TABLE `profile_images`
  ADD CONSTRAINT `profile_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `social_media`
--
ALTER TABLE `social_media`
  ADD CONSTRAINT `social_media_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
