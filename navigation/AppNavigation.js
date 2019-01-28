import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { Text, Button } from 'react-native';

import {
  Signup,
  EventMap,
  CreateEvent,
  Auth,
  Invite,
  Profile,
  UserProfile,
  Settings,
  AuthLoading
} from '../screens';

//DRAWER STACK
const DrawerStack = createDrawerNavigator(
  {
    'Event Map': { screen: EventMap },
    'Create an Event': { screen: CreateEvent },
    Invite: { screen: Invite },
    Profile: { screen: Profile },
    UserProfile: { screen: UserProfile },
    Settings: { screen: Settings }
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

const DrawerNavigation = createStackNavigator({
  DrawerStack: { screen: DrawerStack }
});

//CREATE EVENT STACK
// const CreateEventStack = createStackNavigator({
//   createEventScreen: { screen: CreateEvent },
//   inviteScreen: { screen: Invite }
// });

//LOGIN STACK
const LoginStack = createStackNavigator({
  loginScreen: { screen: Auth },
  signupScreen: { screen: Signup }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: { screen: AuthLoading },
      LoginStack: { screen: LoginStack },
      App: { screen: DrawerNavigation }
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
