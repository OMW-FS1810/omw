import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {connect} from 'react-redux'
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

import AppNavigation from '../navigation/AppNavigation'
import user from './user';
import event from './event';
import navReducer from './nav'

const reducer = combineReducers({
  user,
  event,
  nav: navReducer
});

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

const App = reduxifyNavigator(AppNavigation, "root");
const mapStateToProps = (state) => ({
  state: state.nav,
});

export const AppWithNavigationState = connect(mapStateToProps)(App);

export const store = createStore(
  reducer,
  applyMiddleware(middleware),
);

// const middleware = composeWithDevTools(
//   applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
// );


export * from './user';
export * from './event';
