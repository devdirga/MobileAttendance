import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles/history';

import { color } from '../../values';

import DatePicker from '../../components/DatePicker';
import SinglePicker from '../../components/SinglePicker';
import TextFieldWithoutInput from '../../components/TextField/TextFieldWithoutInput';
import ActivityList from './ActivityList';

import {
  activity as activityDummy,
  location as locationDummy,
} from '../../store/dummy';

import { activityGetList } from '../../store/action/activity';

import { userGetLocationList } from '../../store/action/user';
import { Helper } from '../../common';

const LIMIT = 20;
const DELAY = 750;
let timerSearch;

const HistoryLayout = ({
  activity,
  user,

  activityGetList,
  userGetLocationList,

  navigation,
}) => {
  const [filter, setFilter] = useState({
    search: '',
    location: {},
    startDate: '',
    endDate: '',
  });
  const [oldFilter, setOldFilter] = useState({
    location: {},
    startDate: '',
    endDate: '',
  });
  const [searchBarHeight, setSearchBarHeight] = useState(8);
  const [isAdvanceFilter, setIsAdvanceFilter] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (timerSearch) {
      clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(() => {
      methods.refreshData(true);
    }, DELAY);
    return () => { };
  }, [filter.search]);

  useEffect(() => {
    if (isAdvanceFilter) {
      setOldFilter({
        ...oldFilter,
        location: filter.location,
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }
    return () => { };
  }, [isAdvanceFilter]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        methods.clearAllFilter();
      };
    }, []),
  );

  const methods = {
    clearAllFilter: () => {
      setFilter({
        ...filter,
        search: '',
        location: {},
        startDate: '',
        endDate: '',
      });
      setOldFilter({
        ...oldFilter,
        location: {},
        startDate: '',
        endDate: '',
      });
      setIsAdvanceFilter(false);
    },
    setFilterText: (text) => {
      setFilter({ ...filter, search: text });
    },
    cancelAdvanceFilter: () => {
      setFilter({
        ...filter,
        location: oldFilter.location,
        startDate: oldFilter.startDate,
        endDate: oldFilter.endDate,
      });
      setIsAdvanceFilter(false);
    },
    applyAdvanceFilter: () => {
      setIsAdvanceFilter(false);
      methods.refreshData(true);
    },
    onLayoutSearchBarContainer: (e) => {
      setSearchBarHeight(e.nativeEvent.layout.height);
    },
    refreshData: async (reset) => {
      let entityID = user.selectedEntity ? user.selectedEntity.id || '' : '';
      if (isFirstLoad) {
        setIsFirstLoad(false);
      } else if (reset) {
        // get current logged user's location list based on entity ID
        userGetLocationList({
          entityID: entityID,
        });
      }
      if (entityID && user.id) {
        if (!reset) {
          setIsLoadingMore(true);
        }
        console.log('entityID && user.id======', entityID, user.id)
        activityGetList(
          {
            entityID: entityID,
            userID: user.id,
            skip: reset ? 0 : activity.list.length,
            limit: LIMIT,
            search: filter.search,
            locationID: filter.location.id || '',
            startDate: filter.startDate,
            endDate: filter.endDate,
          },
          () => {
            setIsLoadingMore(false);
          },
          !reset,
        );
      }
    },
  };

  return (
    <>
      {/*  */}
      <View style={styles.mainWrapper}>
        <View
          style={styles.filterPanel}
          onLayout={methods.onLayoutSearchBarContainer}>
          <View style={styles.filterInputContainer}>
            <TouchableOpacity
              style={styles.filterInputIconContainer}
              activeOpacity={0.5}>
              <Icon style={styles.filterInputIcon} name="search" />
            </TouchableOpacity>
            <TextInput
              style={styles.filterInput}
              placeholderTextColor={color.materialBaseColor}
              value={filter.search}
              onChangeText={(text) => {
                methods.setFilterText(text);
              }}
              placeholder="Search here..."
            />
            <TouchableOpacity
              style={styles.filterInputIconContainer}
              activeOpacity={0.5}
              onPress={() => setIsAdvanceFilter(true)}>
              <Icon style={styles.filterInputIcon} name="filter" />
            </TouchableOpacity>
          </View>
        </View>
        {isAdvanceFilter && (
          <View style={[styles.filterAdvanceContainer, { top: searchBarHeight }]}>
            <View style={styles.filterAdvanceContent}>
              <SinglePicker
                label="Location"
                textExtractor={(item) => {
                  return item ? item.name : '';
                }}
                value={filter.location}
                containerStyle={{}}
                data={user.locationList}
                showClearButton={true}
                emptyValue={{}}
                onSelect={(selected) => {
                  setFilter({ ...filter, location: selected });
                }}
                renderChild={
                  <>
                    <TextFieldWithoutInput
                      value={filter.location.name ? filter.location.name : ''}
                      label="Location"
                    />
                  </>
                }
              />
              {/* <TextField
                style={{backgroundColor: 'red'}}
                label="Location"
                value={filter.location}
              /> */}
              <View style={styles.filterRowContainer}>
                <DatePicker
                  label="Start Date"
                  value={filter.startDate}
                  containerStyle={styles.filterColumnLeftContainer}
                  onSelect={(date) => {
                    setFilter({ ...filter, startDate: date });
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={filter.endDate}
                  containerStyle={styles.filterColumnRightContainer}
                  onSelect={(date) => {
                    setFilter({ ...filter, endDate: date });
                  }}
                />
              </View>
              <View style={styles.filterFooterContainer}>
                <TouchableOpacity
                  style={styles.filterFooterActionContainer}
                  activeOpacity={0.5}
                  onPress={() => methods.cancelAdvanceFilter()}>
                  <Text style={styles.filterFooterActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterFooterActionContainer}
                  activeOpacity={0.5}
                  onPress={() => methods.applyAdvanceFilter()}>
                  <Text style={styles.filterFooterActionText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                methods.cancelAdvanceFilter();
              }}>
              <View style={styles.filterDismissableArea} />
            </TouchableWithoutFeedback>
          </View>
        )}
        <View style={styles.content}>
          <FlatList
            data={activity.list}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  methods.refreshData(true);
                }}
              />
            }
            renderItem={({ item, index }) => (
              <ActivityList
                data={item}
                dateBefore={
                  index > 0 ? activity.list[index - 1].dateTime : null
                }
                isLastIndex={activity.list.length - 1 == index}
              />
            )}
            keyExtractor={(item) => item.id + 'id'}
            removeClippedSubviews={true}
            onEndReached={() => methods.refreshData()}
            ListEmptyComponent={
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Data Available</Text>
              </View>
            }
          />
          {isLoadingMore && (
            <View style={styles.loadingMoreContainer}>
              <View style={styles.loadingMoreContent}>
                <ActivityIndicator size="small" color={color.accent} />
                <Text style={styles.loadingMoreText}>Loading more data...</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    activity: state.activity,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userGetLocationList: (payload) => dispatch(userGetLocationList(payload)),
    activityGetList: (
      { entityID, userID, skip, limit, search, locationID, startDate, endDate },
      callBack,
      ignoreLoading,
    ) =>
      dispatch(
        activityGetList(
          {
            entityID,
            userID,
            skip,
            limit,
            search,
            locationID,
            startDate,
            endDate,
          },
          callBack,
          ignoreLoading,
        ),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryLayout);
