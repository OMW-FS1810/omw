import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchAllEvents } from '../redux/event';

class EventList extends Component {
  async componentDidMount() {
    await this.props.fetchEvents(this.props.user.uid);
  }

  render() {
    console.log('event list?', this.props.allEvents);
    return (
      <View Style={styles.container}>
        <Text>hello from event list</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

const mapState = state => ({
  user: state.user.user,
  allEvents: state.event.allEvents
});

const mapDispatch = dispatch => ({
  fetchEvents: userId => dispatch(fetchAllEvents(userId))
});

export default connect(
  mapState,
  mapDispatch
)(EventList);
