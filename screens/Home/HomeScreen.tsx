import React from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Home Screen!</Text>

      <Button title={'New wish'} onPress={() => navigation.navigate('NewWish')} />
    </SafeAreaView>
  );
};

export default HomeScreen;
