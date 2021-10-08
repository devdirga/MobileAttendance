import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import HistoryStack from './HistoryStack';
import EventStack from './EventStack';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return <FontAwesome5 name="home" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => {
            return <FontAwesome5 name="history" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="EventTab"
        component={EventStack}
        options={{
          tabBarLabel: 'Event',
          tabBarIcon: ({color, size}) => {
            return <FontAwesome5 name="tasks" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => {
            return <FontAwesome5 name="user-alt" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
