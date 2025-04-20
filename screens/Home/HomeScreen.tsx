import React, {} from 'react';
import {SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar, FAB, useTheme} from 'react-native-paper';
import {useSQLiteContext} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';

import * as schema from '../../db/schema';
import style from './style';

const HomeScreen = () => {
  const navigation = useNavigation();
  const expo = useSQLiteContext();
  const database = drizzle(expo, {schema});
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
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
