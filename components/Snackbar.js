/* eslint-disable no-use-before-define */
import React from 'react';
import { Notifications, Audio } from 'expo';
import { View, StyleSheet, AppState, Text } from 'react-native';
import { Snackbar, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import {
  addEventToList,
  fetchAllEvents,
  setSelectedEvent,
  trackMembersStart,
  trackMembersStop
} from '../redux/event';

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
    await this.setState({ incoming: notification.data, visible: true });
    if (AppState.currentState === 'active') {
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../assets/sounds/bamboo.mp3'));
        await soundObject.playAsync();
        if (this.state.incoming.messageType === 'new-event') {
          this.props.addEvent(this.state.incoming.newEventObject);
        } else if (this.state.incoming.messageType === 'update') {
          this.props.fetchAllEvents(this.props.myEmail);
          if (Object.keys(this.props.selectedEvent).length) {
            let oldEvent = this.props.selectedEvent;
            let oldInvites = Object.values(this.props.selectedEvent)[0].invites;
            let { thisIndex } = this.state.incoming;
            console.log('incoming', this.state.incoming);
            let newInvites = oldInvites.map((item, index) => {
              console.log(
                'item and index and thisIndex',
                item,
                index,
                thisIndex
              );
              if (index == thisIndex) {
                return {
                  email: this.state.incoming.myEmail,
                  status: this.state.incoming.newEventObject
                };
              } else {
                return item;
              }
            });
            console.log('old', oldInvites, 'new', newInvites);
            //maybe need to clear old ones?
            this.props.setSelectedEvent({});
            const thisOldKey = Object.keys(oldEvent)[0];
            const thisOldEvent = Object.values(oldEvent)[0];
            const updatedEvent = {
              [thisOldKey]: { ...thisOldEvent, invites: newInvites }
            };
            console.log('updated', updatedEvent);
            this.props.setSelectedEvent(updatedEvent);
            this.props.trackMembersStop(Object.values(oldInvites));
            const location = Object.values(this.props.selectedEvent)[0]
              .location;
            const latitude = location.locationGeocode.lat;
            const longitude = location.locationGeocode.lng;
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.1226,
              longitudeDelta: 0.0467
            };
            this.props.trackMembersStart(
              Object.values(this.props.selectedEvent)[0].invites,
              newRegion
            );
          }
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
const mapState = ({ user, event }) => ({
  myEmail: user.user.email,
  selectedEvent: event.selectedEvent
});
const mapDispatch = dispatch => ({
  addEvent: event => dispatch(addEventToList(event)),
  fetchAllEvents: email => dispatch(fetchAllEvents(email)),
  setSelectedEvent: event => dispatch(setSelectedEvent(event)),
  trackMembersStart: (members, newRegion) =>
    dispatch(trackMembersStart(members, newRegion)),
  trackMembersStop: members => dispatch(trackMembersStop(members))
});

export default connect(
  mapState,
  mapDispatch
)(Notify);
