ALTER TABLE `quiz` RENAME COLUMN "conteudo" TO "content";--> statement-breakpoint
ALTER TABLE `quiz` ADD `type` text DEFAULT 'content';--> statement-breakpoint
ALTER TABLE `quiz` ADD `questions` text;--> statement-breakpoint
ALTER TABLE `quiz` ADD `exemple` text;--> statement-breakpoint
ALTER TABLE `quiz` ADD `tips` text;