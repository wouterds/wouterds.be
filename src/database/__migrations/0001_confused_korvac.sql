CREATE TABLE `nuc-readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cpu_temp` float NOT NULL,
	`cpu_usage` float NOT NULL,
	`memory_usage` float NOT NULL,
	`disk_usage` float NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nuc-readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `nuc-readings` (`created_at`);