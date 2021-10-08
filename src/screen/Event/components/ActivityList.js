import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from '../styles/activity-list';
import { color } from '../../../values';

const ActivityList = ({
  data,
  index,
  isLastIndex = false,
  dateBefore = null,
  onPress,
}) => {

  return (

    <>
      {(index == 0 ||
        (moment(data.startTime).format('YYYY-MM-DD') !==
          moment(dateBefore).format('YYYY-MM-DD') &&
          ((moment(data.startTime).isSameOrAfter(new Date()) &&
            !moment(dateBefore).isSameOrAfter(new Date())) ||
            (moment(data.startTime).isBefore(new Date()) &&
              !moment(dateBefore).isBefore(new Date()))))) && (
          <View style={styles.mainContainer}>
            <View style={styles.leftIndicatorContainer}>
              <View
                style={[styles.dotIndicator, { backgroundColor: color.accent }]}
              />
              <View style={styles.verticalLine} />
            </View>
            <View style={[styles.middleContainer, { marginLeft: 0 }]}>
              <Text style={styles.groupText}>
                {moment(data.startTime).isSameOrAfter(new Date())
                  ? 'Upcoming Events'
                  : 'Past Events'}
              </Text>
            </View>
          </View>
        )}
      <TouchableOpacity
        style={styles.mainContainer}
        activeOpacity={0.5}
        onPress={onPress}>
        <View style={styles.leftIndicatorContainer}>
          <View style={styles.dotIndicator} />
          {!isLastIndex && <View style={styles.verticalLine} />}
        </View>
        <View style={styles.middleContainer}>
          <View style={styles.eventHeaderContainer}>
            <Text style={styles.eventText}>{data.name}</Text>
            <View style={styles.locationContainer}>
              <Icon style={styles.eventLocationIcon} name="map-marker-alt" />
              <Text style={styles.eventLocation} numberOfLines={1}>
                {/* {data.location.locationName} */}
              </Text>
            </View>
          </View>
          <View style={styles.dateTextContainer}>
            <View style={styles.dateTextColumn}>
              <Text style={styles.dateCaption}>From</Text>
              <Text style={styles.dateValue}>
                {moment(data.startTime).format('DD MMM YYYY')}
              </Text>
              <View style={styles.timeContainer}>
                <Icon style={styles.timeIcon} name="clock" />
                <Text style={styles.timeVale}>
                  {moment(data.startTime).format('HH:mm')}
                </Text>
              </View>
            </View>
            <View style={styles.dateTextColumn}>
              <Text style={styles.dateCaption}>To</Text>
              <Text style={styles.dateValue}>
                {moment(data.endTime).format('DD MMM YYYY')}
              </Text>
              <View style={styles.timeContainer}>
                <Icon style={styles.timeIcon} name="clock" />
                <Text style={styles.timeVale}>
                  {moment(data.endTime).format('HH:mm')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ActivityList;
