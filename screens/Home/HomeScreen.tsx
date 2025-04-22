import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar, FAB} from 'react-native-paper';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';

import * as schema from '../../db/schema';
import style from './style';
import WishItem from '../../components/WishItem/WishItem';
import useGlobalStyle from '../../components/globalStyle';

const HomeScreen = () => {
  const navigation = useNavigation();
  const expo = useSQLiteContext();
  const database = drizzle(expo, {schema});
  const globalStyle = useGlobalStyle();

  const [entries, setEntries] = useState<schema.Entry[]>([]);

  useEffect(() => {
    const loadWishes = async () => {
      const dbEntries = await database.select().from(schema.entry);

      setEntries(dbEntries);
    };

    loadWishes();
  }, [database]);

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

      <View style={style.list}>
        <FlatList
          data={entries}
          renderItem={({item}) => <WishItem entry={item} />}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <FAB
        style={style.fab}
        icon={'plus'}
        onPress={() => navigation.navigate('NewWish')}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
