import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Homepage } from './components';
import { CreateEvent } from './screens';
import { Provider as StoreProvider } from 'react-redux';
import store from './store';
import * as firebase from 'firebase';

import { config } from './config/firebase';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow'
  }
};

export default class App extends React.Component {
  componentDidMount() {
    // if (!firebase.apps.length) {
    // firebase.initializeApp(config);
    // }
  }
  render() {
    return (
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <CreateEvent />
        </PaperProvider>
      </StoreProvider>
    );
  }
}
