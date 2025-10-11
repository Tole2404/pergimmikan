-- Create savings table
CREATE TABLE IF NOT EXISTS `savings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `description` TEXT NULL,
  `receipt_url` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `transaction_date` DATE NOT NULL,
  `admin_id` INT NULL,
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user_savings_idx` (`user_id`),
  INDEX `admin_savings_idx` (`admin_id`),
  INDEX `status_savings_idx` (`status`),
  CONSTRAINT `fk_savings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_savings_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
);

-- Create stored procedures
DELIMITER //

-- Get member savings summary
CREATE PROCEDURE IF NOT EXISTS `GetMemberSavings`(IN user_id_param INT)
BEGIN
    SELECT
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_approved,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
        SUM(CASE WHEN status = 'rejected' THEN amount ELSE 0 END) as total_rejected,
        COUNT(*) as total_transactions
    FROM
        savings
    WHERE
        user_id = user_id_param;
END //

-- Get member savings history
CREATE PROCEDURE IF NOT EXISTS `GetMemberSavingsHistory`(IN user_id_param INT, IN limit_param INT)
BEGIN
    SELECT
        s.*,
        u.username as user_name,
        a.username as admin_name
    FROM
        savings s
    LEFT JOIN
        users u ON s.user_id = u.id
    LEFT JOIN
        users a ON s.admin_id = a.id
    WHERE
        s.user_id = user_id_param
    ORDER BY
        s.created_at DESC
    LIMIT limit_param;
END //

DELIMITER ;
