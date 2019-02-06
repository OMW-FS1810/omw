/* eslint-disable no-use-before-define */
import React from 'react';
import { Notifications, Audio } from 'expo';
import { View, StyleSheet, AppState, Text } from 'react-native';
import { Snackbar, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { addEventToList } from '../redux/event';

class Notify extends React.Component {
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
        if (this.state.incoming.messageType === 'new-event') {
          this.props.addEvent(this.state.incoming.newEventObject);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  render() {
    let label = 'OK';
    let newEvent = false;
    if (this.state.incoming.messageType === 'new-event') {
      label = 'View';
      newEvent = true;
    }
    return (
      <Snackbar
        style={styles.snackbar}
        visible={this.state.visible}
        onDismiss={() => this.setState({ visible: false, incoming: {} })}
        duration="7000"
        action={{
          label: label,
          onPress: () => {
            if (newEvent) {
              this.props.selectEvent(this.state.incoming.newEventObject);
            }
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

const mapDispatch = dispatch => ({
  addEvent: event => dispatch(addEventToList(event))
});

export default connect(
  null,
  mapDispatch
)(Notify);
