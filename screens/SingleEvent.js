import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box1: {
    backgroundColor: '#e3aa1a',
    height: 75
  },
  box2: {
    backgroundColor: 'grey',
    height: 75
  },
  box3: {
    backgroundColor: 'white',
    height: 250
  },
  box4: {
    backgroundColor: 'grey',
    height: 75
  },
  box5: {
    backgroundColor: 'white',
    height: 200
  }
});

class SingleEvent extends Component {
  render() {
    const { navigation } = this.props;
    let event = false;
    if (this.props.selectedEvent) {
      event = Object.values(this.props.selectedEvent)[0];
      console.log(event);

      return (
        { event } && (
          <View style={styles.container}>
            <View style={styles.box1}>
              <Text>{event.name}</Text>
            </View>
            <View style={styles.box2}>
              <Text>
                {event.date} {event.time}
              </Text>
            </View>
            <View style={styles.box3}>
              <Text>{event.location.locationName}</Text>
            </View>
            <View style={styles.box4}>
              {event.invites.map(invitee => (
                <Text key={invitee}> {invitee} </Text>
              ))}
            </View>
            <View style={styles.box5}>
              <Text>Names</Text>
            </View>
          </View>
        )
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = ({ event }) => ({
  selectedEvent: event.selectedEvent
});

export default connect(mapStateToProps)(SingleEvent);
