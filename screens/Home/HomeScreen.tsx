import React from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Appbar, FAB, Menu, Text} from 'react-native-paper';

import style from './style';
import WishItem from '../../components/WishItem/WishItem';
import useGlobalStyle from '../../components/globalStyle';
import useHomeViewModel from './HomeViewModel';
import {WishState} from '../../contexts/DrawerContext';
import TextInputDialog from '../../components/TextInputDialog/TextInputDialog';

const HomeScreen = () => {
  const navigation = useNavigation();
  const globalStyle = useGlobalStyle();

  const viewModel = useHomeViewModel();

  return (
    <SafeAreaView style={globalStyle.screenContainer}>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.openDrawer();
          }}
        />
        <Appbar.Content title="Wishes" />
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
            title={'New collection'}
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
          renderItem={({item}) => (
            <WishItem
              fullWish={item}
              onEditWish={() => {
                navigation.navigate('NewWish', {fullWish: item});
              }}
              onDeleteWish={async () => {
                await viewModel.deleteWish(item.wish.id);
              }}
              onUpdateWishState={async () => {
                const newState =
                  item.wish.state === WishState.ongoing
                    ? WishState.done
                    : WishState.ongoing;
                await viewModel.updateWishState(item.wish.id, newState);
              }}
            />
          )}
          keyExtractor={item => item.wish.id.toString()}
        />
      ) : (
        <View style={style.centerContainer}>
          <Text variant={'headlineMedium'}>No wish</Text>
        </View>
      )}

      <TextInputDialog
        title={'New collection'}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
