import {useSQLiteContext} from 'expo-sqlite';
import {useCallback, useEffect, useMemo} from 'react';
import {drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {collection, tag, tagJoin} from '../../db/schema';
import {eq} from 'drizzle-orm';
import useDrawerContext from '../../contexts/DrawerContext';

const useDrawerViewModel = () => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);
  const drawerContext = useDrawerContext();

  const collections = useLiveQuery(database.select().from(collection)).data;
  const tags = useLiveQuery(database.select().from(tag)).data;

  const deleteTag = async (tagId: number) => {
    await database.delete(tagJoin).where(eq(tagJoin.tagId, tagId));
    await database.delete(tag).where(eq(tag.id, tagId));
  };

  const deleteCollection = async (collectionId: number) => {
    await database.delete(collection).where(eq(collection.id, collectionId));
  };

  const setCollectionId = useCallback(
    (collectionId: number) => {
      drawerContext?.setState({
        ...drawerContext.drawerState,
        collectionId: collectionId,
      });
    },
    [drawerContext],
  );

  useEffect(() => {
    if (collections.length > 0) {
      const currentId = collections.find(value => value.current)!!.id;
      setCollectionId(currentId);
    }
  }, [collections]); // adding here setCollectionId creates endless re-rendering, I don't know why

  return {
    collections,
    tags,
    deleteTag,
    deleteCollection,
  };
};

export default useDrawerViewModel;
