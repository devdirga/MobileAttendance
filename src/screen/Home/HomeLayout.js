import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Dimensions, Button, Alert, BackHandler, DeviceEventEmitter } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { APP_VERSION } from 'react-native-dotenv';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { BASE_URL, BASEURL } from 'react-native-dotenv';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { Calculate, Helper } from '../../common';
import MenuButton from './MenuButton';
import ActivityList from './ActivityList';
import SinglePicker from '../../components/SinglePicker';
import styles from './styles/home';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import {
  activity as activityDummy,
  activityType as activityTypeDummy,
} from '../../store/dummy';
import {
  userSetEntity,
  userSetLocation,
  userGetMe,
  userGetLocations,
  userGetLocationList,
  userGetSubscription,
  userSetSubscriptionStatus,
} from '../../store/action/user';
import { entityGetList, entityGetByID } from '../../store/action/entity';
import { surveyGetByID } from '../../store/action/survey';
import { activityTypeGetList } from '../../store/action/activityType';
import { locationGetList } from '../../store/action/location';
import {
  activityGetRecentList,
  activityGetList,
} from '../../store/action/activity';
import { KEY_STORAGE_ENTITY, KEY_STORAGE_TOKEN } from '../../store/constant';
import { showAlert } from '../../components/Alert';

const HomeLayout = ({
  navigation,
  entityGetList,
  entityGetByID,
  activityTypeGetList,
  activityGetRecentList,
  activityGetList,
  userSetEntity,
  userSetLocation,
  userGetMe,
  userGetLocationList,
  userGetSubscription,
  userSetSubscriptionStatus,
  user,
  entity,
  activity,
  activityType,
  location,
  locationGetList,
  survey,
  surveyGetByID,
}) => {
  const refRBSheet = useRef();
  const [locationContainerHeight, setLocationContainerHeight] = useState(8);
  const [isUserLocationSelected, setIsUserLocationSelected] = useState(false)
  const [locations, setLocations] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [imgSource, setImgSource] = useState(require('../../assets/images/empty-avatar.png'));
  const { height } = Dimensions.get('window');
  useEffect(() => {

    methods.refreshData();
    // watch position on move
    setTimeout(() => {
      Geolocation.watchPosition(() => {
        methods.nearestLocation()
      })
    }, 1)
    return () => { }
  }, []);
  useEffect(() => {
    // find nearest location
    methods.nearestLocation()
    return () => { }
  }, [user.locationList]);
  useEffect(() => {
    if (user.picture) {
      setImgSource({ uri: `${BASEURL}employee/${user.username}.jpg` });
    } else {
      setImgSource(require('../../assets/images/empty-avatar.png'));
    }
  }, [user.picture, user.lastUpdatedDate]);
  useEffect(() => {
    let entityID = user.selectedEntity ? user.selectedEntity.id || '' : '';
    let userID = user.id
    // get current subscription
    if (entityID) {
      activityTypeGetList({ entityID: entityID, skip: 0, limit: 10, search: '' });
      // get current logged user's location list based on entity ID
      userGetLocationList({ userID: userID });
      if (user.id) {
        activityGetRecentList({ entityID: entityID, userID: user.id });
        activityGetList(
          {
            entityID: entityID,
            userID: user.id,
            skip: 0,
            limit: 20,
            search: '',
            locationID: '',
            startDate: '',
            endDate: '',
          },
          () => { },
          true,
        );
      }
    }
  }, [user.selectedEntity, user.id]);
  const methods = {
    refreshData: async () => {

      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
      }).then(function (success) {
        // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
        navigator.geolocation.getCurrentPosition((position) => {
          let initialPosition = JSON.stringify(position);
          this.setState({ initialPosition });
        }, error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
      }.bind(this)
      ).catch((error) => {
        console.log(error.message);
      });

      DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
        console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
      });

      const entityProcess = async () => {
        // get survey data
        surveyGetByID(0, (response) => {
          setSurveys(response.success ? response.data : [])
        })
        // get selected entity from storage
        const setDefaultEntity = () => {
          entityGetList({ skip: 0, limit: 1, search: '' }, (response) => {
            methods.setEntity((response.success && response.data.length) ? response.data[0] : null)
          })
        }
        let entityID = await AsyncStorage.getItem(KEY_STORAGE_ENTITY);
        if (entityID) {
          entityGetByID(entityID, (response) => {
            if (response.success) {
              methods.setEntity(response.data);
            } else {
              setDefaultEntity();
            }
          })
        } else {
          setDefaultEntity();
        }
        methods.nearestLocation()
      };
      // get current logged in user
      userGetMe(entityProcess);
    },
    purchaseMsg: (msg, dialogOnly) => {
      let buttons = [];
      if (!dialogOnly) {
        buttons = [
          {
            text: 'Purchase',
            type: 'info',
            onPress: async () => {
              await methods.purchaseProcess();
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
    purchaseProcess: async () => {
      let token = await AsyncStorage.getItem(KEY_STORAGE_TOKEN);
      navigation.navigate('Purchase', {
        token: token,
        refreshMethod: methods.refreshData,
      });
    },
    onLayoutLocationContainer: (e) => {
      setLocationContainerHeight(e.nativeEvent.layout.height);
    },
    setEntity: async (selectedData) => {
      if (!selectedData) {
        showAlert({
          title: 'Warning',
          detail: "You don't have any entity, some features might not be accessible",
          type: 'warning',
        });
        return;
      }
      let entityID = selectedData ? selectedData.id || '' : '';
      await AsyncStorage.setItem(KEY_STORAGE_ENTITY, entityID);
      userSetEntity(selectedData);
    },
    nearestLocation: () => {
      if (!isUserLocationSelected) {
        Geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
          let nearestLocation = { name: '...' };
          let locs = []
          user.locationList.map((val, idx) => {
            let distance = Calculate.distance(latitude, longitude, val.latitude, val.longitude)
            val.distance = val.isVirtual ? 0 : distance
            locs.push(val)
            console.log('LLR:', latitude, longitude, 'Office', val.latitude, val.longitude, 'Distance', distance)
            if (val.isVirtual) {
              if (!(nearestLocation.distance != null && nearestLocation.distance != undefined && nearestLocation.distance < parseFloat(nearestLocation.radius))) {
                nearestLocation = { ...val, distance: -1 }
              }
            } else {
              if (idx == 0) {
                nearestLocation = { ...val, distance }
              } else {
                if (distance < nearestLocation.distance || (nearestLocation.distance == -1 && distance < parseFloat(val.radius))) {
                  nearestLocation = { ...val, distance }
                }
              }
            }
          })
          setLocations(locs);
          userSetLocation(nearestLocation);
        })
      }
    },
    inKm: (distanceMeters) => {
      if (!isNaN(distanceMeters)) return (distanceMeters / 1000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return 0;
    },
    activityScreen: (activity, type) => {
      if (methods.checkSubscriptionStatus()) {
        //CheckDataISComplete
        if (user.location.name == '...') {
          showAlert({ title: 'Warning', detail: 'You have not been assigned in any location', type: 'warning' })
        } else {
          navigation.navigate(type, {
            title: activity.name,
            location: (type === 'Activity') ? user.location : surveys,
            isUserLocationSelected: isUserLocationSelected,
            user: user,
            activity,
            refreshMethod: methods.refreshAfterLogging,
          })
        }
      }
    },
    refreshAfterLogging: () => {
      let entityID = user.selectedEntity ? user.selectedEntity.id || '' : '';
      if (entityID && user.id) {
        activityGetRecentList({ entityID: entityID, userID: user.id });
        activityGetList({ entityID: entityID, userID: user.id, skip: 0, limit: 20, search: '', locationID: '', startDate: '', endDate: '' }, () => { },
          true,
        );
      }
    },
    showActionLog: () => {
      navigation.jumpTo('HistoryTab');
    },
    isCanScanQR: () => {
      let ownerID = user.selectedEntity && user.selectedEntity.owner ? user.selectedEntity.owner.id : '';
      if (user.id == ownerID) return true;
      if (
        user.selectedEntity &&
        user.selectedEntity.groups instanceof Array &&
        user.selectedEntity.groups.length
      ) {
        if (
          user.selectedEntity.groups.filter(
            (x) => x.name.toLowerCase() !== 'member',
          ).length
        ) {
          return true;
        }
      }
      return false;
    },
    IsThereSurvey: () => { return (surveys.length > 0) ? true : false },
    scanQR: () => {
      if (methods.checkSubscriptionStatus()) {
        navigation.navigate('ScanQR');
      }
    },
    daysLeft: () => {
      if (user.subscription && user.subscription.expiredDate) {
        return Calculate.daysLeft(user.subscription.expiredDate);
      }
      return 0;
    },
    subscriptionText: () => {
      let res =
        (user.subscription ? user.subscription.license.name : '') + ' - ';
      if (methods.daysLeft() > 0) {
        res +=
          methods.daysLeft() + ' ' + (methods.daysLeft() > 1 ? 'days' : 'day');
      } else {
        res += 'expired';
      }
      return res;
    },
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
    }
  }
  return (
    <>
      < ScrollView
        style={styles.mainWrapper}
        refreshControl={< RefreshControl refreshing={false} onRefresh={() => { methods.refreshData() }} />}>
        <RBSheet ref={refRBSheet} height={height / 2} openDuration={250}>
          <ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 40, paddingHorizontal: 16, paddingTop: 16 }}>
              {activityType.list.map((row, idx) => {
                return (
                  <MenuButton
                    label={row.name} icon={row.icon} key={'sheet' + idx}
                    onPress={() => {
                      refRBSheet.current.close();
                      setTimeout(() => { methods.activityScreen(row, 'Activity') }, 400);
                    }}
                  />
                )
              })}
            </View>
          </ScrollView>
        </RBSheet>
        <View
          style={[styles.headerContainer, { paddingBottom: styles.headerContainer.paddingBottom + locationContainerHeight / 2 }]}>
          <TouchableOpacity onPress={() => navigation.navigate('AccountTab')} style={styles.avatarContainer}>
            <Image style={styles.avatar} source={imgSource} />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.fullNameText}>
              {user.firstName}
            </Text>
            <SinglePicker
              label="Company"
              textExtractor={(item) => { return item ? item.name : '' }}
              containerStyle={styles.entityContainer}
              data={entity.list}
              onSelect={(selected) => { methods.setEntity(selected) }}
              serverPaging={true}
              onLoadData={(param, callback) => {
                entityGetList({ skip: param.skip, limit: param.limit, search: param.filter }, (response) => { callback(response.status ? response.data : []) });
              }}
              renderChild={
                <>
                  <FontAwesome5 name="briefcase" style={styles.entityIcon} />
                  <Text style={styles.entitySelected} numberOfLines={1}>
                    {user.selectedEntity ? user.selectedEntity.name || '...' : '...'}
                  </Text>
                  <FontAwesome5 name="chevron-right" style={styles.entityRightIcon} />
                </>
              }
            />
          </View>
          <View style={styles.subscriptionContainer}>
            <Text style={styles.subscriptionText}>{APP_VERSION}</Text>
          </View>
        </View>
        <View onLayout={methods.onLayoutLocationContainer} style={[styles.locationContainer, { top: (locationContainerHeight / 2) * -1 }]}>
          <View style={styles.locationContent}>
            <View style={styles.locationPinContainer}>
              <FontAwesome5 name="map-marked-alt" style={styles.locationPinIcon} size={24} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTextCaption}>
                Nearest Location{' '}
                {user.location.distance >= 0 ? `(${methods.inKm(user.location.distance)} km)` || '' : ''}
              </Text>
              <SinglePicker
                label="Locations"
                textExtractor={(item) => {
                  let distance = item.isVirtual ? 0 : item.distance
                  let name = item ? item.name : ''
                  return `${name} (${methods.inKm(distance)} km)`;
                }}
                containerStyle={styles.entityContainer}
                onSelect={(selected) => { userSetLocation(selected); setIsUserLocationSelected(true); }}
                data={locations}
                renderChild={
                  <>
                    <Text style={styles.locationTextValue} numberOfLines={1}>
                      {user.location ? user.location.name || '...' : '...'}
                    </Text>
                  </>
                }
              />
            </View>
            {methods.isCanScanQR() && (
              <TouchableOpacity style={styles.locationIcon} onPress={() => { methods.scanQR() }}>
                <MaterialCommunityIcons name="qrcode-scan" style={styles.locationIconRight} size={23} />
                <Text style={styles.locationIconRightText}>Scan QR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={[styles.menuContainer, { top: locationContainerHeight * -1, paddingTop: styles.menuContainer.paddingTop + locationContainerHeight / 2 }]}>
          {!!activityType.list && activityType.list.length > 0 && (
            <>
              {activityType.list
                .filter((_, idx) => idx < 6)
                .map((row, idx, arr) => {
                  let res = [];
                  if (idx == 5) {
                    res.push(
                      <MenuButton isMoreButton={true} onPress={() => refRBSheet.current.open()} key={'2' + idx} />
                    )
                  } else {
                    res.push(
                      <MenuButton
                        label={row.name} icon={row.icon} key={'2' + idx}
                        onPress={() => { methods.activityScreen(row, methods.IsThereSurvey() ? 'Survey' : 'Activity') }}
                      />
                    )
                  }
                  return res
                })}
            </>
          )}
          {!activityType.list ||
            (activityType.list.length <= 0 && (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Action Available</Text>
              </View>
            ))}
        </View>
        <View style={[styles.activityContainer, { top: locationContainerHeight * -1 }]}>
          <View style={styles.activityTitleContainer}>
            <View style={styles.activityTitleLeftContainer}>
              <Text style={styles.activityTitleText}>Recent Activities</Text>
              <Text style={styles.activityTitleToday}>Today, {moment().format('DD MMMM YYYY')}</Text>
            </View>
            <TouchableOpacity onPress={() => methods.showActionLog()} style={styles.activityTitleViewAllContainer} activeOpacity={0.5}>
              <Text style={styles.activityTitleViewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityContent}>
            {!!activity.recentList && activity.recentList.length > 0 && (
              <>
                {activity.recentList.map((row, idx, arr) => {
                  return (
                    <ActivityList
                      key={`${idx}-${row.id}`}
                      data={{ activity: row.activityType.activityTypeName, date: row.dateTime }}
                      isLastIndex={idx == arr.length - 1}
                    />
                  )
                })}
              </>
            )}
            {!activity.recentList ||
              (activity.recentList.length <= 0 && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No Recent Activities</Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    entity: state.entity,
    activity: state.activity,
    activityType: state.activityType,
    location: state.location,
    survey: state.survey
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    entityGetList: (param, callback) =>
      dispatch(entityGetList(param, callback)),
    entityGetByID: (id, callback) => dispatch(entityGetByID(id, callback)),
    surveyGetByID: (id, callback) => dispatch(surveyGetByID(id, callback)),
    activityTypeGetList: (param, callback) =>
      dispatch(activityTypeGetList(param, callback)),
    activityGetRecentList: ({ entityID, userID }, callback) =>
      dispatch(activityGetRecentList({ entityID, userID }, callback)),
    activityGetList: ({ entityID, userID, skip, limit, search, locationID, startDate, endDate }, callBack, ignoreLoading) =>
      dispatch(activityGetList({ entityID, userID, skip, limit, search, locationID, startDate, endDate }, callBack, ignoreLoading)),
    userSetEntity: (selectedEntity) => dispatch(userSetEntity(selectedEntity)),
    userSetLocation: (location) => dispatch(userSetLocation(location)),
    userGetMe: (callback) => dispatch(userGetMe(callback)),
    userGetLocations: () => dispatch(userGetLocations()),
    userGetLocationList: (payload) => dispatch(userGetLocationList(payload)),
    userGetSubscription: (entityID, callback) =>
      dispatch(userGetSubscription(entityID, callback)),
    userSetSubscriptionStatus: (status) =>
      dispatch(userSetSubscriptionStatus(status)),
    locationGetList: (param, callback) =>
      dispatch(locationGetList(param, callback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeLayout);
