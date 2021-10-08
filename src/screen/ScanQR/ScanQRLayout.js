import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useIsFocused} from '@react-navigation/native';

import {connect} from 'react-redux';

import {showAlert} from '../../components/Alert';
import Button from '../../components/Button';

import axios from '../../plugin/axios';
import {color} from '../../values';

import {eventGetByID, eventScan} from '../../store/action/event';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: color.primary,
    paddingHorizontal: 40,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: '300',
    fontSize: 18,
  },
  cameraPanel: {
    flex: 4,
  },
  eventDetail: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  labelDetail: {
    fontSize: 10,
    marginTop: 15,
    color: 'rgba(0,0,0,.35)',
  },
  valueDetail: {
    fontSize: 13,
    marginTop: 3,
    color: 'rgba(0,0,0,1)',
    fontWeight: '300',
  },
});

const ScanQRLayout = ({eventGetByID, eventScan}) => {
  const isFocused = useIsFocused();
  const [eventData, setEventData] = React.useState(null);
  const [qrData, setQrData] = React.useState(null);
  const [showConfirmHideRescan, setShowConfirmHideRescan] = React.useState(
    true,
  );

  const onBarCodeRead = async (scanResult) => {
    if (!!scanResult.data) {
      let qrCode = scanResult.data.split(',');
      setQrData(scanResult.data);
      let eventId = qrCode[0];

      eventGetByID(eventId, (res) => {
        if (res.success) {
          setEventData(res.data);
          setQrData(scanResult.data);
        } else {
          showAlert({
            title: 'Warning',
            detail: 'Event not found',
            type: 'warning',
          });
        }
      });
    }
    return;
  };

  React.useEffect(() => {
    if (eventData != null) setShowConfirmHideRescan(true);
    else setShowConfirmHideRescan(false);
    return () => {
      setShowConfirmHideRescan(true);
    };
  }, [eventData]);

  const confirmCheckin = () => {
    showAlert({
      title: 'Are you sure?',
      detail: 'This action will make attende checkin to the event',
      type: 'info',
      buttons: [
        {
          text: 'Continue',
          type: 'info',
          onPress: async () => {
            eventScan(
              {
                barcode: qrData,
              },
              (res) => {
                if (res.success) {
                  showAlert({
                    title: 'Success',
                    detail: 'Attendee successfully logged to the event.',
                    type: 'success',
                    buttons: [
                      {
                        text: 'OK',
                        type: 'info',
                        onPress: async () => {
                          setShowConfirmHideRescan(false);
                        },
                      },
                    ],
                  });
                } else {
                  showAlert({
                    title: 'Error',
                    detail: res.message,
                    type: 'danger',
                    buttons: [
                      {
                        text: 'OK',
                        type: 'info',
                        onPress: async () => {
                          setShowConfirmHideRescan(false);
                        },
                      },
                    ],
                  });
                }
              },
            );
          },
        },
      ],
    });
  };

  return !isFocused ? (
    <Text>Navigation is not focuse, so we make the camera is not working</Text>
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {eventData == null
            ? `Scan the QR code on the invitation`
            : `Event Detail`}
        </Text>
      </View>
      {eventData == null && (
        <RNCamera
          style={styles.cameraPanel}
          onBarCodeRead={(e) => onBarCodeRead(e)}
        />
      )}
      {eventData != null && (
        <View style={styles.eventDetail}>
          <Text style={styles.labelDetail}>Name</Text>
          <Text style={styles.valueDetail}>{eventData.name}</Text>
          <Text style={styles.labelDetail}>Description</Text>
          <Text style={styles.valueDetail}>{eventData.description}</Text>
          <Text style={styles.labelDetail}>Date</Text>
          <Text style={styles.valueDetail}>{eventData.startTime}</Text>
          <Text style={styles.labelDetail}>Location</Text>
          <Text style={styles.valueDetail}>
            {eventData.location.locationName}
          </Text>
          <Text style={styles.labelDetail}>Organizer</Text>
          <Text
            style={
              styles.valueDetail
            }>{`${eventData.organizerDetail.firstName}, ${eventData.organizerDetail.lastName}`}</Text>

          <View style={{flexDirection: 'row', paddingVertical: 20}}>
            <Button
              text="Cancel"
              containerStyle={{marginRight: 10}}
              size="md"
              textColor="white"
              onPress={() => {
                setEventData(null);
              }}
              color="tomato"
            />
            {showConfirmHideRescan && (
              <Button
                text="Check in"
                onPress={() => {
                  confirmCheckin();
                }}
                size="md"
                textColor="white"
                color="green"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    entity: state.entity,
    location: state.location,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    eventScan: ({barcode}, callback) =>
      dispatch(eventScan({barcode}, callback)),
    eventGetByID: (id, callback) => dispatch(eventGetByID(id, callback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanQRLayout);
