import React, {useEffect, useRef, useState} from 'react';
import {Pressable, SafeAreaView, ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Appbar,
  Button,
  Chip,
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
import {entry, Tag, tag, tagJoin, wish} from '../../db/schema';
import style from './style';
import useGlobalStyle from '../../components/globalStyle';
import {getCurrencies, getLocales} from 'react-native-localize';
import DatePicker from 'react-native-date-picker';
import TagBottomSheet from '../../components/TagBottomSheet/TagBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const NewWishScreen = () => {
  const navigation = useNavigation();
  const drawerContext = useDrawerContext();
  const theme = useTheme();
  const globalStyle = useGlobalStyle();

  const expo = useSQLiteContext();
  const database = drizzle(expo);

  const [currency] = getCurrencies();
  const [locale] = getLocales();

  const [title, setTitle] = useState('');
  const [isTitleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  let [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  const loadTags = async () => {
    const newTags = await database.select().from(tag);
    setTags(newTags);
  };

  useEffect(() => {
    loadTags();
  });

  const addNewTag = async (name: string) => {
    await database.insert(tag).values({name: name});
    loadTags();
  };

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

    const [newEntry] = await database
      .insert(entry)
      .values({
        name: title,
        description: description,
        price: parseFloat(price),
        state: WishState.ongoing,
        wishId: newWish.id,
      })
      .returning({id: entry.id});

    await database
      .insert(tagJoin)
      .values(
        selectedTagIds.map(value => ({entryId: newEntry.id, tagId: value})),
      );

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
            <Text variant={'labelLarge'} style={style.label}>
              Price
            </Text>
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
              contentStyle={style.priceDateInput}
              left={
                <TextInput.Icon icon={`currency-${currency.toLowerCase()}`} />
              }
            />
          </View>

          <View style={style.dateContainer}>
            <Text variant={'labelLarge'} style={style.label}>
              Due date
            </Text>
            <Pressable
              onPress={() => {
                setDatePickerOpen(true);
              }}>
              <TextInput
                value={dueDate?.toLocaleDateString(locale.languageCode)}
                editable={false}
                placeholder={'due date'}
                keyboardType="numeric"
                numberOfLines={1}
                style={style.baseInput}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                cursorColor={theme.colors.primary}
                contentStyle={style.priceDateInput}
                left={
                  <TextInput.Icon
                    icon={'calendar-edit'}
                    onPress={() => {
                      setDatePickerOpen(true);
                    }}
                  />
                }
              />
            </Pressable>

            <DatePicker
              modal
              mode="date"
              locale={locale.languageCode}
              open={isDatePickerOpen}
              date={new Date()}
              onConfirm={date => {
                setDatePickerOpen(false);
                setDueDate(date);
              }}
              onCancel={() => {
                setDatePickerOpen(false);
              }}
            />
          </View>
        </View>

        <Pressable
          onPress={() => {
            bottomSheetRef.current?.present();
          }}>
          <Surface style={style.tagSurface} mode="flat">
            <IconButton mode={'contained-tonal'} icon={'tag'} size={24} />

            {selectedTagIds.length === 0 ? (
              <View style={style.tagMessage}>
                <Text >Add tag</Text>
              </View>
            ) : (
              <View style={style.tagList}>
                {selectedTagIds.map(id => {
                  const selectedTag = tags.find(value => value.id === id)!!;

                  return <Chip style={style.tag}>{selectedTag.name}</Chip>;
                })}
              </View>
            )}
          </Surface>
        </Pressable>

        <IconButton icon={'image-plus'} size={24} onPress={() => {}} />
        <IconButton icon={'link-plus'} size={24} onPress={() => {}} />
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

      <TagBottomSheet
        tags={tags}
        ref={bottomSheetRef}
        onAddTag={async tagName => {
          addNewTag(tagName);
        }}
        selectedTagids={selectedTagIds}
        onSelectTag={({id}) => {
          if (selectedTagIds.includes(id)) {
            const index = selectedTagIds.indexOf(id);
            selectedTagIds.splice(index, 1);
          } else {
            selectedTagIds.push(id);
          }

          setSelectedTagIds(selectedTagIds);
        }}
      />
    </SafeAreaView>
  );
};

export default NewWishScreen;
