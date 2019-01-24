import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { EventMap } from './screens';
import { Homepage } from './components';
import { Provider as StoreProvider } from 'react-redux';
import store from './store';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow'
  }
};

export default class App extends React.Component {
  render() {
    return (
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <EventMap />
        </PaperProvider>
      </StoreProvider>
    );
  }
}
