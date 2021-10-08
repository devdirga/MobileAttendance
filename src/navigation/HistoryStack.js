import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import History from '../screen/History';
import {color, font} from '../values';

const Stack = createStackNavigator();

const StackScreen = ({navigation, route}) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });
  return (
    <Stack.Navigator
      initialRouteName="History"
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
        name="History"
        component={History}
        options={{
          headerTitle: 'History',
          // headerTitleAlign: 'center'
        }}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
