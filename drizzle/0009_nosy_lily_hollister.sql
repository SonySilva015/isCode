CREATE TABLE `options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`iscorrect` integer DEFAULT false,
	`fk_quiz` integer,
	FOREIGN KEY (`fk_quiz`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE no action
);
