import React from 'react';

import {Entry, Image, Link, Tag, Wish} from '../../db/schema';
import {Card, Chip, IconButton, Text, useTheme} from 'react-native-paper';
import style from './style';
import {FlatList, Linking, View} from 'react-native';
import {getCurrencies, getLocales} from 'react-native-localize';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import FixedHeightImage from '../FixedHeightImage/FixedHeightImage';

const formatPrice = (price: number) => {
  const [locale] = getLocales();
  const [currency] = getCurrencies();
  return price.toLocaleString(locale.languageCode, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

type WishItemProps = {
  fullWish: FullWish;
  onDeleteWish: () => void;
};

export interface FullWish {
  wish: Wish;
  entries: FullEntry[];
}

export interface FullEntry {
  entry: Entry;
  tags: Tag[];
  links: Link[];
  images: Image[];
}

const WishItem = ({fullWish, onDeleteWish}: WishItemProps) => {
  const [fullEntry] = fullWish.entries;
  const tags = fullEntry.tags;
  const links = fullEntry.links;
  const images = fullEntry.images;
  const entry = fullEntry.entry;

  const theme = useTheme();

  return (
    <Card style={{...style.container}}>
      <View style={style.header}>
        <Text variant={'headlineSmall'} numberOfLines={1} style={style.name}>
          {entry.name}
        </Text>
        {entry.price && (
          <View
            style={{
              ...style.priceContainer,
              backgroundColor: theme.colors.primaryContainer,
            }}>
            <Text
              variant={'bodyLarge'}
              style={{color: theme.colors.onPrimaryContainer}}>
              {formatPrice(entry.price)}
            </Text>
          </View>
        )}
      </View>
      {entry.description && (
        <Text variant={'bodyLarge'} style={style.description}>
          {entry.description}
        </Text>
      )}

      {tags.length > 0 && (
        <View style={style.tagContainer}>
          {tags.map(tag => {
            return (
              <Chip key={tag.id} style={style.tag}>
                {tag.name}
              </Chip>
            );
          })}
        </View>
      )}

      {images.length > 0 && (
        <FlatList
          style={style.imageList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={newImage => newImage.id.toString()}
          data={images}
          renderItem={({item}) => {
            return (
              <FixedHeightImage
                fixedHeight={150}
                key={item.id}
                source={{uri: item.url}}
                style={style.image}
              />
            );
          }}
        />
      )}

      <View style={style.iconContainer}>
        {links.length > 0 &&
          (links.length === 1 ? (
            <IconButton
              icon={'open-in-new'}
              style={style.link}
              onPress={() => {
                Linking.openURL(links[0].url);
              }}
            />
          ) : (
            <DropdownMenu
              actions={links.map(value => ({
                name: new URL(value.url).host,
                onClick: () => {
                  Linking.openURL(value.url);
                },
              }))}
              icon={'open-in-new'}
              style={style.link}
            />
          ))}
        <DropdownMenu
          actions={[
            {
              name: 'Edit',
              onClick: () => {},
            },
            {
              name: 'Delete',
              onClick: () => {
                onDeleteWish();
              },
            },
          ]}
          style={style.actions}
        />
      </View>
    </Card>
  );
};

export default WishItem;
