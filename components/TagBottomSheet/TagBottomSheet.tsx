import React, {forwardRef, useEffect, useState} from 'react';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  HelperText,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {View} from 'react-native';
import {Tag} from '../../db/schema';
import style from './style';
import Icon from '@react-native-vector-icons/material-design-icons';

type TagBottomSheetProps = {
  tags: Tag[];
  selectedTagIds: number[];
  onSelectTag: (tag: Tag) => void;
  onAddTag: (tagName: string) => void;
};

export type Ref = BottomSheetModal;

const TagBottomSheet = forwardRef<Ref, TagBottomSheetProps>((props, ref) => {
  const [search, setSearch] = useState('');
  const [isTagError, setTagError] = useState(false);
  const theme = useTheme();

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(props.tags);
  }, [props.tags]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal snapPoints={['50%']} ref={ref}>
        <BottomSheetView
          style={{...style.container, backgroundColor: theme.colors.surface}}>
          <View style={style.titleContainer}>
            <Text variant={'headlineSmall'}>Choose tags</Text>
          </View>

          <View style={style.searchContainer}>
            <View
              style={{
                ...style.searchInputContainer,
                backgroundColor: theme.colors.secondaryContainer,
              }}>
              <Icon name={'magnify'} size={24} />
              <BottomSheetTextInput
                multiline={false}
                numberOfLines={1}
                defaultValue={search} // use defaultValue={} instead of value={} because of text flickering
                onChangeText={value => {
                  setTagError(false);
                  setSearch(value);

                  if (value.length > 0) {
                    setTags(
                      props.tags.filter(tag =>
                        tag.name
                          .toLocaleLowerCase()
                          .includes(value.toLowerCase()),
                      ),
                    );
                  } else {
                    setTags(props.tags);
                  }
                }}
                placeholder={'Search or create a tag...'}
                style={{
                  ...style.searchInput,
                  backgroundColor: theme.colors.secondaryContainer,
                }}
              />

              {search.length > 0 && (
                <IconButton
                  icon={'close'}
                  onPress={() => {
                    setSearch('');
                    setTagError(false);
                    setTags(props.tags);
                  }}
                  style={style.iconButton}
                />
              )}
            </View>

            <IconButton
              mode="contained-tonal"
              icon={'tag-plus'}
              disabled={search.length === 0}
              style={style.iconButton}
              onPress={() => {
                // this is a business rule, it should be extracted elsewhere
                if (props.tags.map(value => value.name).includes(search)) {
                  setTagError(true);
                } else {
                  props.onAddTag(search);
                  setSearch('');
                  setTags(props.tags);
                }
              }}
            />
          </View>
          <HelperText type={'error'} visible={isTagError}>
            Tag already exists
          </HelperText>

          {tags.length > 0 ? (
            <BottomSheetFlatList
              ListHeaderComponent={<Text>Tags</Text>}
              data={tags}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return (
                  <TouchableRipple
                    onPress={() => {
                      props.onSelectTag(item);
                    }}>
                    <View style={style.tagContainer}>
                      <View style={style.tagNameContainer}>
                        <Icon
                          name={'tag'}
                          size={16}
                          style={{
                            ...style.tagIcon,
                            color: theme.colors.primary,
                          }}
                        />
                        <Text variant={'bodyLarge'}>{item.name}</Text>
                      </View>

                      {props.selectedTagIds.includes(item.id) && (
                        <Icon
                          name={'check-bold'}
                          size={16}
                          style={{color: theme.colors.primary}}
                        />
                      )}
                    </View>
                  </TouchableRipple>
                );
              }}
            />
          ) : (
            <View style={style.placeholder}>
              <Text variant={'bodyMedium'}>No tag available</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

export default TagBottomSheet;
