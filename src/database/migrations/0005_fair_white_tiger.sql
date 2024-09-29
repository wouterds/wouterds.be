CREATE TABLE `auth-tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(32) NOT NULL,
	`access_token` varchar(255) NOT NULL,
	`refresh_token` varchar(255) NOT NULL,
	`expiry` timestamp NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `auth-tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `type_idx` ON `auth-tokens` (`type`);