import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  surface: {
    borderRadius: 8,
    marginBottom: 32,
  },
  imageList: {
    margin: 8,
  },
  imageContainer: {
    marginHorizontal: 4,
  },
  image: {
    zIndex: 1,
  },
  imageDelete: {
    zIndex: 2,
    position: 'absolute',
    end: 0,
    bottom: 0,
  },
});

export default style;
