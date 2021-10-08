import {StyleSheet} from 'react-native';
import {color, font} from '../../../values';

export default StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  leftIndicatorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 16,
  },
  dotIndicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: color.greyLight,
  },
  verticalLine: {
    flex: 1,
    backgroundColor: color.greyLight,
    width: 1,
  },

  middleContainer: {
    flexDirection: 'column',
    flex: 1,
    top: -4,
    paddingBottom: 16,
    marginLeft: 16,
  },
  eventHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventText: {
    fontSize: font.size.normal,
    fontWeight: 'bold',
    color: color.textPrimary,
    marginRight: 2,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 2,
    marginRight: 8,
  },
  eventLocationIcon: {
    fontSize: font.size.smaller,
    color: color.textSecondary,
    marginRight: 4,
  },
  eventLocation: {
    fontSize: font.size.smaller,
    color: color.textPrimary,
    fontStyle: 'italic',
  },
  dateTextContainer: {
    flexDirection: 'row',
  },
  dateTextColumn: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 4,
  },
  dateCaption: {
    fontSize: font.size.smaller,
    color: color.textSecondary,
    marginVertical: 2,
  },
  dateValue: {
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
  timeVale: {
    fontSize: font.size.normal,
    color: color.textPrimary,
  },

  groupText: {
    fontSize: font.size.normal,
    fontWeight: 'bold',
    color: color.textSecondary,
  },
});
