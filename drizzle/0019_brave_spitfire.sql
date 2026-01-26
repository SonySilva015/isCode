ALTER TABLE `notify` ADD `title` text;--> statement-breakpoint
ALTER TABLE `notify` ADD `checked` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `notify` ADD `date` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `notify` DROP COLUMN `tittle`;