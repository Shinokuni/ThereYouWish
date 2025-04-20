import {sql} from 'drizzle-orm';
import {sqliteTable, integer, text, real} from 'drizzle-orm/sqlite-core';

export const collection = sqliteTable('collection', {
  id: integer().primaryKey({autoIncrement: true}),
  name: text().notNull(),
  description: text(),
  current: integer({mode: 'boolean'}).notNull(),
});

export type Collection = typeof collection.$inferSelect;
export type CollectionInsert = typeof collection.$inferInsert;

export const wish = sqliteTable('wish', {
  id: integer().primaryKey({autoIncrement: true}),
  name: text(),
  collectionId: integer('collection_id')
    .references(() => collection.id, {onDelete: 'cascade'})
    .notNull(),
});

export type Wish = typeof collection.$inferSelect;
export type WishInsert = typeof collection.$inferInsert;

export const entry = sqliteTable('entry', {
  id: integer().primaryKey({autoIncrement: true}),
  name: text().notNull(),
  description: text(),
  price: real(),
  state: text().notNull(),
  dueDate: text('due_date'),
  startDate: text('start_date')
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  endDate: text('end_date'),
  wishId: integer('wish_id')
    .references(() => wish.id, {onDelete: 'cascade'})
    .notNull(),
});

export type Entry = typeof entry.$inferSelect;
export type EntrySelect = typeof entry.$inferInsert;

export const link = sqliteTable('link', {
  id: integer().primaryKey({autoIncrement: true}),
  url: text().notNull(),
  entryId: integer('entry_id')
    .references(() => entry.id, {onDelete: 'cascade'})
    .notNull(),
});

export type Link = typeof link.$inferSelect;
export type LinkInsert = typeof link.$inferInsert;

export const image = sqliteTable('image', {
  id: integer().primaryKey({autoIncrement: true}),
  url: text().notNull(),
  entryId: integer('entry_id')
    .references(() => entry.id, {onDelete: 'cascade'})
    .notNull(),
});

export type Image = typeof image.$inferSelect;
export type ImageInsert = typeof image.$inferInsert;

export const tag = sqliteTable('tag', {
  id: integer().primaryKey({autoIncrement: true}),
  name: text().notNull(),
});

export type Tag = typeof tag.$inferSelect;
export type TagInsert = typeof tag.$inferInsert;

export const tagJoin = sqliteTable('tag_join', {
  id: integer().primaryKey({autoIncrement: true}),
  entryId: integer('entry_id')
    .references(() => entry.id)
    .notNull(),
  tagId: integer('tag_id')
    .references(() => tag.id)
    .notNull(),
});
