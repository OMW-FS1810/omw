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
  Auth,
  Invite,
  Profile,
  UserProfile
} from '../screens';

//DRAWER STACK
const DrawerStack = createDrawerNavigator(
  {
    Auth: { screen: Auth },
    'Create an Event': { screen: CreateEvent },
    'Event Map': { screen: EventMap },
    Invite: { screen: Invite },
    Profile: { screen: Profile },
    UserProfile: { screen: UserProfile }
  },
  {
    headerMode: 'float',
    drawerPosition: 'right',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#384D66' },
      title: 'Logged in!',
      headerRight: (
        <Button
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          title="MENU"
        />
      )
    })
  }
);

//LOGGED IN DRAWER STACK
// const DrawerNavigation = createStackNavigator({
//   DrawerStack: { screen: DrawerStack }
// });

//CREATE EVENT STACK
const CreateEventStack = createStackNavigator({
  createEventScreen: { screen: CreateEvent },
  inviteScreen: { screen: Invite }
});

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
    DrawerStack: { screen: DrawerStack },
    createEventStack: { screen: CreateEventStack }
  },
  {
    headerMode: 'float',
    title: 'Main',
    initialRouteName: 'DrawerStack'
  }
);

export default PrimaryNav;
