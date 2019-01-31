import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { Font, AppLoading } from 'expo';

import { AppWithNavigationState, store } from './redux/store';
// import * as theme from './styles/theme';

// function cacheFonts(fonts) {
//   return fonts.map(font => Font.loadAsync(font));
// }
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    accent: 'green'
  }
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  // async _loadAssetsAsync() {
  //   const fontAssets = cacheFonts([
  //     { RobotoExtraBold: require('./assets/fonts/Roboto-Black.ttf') },
  //     { RobotoBold: require('./assets/fonts/Roboto-Bold.ttf') },
  //     { RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf') },
  //     { RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf') },
  //     { RobotoLight: require('./assets/fonts/Roboto-Light.ttf') }
  //   ]);

  //   await Promise.all([...fontAssets]);
  // }

  render() {
    // if (!this.state.isReady) {
    //   return (
    //     <AppLoading
    //       startAsync={this._loadAssetsAsync}
    //       onFinish={() => this.setState({ isReady: true })}
    //       onError={console.warn}
    //     />
    //   );
    // }

    return (
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <AppWithNavigationState />
        </PaperProvider>
      </StoreProvider>
    );
  }
}
