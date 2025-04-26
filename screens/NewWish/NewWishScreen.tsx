import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
} from 'react-native';
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
import {entry, image, link, Tag, tag, tagJoin, wish} from '../../db/schema';
import style from './style';
import useGlobalStyle from '../../components/globalStyle';
import {getCurrencies, getLocales} from 'react-native-localize';
import DatePicker from 'react-native-date-picker';
import TagBottomSheet from '../../components/TagBottomSheet/TagBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import WishLinks from '../../components/WishLinks/WishLinks';
import WishImages from '../../components/WishImages/WishImages';

const NewWishScreen = () => {
  const navigation = useNavigation();
  const drawerContext = useDrawerContext();
  const theme = useTheme();
  const globalStyle = useGlobalStyle();

  const expo = useSQLiteContext();
  const database = useMemo(() => drizzle(expo), [expo]);

  const [currency] = useMemo(() => getCurrencies(), []);
  const [locale] = useMemo(() => getLocales(), []);

  const [title, setTitle] = useState('');
  const [isTitleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [links, setLinks] = useState<URL[]>([]);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkError, setIsLinkError] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [images, setImages] = useState<string[]>([]);

  const descriptionRef = useRef<RNTextInput>(null);
  const priceRef = useRef<RNTextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  const loadTags = useCallback(async () => {
    const newTags = await database.select().from(tag);
    setTags(newTags);
  }, [database, setTags]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

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

    await database
      .insert(link)
      .values(
        links.map(newLink => ({url: newLink.toString(), entryId: newEntry.id})),
      );

    await database
      .insert(image)
      .values(images.map(newImage => ({url: newImage, entryId: newEntry.id})));

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

      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          style={{...globalStyle.screenSpacing}}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}>
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
            right={
              title.length > 0 ? (
                <TextInput.Icon icon="close" onPress={() => setTitle('')} />
              ) : (
                <View />
              )
            }
            style={style.baseInput}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            cursorColor={theme.colors.primary}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              descriptionRef.current?.focus();
            }}
          />
          <HelperText type="error" visible={isTitleError}>
            Title can't be empty
          </HelperText>

          <Text variant={'labelLarge'} style={style.label}>
            Description
          </Text>
          <TextInput
            ref={descriptionRef}
            value={description}
            onChangeText={setDescription}
            style={[style.baseInput, style.descriptionInput]}
            placeholder={'Enter a description...'}
            multiline={true}
            numberOfLines={5}
            right={
              description.length > 0 ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => setDescription('')}
                />
              ) : (
                <View />
              )
            }
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            cursorColor={theme.colors.primary}
            returnKeyType="next"
            blurOnSubmit={true}
            onSubmitEditing={() => {
              priceRef.current?.focus();
            }}
          />

          <View style={style.priceDateContainer}>
            <View style={style.priceContainer}>
              <Text variant={'labelLarge'} style={style.label}>
                Price
              </Text>
              <TextInput
                ref={priceRef}
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
                returnKeyType="next"
              />
            </View>

            <View style={style.dateContainer}>
              <Text variant={'labelLarge'} style={style.label}>
                Deadline
              </Text>
              <Pressable
                onPress={() => {
                  setDatePickerOpen(true);
                }}>
                <TextInput
                  value={dueDate?.toLocaleDateString(locale.languageCode)}
                  editable={false}
                  placeholder={'Deadline'}
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

          <Text variant={'labelLarge'} style={style.label}>
            Links
          </Text>
          <WishLinks
            links={links}
            linkValue={linkValue}
            onLinkValueChange={value => {
              setLinkValue(value);
              setIsLinkError(false);
            }}
            onAddLink={value => {
              if (value.length > 0) {
                try {
                  setLinks([...links, new URL(value)]);
                  setLinkValue('');
                } catch (e) {
                  setIsLinkError(true);
                }
              }
            }}
            onRemoveLink={value => {
              setLinks(links.filter(currentValue => currentValue !== value));
            }}
            isLinkError={isLinkError}
          />

          <Text variant={'labelLarge'} style={style.label}>
            Tags
          </Text>
          <Pressable
            onPress={() => {
              bottomSheetRef.current?.present();
            }}>
            <Surface style={style.tagSurface} mode="flat">
              <IconButton mode={'contained-tonal'} icon={'tag'} size={24} />

              {selectedTagIds.length === 0 ? (
                <View style={style.tagMessage}>
                  <Text>Add tag</Text>
                </View>
              ) : (
                <View style={style.tagList}>
                  {selectedTagIds.map(id => {
                    const selectedTag = tags.find(value => value.id === id)!!;

                    return (
                      <Chip key={id} style={style.tag}>
                        {selectedTag.name}
                      </Chip>
                    );
                  })}
                </View>
              )}
            </Surface>
          </Pressable>

          <Text variant={'labelLarge'} style={style.label}>
            Images
          </Text>
          <WishImages
            images={images}
            onAddImages={values => {
              const filteredValues = values.filter(
                value => !images.some(newImage => value === newImage),
              );
              setImages(images.concat(filteredValues));
            }}
            onRemoveImage={value => {
              setImages(
                images.filter(filteredValue => filteredValue !== value),
              );
            }}
          />

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
        </ScrollView>
      </KeyboardAvoidingView>

      <TagBottomSheet
        tags={tags}
        ref={bottomSheetRef}
        onAddTag={async tagName => {
          addNewTag(tagName);
        }}
        selectedTagIds={selectedTagIds}
        onSelectTag={({id}) => {
          if (selectedTagIds.includes(id)) {
            setSelectedTagIds(
              selectedTagIds.filter(currentId => currentId !== id),
            );
          } else {
            setSelectedTagIds([...selectedTagIds, id]);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default NewWishScreen;
