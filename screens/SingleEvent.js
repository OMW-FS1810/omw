import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

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
    const {navigation} = this.props;
    const event = navigation.getParam('eventDetails', {}) // 2nd argument is a default value if not exists
    // console.log('event:', event);
    return (
        <View style={styles.container}>
            <View style={styles.box1}>
              <Text>{event.title}</Text>
            </View>
            <View style={styles.box2}>
              <Text>{event.description}</Text>
            </View>
            <View style={styles.box3}>
              <Text>{event.event.location.locationName}</Text>
            </View>
            <View style={styles.box4}>
              {event.event.invites.map(invitee => (
                <Text key={invitee}> {invitee} </Text>
              ))}
            </View>
            <View style={styles.box5}>
              <Text>Names</Text>
            </View>
        </View>
    );
  }
}


export default SingleEvent;
