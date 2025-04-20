import React from 'react';
import Navigation from './navigation/Navigation';
import {openDatabaseSync, SQLiteProvider} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import {DrawerContextProvider} from './contexts/DrawerContext';

function App(): React.JSX.Element {
  const expo = openDatabaseSync('thereyouwish.db');
  const db = drizzle(expo);

  const {success, error} = useMigrations(db, migrations);

  return (
    <DrawerContextProvider>
      <SQLiteProvider databaseName={'thereyouwish.db'}>
        <Navigation />
      </SQLiteProvider>
    </DrawerContextProvider>
  );
}

export default App;
