PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_module` integer,
	`title` text NOT NULL,
	`conteudo` text,
	`status` text DEFAULT 'locked',
	FOREIGN KEY (`fk_module`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_lessons`("id", "fk_module", "title", "conteudo", "status") SELECT "id", "fk_module", "title", "conteudo", "status" FROM `lessons`;--> statement-breakpoint
DROP TABLE `lessons`;--> statement-breakpoint
ALTER TABLE `__new_lessons` RENAME TO `lessons`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `courses` ADD `modules_count` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `modules` ADD `lessons_count` integer DEFAULT 0;