import {useSQLiteContext} from 'expo-sqlite';
import {useMemo} from 'react';
import {drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {collection, tag} from '../../db/schema';
import {eq} from 'drizzle-orm';

const useDrawerViewModel = () => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);

  const collections = useLiveQuery(database.select().from(collection)).data;
  const tags = useLiveQuery(database.select().from(tag)).data;

  const deleteTag = async (tagId: number) => {
    await database.delete(tag).where(eq(tag.id, tagId));
  };

  const deleteCollection = async (collectionId: number) => {
    await database.delete(collection).where(eq(collection.id, collectionId));
  };

  return {
    collections,
    tags,
    deleteTag,
    deleteCollection,
  };
};

export default useDrawerViewModel;
