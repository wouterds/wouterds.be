CREATE TABLE `aranet-readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`temperature` float NOT NULL,
	`humidity` int NOT NULL,
	`co2` int NOT NULL,
	`pressure` float NOT NULL,
	`battery` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aranet-readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth-tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendor` enum('SPOTIFY','TESLA') NOT NULL,
	`type` enum('ACCESS_TOKEN','REFRESH_TOKEN') NOT NULL,
	`token` varchar(2048) NOT NULL,
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auth-tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendor_type_idx` UNIQUE(`vendor`,`type`)
);
--> statement-breakpoint
CREATE TABLE `p1-history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`total` float NOT NULL,
	`peak` int NOT NULL,
	`peak_time` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `p1-history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `p1-readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`active` int NOT NULL,
	`total` float NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `p1-readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tesla-data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`battery` int NOT NULL,
	`distance` float NOT NULL,
	`wake` boolean NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tesla-data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `aranet-readings` (`created_at`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `p1-history` (`created_at`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `p1-readings` (`created_at`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `tesla-data` (`created_at`);