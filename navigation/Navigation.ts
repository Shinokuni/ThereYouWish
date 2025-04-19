import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NewWishScreen from '../screens/NewWish/NewWishScreen';
import {createStaticNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerScreen from '../screens/Drawer/DrawerScreen';

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
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
