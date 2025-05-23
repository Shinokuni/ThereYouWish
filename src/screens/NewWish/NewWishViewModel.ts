import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSQLiteContext} from 'expo-sqlite';
import {and, eq, inArray} from 'drizzle-orm';
import {drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite';

import {entry, image, link, tag, Tag, tagJoin, wish} from '../../db/schema';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import HtmlParser, {ParsingResult} from '../../util/HtmlParser';
import {FullWish} from '../../components/WishItem/WishItem';
import NativeAndroidShareIntent from '../../specs/NativeAndroidShareIntent';
import AmazonScrapper from '../../util/AmazonScrapper';
import Util from '../../util/Util';
import {NavigationAction} from '@react-navigation/native';

export enum DialogAction {
  loading = 'loading',
  parseLink = 'parseLink',
  backConfirmation = 'backConfirmation',
  noCollection = 'noCollection',
}

type NewWishViewModelProps = {
  fullWish?: FullWish;
  url?: string;
};

const useNewWishViewModel = ({fullWish, url}: NewWishViewModelProps) => {
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);
  const drawerContext = useDrawerContext();

  const [title, setTitle] = useState(
    fullWish?.entries[0].entry.name ? fullWish?.entries[0].entry.name : '',
  );
  const [isTitleError, setTitleError] = useState(false);
  const [description, setDescription] = useState(
    fullWish?.entries[0].entry.description
      ? fullWish?.entries[0].entry.description
      : '',
  );
  const [price, setPrice] = useState(
    fullWish?.entries[0].entry.price
      ? fullWish?.entries[0].entry.price.toString()
      : '',
  );
  const [deadline, setDeadline] = useState<Date | null>(
    fullWish?.entries[0].entry.deadline
      ? fullWish?.entries[0].entry.deadline
      : null,
  );
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [links, setLinks] = useState<URL[]>(
    fullWish?.entries[0].links
      ? fullWish?.entries[0].links.map(value => value.url)
      : [],
  );
  const [linkValue, setLinkValue] = useState('');
  const [isLinkError, setIsLinkError] = useState(false);

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    fullWish?.entries[0].tags
      ? fullWish?.entries[0].tags.map(value => value.id)!!
      : [],
  );

  const [images, setImages] = useState<string[]>(
    fullWish?.entries[0].images
      ? fullWish?.entries[0].images.map(value => value.url)
      : [],
  );

  const [linkDialogValue, setLinkDialogValue] = useState('');
  const [isErrorSnackBarVisible, setErrorSnackBarVisible] = useState(false);

  const [dialogAction, setDialogAction] = useState<DialogAction | null>(null);
  const [navigationAction, setNavigationAction] =
    useState<NavigationAction | null>(null);
  let validExit = false;

  const tags = useLiveQuery(database.select().from(tag)).data;

  const addNewTag = async (name: string) => {
    await database.insert(tag).values({name: name});
  };

  const checkFields = () => {
    if (title.length > 0) {
      return true;
    } else {
      setTitleError(true);
      return false;
    }
  };

  const canGoBack = () => {
    if (fullWish) {
      // update state
      const fulLEntry = fullWish.entries[0];
      const entry = fulLEntry.entry;

      return (
        title === entry.name &&
        description === entry.description &&
        price === (entry.price ? entry.price.toString() : '') &&
        deadline === entry.deadline &&
        links.toString() === fulLEntry.links.map(link => link.url).toString() &&
        selectedTagIds.toString() ===
          fulLEntry.tags.map(tag => tag.id).toString() &&
        images.toString() ===
          fulLEntry.images.map(image => image.url).toString()
      );
    } else {
      // insert state
      return (
        title.length === 0 &&
        description.length === 0 &&
        price.length === 0 &&
        deadline === null &&
        links.length === 0 &&
        selectedTagIds.length === 0 &&
        images.length === 0
      );
    }
  };

  const updateWish = async () => {
    const entryId = fullWish?.entries[0].entry.id!!;
    const baseLinks = fullWish?.entries[0].links;
    const baseImages = fullWish?.entries[0].images;
    const baseTags = fullWish?.entries[0].tags;

    await database
      .update(entry)
      .set({
        name: title,
        description: description,
        price: parseFloat(price),
        deadline: deadline,
      })
      .where(eq(entry.id, entryId));

    const linksToInsert = links.filter(
      link => !baseLinks?.some(baseLink => baseLink.url === link),
    );
    const linksToDelete = baseLinks?.filter(
      baseLink => !links.some(link => link === baseLink.url),
    );

    if (linksToInsert.length > 0) {
      await database
        .insert(link)
        .values(linksToInsert.map(link => ({url: link, entryId: entryId})));
    }

    if (linksToDelete && linksToDelete.length > 0) {
      await database.delete(link).where(
        inArray(
          link.id,
          linksToDelete!!.map(value => value.id),
        ),
      );
    }

    const imagesToInsert = images.filter(
      image => !baseImages?.some(baseImage => baseImage.url === image),
    );
    const imagesToDelete = baseImages?.filter(
      baseImage => !images.some(image => image === baseImage.url),
    );

    if (imagesToInsert.length > 0) {
      await database
        .insert(image)
        .values(imagesToInsert.map(image => ({url: image, entryId: entryId})));
    }

    if (imagesToDelete && imagesToDelete.length > 0) {
      await database.delete(image).where(
        inArray(
          image.id,
          imagesToDelete!!.map(value => value.id),
        ),
      );
    }

    const tagsToInsert = selectedTagIds.filter(
      selectedTagId => !baseTags?.some(baseTag => baseTag.id === selectedTagId),
    );
    const tagsToDelete = baseTags?.filter(
      baseTag =>
        !selectedTagIds.some(selectedTagId => selectedTagId === baseTag.id),
    );

    if (tagsToInsert.length > 0) {
      await database
        .insert(tagJoin)
        .values(tagsToInsert.map(tagId => ({tagId: tagId, entryId: entryId})));
    }

    if (tagsToDelete && tagsToDelete.length > 0) {
      await database.delete(tagJoin).where(
        and(
          eq(tagJoin.entryId, entryId),
          inArray(
            tagJoin.tagId,
            tagsToDelete.map(value => value.id),
          ),
        ),
      );
    }
  };

  const insertWish = async () => {
    if (drawerContext!!.drawerState.collectionId === -1) {
      setDialogAction(DialogAction.noCollection);
      return false;
    }

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
          url: newLink,
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

    return true;
  };

  const parseLink = useCallback(async (newLink: string) => {
    try {
      setDialogAction(DialogAction.loading);
      const response = await fetch(newLink);

      if (!response.ok) {
        setErrorSnackBarVisible(true);
        return;
      }

      const text = await response.text();

      let result: ParsingResult;
      if (Util.getURLrootDomain(newLink) === 'amazon') {
        result = new AmazonScrapper().scrape(text);
      } else {
        result = new HtmlParser().parse(text);
      }

      setTitle(result.title ? result.title : '');
      setDescription(result.description ? result.description : '');
      setPrice(result.price ? result.price : '');

      if (result.url) {
        setLinks([...links, new URL(result.url)]);
      } else {
        setLinks([...links, new URL(newLink)]);
      }

      if (result.images) {
        setImages([...images, ...result.images]);
      }
    } catch (error) {
      console.log(error);
      setErrorSnackBarVisible(true);
    } finally {
      setDialogAction(null);
    }
  }, []);

  useEffect(() => {
    const fetchLink = async () => {
      if (url) {
        await parseLink(url);
        // very important to remove the shared content text after being processed
        NativeAndroidShareIntent.clearInitialSharedText();
      }
    };

    fetchLink();
  }, [url, parseLink]);

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
    selectedTagIds,
    setSelectedTagIds,
    images,
    setImages,
    addNewTag,
    checkFields,
    insertWish,
    updateWish,
    linkDialogValue,
    setLinkDialogValue,
    isErrorSnackBarVisible,
    setErrorSnackBarVisible,
    dialogAction,
    setDialogAction,
    navigationAction,
    setNavigationAction,
    validExit,
    parseLink,
    canGoBack,
  };
};

export default useNewWishViewModel;
