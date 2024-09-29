CREATE TABLE `p1-readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`active` int NOT NULL,
	`total` float NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `p1-readings_id` PRIMARY KEY(`id`)
);
