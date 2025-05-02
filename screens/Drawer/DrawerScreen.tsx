import React from 'react';
import {Drawer} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';

import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import DropdownMenu, {Action} from '../../components/DropdownMenu/DropdownMenu';
import useDrawerViewModel from './DrawerViewModel';
import TextInputDialog from '../../components/TextInputDialog/TextInputDialog';

const DrawerMenu = (actions: Action[]) => {
  return <DropdownMenu actions={actions} />;
};

const DrawerScreen = () => {
  const drawerContext = useDrawerContext();
  const viewModel = useDrawerViewModel();

  return (
    <>
      <TextInputDialog
        title={
          viewModel.renameType === 'tag' ? 'Rename tag' : 'Rename collection'
        }
        value={viewModel.renameValue}
        visible={viewModel.isRenameDialogVisible}
        onValueChange={viewModel.setRenameValue}
        onValidate={() => {
          viewModel.setIsRenameDialogVisible(false);
          if (viewModel.renameType === 'tag') {
            viewModel.renameTag(viewModel.renameId, viewModel.renameValue);
          } else {
            viewModel.renameCollection(
              viewModel.renameId,
              viewModel.renameValue,
            );
          }
        }}
        onDismiss={() => {
          viewModel.setIsRenameDialogVisible(false);
        }}
      />
      <DrawerContentScrollView>
        <Drawer.Section title="Status">
          <Drawer.Item
            label="All"
            icon={'apps'}
            active={drawerContext?.drawerState.wishState === WishState.all}
            onPress={() => {
              drawerContext?.setState({
                ...drawerContext.drawerState,
                wishState: WishState.all,
                tagId: -1,
              });
            }}
          />
          <Drawer.Item
            label="On going"
            icon={'refresh'}
            active={drawerContext?.drawerState.wishState === WishState.ongoing}
            onPress={() => {
              drawerContext?.setState({
                ...drawerContext.drawerState,
                wishState: WishState.ongoing,
                tagId: -1,
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
                  tagId: -1,
                });
              }
            }}
          />
        </Drawer.Section>

        <Drawer.Section title="Collections">
          {viewModel.collections.length > 0 &&
            viewModel.collections.map(collection => (
              <Drawer.Item
                key={collection.id}
                label={collection.name}
                icon={'image-multiple'}
                active={collection.current}
                right={() =>
                  DrawerMenu([
                    {
                      name: 'Rename',
                      onClick: () => {
                        viewModel.setRenameValue(collection.name);
                        viewModel.setRenameId(collection.id);
                        viewModel.setRenameType('collection');
                        viewModel.setIsRenameDialogVisible(true);
                      },
                    },
                    {
                      name: 'Delete',
                      onClick: async () => {
                        await viewModel.deleteCollection(collection.id);
                      },
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
          {viewModel.tags.length > 0 &&
            viewModel.tags.map(tag => (
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
                      onClick: () => {
                        viewModel.setRenameValue(tag.name);
                        viewModel.setRenameType('tag');
                        viewModel.setRenameId(tag.id);
                        viewModel.setIsRenameDialogVisible(true);
                      },
                    },
                    {
                      name: 'Delete',
                      onClick: async () => {
                        await viewModel.deleteTag(tag.id);
                      },
                    },
                  ])
                }
              />
            ))}
        </Drawer.Section>
      </DrawerContentScrollView>
    </>
  );
};

export default DrawerScreen;
