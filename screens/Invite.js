/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { populateEventEmails, createEvent } from '../redux/event';

class Invite extends Component {
  state = {
    emails: [],
    input: ''
  };

  handleCreateEvent = () => {
    let emailsToInvite = this.state.emails;
    // add the user (host) to the emails to invite
    emailsToInvite = [...emailsToInvite, this.props.user.email];
    this.props.populateEmails(this.state.emails);
    this.props.createTheEvent(this.props.eventDeets, emailsToInvite);
    this.setState({
      emails: [],
      input: ''
    });
    // is this where we want to go?
    this.props.navigation.navigate('Event Map');
  };

  handleAddToInviteList = () => {
    const email = this.state.input.toLowerCase();
    const emails = this.state.emails;
    emails.push(email);
    this.setState({ emails });
    this.setState({ input: '' });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Invite Your Friends!</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={this.state.input}
            label="Email"
            style={styles.input}
            onChangeText={input => this.setState({ input })}
          />
          <Button onPress={this.handleAddToInviteList}>
            <Text>invite this friendo!</Text>
          </Button>
        </View>
        <View>
          {!!this.state.emails.length && <Text>Currently inviting:</Text>}
          {this.state.emails.map(email => (
            <Text key={email}>{email}</Text>
          ))}
        </View>
        <View style={styles.button}>
          <Button onPress={this.handleCreateEvent}>
            <Text>create event!</Text>
          </Button>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    flex: 1,
    // justifyContent: 'flex-start',
    width: '95%',
    top: 0
  },
  titleView: {
    marginTop: 80,
    flex: 1
  },
  input: {
    borderColor: '#98B1C4',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    width: '95%'
  },
  title: {
    fontFamily: 'System',
    fontSize: 40,
    paddingBottom: 20,
    marginBottom: 20,
    color: '#2F4E6F',
    fontWeight: '500'
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  buttonText: {
    fontSize: 20
  }
});

const mapState = state => ({
  eventDeets: state.event.pendingCreateEventDeets,
  user: state.user.user
});

const mapDispatch = dispatch => ({
  populateEmails: emails => dispatch(populateEventEmails(emails)),
  createTheEvent: (deets, emails) => dispatch(createEvent(deets, emails))
});

export default connect(
  mapState,
  mapDispatch
)(Invite);
