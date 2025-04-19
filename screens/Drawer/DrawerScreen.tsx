import React from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View} from 'react-native';

import style from './style';
import { Text } from 'react-native-paper';

const DrawerScreen = () => {
  return (
    <DrawerContentScrollView>
      <DrawerItem label={'On going'} focused={true} onPress={() => {}} />
      <DrawerItem label={'Done'} focused={false} onPress={() => {}} />

      <View style={style.separator} />

      <Text>Collections</Text>

      <View style={style.separator} />

      <Text>Tags</Text>
    </DrawerContentScrollView>
  );
};

export default DrawerScreen;
