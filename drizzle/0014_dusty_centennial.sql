CREATE TABLE `trophies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`icon` text
);
--> statement-breakpoint
CREATE TABLE `xp_levels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`level` integer,
	`xp` integer
);
--> statement-breakpoint
DROP TABLE `brain_test`;