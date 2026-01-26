PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notify` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tittle` text,
	`content` text
);
--> statement-breakpoint
INSERT INTO `__new_notify`("id", "tittle", "content") SELECT "id", "tittle", "content" FROM `notify`;--> statement-breakpoint
DROP TABLE `notify`;--> statement-breakpoint
ALTER TABLE `__new_notify` RENAME TO `notify`;--> statement-breakpoint
PRAGMA foreign_keys=ON;