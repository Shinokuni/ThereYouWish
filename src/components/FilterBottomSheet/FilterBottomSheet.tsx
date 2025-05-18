import React, {forwardRef, useMemo} from 'react';
import {View} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import Icon from '@react-native-vector-icons/material-design-icons';
import {TabsProvider, Tabs, TabScreen} from 'react-native-paper-tabs';

import style from './style';
import {useTranslation} from 'react-i18next';

export enum OrderField {
  name = 'name',
  price = 'price',
  deadline = 'deadline',
  startDate = 'startDate',
}

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum FilterField {
  price = 'price',
  deadline = 'deadline',
  images = 'images',
}

type FilterBottomSheetProps = {
  orderField: OrderField;
  orderType: OrderType;
  filterField: FilterField | null;
  onChangeOrderField: (orderField: OrderField) => void;
  onChangeOrderType: (orderType: OrderType) => void;
  onChangeFilterField: (FilterField: FilterField | null) => void;
};

export type Ref = BottomSheetModal;

const FilterBottomSheet = forwardRef<Ref, FilterBottomSheetProps>(
  (props, ref) => {
    const theme = useTheme();
    const {t} = useTranslation();

    const orderValues = useMemo(
      () =>
        new Map<OrderField, string>([
          [OrderField.name, t('name')],
          [OrderField.price, t('price')],
          [OrderField.deadline, t('deadline')],
          [OrderField.startDate, t('creation_date')],
        ]),
      [t],
    );

    const filterValues = useMemo(
      () =>
        new Map<FilterField, string>([
          [FilterField.price, t('price')],
          [FilterField.deadline, t('deadline')],
          [FilterField.images, t('images')],
        ]),
      [t],
    );

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal handleComponent={null} snapPoints={['50%']} ref={ref}>
          <BottomSheetView
            style={{...style.container, backgroundColor: theme.colors.surface}}>
            <TabsProvider>
              <Tabs>
                <TabScreen label="Order">
                  <View style={style.tabContainer}>
                    {[...orderValues.entries()].map(([key, value]) => {
                      return (
                        <TouchableRipple
                          key={key}
                          onPress={() => props.onChangeOrderField(key)}>
                          <View style={style.item}>
                            {props.orderField === key ? (
                              <Icon
                                name={
                                  props.orderType === OrderType.ASC
                                    ? 'arrow-up'
                                    : 'arrow-down'
                                }
                                size={24}
                                onPress={() => {
                                  const newOrderType =
                                    props.orderType === OrderType.ASC
                                      ? OrderType.DESC
                                      : OrderType.ASC;
                                  props.onChangeOrderType(newOrderType);
                                }}
                              />
                            ) : (
                              <View style={style.emptyIcon} />
                            )}
                            <Text variant="bodyLarge" style={style.text}>
                              {value}
                            </Text>
                          </View>
                        </TouchableRipple>
                      );
                    })}
                  </View>
                </TabScreen>

                <TabScreen label="Filter">
                  <View style={style.tabContainer}>
                    {[...filterValues.entries()].map(([key, value]) => {
                      return (
                        <TouchableRipple
                          key={key}
                          onPress={() =>
                            props.onChangeFilterField(
                              props.filterField === key ? null : key,
                            )
                          }>
                          <View style={style.item}>
                            {props.filterField === key ? (
                              <Icon name={'check'} size={24} />
                            ) : (
                              <View style={style.emptyIcon} />
                            )}

                            <Text variant="bodyLarge" style={style.text}>
                              {value}
                            </Text>
                          </View>
                        </TouchableRipple>
                      );
                    })}
                  </View>
                </TabScreen>
              </Tabs>
            </TabsProvider>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);

export default FilterBottomSheet;
