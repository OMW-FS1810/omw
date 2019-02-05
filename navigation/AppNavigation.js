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
const mapStack = createStackNavigator(
  {
    eventMapScreen: { screen: EventMap }
  },
  {
    navigationOptions: () => {}
  }
);

//CREATE EVENT STACK
const CreateEventStack = createStackNavigator(
  {
    createEventScreen: {
      screen: CreateEvent,
      navigationOptions: {
        headerTitle: 'Create Event'
      }
    },
    inviteScreen: {
      screen: Invite,
      navigationOptions: {
        headerTitle: 'Invite'
      }
    }
  },
  // s
);

//DRAWER STACK
const DrawerStack = createDrawerNavigator(
  {
    'Event Map': { screen: mapStack },
    'Create an Event': { screen: CreateEventStack },
    Profile: { screen: Profile },
    SingleEvent: { screen: SingleEvent }
  },
  {
    drawerPosition: 'right',
    navigationOptions: () => null
    // navigationOptions: ({ navigation }) => ({
    //   headerStyle: { backgroundColor: 'transparent' },
    //   title: navigation.state.routeName,
    //   // title: 'Logged in!',
    //   headerRight: (
    //     <Icon
    //       name="menu"
    //       color={color.blue}
    //       containerStyle={{ paddingRight: 10 }}
    //       onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    //     />
    //   )
    // })
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
