import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { Text } from 'react-native';
import { color, fontFamily } from '../styles/theme';
import { Snackbar } from '../components';

import {
  Signup,
  EventMap,
  CreateEvent,
  Auth,
  Invite,
  Profile,
  AuthLoading,
  SingleEvent
} from '../screens';

//LOGIN STACK
const LoginStack = createStackNavigator({
  loginScreen: { screen: Auth },
  signupScreen: { screen: Signup }
});

//MAP STACK
const mapStack = createStackNavigator({
  eventMapScreen: { screen: EventMap },
  SingleEvent: { screen: SingleEvent }
});

//CREATE EVENT STACK
const CreateEventStack = createStackNavigator(
  {
    createEventScreen: {
      screen: CreateEvent
    },
    inviteScreen: {
      screen: Invite
    }
  }
  // s
);

//DRAWER STACK
const DrawerStack = createDrawerNavigator(
  {
    'EVENT MAP': { screen: mapStack },
    'CREATE EVENT': { screen: CreateEventStack },
    PROFILE: { screen: Profile }
    // SingleEvent: { screen: SingleEvent }
  },
  {
    drawerPosition: 'left',
    drawerBackgroundColor: color.lightBlue,
    drawerType: 'slide',
    contentOptions: {
      activeTintColor: color.whiteBlue,
      activeBackgroundColor: color.blue,
      inactiveTintColor: color.indigoBlue
    }
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: { screen: AuthLoading },
      LoginStack: { screen: LoginStack },
      App: { screen: DrawerStack },
      CreateEvent: { screen: CreateEventStack }
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
