import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
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
import Icon from '@react-native-vector-icons/material-design-icons';
import {keepLocalCopy, pick, types} from '@react-native-documents/picker';
import FixedHeightImage from '../../components/FixedHeightImage/FixedHeightImage';

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

  let [links, setLinks] = useState<URL[]>([]);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkError, setIsLinkError] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  let [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  let [images, setImages] = useState<string[]>([]);

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

        <Text variant={'labelLarge'} style={style.label}>
          Links
        </Text>
        <Surface style={style.linkSurface}>
          <View>
            <TextInput
              value={linkValue}
              onChangeText={value => {
                setLinkValue(value);
                setIsLinkError(false);
              }}
              placeholder={'Add link...'}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
              style={style.baseInput}
              left={<TextInput.Icon icon="link-plus" />}
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={() => {
                    if (linkValue.length > 0) {
                      try {
                        links.push(new URL(linkValue));
                        setLinks(links);
                        setLinkValue('');
                      } catch (e) {
                        setIsLinkError(true);
                      }
                    }
                  }}
                />
              }
            />

            {isLinkError && (
              <HelperText type={'error'} visible={isLinkError}>
                Entered value is not a valid URL
              </HelperText>
            )}
          </View>

          {links.length > 0 &&
            links.map(newLink => {
              return (
                <View key={newLink.toString()} style={style.linkItem}>
                  <View style={style.hostContainer}>
                    <Icon name="link" size={24} />
                    <Text
                      variant={'titleMedium'}
                      style={{...style.host, color: theme.colors.primary}}
                      onPress={() => {
                        Linking.openURL(newLink.toString());
                      }}>
                      {newLink.host}
                    </Text>
                  </View>
                  <IconButton
                    icon={'delete'}
                    size={24}
                    onPress={() => {
                      links.splice(links.indexOf(newLink), 1);
                      setLinks(links);
                    }}
                  />
                </View>
              );
            })}
        </Surface>

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
        <Surface style={style.imageSurface}>
          <IconButton
            icon={'image-plus'}
            size={24}
            onPress={async () => {
              try {
                const files = await pick({
                  allowMultiSelection: true,
                  allowVirtualFiles: true, // android only
                  type: [types.images],
                });

                if (files.length === 0) {
                  return;
                }

                const copyResults = await keepLocalCopy({
                  files: [
                    {uri: files[0].uri, fileName: files[0].uri},
                    ...files.slice(1).map(value => ({
                      uri: value.uri,
                      fileName: value.name!!,
                    })),
                  ],
                  destination: 'documentDirectory',
                });

                images = images.concat(
                  copyResults
                    .filter(value => value.status === 'success')
                    .map(value => value.localUri)
                    .filter(
                      value => !images.some(newImage => value === newImage),
                    ),
                );

                setImages(images);
                console.log();
              } catch (err: unknown) {
                // maybe snackbar to inform the user?
                console.log(err);
              }
            }}
          />
          {images.length > 0 && (
            <FlatList
              style={style.imageList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={newImage => newImage}
              data={images}
              renderItem={value => {
                return (
                  <View style={style.imageContainer}>
                    <FixedHeightImage
                      style={style.image}
                      fixedHeight={150}
                      key={value.item}
                      source={{uri: value.item}}
                    />

                    <IconButton
                      mode="contained"
                      icon={'delete'}
                      style={style.imageDelete}
                      onPress={() => {
                        images.splice(images.indexOf(value.item), 1);
                        setImages(images);
                      }}
                    />
                  </View>
                );
              }}
            />
          )}
        </Surface>

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
