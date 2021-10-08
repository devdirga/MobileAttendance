import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';

import { wrapperNoScroll } from '../../hoc';

import styles from './styles/event-qr';

import { eventGetByID } from '../../store/action/event';

const EventQR = ({
  navigation,
  route,

  user,
  eventGetByID,
}) => {
  const [qrContainerWidth, setQRContainerWidth] = useState(8);

  const [model, setModel] = useState({
    name: '',
    attendees: [],
    startTime: '',
    endTime: '',
    location: {},
    description: '',
  });

  useEffect(() => {
    methods.refresh();
    return () => { };
  }, []);

  useEffect(() => {
    return () => { };
  }, [model]);

  const methods = {
    refresh: () => {

      if (route.params.eventID) {
        eventGetByID(route.params.eventID, (res) => {
          if (res.success) {
            let temp = res.data;
            temp.attendees = temp.attendees.map((att) => {
              att.id = att.userID;
              if (!att.name) {
                att.name = att.email;
              }
              return att;
            });

            setModel({
              ...temp,
            });
          }
        });
      }
    },
    onLayout: (e, type = 'qr') => {
      switch (type) {
        case 'qr':
          setQRContainerWidth(e.nativeEvent.layout.width);
          break;
        default:
          break;
      }
    },
    qrWidth: () => {
      let minWidth = 150;
      if (qrContainerWidth - 64 > minWidth) {
        return qrContainerWidth - 64;
      }
      return minWidth;
    },
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView
        style={styles.inputContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              methods.refresh();
            }}
          />
        }>
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.textCaption}>Title</Text>
            <Text style={styles.eventText}>{model.name}</Text>
          </View>
          <View style={styles.columnContainer}>
            <Text style={styles.textCaption}>Description</Text>
            <Text style={styles.textValue}>{model.description}</Text>
          </View>
        </View>
        <View style={styles.columnContainerWithoutFlex}>
          <Text style={styles.textCaption}>Location</Text>
          <View style={styles.locationContainer}>
            <Icon style={styles.eventLocationIcon} name="map-marker-alt" />
            <Text style={styles.eventLocation} numberOfLines={1}>
              {model.location.locationName} - {model.location.locationAddress}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.textCaption}>From</Text>
            <Text style={styles.textValue}>
              {moment(model.startTime).format('DD MMM YYYY')}
            </Text>
            <View style={styles.timeContainer}>
              <Icon style={styles.timeIcon} name="clock" />
              <Text style={styles.timeValue}>
                {moment(model.startTime).format('HH:mm')}
              </Text>
            </View>
          </View>
          <View style={styles.columnContainer}>
            <Text style={styles.textCaption}>To</Text>
            <Text style={styles.textValue}>
              {moment(model.endTime).format('DD MMM YYYY')}
            </Text>
            <View style={styles.timeContainer}>
              <Icon style={styles.timeIcon} name="clock" />
              <Text style={styles.timeValue}>
                {moment(model.endTime).format('HH:mm')}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={styles.qrContainer}
          onLayout={(e) => methods.onLayout(e, 'qr')}>
          <QRCode
            value={`${model.id},${user.email}`}
            size={methods.qrWidth()}
            logo={require('../../assets/images/kara-black-white.png')}
            logoSize={methods.qrWidth() / 4}
          />
        </View>
      </ScrollView>
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
    eventGetByID: (id, callback) => dispatch(eventGetByID(id, callback)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(wrapperNoScroll(EventQR));
