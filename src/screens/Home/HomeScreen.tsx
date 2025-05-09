import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {StaticScreenProps, useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Appbar, FAB, Menu, Text} from 'react-native-paper';

import style from './style';
import WishItem from '../../components/WishItem/WishItem';
import useGlobalStyle from '../../components/globalStyle';
import useHomeViewModel, {DialogAction} from './HomeViewModel';
import {WishState} from '../../contexts/DrawerContext';
import TextInputDialog from '../../components/TextInputDialog/TextInputDialog';
import {useTranslation} from 'react-i18next';
import AlertDialog from '../../components/AlertDialog/AlertDialog';

type HomeScreenProps = StaticScreenProps<{
  refreshWishes?: boolean;
}>;

const HomeScreen = ({route}: HomeScreenProps) => {
  const navigation = useNavigation();
  const globalStyle = useGlobalStyle();
  const {t} = useTranslation();

  const viewModel = useHomeViewModel();

  useEffect(() => {
    if (route.params && route.params.refreshWishes) {
      viewModel.loadFullWishes();
    }
  }, [route.params]);

  return (
    <SafeAreaView style={globalStyle.screenContainer}>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.openDrawer();
          }}
        />
        <Appbar.Content title={t('wishes')} />
        <Menu
          visible={viewModel.isAppbarMenuVisible}
          onDismiss={() => viewModel.setAppbarMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => viewModel.setAppbarMenuVisible(true)}
            />
          }>
          <Menu.Item
            title={t('new_collection')}
            onPress={() => {
              viewModel.setAppbarMenuVisible(false);
              viewModel.setNewCollectionDialogVisible(true);
            }}
          />
        </Menu>
      </Appbar.Header>

      {viewModel.isLoading ? (
        <View style={style.centerContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : viewModel.wishes.length > 0 ? (
        <FlatList
          data={viewModel.wishes}
          style={style.list}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.wish.id.toString()}
          renderItem={({item}) => (
            <WishItem
              fullWish={item}
              onEditWish={() => {
                navigation.navigate('NewWish', {fullWish: item});
              }}
              onDeleteWish={async () => {
                viewModel.setSelectedWish(item.wish);
                viewModel.setDialogAction(DialogAction.deleteWish);
              }}
              onUpdateWishState={async () => {
                viewModel.setSelectedWish(item.wish);
                viewModel.setDialogAction(DialogAction.updateWishState);
              }}
            />
          )}
        />
      ) : (
        <View style={style.centerContainer}>
          <Text variant={'headlineMedium'}>{t('no_wish')}</Text>
        </View>
      )}

      <TextInputDialog
        title={t('new_collection')}
        value={viewModel.collectionName}
        visible={viewModel.isNewCollectionDialogVisible}
        onValueChange={viewModel.setCollectionName}
        onValidate={() => {
          viewModel.setNewCollectionDialogVisible(false);
          viewModel.insertCollection(viewModel.collectionName);
          viewModel.setCollectionName('');
        }}
        onDismiss={() => {
          viewModel.setNewCollectionDialogVisible(false);
          viewModel.setCollectionName('');
        }}
      />

      <FAB
        style={style.fab}
        icon={'plus'}
        onPress={() => navigation.navigate('NewWish', {})}
      />

      {(() => {
        switch (viewModel.dialogAction) {
          case DialogAction.deleteWish:
            return (
              <AlertDialog
                title={t('delete_wish')}
                text={t('delete_wish_question', {
                  name: viewModel.selectedWish?.name,
                })}
                visible={true}
                onDismiss={() => viewModel.setDialogAction(null)}
                onValidate={async () => {
                  viewModel.setDialogAction(null);
                  await viewModel.deleteWish(viewModel.selectedWish!!.id);
                }}
              />
            );
          case DialogAction.updateWishState:
            return (
              <AlertDialog
                title={t('update_wish_state')}
                text={t('mark_wish_to', {
                  state:
                    viewModel.selectedWish?.state === WishState.ongoing
                      ? t('done')
                      : t('on_going'),
                })}
                visible={true}
                onDismiss={() => viewModel.setDialogAction(null)}
                onValidate={async () => {
                  viewModel.setDialogAction(null);
                  await viewModel.updateWishState(viewModel.selectedWish!!);
                }}
              />
            );
          default:
            return <View />;
        }
      })()}
    </SafeAreaView>
  );
};

export default HomeScreen;
