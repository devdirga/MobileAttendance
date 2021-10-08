import {StyleSheet} from 'react-native';
import {color, font} from '../../values';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  callAction: {
    flexShrink: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationLabel: {
    fontWeight: '700',
  },
  otherLocationContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
    alignSelf: 'flex-end',
  },
  otherLocationLabel: {
    color: color.urlColor,
    alignSelf: 'flex-end',
  },
  locationPanel: {
    backgroundColor: '#f6f7f9',
    borderColor: '#f2f2f2',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDetail: {
    paddingLeft: 10,
    flex: 1,
  },
  locationDetailChangeText: {
    paddingLeft: 10,
    color: color.urlColor,
  },
  center: {
    justifyContent: 'center',
    backgroundColor: color.bgWindow,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 12,
    margin: 16,
  },
  innerCenter: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerChooser: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderBottomColor: color.greyLight,
    borderBottomWidth: 1,
  },
  hederText: {
    fontSize: font.size.bigger,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    top: 0,
    backgroundColor: '#000000' + '7f',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationListWrapper: {},
  locationListContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: color.greyLight,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  locationListText: {
    flex: 1,
    fontSize: font.size.normal,
    color: color.textPrimary,
  },
  takenPhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  takenPhoto: {
    flex: 1,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,

    resizeMode: 'center',
  },
  line: {
    backgroundColor: color.greyLight,
    height: 1,
  },
  bottomPhotoContainer: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 42,
  },
  retakePhoto: {
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    alignItems: 'center',
  },
  closeTakePhoto: {
    position: 'absolute',
    backgroundColor: '#00000070',
    height: 36,
    width: 36,
    borderRadius: 18,
    top: 16,
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
