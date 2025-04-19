import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar, FAB} from 'react-native-paper';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {DrawerActions} from '@react-navigation/native';

import {Collection, collection} from '../../db/schema';
import * as schema from '../../db/schema';
import style from './style';

const HomeScreen = () => {
  const navigation = useNavigation();
  const expo = useSQLiteContext();
  const database = drizzle(expo, {schema});

  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        /* await database
          .insert(collection)
          .values({name: 'collection 1', description: 'this is a description'}); */

        const test = await database.select().from(collection);
        setCollections(test);
      } catch (error) {
        console.log(error);
      }
    };

    load()
      .then(() => {
        console.log('promise end');
      })
      .catch(() => {
        console.log('promise error');
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.openDrawer();
          }}
        />
        <Appbar.Content title="Wishes" />
      </Appbar.Header>

      <FAB
        style={style.fab}
        icon={'plus'}
        onPress={() => navigation.navigate('NewWish')}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
