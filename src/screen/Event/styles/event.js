import {StyleSheet} from 'react-native';
import {color, font} from '../../../values';

export default StyleSheet.create({
  mainWrapper: {
    backgroundColor: color.bgWindow,
    flex: 1,
  },
  //#region filter
  filterPanel: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  filterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderColor: color.materialBaseColor,
    borderWidth: 1,
  },
  filterInputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterInputIcon: {
    color: color.textSecondary,
    fontSize: font.size.normal,
  },
  filterInput: {
    fontSize: font.size.normal,
    color: color.textPrimary,
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  filterAdvanceContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,.2)',
    zIndex: 2,
  },
  filterAdvanceContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    paddingTop: 0,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  filterRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterColumnLeftContainer: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 4,
  },
  filterColumnRightContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 4,
  },
  filterFooterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filterFooterActionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  filterFooterActionText: {
    color: color.accent,
    fontSize: font.size.normal,
    fontWeight: 'bold',
  },
  filterDismissableArea: {
    flex: 1,
  },
  //#endregion

  //#region content
  content: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    flex: 1,
  },

  noDataContainer: {
    flex: 1,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontWeight: '700',
    fontSize: font.size.normal,
    color: color.textSecondary,
  },
  loadingMoreContainer: {
    justifyContent: 'flex-end',
    ...StyleSheet.absoluteFill,
    // zIndex: 1,
  },
  loadingMoreContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  loadingMoreText: {
    fontSize: font.size.normal,
    color: color.textSecondary,
    marginLeft: 8,
  },
  loadingIndicator: {
    paddingTop: 16,
    paddingBottom: 32,
  },

  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.accent,
  },
  addButtonIcon: {
    fontSize: 24,
    color: color.textLight,
  },
  //#endregion
});
