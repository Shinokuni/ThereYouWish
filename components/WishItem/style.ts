import {StyleSheet} from 'react-native';

const useStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
  },
  price: {
    marginStart: 8,
  },
});

export default useStyle;
