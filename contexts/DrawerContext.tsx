import React, {useContext} from 'react';
import {createContext, useState} from 'react';

export enum WishState {
  ongoing = 'ongoing',
  done = 'done',
  all = 'all',
}

export interface DrawerState {
  wishState: WishState;
  collectionId: number;
  tagId?: number;
}

export type DrawerStateContextType = {
  drawerState: DrawerState;
  setState: (state: DrawerState) => void;
};

const DrawerContext = createContext<DrawerStateContextType | null>(null);

const DrawerContextProvider = ({children}: any) => {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    wishState: WishState.all,
    collectionId: -1,
  });

  return (
    <DrawerContext.Provider
      value={{drawerState: drawerState, setState: setDrawerState}}>
      {children}
    </DrawerContext.Provider>
  );
};

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  return context;
};

export {DrawerContextProvider};

export default useDrawerContext;
