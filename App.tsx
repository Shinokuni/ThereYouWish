import React, {useEffect} from 'react';
import Navigation from './navigation/Navigation';
import {openDatabaseSync, SQLiteProvider} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import {DrawerContextProvider} from './contexts/DrawerContext';
import {collection, tag} from './db/schema';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const expo = openDatabaseSync('thereyouwish.db', {
    enableChangeListener: true,
  });
  const db = drizzle(expo);

  const {success, error} = useMigrations(db, migrations);

  useEffect(() => {
    const preloadDb = async () => {
      const count = await db.$count(collection);
      if (count === 0) {
        await db
          .insert(collection)
          .values({name: 'Default collection', current: true});
      }

      const tagCount = await db.$count(tag);
      if (tagCount === 0) {
        await db
          .insert(tag)
          .values([{name: 'Tag 1'}, {name: 'Tag 2'}, {name: 'Tag 3'}]);
      }
    };

    preloadDb();
  });

  return (
    <GestureHandlerRootView>
      <DrawerContextProvider>
        <SQLiteProvider
          databaseName={'thereyouwish.db'}
          options={{enableChangeListener: true}}>
          <Navigation />
        </SQLiteProvider>
      </DrawerContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
