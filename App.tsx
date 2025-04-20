import React, {useEffect} from 'react';
import Navigation from './navigation/Navigation';
import {openDatabaseSync, SQLiteProvider} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import {DrawerContextProvider} from './contexts/DrawerContext';
import {collection} from './db/schema';

const App = () => {
  const expo = openDatabaseSync('thereyouwish.db');
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
    };

    preloadDb();
  });

  return (
    <DrawerContextProvider>
      <SQLiteProvider databaseName={'thereyouwish.db'}>
        <Navigation />
      </SQLiteProvider>
    </DrawerContextProvider>
  );
};

export default App;
