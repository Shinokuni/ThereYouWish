import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NewWishScreen from '../screens/NewWish/NewWishScreen';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerScreen from '../screens/Drawer/DrawerScreen';
import ImageViewerScreen from '../screens/ImageViewerScreen/ImageViewerScreen';

const Drawer = createDrawerNavigator({
  screenOptions: {
    header: () => null,
  },
  screens: {
    Home: HomeScreen,
  },
  drawerContent: DrawerScreen,
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Drawer',
  screenOptions: {
    header: () => null,
  },
  screens: {
    Drawer: Drawer,
    NewWish: NewWishScreen,
    ImageViewer: ImageViewerScreen,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
