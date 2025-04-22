import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

const useGlobalStyle = () => {
  const theme = useTheme();

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    screenSpacing: {
      margin: 16,
    },
  });
};

export default useGlobalStyle;
