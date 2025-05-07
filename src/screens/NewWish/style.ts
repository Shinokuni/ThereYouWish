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
    flexShrink: 1,
    alignItems: 'center',
  },
  tag: {
    marginEnd: 4,
    marginBottom: 8,
  },
  validate: {
    marginHorizontal: 16,
  },
});

export default style;
