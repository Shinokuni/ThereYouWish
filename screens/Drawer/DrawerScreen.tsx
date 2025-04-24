import React, {useEffect, useState} from 'react';
import {Drawer, Menu} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from '@react-native-vector-icons/material-design-icons';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import {Collection, Tag} from '../../db/schema';

type DrawerCollectionMenuProps = {
  onRename: () => void;
  onDelete: () => void;
};

const DrawerCollectionMenu = ({
  onRename,
  onDelete,
}: DrawerCollectionMenuProps) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Icon name={'dots-vertical'} size={24} onPress={openMenu} />}>
      <Menu.Item
        onPress={() => {
          closeMenu();
          onRename();
        }}
        title="Rename"
      />
      <Menu.Item
        onPress={() => {
          closeMenu();
          onDelete();
        }}
        title="Delete"
      />
    </Menu>
  );
};

const DrawerCollectionFunc = () => {
  return <DrawerCollectionMenu onRename={() => {}} onDelete={() => {}} />;
};

const DrawerScreen = () => {
  const drawerContext = useDrawerContext();
  const expo = useSQLiteContext();
  const database = drizzle(expo, {schema});

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
  });

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
              right={() => DrawerCollectionFunc()}
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
              right={() => DrawerCollectionFunc()}
            />
          ))}
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default DrawerScreen;
