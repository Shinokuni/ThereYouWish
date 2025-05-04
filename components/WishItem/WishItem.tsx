import React from 'react';
import {FlatList, Linking, Share, View} from 'react-native';
import {Card, Chip, IconButton, Text, useTheme} from 'react-native-paper';
import {getCurrencies, getLocales} from 'react-native-localize';
import Icon from '@react-native-vector-icons/material-design-icons';

import {Entry, Image, Link, Tag, Wish} from '../../db/schema';
import style from './style';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import FixedHeightImage from '../FixedHeightImage/FixedHeightImage';
import {WishState} from '../../contexts/DrawerContext';

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
  onEditWish: () => void;
  onDeleteWish: () => void;
  onUpdateWishState: () => void;
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

const WishItem = ({
  fullWish,
  onEditWish,
  onDeleteWish,
  onUpdateWishState,
}: WishItemProps) => {
  const [fullEntry] = fullWish.entries;
  const tags = fullEntry.tags;
  const links = fullEntry.links;
  const images = fullEntry.images;
  const entry = fullEntry.entry;

  const theme = useTheme();

  return (
    <Card style={{...style.container}}>
      <View style={style.header}>
        <Text variant={'headlineSmall'} numberOfLines={2} style={style.name}>
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
        {entry.deadline && (
          <View style={style.leftIconContainer}>
            <Icon name={'timer-sand'} size={16} style={style.link} />
            <Text variant={'bodyMedium'}>
              {entry.deadline.toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={style.rightIconContainer}>
          <IconButton
            icon={
              fullWish.wish.state === WishState.ongoing ? 'check' : 'refresh'
            }
            style={style.actions}
            onPress={() => {
              onUpdateWishState();
            }}
          />
          {links.length > 0 &&
            (links.length === 1 ? (
              <IconButton
                icon={'open-in-new'}
                style={style.link}
                onPress={() => {
                  Linking.openURL(links[0].url.toString());
                }}
              />
            ) : (
              <DropdownMenu
                actions={links.map(value => ({
                  name: value.url.host,
                  onClick: () => {
                    Linking.openURL(value.url.toString());
                  },
                }))}
                icon={'open-in-new'}
                style={style.actions}
              />
            ))}

          <IconButton
            icon={'share-variant'}
            style={style.actions}
            onPress={() => {
              Share.share({
                message: `${entry.name}${
                  entry.price ? ' - ' + formatPrice(entry.price) : ''
                }\n${links.length > 0 ? links[0].url : ''}`,
              });
            }}
          />
          <DropdownMenu
            actions={[
              {
                name: 'Edit',
                onClick: () => {
                  onEditWish();
                },
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
      </View>
    </Card>
  );
};

export default WishItem;
