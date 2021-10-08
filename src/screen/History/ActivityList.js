import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import moment from 'moment';

import styles from './styles/activity-list';
import {color} from '../../values';

const ActivityList = ({data, isLastIndex = false, dateBefore = null}) => {
  return (
    <>
      {(dateBefore == null ||
        moment(data.dateTime).format('YYYY-MM-DD') !==
          moment(dateBefore).format('YYYY-MM-DD')) && (
        <View style={styles.mainContainer}>
          <View style={styles.leftIndicatorContainer}>
            <View
              style={[styles.dotIndicator, {backgroundColor: color.accent}]}
            />
            <View style={styles.verticalLine} />
          </View>
          <View style={[styles.middleContainer, {marginLeft: 0}]}>
            <Text style={styles.dateText}>
              {moment(data.dateTime).format('DD MMM YYYY')}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.mainContainer}>
        <View style={styles.leftIndicatorContainer}>
          <View style={styles.dotIndicator} />
          {!isLastIndex && <View style={styles.verticalLine} />}
        </View>
        <View style={styles.middleContainer}>
          <Text style={styles.activityText}>
            {data.activityType.activityTypeName}
          </Text>
          <Text style={styles.locationText}>{data.location.locationName}</Text>
        </View>
        <Text style={styles.timeText}>
          {moment(data.dateTime).format('HH:mm')}
        </Text>
      </View>
    </>
  );
};

export default ActivityList;
