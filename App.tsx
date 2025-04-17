import React from 'react';
import Navigation from './navigation/Navigation';
import {openDatabaseSync} from 'expo-sqlite';
import {drizzle} from 'drizzle-orm/expo-sqlite';

function App(): React.JSX.Element {
  const expo = openDatabaseSync('thereyouwish.db');
  const db = drizzle(expo);

  return <Navigation />;
}

export default App;
