CREATE TABLE `p1-history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`total` float NOT NULL,
	`peak` int NOT NULL,
	`peak_time` timestamp NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `p1-history_id` PRIMARY KEY(`id`)
);
