CREATE TABLE `aranet-readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`temperature` float NOT NULL,
	`humidity` int NOT NULL,
	`co2` int NOT NULL,
	`pressure` float NOT NULL,
	`battery` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aranet-readings_id` PRIMARY KEY(`id`)
);
