import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions
} from 'react-navigation';
import { Text, Button } from 'react-native';

import {
  LoginScreen,
  SignupScreen,
  ForgotPasswordScreen,
  EventMap,
  CreateEvent,
  Screen1
} from '../screens';

//DRAWER STACK
const DrawerStack = createDrawerNavigator({
  screen1: { screen: Screen1 },
  'Create an Event': { screen: CreateEvent },
  'Event Map': { screen: EventMap }
});

//LOGGED IN DRAWER STACK
const DrawerNavigation = createStackNavigator(
  {
    DrawerStack: { screen: DrawerStack }
  },
  {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#384D66' },
      title: 'Logged in!',
      headerLeft: (
        <Button
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          title="MENU"
        />
      )
    })
  }
);

//LOGIN STACK
const LoginStack = createStackNavigator(
  {
    loginScreen: { screen: LoginScreen },
    signupScreen: { screen: SignupScreen },
    forgotPasswordScreen: {
      screen: ForgotPasswordScreen,
      navigationOptions: { title: 'Forgot Password' }
    }
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: { backgroundColor: '#827B84' },
      title: 'Not Logged In',
      headerTintColor: 'white'
    }
  }
);

const PrimaryNav = createStackNavigator(
  {
    loginStack: { screen: LoginStack },
    DrawerStack: { screen: DrawerNavigation }
  },
  {
    headerMode: 'float',
    title: 'Main',
    initialRouteName: 'DrawerStack'
  }
);

export default PrimaryNav;
