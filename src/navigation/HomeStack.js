import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screen/Home';
import Activity from '../screen/Activity';
import ScanQR from '../screen/ScanQR';
import Purchase from '../screen/Purchase';
import Survey from '../screen/Survey';

import Color from '../values/color';

const Stack = createStackNavigator();

const StackScreen = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.primary,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '500',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanQR"
        component={ScanQR}
        options={{
          title: 'Attendee Scanning',
        }}
      />
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={({ route }) => ({
          title: route.params.title,
          tabBarVisible: false,
        })}
      />
      <Stack.Screen
        name="Survey"
        component={Survey}
        options={({ route }) => ({
          title: 'Mohon isi survey berikut :',
          tabBarVisible: false,
        })}
      />
      <Stack.Screen
        name="Purchase"
        component={Purchase}
        options={({ route }) => ({
          title: 'Purchase',
        })}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
