import React, {useState} from 'react';
import {Drawer, Menu} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from '@react-native-vector-icons/material-design-icons';
import useDrawerContext, {WishState} from '../../contexts/DrawerContext';

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
        <Drawer.Item
          label="Default collection"
          icon={'image-multiple'}
          active={true}
          right={() => DrawerCollectionFunc()}
          onPress={() => {}}
        />
      </Drawer.Section>

      <Drawer.Section title="Tags" showDivider={false}>
        <Drawer.Item
          label="Tag 1"
          icon={'tag'}
          active={true}
          onPress={() => {}}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default DrawerScreen;
