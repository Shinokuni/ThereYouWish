import {useEffect, useMemo, useState} from 'react';
import {drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {useSQLiteContext} from 'expo-sqlite';
import {FullEntry, FullWish} from '../../components/WishItem/WishItem';
import {entry, image, link, tag, tagJoin, wish} from '../../db/schema';
import {eq, and} from 'drizzle-orm';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';

const useHomeViewModel = () => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);
  const drawerContext = useDrawerContext();

  const [isLoading, setIsLoading] = useState(true);
  const [wishes, setWishes] = useState<FullWish[]>([]);

  const deleteWish = async (wishId: number) => {
    console.log(wishId);
    await database.delete(wish).where(eq(wish.id, wishId));
  };

  const updateWishState = async (entryId: number, state: WishState) => {
    await database
      .update(entry)
      .set({state: state})
      .where(eq(entry.id, entryId));
  };

  const {data} = useLiveQuery(
    database
      .select({id: wish.id, name: wish.name, collectionId: wish.collectionId})
      .from(wish)
      .innerJoin(entry, eq(wish.id, entry.wishId))
      .where(
        and(
          eq(wish.collectionId, drawerContext!!.drawerState.collectionId),
          eq(entry.state, drawerContext!!.drawerState.wishState),
        ),
      ),
    [drawerContext!!.drawerState],
  );

  useEffect(() => {
    const loadFullWishes = async () => {
      const fullWishes: FullWish[] = [];

      for (const dbWish of data) {
        const dbEntries = await database
          .select()
          .from(entry)
          .where(eq(entry.wishId, dbWish.id));

        const fullEntries: FullEntry[] = [];

        for (const dbEntry of dbEntries) {
          const tags = await database
            .select({id: tag.id, name: tag.name})
            .from(tag)
            .innerJoin(tagJoin, eq(tag.id, tagJoin.tagId))
            .where(eq(tagJoin.entryId, dbEntry.id));

          const links = await database
            .select()
            .from(link)
            .where(eq(link.entryId, dbEntry.id));

          const images = await database
            .select()
            .from(image)
            .where(eq(image.entryId, dbEntry.id));

          fullEntries.push({
            entry: dbEntry,
            tags: tags,
            links: links,
            images: images,
          });
        }

        fullWishes.push({wish: dbWish, entries: fullEntries});
      }

      setWishes(fullWishes);
      setIsLoading(false);
    };

    loadFullWishes();
  }, [data, database]);

  return {
    isLoading,
    wishes,
    deleteWish,
    updateWishState,
  };
};

export default useHomeViewModel;
