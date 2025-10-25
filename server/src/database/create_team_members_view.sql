-- Create Team Members View with Social Media
-- This view combines team members data with their social media links

DROP VIEW IF EXISTS `team_members_view`;

CREATE VIEW `team_members_view` AS
SELECT 
  `t`.`id` AS `id`,
  `t`.`name` AS `name`,
  `t`.`role` AS `role`,
  `t`.`image_url` AS `image_url`,
  `t`.`description` AS `description`,
  `t`.`status` AS `status`,
  MAX(CASE WHEN `sm`.`platform` = 'linkedin' THEN `sm`.`url` END) AS `linkedin`,
  MAX(CASE WHEN `sm`.`platform` = 'github' THEN `sm`.`url` END) AS `github`,
  MAX(CASE WHEN `sm`.`platform` = 'instagram' THEN `sm`.`url` END) AS `instagram`
FROM 
  `teams` `t`
LEFT JOIN 
  `social_media` `sm` ON `t`.`id` = `sm`.`team_id`
GROUP BY 
  `t`.`id`,
  `t`.`name`,
  `t`.`role`,
  `t`.`image_url`,
  `t`.`description`,
  `t`.`status`;

-- Test the view
SELECT * FROM `team_members_view` LIMIT 5;
