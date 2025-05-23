import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    padding: 16,
    paddingBottom: 4,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    flex: 1,
  },
  description: {
    marginBottom: 8,
  },
  priceContainer: {
    padding: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginStart: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  tag: {
    marginEnd: 8,
    marginBottom: 8,
  },
  imageList: {
    marginBottom: 8,
  },
  image: {
    marginEnd: 8,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  link: {
    margin: 0,
    marginEnd: 4,
  },
  actions: {
    margin: 0,
  },
  leftIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewLessMore: {
    textDecorationLine: 'underline',
    marginTop: -8, // more than a hack than anything else
    marginBottom: 8,
  },
});

export default style;
