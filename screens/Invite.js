/* eslint-disable complexity */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity
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

  static navigationOptions= {
    headerTitle: 'Invite',
    headerStyle: {
      backgroundColor: color.whiteBlue,
      headerTintColor: color.blue,
      headerTitleStyle: {
        fontFamily: fontFamily.bold,
      }
    },
  }

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
        <View>
          <TextInput
            value={this.state.input}
            style={styles.inputContainer}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            label="Email"
            placeholder="Email"
            placeholderTextColor="#aaa"
            onChangeText={input => this.setState({ input })}
          />
          <TouchableOpacity
            style={[styles.button, styles.containerView]}
            onPress={this.handleAddToInviteList}
          >
            <Text style={styles.buttonText}>ADD TO INVITE LIST</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inviteContainer}>
          {!!this.state.emails.length && (
            <Text style={styles.inviteList}>Invite List</Text>
          )}
          {this.state.emails.map(email => (
            <Text key={email} style={styles.emailList}>
              {email}
            </Text>
          ))}
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleCreateEvent}
          >
            <Text style={[styles.buttonText]}>CREATE EVENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.whiteBlue
  },
  containerView: {
    width: windowWidth - 40
  },
  inputContainer: {
    width: windowWidth - 40,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: fontSize.regular,
    color: color.darkBlue,
    marginVertical: 10,
    backgroundColor: color.whiteBlue
  },

  titleView: {
    marginTop: 80,
    flex: 1
  },

  title: {
    fontSize: fontSize.xLarge,
    fontFamily: fontFamily.light,
    paddingBottom: 20,
    marginBottom: 20,
    color: color.darkBlue,
  },

  button: {
    width: 300,
    backgroundColor: color.darkOrange,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center'
  },

  inviteContainer: {
    flex: 2,
    width: windowWidth - 40,
    marginTop: padding * 2
  },

  inviteList: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.large,
    color: color.blue
  },

  emailList: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.regular,
    paddingHorizontal: padding,
    marginTop: padding,
    color: color.darkBlue
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    alignItems: 'center'
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
