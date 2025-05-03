import {useCallback, useEffect, useMemo, useState} from 'react';
import {entry, image, link, tag, Tag, tagJoin, wish} from '../../db/schema';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import HtmlParser from '../../util/HtmlParser';

const useNewWishViewModel = () => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);
  const drawerContext = useDrawerContext();

  const [title, setTitle] = useState('');
  const [isTitleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [links, setLinks] = useState<URL[]>([]);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkError, setIsLinkError] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [images, setImages] = useState<string[]>([]);

  const [isLinkDialogVisible, setLinkDialogVisible] = useState(false);
  const [linkDialogValue, setLinkDialogValue] = useState('');

  const loadTags = useCallback(async () => {
    const newTags = await database.select().from(tag);
    setTags(newTags);
  }, [database, setTags]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const addNewTag = async (name: string) => {
    await database.insert(tag).values({name: name});
    loadTags();
  };

  const checkFields = () => {
    if (title.length > 0) {
      return true;
    } else {
      setTitleError(true);
      return false;
    }
  };

  const insertWish = async () => {
    const [newWish] = await database
      .insert(wish)
      .values({
        name: title,
        state: WishState.ongoing,
        collectionId: drawerContext!!.drawerState.collectionId,
      })
      .returning({id: wish.id});

    const [newEntry] = await database
      .insert(entry)
      .values({
        name: title,
        description: description,
        price: parseFloat(price),
        state: WishState.ongoing,
        deadline: deadline,
        wishId: newWish.id,
      })
      .returning({id: entry.id});

    if (selectedTagIds.length > 0) {
      await database
        .insert(tagJoin)
        .values(
          selectedTagIds.map(value => ({entryId: newEntry.id, tagId: value})),
        );
    }

    if (links.length > 0) {
      await database.insert(link).values(
        links.map(newLink => ({
          url: newLink.toString(),
          entryId: newEntry.id,
        })),
      );
    }

    if (images.length > 0) {
      await database
        .insert(image)
        .values(
          images.map(newImage => ({url: newImage, entryId: newEntry.id})),
        );
    }
  };

  const parseLink = async (newLink: string) => {
    const response = await fetch(newLink);
    const text = await response.text();

    const result = new HtmlParser().parse(text);

    setTitle(result.title ? result.title : '');
    setDescription(result.description ? result.description : '');
    setPrice(result.price ? result.price : '');

    if (result.url) {
      setLinks([...links, new URL(result.url)]);
    }

    if (result.imageUrl) {
      setImages([...images, result.imageUrl]);
    }
  };

  return {
    title,
    setTitle,
    isTitleError,
    setTitleError,
    description,
    setDescription,
    price,
    setPrice,
    deadline,
    setDeadline,
    isDatePickerOpen,
    setDatePickerOpen,
    links,
    setLinks,
    linkValue,
    setLinkValue,
    isLinkError,
    setIsLinkError,
    tags,
    setTags,
    selectedTagIds,
    setSelectedTagIds,
    images,
    setImages,
    addNewTag,
    checkFields,
    insertWish,
    isLinkDialogVisible,
    setLinkDialogVisible,
    linkDialogValue,
    setLinkDialogValue,
    parseLink,
  };
};

export default useNewWishViewModel;
