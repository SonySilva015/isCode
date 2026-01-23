PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_xp_levels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`level` integer DEFAULT 1,
	`xp` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_xp_levels`("id", "level", "xp") SELECT "id", "level", "xp" FROM `xp_levels`;--> statement-breakpoint
DROP TABLE `xp_levels`;--> statement-breakpoint
ALTER TABLE `__new_xp_levels` RENAME TO `xp_levels`;--> statement-breakpoint
PRAGMA foreign_keys=ON;