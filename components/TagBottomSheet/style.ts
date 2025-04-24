import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    paddingTop: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingEnd: 8,
  },
  tagNameContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon: {
    marginEnd: 8,
  },
});

export default style;
