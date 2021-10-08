import React from 'react';
import {
  Alert, View, Text, TouchableOpacity, Image,
  Dimensions, Modal, SafeAreaView, Platform
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux';
import { MAPBOX_TOKEN } from 'react-native-dotenv';
import { Calculate, Helper } from '../../common';
import axios from '../../plugin/axios';
import Button from '../../components/Button';
import CaptureImage from '../../components/CaptureImage';
import { color } from '../../values';
import styles from './styles';
import { showAlert } from '../../components/Alert';
import { activitySetLoading } from '../../store/action/activity';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import FingerprintPopup from '../Finger/FingerprintPopup.component.android';
import fingerStyles from '../Finger/FingerprintPopup.component.styles';
import ReactNativeBiometrics from 'react-native-biometrics';
import RadioGroup from 'react-native-radio-buttons-group';
MapboxGL.setAccessToken(MAPBOX_TOKEN);
const AnnotationContent = ({ inrange }) => (
  <View>
    <MaterialCommunityIcons name={inrange ? 'map-marker-check' : 'map-marker-off'} color={inrange ? 'green' : 'red'} size={30} />
  </View>
)
const ActivityLayoutLayout = ({
  user: { locationList, selectedEntity },
  route,
  navigation,
  activitySetLoading,
}) => {
  const [currentLocation, setCurrentLocation] = React.useState({ name: 'Detect nearest location...' });
  const [nearestLocationList, setNearestLocationList] = React.useState([]);
  // start try catch
  const [officeCoordinate, setOfficeCoordinate] = React.useState([34.4999, 31.5542])
  const [toOfficeRoute, setToOfficeRoute] = React.useState({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [-7.66, 112.53]
            [-77.66, 112.53]
          ],
        },
        style: {
          fill: 'red',
          strokeWidth: '10',
          fillOpacity: 0.6,
        },
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8,
        },
      },
    ],
  })
  const startPoint = [112.7303271, -7.8071631]
  const endPoint = [112.7403271, -7.8071631]
  const officeRoute = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [112.7303271, -7.8071631]
            [112.7403271, -7.8071631]
          ],
        },
      },
    ],
  }
  // start try catch
  const [activity, setActivity] = React.useState(route.params.activity);
  const [picture, setPicture] = React.useState({ photo: '', logoContent: '', logoMIME: '' });
  const [fingerBiometricType, setFingerBiometricType] = React.useState(null);
  const [fingerBiometricTypeError, setFingerBiometricTypeError] = React.useState(null);
  const [faceBiometricType, setFaceBiometricType] = React.useState(null)
  const [biometricPopupShowed, setBiometricPopupShowed] = React.useState(false);
  const [isFingerPromptShowed, setIsFingerPromptShowed] = React.useState(false)
  const [mapStyleUrl, setMapStyleUrl] = React.useState([
    { label: 'Light', value: 'mapbox://styles/mapbox/light-v10', size: 12 },
    { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v10', size: 12 },
    { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-streets-v11', size: 12 },
    { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v11', size: 12 }
  ]);
  const [styleUrl, setStyleUrl] = React.useState(mapStyleUrl[0].value)
  const [takenPhoto, setTakenPhoto] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState([]);
  const [isLocationChooserShown, setIsLocationChooserShown] = React.useState(false);
  const [isPhotoTakeShown, setIsPhotoTakeShown] = React.useState(false);
  React.useEffect(() => {
    // watch position on move
    setTimeout(() => {
      Geolocation.watchPosition(({ coords: { latitude, longitude } }) => {
        methods.setLocation(latitude, longitude)
      })
    }, 1);
    // check if finger is available
    FingerprintScanner.isSensorAvailable().then(biometricType => setFingerBiometricType(biometricType)).catch(err => setFingerBiometricTypeError(err))
    // check if face biometric available
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject
      if (available && biometryType === ReactNativeBiometrics.Biometrics && Platform.Version >= 29) {
        setFaceBiometricType(true)
      }
    })
    return () => { }
  }, []);
  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
    methods.findLocation()
    return () => { };
  }, []);
  const methods = {
    checkInOut: () => {
      if (fingerBiometricTypeError === null) {
        setIsFingerPromptShowed(true)
      } else if (faceBiometricType) {
        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm Face Unlock' })
          .then((resultObject) => {
            const { success } = resultObject
            if (success) {
              methods.confirmAction('Finger')
            } else {
              Alert.alert('Face Authentication', 'User cancelled biometric prompt')
            }
          })
          .catch(() => {
            Alert.alert('Face Authentication', 'Biometrics failed')
          })
      } else {
        if (route.params.user.isSelfieAuth == 'Yes' || route.params.user.isSelfieAuth == 'yes') {
          methods.pickImage()
        } else {
          showAlert({ title: `Warning`, detail: `${activity.name} can't be performing, you not allowed to use selfie auth.`, type: 'warning' })
        }
      }
    },
    confirmAction: (type) => {
      if (typeof currentLocation.id !== 'undefined') {
        showAlert({
          title: `${activity.name} Confirmation`,
          detail: `Are you sure to ${activity.name} on location "${currentLocation.name}"?`,
          type: 'info',
          buttons: [
            {
              text: 'Sure',
              type: 'info',
              onPress: async () => {
                try {
                  activitySetLoading(true)
                  setIsPhotoTakeShown(false)
                  let param = {
                    typeID: type,
                    entityID: selectedEntity.id,
                    activityTypeID: activity.id,
                    locationID: currentLocation.code,
                    longitude: coordinates[0][0],
                    latitude: coordinates[0][1],
                    inOut: (activity.name === 'Checkin') ? 'IN' : 'OUT',
                    ...picture
                  }
                  let { data: { success, message } } = await axios.post('/absence/checkinout', param);
                  if (success) {
                    showAlert({
                      title: 'Success',
                      detail: 'Successfully checked into location.',
                      type: 'success',
                      buttons: [
                        {
                          text: 'OK',
                          type: 'info',
                          onPress: async () => {
                            if (route.params.refreshMethod) route.params.refreshMethod();
                            navigation.goBack();
                          },
                        },
                      ],
                    });
                  } else {
                    showAlert({ title: 'Error', detail: message, type: 'danger' })
                  }
                } catch (error) {
                  showAlert({ title: 'Error', detail: 'Something wrong, please try again', type: 'danger' })
                } finally {
                  activitySetLoading(false)
                }
              }
            },
            { text: 'Cancel', type: 'default' }
          ]

        })
      } else {
        showAlert({ title: `Warning`, detail: `${activity.name} can't be performing, your location is too far.`, type: 'warning' })
      }
    },
    pickImage: () => {
      CaptureImage({ cameraType: 'front', mediaType: 'photo' }).then((res) => {
        if (!res.success) return
        const pictureData = { ...picture, photo: res.fileName, logoContent: res.logoContent, logoMIME: res.logoMIME }
        setPicture(pictureData)
        setTakenPhoto({ uri: res.uri })
        setIsPhotoTakeShown(true)
      }).catch((err) => {
        showAlert({ title: 'Error', detail: err.message, type: 'danger' })
      })
    },
    changeLocation: (location) => {
      setCurrentLocation(location)
      setIsLocationChooserShown(false)
    },
    onAuthFinger: () => {
      methods.confirmAction('Finger')
    },
    onFingerPromptDismissed: () => {
      setIsFingerPromptShowed(false)
    },
    closePhoto: () => {
      setIsPhotoTakeShown(false);
      setPicture({ ...picture, photo: '', logoContent: '', logoMIME: '' });
      setTakenPhoto(null);
    },
    switchMapStyle: data => {
      setStyleUrl(data.find(e => e.selected == true).value)
    },
    findLocation: () => {
      Geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        methods.setLocation(latitude, longitude)
      })
    },
    setLocation: (latitude, longitude) => {
      let nearestLocation = null;
      let almostLocation = null;
      let nearestLocationArr = [];

      if (route.params.isUserLocationSelected) {
        let selectedLocation = []
        selectedLocation.push(route.params.location)
        selectedLocation.map((val, idx) => {
          if (val.isVirtual) {
            nearestLocationArr.push({ ...val, distance: -1 })
            if (nearestLocation == null) {
              nearestLocation = { ...val, distance: -1 }
            }
          } else {
            let distance = Calculate.distance(latitude, longitude, val.latitude, val.longitude)
            if (distance < parseFloat(val.radius)) {
              nearestLocationArr.push({ ...val, distance })
              if (nearestLocation == null) {
                nearestLocation = { ...val, distance }
              } else {
                if (distance < nearestLocation.distance) {
                  nearestLocation = { ...val, distance }
                }
              }
            } else {
              if (almostLocation && distance < almostLocation.distance) {
                almostLocation = { ...val, distance }
              } else {
                almostLocation = { ...val, distance }
              }
            }
          }
        })
      } else {
        locationList.map((val, idx) => {
          if (val.isVirtual) {
            nearestLocationArr.push({ ...val, distance: -1 })
            if (nearestLocation == null) {
              nearestLocation = { ...val, distance: -1 }
            }
          } else {
            let distance = Calculate.distance(latitude, longitude, val.latitude, val.longitude)
            if (distance < parseFloat(val.radius)) {
              nearestLocationArr.push({ ...val, distance })
              if (nearestLocation == null) {
                nearestLocation = { ...val, distance }
              } else {
                if (distance < nearestLocation.distance) {
                  nearestLocation = { ...val, distance }
                }
              }
            } else {
              if (almostLocation && distance < almostLocation.distance) {
                almostLocation = { ...val, distance }
              } else {
                almostLocation = { ...val, distance }
              }
            }
          }
        });
      }
      if (nearestLocation != null) {
        setCurrentLocation({ ...nearestLocation });
      } else {
        setCurrentLocation({ name: `Your are too far from: ${almostLocation.name}` })
      }
      setNearestLocationList(nearestLocationArr);
      let current = coordinates;
      current.length = 0;
      current.push([longitude, latitude]);
      setCoordinates([...current]);
    }
  }

  const photoModalWidth = Dimensions.get('screen').width - 32;
  let selectedButton = mapStyleUrl.find(e => e.selected == true);
  selectedButton = selectedButton ? selectedButton.value : mapStyleUrl[0].label;
  return (
    <>
      <View style={styles.container}>
        {isLocationChooserShown && (
          <View style={styles.overlay}>
            <View style={styles.center}>
              <View style={styles.innerCenter}>
                <View style={styles.headerChooser}>
                  <Text style={styles.hederText}>Choose a location...</Text>
                </View>
                {nearestLocationList.map((item, idx) => {
                  return (
                    <TouchableOpacity
                      style={styles.locationListContainer}
                      activeOpacity={0.5}
                      onPress={() => { methods.changeLocation(item) }}>
                      <Text style={styles.locationListText}>{item.name}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
        )}
        {isFingerPromptShowed && (
          <FingerprintPopup style={styles.popup} handlePopupDismissed={methods.onFingerPromptDismissed} onAuthenticate={methods.onAuthFinger} />
        )}
        <Modal
          visible={isPhotoTakeShown}
          animationType="fade"
          transparent={true}
          onRequestClose={() => { methods.closePhoto() }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#0000007f' }}>
            <View style={[styles.center, { flex: 1 }]}>
              <View style={[styles.takenPhotoContainer, { width: photoModalWidth }]}>
                <Image source={takenPhoto} style={[styles.takenPhoto, { width: photoModalWidth }]} />
              </View>
              <View style={[styles.line, { width: photoModalWidth }]} />
              <View style={styles.bottomPhotoContainer}>
                <Button
                  containerStyle={styles.confirmButton}
                  text={`Confirm ${activity.name}`}
                  onPress={() => { methods.confirmAction('Photo') }}
                  color={color.primary} textColor="white" size="lg" />
                <TouchableOpacity
                  style={styles.retakePhoto}
                  activeOpacity={0.5}
                  onPress={() => { methods.pickImage() }}>
                  <MaterialCommunityIcons name="reload" size={28} color="gray" />
                  <Text style={{ fontSize: 10, color: 'gray', paddingTop: 3 }}>
                    Retake Photo
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.closeTakePhoto}
                activeOpacity={0.5}
                onPress={() => { methods.closePhoto() }}>
                <MaterialCommunityIcons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
        <View style={styles.map}>
          <RadioGroup radioButtons={mapStyleUrl} onPress={methods.switchMapStyle} flexDirection='row' />
          {coordinates.length > 0 && (
            <MapboxGL.MapView style={styles.map} styleURL={styleUrl}>
              {coordinates.map((val, idx) => {
                return (
                  <MapboxGL.PointAnnotation
                    coordinate={val}
                    id={`pt-ann-${idx}`}
                    key={`${idx}${styleUrl}`}
                    draggable={false}>
                    <AnnotationContent inrange={typeof currentLocation.id != 'undefined'} />
                  </MapboxGL.PointAnnotation>
                )
              })}

              {/* <MapboxGL.PointAnnotation
                coordinate={endPoint}
                id='id1'
                key='key1'
                draggable={false}>
                <AnnotationContent inrange={true} />
              </MapboxGL.PointAnnotation>
              <MapboxGL.ShapeSource id="line1" shape={officeRoute}>
                <MapboxGL.LineLayer
                  id="linelayer1" />
              </MapboxGL.ShapeSource> */}

              <MapboxGL.Camera
                animationDuration={1}
                zoomLevel={16}
                centerCoordinate={coordinates[0]} />
            </MapboxGL.MapView>
          )}
          {coordinates.length < 1 && (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text>Detect nearest location...</Text>
            </View>
          )}
        </View>
        <View style={styles.callAction}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>{activity.name} Location</Text>
            {nearestLocationList.length > 1 && (
              <View style={styles.otherLocationContainer}>
                <Text style={styles.otherLocationLabel}>
                  {nearestLocationList.length} locations found
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.locationPanel}
            onPress={() => {
              if (nearestLocationList.length > 1) {
                setIsLocationChooserShown(true);
              }
            }}
            activeOpacity={nearestLocationList.length > 1 ? 0.5 : 1}>
            <FontAwesome5 name="map-marked-alt" size={20} color="#f59a22" />
            <Text style={styles.locationDetail}>{currentLocation.name}</Text>
            {nearestLocationList.length > 1 && (
              <Text style={styles.locationDetailChangeText}>(tap to change)</Text>
            )}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button
                text={activity.name}
                onPress={() => { methods.checkInOut() }}
                color={color.primary}
                paddingVertical={15}
                textColor="white"
                size="lg" />
            </View>
            <TouchableOpacity style={{ justifyContent: 'center', paddingLeft: 15, paddingRight: 10, alignItems: 'center' }}
              onPress={() => { methods.findLocation() }}>
              <MaterialCommunityIcons name="crosshairs-gps" size={23} color="gray" />
              <Text style={{ fontSize: 10, color: 'gray', paddingTop: 3 }}>Locate Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    activitySetLoading: (isLoading) => dispatch(activitySetLoading(isLoading)),
    userGetMe: () => dispatch(userGetMe()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps,)(ActivityLayoutLayout)
