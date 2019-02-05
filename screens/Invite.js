/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import {
  populateEventEmails,
  createEvent,
  trackMembersStart
} from '../redux/event';
import { NavigationActions, StackActions } from 'react-navigation';
import * as theme from '../styles/theme';

const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

class Invite extends Component {
  state = {
    emails: [],
    input: ''
  };

  handleCreateEvent = async () => {
    let emailsToInvite = this.state.emails;
    // add the user (host) to the emails to invite
    emailsToInvite = [...emailsToInvite, this.props.user.email];

    await this.props.populateEmails(this.state.emails);
    await this.props.createTheEvent(this.props.eventDeets, emailsToInvite);
    await this.setState({
      emails: [],
      input: ''
    });

    const eventMembers = await Object.values(this.props.selectedEvent)[0]
      .invites;

    await this.props.trackMembersStart(eventMembers);
    // is this where we want to go?
    // this.props.navigation.navigate('Event Map');
    this.props.navigation.navigate('SingleEvent');
  };

  handleAddToInviteList = () => {
    const email = this.state.input.toLowerCase();
    this.setState(prevState => ({
      emails: [...prevState.emails, email],
      input: ''
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Invite Your Friends!</Text>
        </View>
        <View
        // style={styles.inputContainer}
        >
          <TextInput
            value={this.state.input}
            style={styles.newInputContainer}
            label="Email"
            placeholder="Email"
            clearButtonMode="while-editing"
            onChangeText={input => this.setState({ input })}
          />
          <Button
            title="add to invite list"
            onPress={this.handleAddToInviteList}
          >
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
          <Button title="create" onPress={this.handleCreateEvent}>
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
    width: '95%',
    top: 0
  },
  newInputContainer: {
    width: windowWidth - 33,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: fontFamily.light,
    color: color.darkBlue,
    marginVertical: 15,
    alignSelf: 'center',
    borderColor: '#98B1C4',
    borderWidth: 1,
    height: 20
  },
  titleView: {
    marginTop: 80,
    flex: 1
  },
  input: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    width: '95%'
  },
  title: {
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
  user: state.user.user,
  selectedEvent: state.event.selectedEvent,
  eventJustMade: state.event.eventJustMade
});

const mapDispatch = dispatch => ({
  populateEmails: emails => dispatch(populateEventEmails(emails)),
  createTheEvent: (deets, emails) => dispatch(createEvent(deets, emails)),
  trackMembersStart: members => dispatch(trackMembersStart(members))
});

export default connect(
  mapState,
  mapDispatch
)(Invite);
