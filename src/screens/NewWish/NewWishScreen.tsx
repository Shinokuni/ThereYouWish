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
  Snackbar,
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
import {useTranslation} from 'react-i18next';
import AlertDialog from '../../components/AlertDialog/AlertDialog';

type NewWishScreenProps = StaticScreenProps<{
  fullWish?: FullWish;
}>;

const NewWishScreen = ({route}: NewWishScreenProps) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const globalStyle = useGlobalStyle();
  const {t} = useTranslation();

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
        <Appbar.Content title={t('new_wish')} />
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
            {t('title')}
          </Text>
          <TextInput
            value={viewModel.title}
            onChangeText={value => {
              viewModel.setTitle(value);
              viewModel.setTitleError(false);
            }}
            mode="flat"
            placeholder={t('enter_title')}
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
            {t('title_cant_be_empty')}
          </HelperText>

          <Text variant={'labelLarge'} style={style.label}>
            {t('description')}
          </Text>
          <TextInput
            ref={descriptionRef}
            value={viewModel.description}
            onChangeText={viewModel.setDescription}
            style={[style.baseInput, style.descriptionInput]}
            placeholder={t('enter_description')}
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
                {t('price')}
              </Text>
              <TextInput
                ref={priceRef}
                value={viewModel.price}
                onChangeText={viewModel.setPrice}
                placeholder={t('enter_a_price')}
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
                {t('deadline')}
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
                  placeholder={t('deadline')}
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
            {t('links')}
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
            {t('tags')}
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
                  <Text>{t('add_tag')}</Text>
                </View>
              )}
            </Surface>
          </Pressable>

          <Text variant={'labelLarge'} style={style.label}>
            {t('images')}
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
                  if (await viewModel.insertWish()) {
                    navigation.goBack();
                  }
                }
              }
            }}>
            {route.params.fullWish ? t('update') : t('validate')}
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
        title={t('generate_infos_link')}
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
        title={t('analyzing_content')}
        visible={viewModel.isLoadingDialogVisible}
      />

      <Snackbar
        visible={viewModel.isErrorSnackBarVisible}
        onDismiss={() => viewModel.setErrorSnackBarVisible(false)}>
        {t('error_occured_link')}
      </Snackbar>

      <AlertDialog
        title={t('no_collection')}
        text={t('create_new_collection')}
        visible={viewModel.isNoCollectionDialogVisible}
        onDismiss={() => {
          viewModel.setNoCollectionDialogVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default NewWishScreen;
