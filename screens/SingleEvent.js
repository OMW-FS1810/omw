import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  boxContainer: {
    flex: 1
  },
  box1: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center'
  },
  box2: {
    backgroundColor: 'blue',
    flex: 3,
    fontSize: 48
  },
  box3: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center'
  },
  box4: {
    backgroundColor: 'blue',
    flex: 3,
    fontSize: 48
  },
  text: {
    color: 'white',
    fontSize: 60
  }
});

class SingleEvent extends Component {
   static navigationOptions = {title: 'Single Event'}
  render() {
    // const { navigation } = this.props;
    let event = false;
    if (this.props.selectedEvent) {
      event = Object.values(this.props.selectedEvent)[0];

      return (
        { event } && (
          <View style={styles.container}>
            <View style={[styles.boxContainer, styles.box1]}>
              <Text style={styles.text}>DETAILS</Text>
            </View>
            <View style={[styles.boxContainer, styles.box2]}>
              <Text>Event:</Text>
              <Text>{event.name}</Text>
              <Text>Location:</Text>
              <Text>{event.location.locationName}</Text>
              <Text>Date:</Text>
              <Text>{event.date}</Text>
              <Text>Time:</Text>
              <Text>{event.time}</Text>
            </View>
            <View style={[styles.boxContainer, styles.box3]}>
              <Text style={styles.text}>INVITEES</Text>
            </View>
            <View style={[styles.boxContainer, styles.box4]}>
              <Text>Email:</Text>
              {event.invites.map(invitee => (
              <Text key={invitee}> {invitee} </Text>
              ))}
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
