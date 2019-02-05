import React from 'react';
import { Notifications, Audio } from 'expo';
import { View, StyleSheet, AppState } from 'react-native';
import { Snackbar, Button } from 'react-native-paper';

export default class Notify extends React.Component {
  state = {
    incoming: {},
    visible: false
  };

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  _handleNotification = async notification => {
    this.setState({ incoming: notification.data, visible: true });
    console.log(AppState.cuurentState);
    if (AppState.cuurentState === 'active') {
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../assets/sounds/bamboo.mp3'));
        await soundObject.playAsync();
      } catch (err) {
        console.error(err);
      }
    }
  };

  render() {
    return (
      // <View style={styles.container}>
      <Snackbar
        visible={this.state.visible}
        onDismiss={() => this.setState({ visible: false })}
        duration="10000"
        action={{
          label: 'Open',
          onPress: () => {
            // Do something
            // this.props.navigation.navigate('Notifications');
          }
        }}
      >
        {this.state.incoming.message}
      </Snackbar>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'space-between',
    position: 'absolute',
    top: 10
  }
});
