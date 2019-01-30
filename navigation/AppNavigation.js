import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { color } from '../styles/theme';

import {
  Signup,
  EventMap,
  CreateEvent,
  Auth,
  Invite,
  Profile,
  Settings,
  AuthLoading
} from '../screens';

//DRAWER STACK
const DrawerStack = createDrawerNavigator(
  {
    'Event Map': { screen: EventMap },
    'Create an Event': { screen: CreateEvent },
    // Invite: { screen: Invite },
    Profile: { screen: Profile },
    Settings: { screen: Settings }
  },
  {
    // headerMode: 'float',
    drawerPosition: 'right',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'transparent' },
      // title: 'Logged in!',
      headerRight: (
        <Icon
          name="menu"
          color={color.blue}
          containerStyle={{ paddingRight: 10 }}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      )
    })
  },
  { headerMode: 'none' }
);

//CREATE EVENT STACK
const CreateEventStack = createStackNavigator({
  createEventScreen: { screen: CreateEvent },
  inviteScreen: { screen: Invite }
});

const DrawerNavigation = createStackNavigator({
  DrawerStack: { screen: DrawerStack }
});

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
      App: { screen: DrawerNavigation },
      CreateEvent: { screen: CreateEventStack }
    },
    {
      initialRouteName: 'LoginStack'
    }
  )
);
