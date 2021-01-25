import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  form_single: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  single_iup: {
    position: 'relative',
    flex: 1,
  },
  item_error: {
    position: 'absolute',
    right: 30,
    bottom: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 13,
    color: '#d53d3f',
  },
});
