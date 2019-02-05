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
import MenuDrawer from '../components/MenuDrawer'
import { Platform, Dimensions } from 'react-native';

import {
  Signup,
  EventMap,
  CreateEvent,
  Auth,
  Invite,
  Profile,
  Settings,
  AuthLoading,
  SingleEvent,
  Notifications
} from '../screens';

//CREATE MAP STACK
// const CreateMapStack = createStackNavigator({
//   createEventMap: {
//     screen: EventMap,
//     navigationOptions: {
//       headerTitle: 'Event Map'
//     },
//   },
//   singleEvent: {
//     screen: SingleEvent,
//     navigationOptions: {
//       headerTitle: 'Single Event'
//     },
//   },
// });

//CREATE EVENT STACK
const CreateEventStack = createStackNavigator({
  createEventScreen: {
    screen: CreateEvent,
    // navigationOptions: {
    //   headerTitle: 'Create Event'
    // }
  },
  inviteScreen: {
    screen: Invite,
    // navigationOptions: {
    //   headerTitle: 'Invite'
    // }
  }
});

//LOGIN STACK
const LoginStack = createStackNavigator({
  loginScreen: { screen: Auth },
  signupScreen: { screen: Signup }
});
import { Snackbar } from '../components';

//DRAWER STACK
// const DrawerStack = createDrawerNavigator(
//   {
//     'Event Map': { screen: EventMap, headerTitle: 'Event Map' },
//     'Create an Event': { screen: CreateEvent },
//     Profile: { screen: Profile },
//     SingleEvent: { screen: SingleEvent }
//     // Invite: { screen: Invite },
//     // Notifications: { screen: Notifications }
//   },
//   {
//     headerMode: 'float',
//     drawerPosition: 'right',
//     navigationOptions: ({ navigation }) => ({
//       headerStyle: { backgroundColor: 'transparent' },
//       title: navigation.state.routeName,
//       // title: 'Logged in!',
//       headerRight: (
//         <Icon
//           name="menu"
//           color={color.blue}
//           containerStyle={{ paddingRight: 10 }}
//           onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
//         />
//       )
//     })
//   },
//   { headerMode: 'none' }
// );

// const DrawerNavigation = createStackNavigator({
//   'My Events': {
//     screen: DrawerStack
//     // navigationOptions: ({ navigation }) => ({
//     //   headerTitle: navigation.state.routeName
//   },
//   Test: { screen: CreateEventStack }
//   // )}
// });

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
	drawerWidth: WIDTH*0.83,
	contentComponent: ({ navigation }) => {
		return(<MenuDrawer navigation={navigation} />)
	}
}

const DrawerNavigator =  createDrawerNavigator(
	{
		'Event Map': {
			screen: EventMap
		},
		'Create Event': {
			screen: CreateEvent
		},
		Profile: {
			screen: Profile
    },
    SingleEvent: {
			screen: SingleEvent
		}
	},
	DrawerConfig
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: { screen: AuthLoading },
      LoginStack: { screen: LoginStack },
      App: { screen: DrawerNavigator },
      CreateEvent: { screen: CreateEventStack }
      //CreateMap: { screen: CreateMapStack }
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

// const EventMapS = createStackNavigator(
//   {
//     'Event Map': {
//       screen: EventMap
//     }
//   },
//   {
//     navigationOptions: ({ navigation }) => ({
//       initialRouteName: 'MainScreen',
//       headerMode: 'screen',
//       headerTitle: 'Main Screen Header',
//       drawerLabel: 'Main Screen'
//     })
//   }
// );
