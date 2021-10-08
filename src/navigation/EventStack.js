import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Event from '../screen/Event';
import Form from '../screen/Event/EventForm';
import QR from '../screen/Event/EventQR';
import {color, font} from '../values';

const Stack = createStackNavigator();

const StackScreen = ({navigation, route}) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });
  return (
    <Stack.Navigator
      initialRouteName="Event"
      screenOptions={{
        headerTintColor: color.textPrimary,
        headerStyle: {
          backgroundColor: color.navBar,
        },
        headerTitleStyle: {
          color: color.textPrimary,
          fontSize: font.size.navbarTitle,
        },
      }}>
      <Stack.Screen
        name="Event"
        component={Event}
        options={{
          title: 'Event',
        }}
      />
      <Stack.Screen
        name="EventForm"
        component={Form}
        options={({route}) => ({
          title: route.params.title || 'Form',
        })}
      />
      <Stack.Screen
        name="EventQR"
        component={QR}
        options={({route}) => ({
          title: route.params.title || 'Detail',
        })}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
