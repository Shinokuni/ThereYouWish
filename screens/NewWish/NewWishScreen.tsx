import React, {useMemo, useRef} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {StaticScreenProps, useNavigation} from '@react-navigation/native';
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

import style from './style';
import useGlobalStyle from '../../components/globalStyle';
import {getCurrencies, getLocales} from 'react-native-localize';
import DatePicker from 'react-native-date-picker';
import TagBottomSheet from '../../components/TagBottomSheet/TagBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import WishLinks from '../../components/WishLinks/WishLinks';
import WishImages from '../../components/WishImages/WishImages';
import useNewWishViewModel from './NewWishViewModel';
import TextInputDialog from '../../components/TextInputDialog/TextInputDialog';
import {FullWish} from '../../components/WishItem/WishItem';
import LoadingDialog from '../../components/LoadingDialog/LoadingDialog';

type NewWishScreenProps = StaticScreenProps<{
  fullWish?: FullWish;
}>;

const NewWishScreen = ({route}: NewWishScreenProps) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const globalStyle = useGlobalStyle();

  const viewModel = useNewWishViewModel({
    fullWish: route.params ? route.params.fullWish : undefined,
  });

  const [currency] = useMemo(() => getCurrencies(), []);
  const [locale] = useMemo(() => getLocales(), []);

  const descriptionRef = useRef<RNTextInput>(null);
  const priceRef = useRef<RNTextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

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
        <Appbar.Action
          icon={'link-plus'}
          onPress={() => {
            viewModel.setLinkDialogVisible(true);
          }}
        />
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
            value={viewModel.title}
            onChangeText={value => {
              viewModel.setTitle(value);
              viewModel.setTitleError(false);
            }}
            mode="flat"
            placeholder={'Enter a title...'}
            numberOfLines={1}
            error={viewModel.isTitleError}
            right={
              viewModel.title.length > 0 ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => viewModel.setTitle('')}
                />
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
          <HelperText type="error" visible={viewModel.isTitleError}>
            Title can't be empty
          </HelperText>

          <Text variant={'labelLarge'} style={style.label}>
            Description
          </Text>
          <TextInput
            ref={descriptionRef}
            value={viewModel.description}
            onChangeText={viewModel.setDescription}
            style={[style.baseInput, style.descriptionInput]}
            placeholder={'Enter a description...'}
            multiline={true}
            numberOfLines={5}
            right={
              viewModel.description.length > 0 ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => viewModel.setDescription('')}
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
                value={viewModel.price}
                onChangeText={viewModel.setPrice}
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
                  viewModel.setDatePickerOpen(true);
                }}>
                <TextInput
                  value={viewModel.deadline?.toLocaleDateString(
                    locale.languageCode,
                  )}
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
                        viewModel.setDatePickerOpen(true);
                      }}
                    />
                  }
                />
              </Pressable>

              <DatePicker
                modal
                mode="date"
                locale={locale.languageCode}
                open={viewModel.isDatePickerOpen}
                date={new Date()}
                onConfirm={date => {
                  viewModel.setDatePickerOpen(false);
                  viewModel.setDeadline(date);
                }}
                onCancel={() => {
                  viewModel.setDatePickerOpen(false);
                }}
              />
            </View>
          </View>

          <Text variant={'labelLarge'} style={style.label}>
            Links
          </Text>
          <WishLinks
            links={viewModel.links}
            linkValue={viewModel.linkValue}
            onLinkValueChange={value => {
              viewModel.setLinkValue(value);
              viewModel.setIsLinkError(false);
            }}
            onAddLink={value => {
              if (value.length > 0) {
                try {
                  viewModel.setLinks([...viewModel.links, new URL(value)]);
                  viewModel.setLinkValue('');
                } catch (e) {
                  viewModel.setIsLinkError(true);
                }
              }
            }}
            onRemoveLink={value => {
              viewModel.setLinks(
                viewModel.links.filter(currentValue => currentValue !== value),
              );
            }}
            isLinkError={viewModel.isLinkError}
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

              {viewModel.selectedTagIds.length > 0 &&
              viewModel.tags.length > 0 ? (
                <View style={style.tagList}>
                  {viewModel.selectedTagIds.map(id => {
                    const selectedTag = viewModel.tags.find(
                      value => value.id === id,
                    )!!;

                    return (
                      <Chip key={id} style={style.tag}>
                        {selectedTag.name}
                      </Chip>
                    );
                  })}
                </View>
              ) : (
                <View style={style.tagMessage}>
                  <Text>Add tag</Text>
                </View>
              )}
            </Surface>
          </Pressable>

          <Text variant={'labelLarge'} style={style.label}>
            Images
          </Text>
          <WishImages
            images={viewModel.images}
            onAddImages={values => {
              const filteredValues = values.filter(
                value => !viewModel.images.some(newImage => value === newImage),
              );
              viewModel.setImages(viewModel.images.concat(filteredValues));
            }}
            onRemoveImage={value => {
              viewModel.setImages(
                viewModel.images.filter(
                  filteredValue => filteredValue !== value,
                ),
              );
            }}
          />

          <Button
            mode="contained"
            style={style.validate}
            onPress={async () => {
              if (viewModel.checkFields()) {
                if (route.params.fullWish) {
                  await viewModel.updateWish();
                  navigation.popTo('Drawer', {
                    screen: 'Home',
                    params: {refreshWishes: true},
                  });
                } else {
                  await viewModel.insertWish();
                  navigation.goBack();
                }
              }
            }}>
            {route.params.fullWish ? 'Update' : 'Validate'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <TagBottomSheet
        tags={viewModel.tags}
        ref={bottomSheetRef}
        onAddTag={async tagName => {
          viewModel.addNewTag(tagName);
        }}
        selectedTagIds={viewModel.selectedTagIds}
        onSelectTag={({id}) => {
          if (viewModel.selectedTagIds.includes(id)) {
            viewModel.setSelectedTagIds(
              viewModel.selectedTagIds.filter(currentId => currentId !== id),
            );
          } else {
            viewModel.setSelectedTagIds([...viewModel.selectedTagIds, id]);
          }
        }}
      />

      <TextInputDialog
        title={'Generate infos from link'}
        value={viewModel.linkDialogValue}
        visible={viewModel.isLinkDialogVisible}
        onValueChange={viewModel.setLinkDialogValue}
        onValidate={async () => {
          viewModel.setLinkDialogVisible(false);
          await viewModel.parseLink(viewModel.linkDialogValue);
          viewModel.setLinkDialogValue('');
        }}
        onDismiss={() => {
          viewModel.setLinkDialogVisible(false);
          viewModel.setLinkDialogValue('');
        }}
      />

      <LoadingDialog
        title={'Analyzing content'}
        visible={viewModel.isLoadingDialogVisible}
      />
    </SafeAreaView>
  );
};

export default NewWishScreen;
