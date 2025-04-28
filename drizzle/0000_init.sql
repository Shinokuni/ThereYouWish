CREATE TABLE `collection` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`current` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real,
	`state` text NOT NULL,
	`deadline` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`wish_id` integer NOT NULL,
	FOREIGN KEY (`wish_id`) REFERENCES `wish`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `image` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`entry_id` integer NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entry`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `link` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`entry_id` integer NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entry`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tag_join` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entry_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entry`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wish` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`collection_id` integer NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON UPDATE no action ON DELETE cascade
);
