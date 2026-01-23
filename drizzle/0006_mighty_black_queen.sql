PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_courses` integer,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'locked',
	`lessons_count` integer DEFAULT 0,
	`porcent` integer DEFAULT 0,
	FOREIGN KEY (`fk_courses`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_modules`("id", "fk_courses", "title", "description", "status", "lessons_count", "porcent") SELECT "id", "fk_courses", "title", "description", "status", "lessons_count", "porcent" FROM `modules`;--> statement-breakpoint
DROP TABLE `modules`;--> statement-breakpoint
ALTER TABLE `__new_modules` RENAME TO `modules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `users` ADD `xp` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `level` text DEFAULT 'amador';