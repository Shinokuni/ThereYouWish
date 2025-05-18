import {useCallback, useEffect, useMemo, useState} from 'react';
import {drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {useSQLiteContext} from 'expo-sqlite';
import {FullEntry, FullWish} from '../../components/WishItem/WishItem';
import {
  collection,
  entry,
  image,
  link,
  tag,
  tagJoin,
  Wish,
  wish,
} from '../../db/schema';
import {eq, and, sql, asc, desc, SQL, isNotNull} from 'drizzle-orm';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import {
  FilterField,
  OrderField,
  OrderType,
} from '../../components/FilterBottomSheet/FilterBottomSheet';

export enum DialogAction {
  deleteWish = 'deleteWish',
  updateWishState = 'updateWishState',
}

const useHomeViewModel = () => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);
  const drawerContext = useDrawerContext();

  const [isLoading, setIsLoading] = useState(true);
  const [wishes, setWishes] = useState<FullWish[]>([]);

  const [isAppbarMenuVisible, setAppbarMenuVisible] = useState(false);
  const [isNewCollectionDialogVisible, setNewCollectionDialogVisible] =
    useState(false);
  const [collectionName, setCollectionName] = useState('');

  const [dialogAction, setDialogAction] = useState<DialogAction | null>(null);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  const [orderField, setOrderField] = useState(OrderField.name);
  const [orderType, setOrderType] = useState(OrderType.ASC);
  const [filterField, setFilterField] = useState<FilterField | null>(null);

  const deleteWish = async (wishId: number) => {
    await database.delete(wish).where(eq(wish.id, wishId));
  };

  const updateWishState = async (wishToUpdate: Wish) => {
    const newState =
      wishToUpdate.state === WishState.ongoing
        ? WishState.done
        : WishState.ongoing;
    await database
      .update(wish)
      .set({state: newState})
      .where(eq(wish.id, wishToUpdate.id));
  };

  const insertCollection = async (name: string) => {
    await database.insert(collection).values({name: name, current: false});
  };

  // string templates makes the useLiveQuery hook always return 0 values
  // so no choice than returning fixed strings
  const orderBy = () => {
    let orderBySQL: SQL<string>;

    switch (orderField) {
      case OrderField.price:
        orderBySQL = sql<string>`entry.price`;
        break;
      case OrderField.deadline:
        orderBySQL = sql<string>`entry.deadline`;
        break;
      case OrderField.startDate:
        orderBySQL = sql<string>`entry.startDate`;
        break;
      case OrderField.name:
      default:
        orderBySQL = sql<string>`wish.name`;
        break;
    }

    return orderType === OrderType.ASC ? asc(orderBySQL) : desc(orderBySQL);
  };

  const filter = (): SQL | undefined => {
    let filterSQL: SQL;

    switch (filterField) {
      case FilterField.price:
        filterSQL = isNotNull(entry.price);
        break;
      case FilterField.deadline:
        filterSQL = isNotNull(entry.deadline);
        break;
      default:
        return undefined;
    }

    return filterSQL;
  };

  const {data} = useLiveQuery(
    database
      .selectDistinct({
        id: wish.id,
        name: wish.name,
        state: wish.state,
        collectionId: wish.collectionId,
      })
      .from(wish)
      .innerJoin(entry, eq(wish.id, entry.wishId))
      .leftJoin(tagJoin, eq(tagJoin.entryId, entry.id))
      .where(
        and(
          eq(wish.collectionId, drawerContext!!.drawerState.collectionId),
          drawerContext!!.drawerState.wishState !== WishState.all
            ? eq(wish.state, drawerContext!!.drawerState.wishState)
            : undefined,
          drawerContext!!.drawerState.tagId !== -1
            ? eq(tagJoin.tagId, drawerContext!!.drawerState.tagId)
            : undefined,
          filter(),
        ),
      )
      .orderBy(orderBy()),
    [drawerContext!!.drawerState, orderField, orderType, filterField],
  );

  const allTags = useLiveQuery(database.select().from(tag)).data;

  const loadFullWishes = useCallback(async () => {
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
  }, [data, allTags, database]);

  useEffect(() => {
    loadFullWishes();
  }, [loadFullWishes]);

  return {
    isLoading,
    wishes,
    deleteWish,
    updateWishState,
    isAppbarMenuVisible,
    setAppbarMenuVisible,
    isNewCollectionDialogVisible,
    setNewCollectionDialogVisible,
    dialogAction,
    setDialogAction,
    selectedWish,
    setSelectedWish,
    collectionName,
    setCollectionName,
    insertCollection,
    loadFullWishes,
    orderField,
    setOrderField,
    orderType,
    setOrderType,
    filterField,
    setFilterField,
  };
};

export default useHomeViewModel;
