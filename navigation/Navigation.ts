import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NewWishScreen from '../screens/NewWish/NewWishScreen';
import {createStaticNavigation} from '@react-navigation/native';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    header: () => null,
  },
  screens: {
    Home: HomeScreen,
    NewWish: NewWishScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
