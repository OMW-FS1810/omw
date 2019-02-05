import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connect } from 'react-redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer
} from 'react-navigation-redux-helpers';

import AppNavigation from '../navigation/AppNavigation';

import eventReducer from './event';
import navReducer from './nav';
import authReducer from './auth';
import animateReducer from './animate';
import messagingReducer from './messaging';

const reducer = combineReducers({
  event: eventReducer,
  nav: navReducer,
  user: authReducer,
  animate: animateReducer,
  messaging: messagingReducer
});
/*
  *********** THESE ARE OUR VALUES ON STORE ***********
  event:
    store.event.allEvents: {},
    store.event.selectedEvent: {},
    store.event.pendingCreateEventDeets: {},
    store.event.pendingCreateEventInvites: []
  ____________
  
  user:
    store.user: {
      store.user.user.uid: null,
      store.user.user.email: '',
      store.user.user.firstName: '',
      store.user.user.lastName: '',
      store.user.user.pictureUrl: '',
      store.user.user.deviceId: null,
      store.user.user.token: null
    }
  ____________
  
  animate:
    store.animate.allEventsAnimate: new Animated.Value(0)
  ____________
  
  messaging:
    store.messaging.sent: []
    store.messaging.received: []
  ____________
*/

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

const App = reduxifyNavigator(AppNavigation, 'root');
const mapStateToProps = state => ({
  state: state.nav
});

export const AppWithNavigationState = connect(mapStateToProps)(App);

export const store = createStore(
  reducer,
  applyMiddleware(middleware, thunkMiddleware)
);

// const middleware = composeWithDevTools(
//   applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
// );

export * from './event';
export * from './auth';
export * from './messaging';
