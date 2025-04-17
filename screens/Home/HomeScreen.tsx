import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Collection, collection} from '../../db/schema';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';

const HomeScreen = () => {
  const navigation = useNavigation();
  const expo = useSQLiteContext();
  const database = drizzle(expo, {schema});

  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        await database
          .insert(collection)
          .values({name: 'collection 1', description: 'this is a description'});

        const test = await database.select().from(collection);
        console.log(test);
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
    <SafeAreaView>
      <Text>Home Screen!</Text>

      <Button
        title={'New wish'}
        onPress={() => navigation.navigate('NewWish')}
      />

      {collections.length > 0 && <Text>{collections[0].name}</Text>}
    </SafeAreaView>
  );
};

export default HomeScreen;
