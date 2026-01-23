DROP TABLE `user_progress`;--> statement-breakpoint
DROP TABLE `module_progress`;--> statement-breakpoint
DROP TABLE `answers`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
DROP TABLE `questions`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tests`("id", "title") SELECT "id", "title" FROM `tests`;--> statement-breakpoint
DROP TABLE `tests`;--> statement-breakpoint
ALTER TABLE `__new_tests` RENAME TO `tests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`iscorrect` integer,
	`fk_quiz` integer,
	FOREIGN KEY (`fk_quiz`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_options`("id", "content", "iscorrect", "fk_quiz") SELECT "id", "content", "iscorrect", "fk_quiz" FROM `options`;--> statement-breakpoint
DROP TABLE `options`;--> statement-breakpoint
ALTER TABLE `__new_options` RENAME TO `options`;--> statement-breakpoint
CREATE TABLE `__new_quiz` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`content` text,
	`questions` text,
	`exemple` text,
	`tips` text,
	`fk_lesson` integer,
	FOREIGN KEY (`fk_lesson`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_quiz`("id", "type", "content", "questions", "exemple", "tips", "fk_lesson") SELECT "id", "type", "content", "questions", "exemple", "tips", "fk_lesson" FROM `quiz`;--> statement-breakpoint
DROP TABLE `quiz`;--> statement-breakpoint
ALTER TABLE `__new_quiz` RENAME TO `quiz`;