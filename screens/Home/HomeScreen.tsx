import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar, FAB} from 'react-native-paper';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';

import style from './style';
import WishItem, {FullEntry} from '../../components/WishItem/WishItem';
import useGlobalStyle from '../../components/globalStyle';
import {eq} from 'drizzle-orm';
import {entry, tag, tagJoin} from '../../db/schema';

const HomeScreen = () => {
  const navigation = useNavigation();
  const expo = useSQLiteContext();
  const database = drizzle(expo);
  const globalStyle = useGlobalStyle();

  const [entries, setEntries] = useState<FullEntry[]>([]);

  useEffect(() => {
    const loadWishes = async () => {
      const dbEntries = await database.select().from(entry);

      const fullEntries: FullEntry[] = [];

      for (const dbEntry of dbEntries) {
        const tags = await database
          .select({id: tag.id, name: tag.name})
          .from(tag)
          .innerJoin(tagJoin, eq(tag.id, tagJoin.tagId))
          .where(eq(tagJoin.entryId, dbEntry.id));

        fullEntries.push({entry: dbEntry, tags: tags});
      }

      setEntries(fullEntries);
    };

    loadWishes();
  });

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
          renderItem={({item}) => <WishItem fullEntry={item} />}
          keyExtractor={item => item.entry.id.toString()}
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
