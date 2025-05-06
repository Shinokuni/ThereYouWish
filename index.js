import React, {Suspense} from 'react';
import {AppRegistry, useColorScheme} from 'react-native';
import {MD3DarkTheme, PaperProvider} from 'react-native-paper';

import App from './App';
import {name as appName} from './app.json';
import Icon from '@react-native-vector-icons/material-design-icons';
import {MD3LightTheme} from 'react-native-paper';
import LightTheme from './util/theme/light_theme.json';
import DarkTheme from './util/theme/dark_theme.json';

const lightTheme = {
  ...MD3LightTheme,
  colors: LightTheme.colors,
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: DarkTheme.colors,
};

const TYWIcon = props => {
  return <Icon {...props} />;
};

export default function Main() {
  return (
    <PaperProvider
      theme={useColorScheme() === 'light' ? lightTheme : darkTheme}
      settings={{
        icon: props => TYWIcon(props),
      }}>
      <Suspense>
        <App />
      </Suspense>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
