import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  surface: {
    marginBottom: 16,
    borderRadius: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: 8,
  },
  baseInput: {
    borderRadius: 8,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    paddingStart: 8,
  },
  hostContainer: {
    flexDirection: 'row',
  },
  host: {
    marginStart: 8,
    textDecorationLine: 'underline',
  },
});

export default style;
