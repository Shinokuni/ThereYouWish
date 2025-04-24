import React from 'react';

import {Entry, Link, Tag} from '../../db/schema';
import {Card, Chip, IconButton, Text, useTheme} from 'react-native-paper';
import style from './style';
import {Linking, View} from 'react-native';
import {getCurrencies, getLocales} from 'react-native-localize';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

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
  fullEntry: FullEntry;
};

export interface FullEntry {
  entry: Entry;
  tags: Tag[];
  links: Link[];
}

const WishItem = ({fullEntry}: WishItemProps) => {
  const entry = fullEntry.entry;
  const tags = fullEntry.tags;
  const links = fullEntry.links;

  const theme = useTheme();

  return (
    <Card style={{...style.container, paddingBottom: 0}}>
      <View style={style.header}>
        <Text variant={'headlineSmall'} numberOfLines={1} style={style.name}>
          {entry.name}
        </Text>
        {entry.price !== null && (
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
      {entry.description !== null && (
        <Text variant={'bodyMedium'} numberOfLines={3}>
          {entry.description}
        </Text>
      )}

      <View style={style.tagContainer}>
        {tags.length > 0 &&
          tags.map(tag => {
            return (
              <Chip key={tag.id} style={style.tag}>
                {tag.name}
              </Chip>
            );
          })}
      </View>

      <View style={style.iconContainer}>
        {links.length > 0 &&
          (links.length === 1 ? (
            <IconButton
              icon={'open-in-new'}
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
              onClick: () => {},
            },
          ]}
        />
      </View>
    </Card>
  );
};

export default WishItem;
