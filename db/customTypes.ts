import {customType} from 'drizzle-orm/sqlite-core';
import {WishState} from '../contexts/DrawerContext';

export const dateType = customType<{data: Date; driverData: string}>({
  dataType() {
    return 'text';
  },

  fromDriver(value: string): Date {
    return new Date(value);
  },

  toDriver(value: Date): string {
    return value.toISOString();
  },
});

export const wishStateType = customType<{data: WishState; driverData: string}>({
  dataType() {
    return 'text';
  },

  fromDriver(value: string): WishState {
    return (<any>WishState)[value];
  },

  toDriver(value: WishState): string {
    return value.toString();
  },
});
