import React from 'react';

import {Entry, Tag} from '../../db/schema';
import {Card, Chip, Text} from 'react-native-paper';
import style from './style';
import {View} from 'react-native';
import {getCurrencies, getLocales} from 'react-native-localize';

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
}

const WishItem = ({fullEntry}: WishItemProps) => {
  const entry = fullEntry.entry;
  const tags = fullEntry.tags;

  return (
    <Card style={style.container}>
      <View style={style.header}>
        <Text variant={'headlineSmall'} numberOfLines={1} style={style.name}>
          {entry.name}
        </Text>
        {entry.price !== null && (
          <Text variant={'bodyLarge'} style={style.price}>
            {formatPrice(entry.price)}
          </Text>
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
    </Card>
  );
};

export default WishItem;
