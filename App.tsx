import React from 'react';
import Navigation from './navigation/Navigation';
import {openDatabaseSync, SQLiteDatabase, SQLiteProvider} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import {DrawerContextProvider} from './contexts/DrawerContext';
import {collection} from './db/schema';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import './i18n/i18n';

const App = () => {
  const expo = openDatabaseSync('thereyouwish.db', {
    enableChangeListener: true,
  });
  const db = drizzle(expo);

  const {success, error} = useMigrations(db, migrations);

  return (
    <GestureHandlerRootView>
      <DrawerContextProvider>
        <SQLiteProvider
          databaseName={'thereyouwish.db'}
          options={{enableChangeListener: true}}
          onInit={initDatabase}>
          <Navigation />
        </SQLiteProvider>
      </DrawerContextProvider>
    </GestureHandlerRootView>
  );
};

async function initDatabase(expo: SQLiteDatabase) {
  const db = drizzle(expo);

  await expo.execAsync('PRAGMA journal_mode = WAL');
  await expo.execAsync('PRAGMA foreign_keys = ON');

  const count = await db.$count(collection);
  if (count === 0) {
    await db
      .insert(collection)
      .values({name: 'Default collection', current: true});
  }
}

export default App;
