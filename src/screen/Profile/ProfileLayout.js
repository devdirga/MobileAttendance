import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native';
import { connect } from 'react-redux';
import { BASE_URL, BASEURL } from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles/profile';
import ItemLabelValue from './components/ItemLabelValue';
import Button from '../../components/Button';
import { userGetMe } from '../../store/action/user';
import { authLogout } from '../../store/action/auth';
import { color } from '../../values';
const ProfileLayout = ({
  navigation,
  userGetMe,
  authLogout,
  user,
}) => {
  const [imgSource, setImgSource] = useState(
    require('../../assets/images/empty-avatar.png'),
  );
  const [
    floatingButtonContainerHeight,
    setFloatingButtonContainerHeight,
  ] = useState(8);

  useEffect(() => {
    if (user.picture) {
      setImgSource({
        uri: `${BASEURL}employee/${user.username}.jpg?last_updated_date=${user.lastUpdatedDate}`
      });
    } else {
      setImgSource(require('../../assets/images/empty-avatar.png'));
    }
  }, [user.picture, user.lastUpdatedDate]);

  const methods = {
    refreshData: async () => {
      userGetMe();
    },
    changePassword: () => {
      navigation.navigate('ChangePassword');
    },
    editProfile: () => {
      // navigation.navigate('EditProfile');
    },
    onLayout: (e, type = 'floatingbutton') => {
      switch (type) {
        case 'floatingbutton':
          setFloatingButtonContainerHeight(e.nativeEvent.layout.height);
          break;
        default:
          break;
      }
    },
  };

  return (
    <View style={styles.mainWrapper}>
      {/*  */}
      <ScrollView
        style={styles.mainWrapper}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              methods.refreshData();
            }}
          />
        }>
        <View style={styles.headerWrapper}>
          <View style={[styles.headerContainer]}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={imgSource} />
            </View>
            <View style={styles.headerInfoContainer}>
              <Text style={styles.userFullname}>
                {user.firstName}
              </Text>
              <Text style={styles.userPosition}>{user.position}</Text>
              <View style={styles.userLocationContainer}>
                <View style={styles.locationPinContainer}>
                  <Icon
                    name="map-marker-alt"
                    style={styles.locationPinIcon}
                    size={12}
                  />
                </View>
                <Text numberOfLines={1} style={styles.userLocation}>
                  {user.location.name || '...'}
                </Text>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity
            style={styles.editProfileTouchable}
            activeOpacity={0.5}
            onPress={() => methods.editProfile()}>
            <Icon name="edit" style={styles.editProfileIcon} />
          </TouchableOpacity> */}

        </View>
        <View style={styles.informationContainer}>
          <Text style={styles.informationTitle}>Information</Text>
          <ItemLabelValue label="Username" value={user.username} />
          <ItemLabelValue label="Email" value={user.email} />
          <ItemLabelValue label="Full Name" value={user.firstName} />
          {/* <ItemLabelValue label="Last Name" value={user.lastName} /> */}
          <View style={styles.editProfileContainer}>
            <TouchableOpacity style={styles.editProfileTouchable} activeOpacity={0.5} onPress={() => methods.editProfile()}>
              {/* <Text style={styles.editProfileText}>Edit Profile</Text> */}
            </TouchableOpacity>
          </View>
        </View>

        {/* <TouchableOpacity
          activeOpacity={0.5}
          style={styles.informationContainer}
          onPress={() => methods.changePassword()}>
          <ItemLabelValue label="Change Password" value="" />
        </TouchableOpacity> */}

        <Button
          marginTop={16}
          text="Logout"
          color={color.primary}
          textColor="white"
          size="lg"
          paddingVertical={12}
          borderRadius={4}
          marginLeft={32}
          marginRight={32}
          onPress={() => {
            authLogout();
          }}
        />
      </ScrollView>
      {/* <TouchableOpacity style={[
          styles.floatingButtonContainer,
          {
            width: floatingButtonContainerHeight,
            borderRadius: floatingButtonContainerHeight / 2,
          }
        ]} 
        activeOpacity={0.5}
        onPress={() => methods.editProfile()}
        onLayout={(e) => methods.onLayout(e, 'floatingbutton')}
      >
        <Icon style={styles.floatingButtonIcon} name='edit' />
      </TouchableOpacity> */}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userGetMe: () => dispatch(userGetMe()),
    authLogout: () => dispatch(authLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileLayout);
