import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Appbar,
  Button,
  HelperText,
  IconButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {drizzle} from 'drizzle-orm/expo-sqlite';
import {useSQLiteContext} from 'expo-sqlite';

import useDrawerContext, {WishState} from '../../contexts/DrawerContext';
import {entry, wish} from '../../db/schema';
import style from './style';
import useGlobalStyle from '../../components/globalStyle';

const NewWishScreen = () => {
  const navigation = useNavigation();
  const drawerContext = useDrawerContext();
  const theme = useTheme();
  const globalStyle = useGlobalStyle();

  const expo = useSQLiteContext();
  const database = drizzle(expo);

  const [title, setTitle] = useState('');
  const [isTitleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const checkFields = () => {
    if (title.length > 0) {
      return true;
    } else {
      setTitleError(true);
      return false;
    }
  };

  const insertWish = async () => {
    const [newWish] = await database
      .insert(wish)
      .values({
        name: title,
        collectionId: drawerContext!!.drawerState.collectionId,
      })
      .returning({id: wish.id});

    await database.insert(entry).values({
      name: title,
      description: description,
      price: parseFloat(price),
      state: WishState.ongoing,
      wishId: newWish.id,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={globalStyle.screenContainer}>
      <Appbar.Header>
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="New wish" />
      </Appbar.Header>

      <ScrollView style={globalStyle.screenSpacing}>
        <Text variant={'labelLarge'} style={style.label}>
          Title*
        </Text>
        <TextInput
          value={title}
          onChangeText={value => {
            setTitle(value);
            setTitleError(false);
          }}
          mode="flat"
          placeholder={'Enter a title...'}
          numberOfLines={1}
          error={isTitleError}
          right={<TextInput.Icon icon="close" onPress={() => setTitle('')} />}
          style={style.baseInput}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          cursorColor={theme.colors.primary}
        />
        <HelperText type="error" visible={isTitleError}>
          Title can't be empty
        </HelperText>

        <Text variant={'labelLarge'} style={style.label}>
          Description
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[style.baseInput, style.descriptionInput]}
          placeholder={'Enter a description...'}
          multiline={true}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          cursorColor={theme.colors.primary}
        />

        <View style={style.priceDateContainer}>
          <View style={style.priceContainer}>
            <Text variant={'labelLarge'} style={style.label}>Price</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder={'Enter a price'}
              keyboardType="numeric"
              numberOfLines={1}
              style={style.baseInput}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
            />
          </View>

          <View style={style.dateContainer}>
            <Text variant={'labelLarge'} style={style.label}>Due date</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder={'Enter a due date'}
              keyboardType="numeric"
              numberOfLines={1}
              style={style.baseInput}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
            />
          </View>
        </View>

        <Surface style={style.tagSurface} mode="flat">
          <IconButton
            mode={'contained-tonal'}
            icon={'tag-plus'}
            size={24}
            onPress={() => {}}
          />
        </Surface>

        <IconButton icon={'image-plus'} size={24} onPress={() => {}} />
      </ScrollView>
      <Button
        mode="contained"
        style={style.validate}
        onPress={async () => {
          if (checkFields()) {
            insertWish();
          }
        }}>
        Validate
      </Button>
    </SafeAreaView>
  );
};

export default NewWishScreen;
