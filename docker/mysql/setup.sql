CREATE DATABASE IF NOT EXISTS `wouterdeschuyter` CHARACTER SET `utf8mb4` COLLATE `utf8mb4_unicode_ci`;
CREATE DATABASE IF NOT EXISTS `wouterdeschuyter-tests` CHARACTER SET `utf8mb4` COLLATE `utf8mb4_unicode_ci`;

GRANT ALL PRIVILEGES ON `wouterdeschuyter`.* TO 'wouterdeschuyter'@'%';
GRANT ALL PRIVILEGES ON `wouterdeschuyter-tests`.* TO 'wouterdeschuyter'@'%';
