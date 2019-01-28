import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  StatusBar,
  AsyncStorage
} from 'react-native';

class Settings extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Settings
