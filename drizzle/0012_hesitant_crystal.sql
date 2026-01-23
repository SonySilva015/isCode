CREATE TABLE `game` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`game_fk` integer,
	FOREIGN KEY (`game_fk`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `answer_test`;--> statement-breakpoint
DROP TABLE `tests`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_brain_test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`xp` integer,
	`qi` integer
);
--> statement-breakpoint
INSERT INTO `__new_brain_test`("id", "xp", "qi") SELECT "id", "xp", "qi" FROM `brain_test`;--> statement-breakpoint
DROP TABLE `brain_test`;--> statement-breakpoint
ALTER TABLE `__new_brain_test` RENAME TO `brain_test`;--> statement-breakpoint
PRAGMA foreign_keys=ON;