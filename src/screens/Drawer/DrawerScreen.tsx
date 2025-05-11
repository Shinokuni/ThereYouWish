import React from 'react';
import {Drawer} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';

import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import DropdownMenu, {Action} from '../../components/DropdownMenu/DropdownMenu';
import useDrawerViewModel, {DialogAction} from './DrawerViewModel';
import TextInputDialog from '../../components/TextInputDialog/TextInputDialog';
import {useTranslation} from 'react-i18next';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import {View} from 'react-native';

const DrawerMenu = (actions: Action[]) => {
  return <DropdownMenu actions={actions} />;
};

const DrawerScreen = () => {
  const drawerContext = useDrawerContext();
  const viewModel = useDrawerViewModel();
  const {t} = useTranslation();

  return (
    <DrawerContentScrollView>
      <Drawer.Section title={t('status')}>
        <Drawer.Item
          label={t('all')}
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
          label={t('on_going')}
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
          label={t('done')}
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

      <Drawer.Section title={t('collections')}>
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
                    name: t('rename'),
                    onClick: () => {
                      viewModel.setSelectedEntity(collection);
                      viewModel.setRenameValue(collection.name);
                      viewModel.setDialogAction(DialogAction.renameCollection);
                    },
                  },
                  {
                    name: t('delete'),
                    onClick: async () => {
                      viewModel.setSelectedEntity(collection);
                      viewModel.setDialogAction(DialogAction.deleteCollection);
                    },
                  },
                ])
              }
              onPress={async () => {
                await viewModel.updateCurrentCollection(collection.id);
                drawerContext?.setState({
                  ...drawerContext.drawerState,
                  collectionId: collection.id,
                });
              }}
            />
          ))}
      </Drawer.Section>

      <Drawer.Section title={t('tags')} showDivider={false}>
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
                    name: t('rename'),
                    onClick: () => {
                      viewModel.setSelectedEntity(tag);
                      viewModel.setRenameValue(tag.name);
                      viewModel.setDialogAction(DialogAction.renameTag);
                    },
                  },
                  {
                    name: t('delete'),
                    onClick: async () => {
                      viewModel.setSelectedEntity(tag);
                      viewModel.setDialogAction(DialogAction.deleteTag);
                    },
                  },
                ])
              }
            />
          ))}
      </Drawer.Section>

      {(() => {
        switch (viewModel.dialogAction) {
          case DialogAction.deleteTag:
            return (
              <AlertDialog
                title={t('delete_tag')}
                text={t('delete_tag_question', {
                  name: viewModel.selectedEntity!!.name,
                })}
                visible={true}
                onDismiss={() => viewModel.setDialogAction(null)}
                onValidate={() => {
                  viewModel.setDialogAction(null);
                  viewModel.deleteTag(viewModel.selectedEntity!!.id);
                }}
              />
            );
          case DialogAction.deleteCollection:
            return (
              <AlertDialog
                title={t('delete_collection')}
                text={t('delete_collection_question', {
                  name: viewModel.selectedEntity!!.name,
                })}
                visible={true}
                onDismiss={() => viewModel.setDialogAction(null)}
                onValidate={() => {
                  viewModel.setDialogAction(null);
                  viewModel.deleteCollection(viewModel.selectedEntity!!.id);
                }}
              />
            );
          case DialogAction.renameCollection:
            return (
              <TextInputDialog
                visible={true}
                title={t('rename_collection')}
                value={viewModel.renameValue}
                onValueChange={viewModel.setRenameValue}
                onValidate={() => {
                  viewModel.setDialogAction(null);
                  viewModel.renameCollection(
                    viewModel.selectedEntity!!.id,
                    viewModel.renameValue,
                  );
                }}
                onDismiss={() => viewModel.setDialogAction(null)}
              />
            );
          case DialogAction.renameTag:
            return (
              <TextInputDialog
                visible={true}
                title={t('rename_tag')}
                value={viewModel.renameValue}
                onValueChange={viewModel.setRenameValue}
                onValidate={() => {
                  viewModel.setDialogAction(null);
                  viewModel.renameTag(
                    viewModel.selectedEntity!!.id,
                    viewModel.renameValue,
                  );
                }}
                onDismiss={() => viewModel.setDialogAction(null)}
              />
            );
          default:
            return <View />;
        }
      })()}
    </DrawerContentScrollView>
  );
};

export default DrawerScreen;
