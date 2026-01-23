CREATE TABLE `user_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_user` integer,
	`fk_course` integer,
	`fk_module` integer,
	`fk_lesson` integer,
	`status` text DEFAULT 'em progresso',
	`porcent` integer DEFAULT 0,
	FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fk_course`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fk_module`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fk_lesson`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `module_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_user` integer,
	`fk_module` integer,
	`status` text DEFAULT 'em progresso',
	`porcent` integer DEFAULT 0,
	FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fk_module`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `answer_test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conteudo` text NOT NULL,
	`fk_test` integer,
	`iscorrect` integer DEFAULT false,
	FOREIGN KEY (`fk_test`) REFERENCES `tests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conteudo` text NOT NULL,
	`fk_exercise` integer,
	`iscorrect` integer DEFAULT false,
	FOREIGN KEY (`fk_exercise`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `brain_test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_user` integer,
	`fk_test` integer,
	`is_correct` integer DEFAULT false,
	FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fk_test`) REFERENCES `tests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`fk_lesson` integer,
	`fk_question` integer,
	FOREIGN KEY (`fk_lesson`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_fk_question_unique` ON `exercises` (`fk_question`);--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_module` integer,
	`title` text NOT NULL,
	`conteudo` text,
	`status` text DEFAULT 'LOCKED',
	FOREIGN KEY (`fk_module`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_courses` integer,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'LOCKED',
	`porcent` integer DEFAULT 0,
	FOREIGN KEY (`fk_courses`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`texto` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conteudo` text,
	`fk_lesson` integer,
	FOREIGN KEY (`fk_lesson`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`fk_question` integer,
	FOREIGN KEY (`fk_question`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_user` integer,
	`fk_course` integer,
	FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fk_course`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`picture` text,
	`plan` text DEFAULT 'free',
	`age` integer,
	`location` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
DROP TABLE `users_table`;