import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { addEmailToEvent } from '../redux/store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box1: {
    flex: 1,
    backgroundColor: '#e3aa1a'
  },
  box2: {
    flex: 1,
    backgroundColor: 'grey'
  },
  box3: {
    flex: 3,
    backgroundColor: 'white'
  },
  box4: {
    flex: 3,
    backgroundColor: 'grey'
  },
  box5: {
    flex: 3,
    backgroundColor: 'white'
  },
  editButton: {
    alignSelf: 'flex-start'
  }
});

class SingleEvent extends Component {
  state = {
    editing: false,
    emailInput: '',
    edits: {
      name: '',
      date: '',
      time: ''
    }
  };

  handleAddToInviteList = uid => {
    const email = this.state.emailInput;
    this.props.addEmail(uid, email);
    this.setState({ emailInput: '' });
  };

  render() {
    const { navigation } = this.props;
    let event = false;

    if (this.props.selectedEvent) {
      event = Object.values(this.props.selectedEvent)[0];
      const uid = Object.keys(this.props.selectedEvent)[0];
      this.setState({
        edits: {
          name: event.name,
          date: event.date,
          time: event.time
        }
      });
      return (
        { event } && (
          <View style={styles.container}>
            <View style={styles.box1}>
              <Text>{event.name}</Text>
              <Button
                mode="contained"
                onPress={() => {
                  if (!this.state.editing) {
                    this.setState({ editing: true });
                  } else {
                    this.setState({ editing: false });
                  }
                }}
                style={styles.editButton}
              >
                <Text>{this.state.editing ? 'SAVE' : 'EDIT'}</Text>
              </Button>
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
              {this.state.editing ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    value={this.state.emailInput}
                    label="Invite Another Friendo!"
                    style={styles.input}
                    onChangeText={emailInput => this.setState({ emailInput })}
                  />
                  <Button onPress={() => this.handleAddToInviteList(uid)}>
                    <Text>invite this friendo!</Text>
                  </Button>
                </View>
              ) : null}
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

const mapState = ({ event }) => ({
  selectedEvent: event.selectedEvent
});

const mapDispatch = dispatch => ({
  addEmail: (uid, email) => dispatch(addEmailToEvent(uid, email))
});

export default connect(
  mapState,
  mapDispatch
)(SingleEvent);
