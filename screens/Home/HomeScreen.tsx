import React from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Appbar, FAB, Text} from 'react-native-paper';

import style from './style';
import WishItem from '../../components/WishItem/WishItem';
import useGlobalStyle from '../../components/globalStyle';
import useHomeViewModel from './HomeViewModel';
import {WishState} from '../../contexts/DrawerContext';

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
      </Appbar.Header>

      {viewModel.isLoading ? (
        <View style={style.centerContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : viewModel.wishes.length > 0 ? (
        <View style={style.list}>
          <FlatList
            data={viewModel.wishes}
            renderItem={({item}) => (
              <WishItem
                fullWish={item}
                onDeleteWish={async () => {
                  await viewModel.deleteWish(item.wish.id);
                }}
                onUpdateWishState={async () => {
                  const newState =
                    item.entries[0].entry.state === WishState.ongoing
                      ? WishState.done
                      : WishState.ongoing;
                  await viewModel.updateWishState(
                    item.entries[0].entry.id,
                    newState,
                  );
                }}
              />
            )}
            keyExtractor={item => item.wish.id.toString()}
          />
        </View>
      ) : (
        <View style={style.centerContainer}>
          <Text variant={'headlineMedium'}>No wish</Text>
        </View>
      )}

      <FAB
        style={style.fab}
        icon={'plus'}
        onPress={() => navigation.navigate('NewWish')}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
