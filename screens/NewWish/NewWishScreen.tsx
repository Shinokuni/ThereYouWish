import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {Appbar} from 'react-native-paper';

const NewWishScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
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
