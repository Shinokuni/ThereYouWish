import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';

const NewWishScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Appbar.Header>
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="New wish" />
      </Appbar.Header>
    </SafeAreaView>
  );
};

export default NewWishScreen;
