import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { setUserAndDevice } from '../redux/store';
import { connect } from 'react-redux';

class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('user');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken) {
      const thisUserData = JSON.parse(userToken);
      await this.props.setUserAndDevice(thisUserData);
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('LoginStack');
    }

    // await AsyncStorage.clear();
    // this.props.navigation.navigate('Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapDispatchToProps = dispatch => ({
  setUserAndDevice(user) {
    return dispatch(setUserAndDevice(user));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(AuthLoading);
