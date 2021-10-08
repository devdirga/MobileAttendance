import {StyleSheet} from 'react-native';
import {color, font} from '../../../values';

export default StyleSheet.create({
  mainWrapper: {
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'column',
  },
  inputContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 18,
  },

  eventText: {
    fontSize: font.size.normal,
    fontWeight: 'bold',
    color: color.textPrimary,
    marginVertical: 2,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  eventLocationIcon: {
    fontSize: font.size.smaller,
    color: color.textSecondary,
    marginRight: 4,
  },
  eventLocation: {
    fontSize: font.size.normal,
    color: color.textPrimary,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  columnContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  columnContainerWithoutFlex: {
    flexDirection: 'column',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  textCaption: {
    fontSize: font.size.smaller,
    color: color.textSecondary,
    marginVertical: 2,
  },
  textValue: {
    fontSize: font.size.normal,
    color: color.textPrimary,
    marginVertical: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: font.size.smaller,
    color: color.textSecondary,
    marginRight: 4,
  },
  timeValue: {
    fontSize: font.size.normal,
    color: color.textPrimary,
  },

  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
});
