import React from 'react';
import {AppRegistry} from 'react-native';
import {PaperProvider} from 'react-native-paper';

import App from './App';
import {name as appName} from './app.json';
import Icon from '@react-native-vector-icons/material-design-icons';

const TYWIcon = props => {
  return <Icon {...props} />;
};

export default function Main() {
  return (
    <PaperProvider
      settings={{
        icon: props => TYWIcon(props),
      }}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
