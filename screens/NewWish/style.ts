import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  descriptionInput: {
    minHeight: 125,
    marginBottom: 16,
  },
  baseInput: {
    borderRadius: 8,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    paddingStart: 8,
  },
  label: {
    marginBottom: 4,
  },
  priceDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  priceContainer: {
    flex: 1,
    marginEnd: 16,
  },
  dateContainer: {
    flex: 1,
  },
  priceDateInput: {
    paddingStart: 0,
  },
  linkSurface: {
    marginBottom: 16,
    borderRadius: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: 8,
  },
  hostContainer: {
    flexDirection: 'row',
  },
  host: {
    marginStart: 8,
    textDecorationLine: 'underline',
  },
  tagSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tagMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    marginEnd: 4,
    marginBottom: 8,
  },
  imageSurface: {
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
  validate: {
    //bottom: 32,
    marginHorizontal: 16,
  },
});

export default style;
