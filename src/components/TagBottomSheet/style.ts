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
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginEnd: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
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
  placeholder: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconButton: {
    margin: 0,
  },
});

export default style;
