/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

class Invite extends Component {
  state = {
    emails: [],
    input: ''
  };

  handleCreateEvent = async () => {
    // try {
    // } catch (error) {
    //   console.error(error)
    // }
  };

  handleAddToInviteList = () => {
    const email = this.state.input;
    const emails = this.state.emails;
    emails.push(email);
    this.setState({ emails });
    this.setState({ input: '' });
    console.log(this.state);
  };

  render() {
    console.log(this.state);
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
            onChangeText={input => {
              console.log(this.state);
              this.setState({ input });
            }}
          />
          <Button onPress={this.handleAddToInviteList}>
            <Text>invite this friendo!</Text>
          </Button>
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
    marginTop: 100,
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

export default Invite;
