import React from 'react';
import { Notifications, Audio } from 'expo';
import { View, StyleSheet, AppState, Text } from 'react-native';
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
    if (AppState.currentState === 'active') {
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
      <Snackbar
        style={styles.snackbar}
        visible={this.state.visible}
        onDismiss={() => this.setState({ visible: false })}
        duration="7000"
        action={{
          label: 'View',
          onPress: () => {
            this.props.selectEvent(this.state.incoming.newEventObject);
            //below is if we want to jump to details page
            // this.props.navigation.navigate('SingleEvent')
          }
        }}
      >
        {this.state.incoming.message}
      </Snackbar>
    );
  }
}

const styles = StyleSheet.create({
  snackbar: {}
});
