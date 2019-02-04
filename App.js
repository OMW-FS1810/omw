import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { Font, AppLoading, Asset } from 'expo';
import { AppWithNavigationState, store } from './redux/store';
import * as theme from './styles/theme';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/logo.png'),
    ]);

    const fontAssets = cacheFonts([
      { RobotoExtraBold: require('./assets/fonts/Roboto-Black.ttf') },
      { RobotoBold: require('./assets/fonts/Roboto-Bold.ttf') },
      { RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf') },
      { RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf') },
      { RobotoLight: require('./assets/fonts/Roboto-Light.ttf') }
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <AppWithNavigationState />
        </PaperProvider>
      </StoreProvider>
    );
  }
}
