import {useSQLiteContext} from 'expo-sqlite';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {collection, tag, tagJoin} from '../../db/schema';
import {eq} from 'drizzle-orm';
import useDrawerContext from '../../contexts/DrawerContext';

const useDrawerViewModel = () => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);
  const drawerContext = useDrawerContext();

  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameId, setRenameId] = useState(0);
  const [renameType, setRenameType] = useState<'tag' | 'collection' | null>(
    null,
  );

  const collections = useLiveQuery(database.select().from(collection)).data;
  const tags = useLiveQuery(database.select().from(tag)).data;

  const renameTag = async (tagId: number, name: string) => {
    await database.update(tag).set({name: name}).where(eq(tag.id, tagId));
  };

  const deleteTag = async (tagId: number) => {
    await database.delete(tag).where(eq(tag.id, tagId));
  };

  const renameCollection = async (collectionId: number, name: string) => {
    await database
      .update(collection)
      .set({name: name})
      .where(eq(collection.id, collectionId));
  };

  const deleteCollection = async (collectionId: number) => {
    await database.delete(collection).where(eq(collection.id, collectionId));
    const newCollections = collections.filter(
      collection => collection.id !== collectionId,
    );

    if (newCollections.length > 0) {
      await updateCurrentCollection(newCollections[0].id);
    }
  };

  const updateCurrentCollection = async (collectionId: number) => {
    await expo.execAsync(
      `Update Collection Set current = Case When id = ${collectionId} Then 1 Else 0 End`,
    );
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
      const currentId = collections.find(value => value.current)?.id;

      if (currentId) {
        setCollectionId(currentId);
      } else {
        setCollectionId(-1);
      }
    } else {
      setCollectionId(-1);
    }
  }, [collections]); // adding here setCollectionId creates endless re-rendering, I don't know why

  return {
    collections,
    tags,
    deleteTag,
    deleteCollection,
    isRenameDialogVisible,
    setIsRenameDialogVisible,
    renameValue,
    setRenameValue,
    renameType,
    setRenameType,
    renameCollection,
    renameTag,
    renameId,
    setRenameId,
    updateCurrentCollection,
  };
};

export default useDrawerViewModel;
