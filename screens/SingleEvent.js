import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { setSingleEvent } from '../redux/store';
import { connect } from 'react-redux';

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
    console.log('email in events page', this.props)
    return (
        <View style={styles.container}>
            <View style={styles.box1}>
              <Text>Event</Text>
            </View>
            <View style={styles.box2}>
              <Text>Details</Text>
            </View>
            <View style={styles.box3}>
              <Text>Location</Text>
            </View>
            <View style={styles.box4}>
              <Text>Invitees</Text>
            </View>
            <View style={styles.box5}>
              <Text>Names</Text>
            </View>
        </View>
    );
  }
}



const mapStateToProps = state => ({
  email: state.email
});

const mapDispatchToProps = dispatch => ({
  singleEvent: event => dispatch(setSingleEvent(event))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleEvent);
