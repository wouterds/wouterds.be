CREATE TABLE `tesla-data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`battery` int NOT NULL,
	`distance` float NOT NULL,
	`wake` boolean NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `tesla-data_id` PRIMARY KEY(`id`)
);
