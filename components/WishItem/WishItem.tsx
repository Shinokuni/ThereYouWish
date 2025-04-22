import React from 'react';

import {Entry} from '../../db/schema';
import {Card, Text} from 'react-native-paper';
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
  entry: Entry;
};

const WishItem = ({entry}: WishItemProps) => {
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
    </Card>
  );
};

export default WishItem;
