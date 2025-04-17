import React from 'react';
import Navigation from './navigation/Navigation';
import {openDatabaseSync, SQLiteProvider} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

function App(): React.JSX.Element {
  const expo = openDatabaseSync('thereyouwish.db');
  const db = drizzle(expo);

  const {success, error} = useMigrations(db, migrations);

  return (
    <SQLiteProvider databaseName={'thereyouwish.db'}>
      <Navigation />
    </SQLiteProvider>
  );
}

export default App;
