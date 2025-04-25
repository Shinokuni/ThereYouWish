import React, {useEffect, useMemo, useState} from 'react';
import {Drawer} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';

import * as schema from '../../db/schema';
import {Collection, Tag} from '../../db/schema';
import DropdownMenu, {Action} from '../../components/DropdownMenu/DropdownMenu';

const DrawerMenu = (actions: Action[]) => {
  return <DropdownMenu actions={actions} />;
};

const DrawerScreen = () => {
  const drawerContext = useDrawerContext();
  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo, {schema}), [expo]);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const loaded = await database.select().from(schema.collection);
      setCollections(loaded);

      const loadedTags = await database.select().from(schema.tag);
      setTags(loadedTags);
    };

    loadData();
  }, [database, setCollections, setTags]);

  return (
    <DrawerContentScrollView>
      <Drawer.Section title="Status">
        <Drawer.Item
          label="On going"
          icon={'refresh'}
          active={drawerContext?.drawerState.wishState === WishState.ongoing}
          onPress={() => {
            drawerContext?.setState({
              ...drawerContext.drawerState,
              wishState: WishState.ongoing,
            });
          }}
        />
        <Drawer.Item
          label="Done"
          icon={'check-all'}
          active={drawerContext?.drawerState.wishState === WishState.done}
          onPress={() => {
            if (drawerContext != null) {
              drawerContext.setState({
                ...drawerContext.drawerState,
                wishState: WishState.done,
              });
            }
          }}
        />
      </Drawer.Section>

      <Drawer.Section title="Collections">
        {collections.length > 0 &&
          collections.map(collection => (
            <Drawer.Item
              key={collection.id}
              label={collection.name}
              icon={'image-multiple'}
              active={collection.current}
              right={() =>
                DrawerMenu([
                  {
                    name: 'Rename',
                    onClick: () => {},
                  },
                  {
                    name: 'Delete',
                    onClick: () => {},
                  },
                ])
              }
              onPress={() => {
                drawerContext?.setState({
                  ...drawerContext.drawerState,
                  collectionId: collection.id,
                });
              }}
            />
          ))}
      </Drawer.Section>

      <Drawer.Section title="Tags" showDivider={false}>
        {tags.length > 0 &&
          tags.map(tag => (
            <Drawer.Item
              key={tag.id}
              label={tag.name}
              icon={'tag'}
              active={tag.id === drawerContext?.drawerState.tagId}
              onPress={() => {
                drawerContext?.setState({
                  ...drawerContext.drawerState,
                  tagId: tag.id,
                });
              }}
              right={() =>
                DrawerMenu([
                  {
                    name: 'Rename',
                    onClick: () => {},
                  },
                  {
                    name: 'Delete',
                    onClick: () => {},
                  },
                ])
              }
            />
          ))}
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default DrawerScreen;
