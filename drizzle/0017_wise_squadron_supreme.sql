CREATE TABLE `notify` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tittle` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `trophies`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`picture` text,
	`plan` text DEFAULT 'free',
	`age` integer,
	`location` text DEFAULT 'Angola',
	`xp` integer DEFAULT 0,
	`level` text DEFAULT 'amador'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "picture", "plan", "age", "location", "xp", "level") SELECT "id", "name", "email", "picture", "plan", "age", "location", "xp", "level" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);