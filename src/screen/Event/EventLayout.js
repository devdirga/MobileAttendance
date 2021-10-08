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

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles/event';

import { color } from '../../values';

import DatePicker from '../../components/DatePicker';
import ActivityList from './components/ActivityList';
import { showAlert } from '../../components/Alert';

import {
  event as eventDummy,
  location as locationDummy,
} from '../../store/dummy';

import { eventGetList } from '../../store/action/event';

const LIMIT = 20;
const DELAY = 750;
let timerSearch;

const EventLayout = ({
  event,
  user,

  eventGetList,

  navigation,
}) => {
  const [filter, setFilter] = useState({
    search: '',
    startDate: '',
    endDate: '',
  });
  const [oldFilter, setOldFilter] = useState({
    startDate: '',
    endDate: '',
  });

  const [searchBarHeight, setSearchBarHeight] = useState(8);
  const [addButtonContainerHeight, setAddButtonContainerHeight] = useState(8);

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
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }
    return () => { };
  }, [isAdvanceFilter]);

  const methods = {
    checkSubscriptionStatus: () => {
      switch (user.subscriptionStatus) {
        case 'expired':
          let ownerID =
            user.selectedEntity && user.selectedEntity.owner
              ? user.selectedEntity.owner.id
              : '';
          if (ownerID === user.id) {
            methods.purchaseMsg('Your subscription is expired', false);
          } else {
            methods.purchaseMsg(
              `Subscription for entity "${user.selectedEntity.name}" is expired`,
              true,
            );
          }
          return false;
        case 'none':
          methods.purchaseMsg('You are not subscribed to any license', false);
          return false;
        default:
          return true;
      }
    },
    purchaseMsg: (msg, dialogOnly) => {
      let buttons = [];
      if (!dialogOnly) {
        buttons = [
          {
            text: 'Purchase',
            type: 'info',
            onPress: async () => {
              await methods.purchaseProcess(() => { });
            },
          },
          {
            text: 'Cancel',
            type: 'default',
            onPress: async () => { },
          },
        ];
      }
      showAlert({
        title: 'Warning',
        detail: msg,
        type: 'warning',
        buttons: buttons,
      });
    },
    purchaseProcess: async (callback) => {
      if (callback) {
        callback();
      }
    },
    add: () => {
      if (methods.checkSubscriptionStatus()) {
        navigation.navigate('EventForm', {
          title: 'Add New Event',
          mode: 'new',
          onSuccess: () => methods.refreshData(true),
        });
      }
    },
    edit: (item) => {

      if (item.organizer == user.id) {
        console.log('items...', item)
        if (methods.checkSubscriptionStatus()) {
          navigation.navigate('EventForm', {
            title: 'Edit Event',
            eventID: item.id,
            mode: 'edit',
            onSuccess: () => methods.refreshData(true),
          });
        }
      } else {
        navigation.navigate('EventQR', {
          title: 'Event Detail',
          eventID: item.id
        });
      }
    },
    setFilterText: (text) => {
      setFilter({ ...filter, search: text });
    },
    cancelAdvanceFilter: () => {
      setFilter({
        ...filter,
        startDate: oldFilter.startDate,
        endDate: oldFilter.endDate,
      });
      setIsAdvanceFilter(false);
    },
    applyAdvanceFilter: () => {
      setIsAdvanceFilter(false);
      methods.refreshData(true);
    },
    onLayout: (e, type = 'searchbar') => {
      switch (type) {
        case 'searchbar':
          setSearchBarHeight(e.nativeEvent.layout.height);
          break;
        case 'addbutton':
          setAddButtonContainerHeight(e.nativeEvent.layout.height);
          break;
        default:
          break;
      }
    },
    refreshData: async (reset) => {
      if (isFirstLoad) {
        setIsFirstLoad(false);
      } else if (reset) {
      }

      if (user.id) {
        if (!reset) {
          setIsLoadingMore(true);
        }
        eventGetList(
          {
            userID: user.id,
            skip: reset ? 0 : event.list.length,
            limit: LIMIT,
            search: filter.search,
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
          onLayout={(e) => methods.onLayout(e, 'searchbar')}>
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
            data={event.list}
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
                dateBefore={index > 0 ? event.list[index - 1].startTime : null}
                index={index}
                isLastIndex={event.list.length - 1 == index}
                onPress={() => {
                  methods.edit(item);
                }}
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

          <TouchableOpacity
            style={[
              styles.addButtonContainer,
              {
                width: addButtonContainerHeight,
                borderRadius: addButtonContainerHeight / 2,
              },
            ]}
            activeOpacity={0.5}
            onPress={() => methods.add()}
            onLayout={(e) => methods.onLayout(e, 'addbutton')}>
            <Icon style={styles.addButtonIcon} name="plus" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.event,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    eventGetList: (
      { userID, skip, limit, search, startDate, endDate },
      callBack,
      ignoreLoading,
    ) =>
      dispatch(
        eventGetList(
          { userID, skip, limit, search, startDate, endDate },
          callBack,
          ignoreLoading,
        ),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventLayout);
