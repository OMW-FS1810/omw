import React from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native';
import { List, TextInput } from 'react-native-paper';

export default class Notifications extends React.Component {
  state = {
    newMessage: {
      recipient: '',
      title: '',
      body: ''
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>New Message</Text>
        <TextInput
          style={styles.input}
          label="Recipient email"
          value={this.state.newMessage.recipient}
          onChangeText={recipient =>
            this.setState({
              newMessage: { ...this.state.newMessage, recipient }
            })
          }
        />
        <TextInput
          style={styles.input}
          label="Title"
          value={this.state.newMessage.title}
          onChangeText={title =>
            this.setState({ newMessage: { ...this.state.newMessage, title } })
          }
        />
        <TextInput
          style={styles.input}
          label="Body"
          value={this.state.newMessage.body}
          onChangeText={body =>
            this.setState({ newMessage: { ...this.state.newMessage, body } })
          }
        />
        <List.Section title="Some title">
          <List.Item
            title="First Item"
            left={() => <List.Icon icon="folder" />}
          />
          <Text>{this.state.newMessage.title}</Text>
          <List.Item
            title="Second Item"
            left={() => <List.Icon icon="message" />}
          />
        </List.Section>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
    // backgroundColor: '#98B1C4'
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
    marginBottom: 0,
    paddingBottom: 0,
    color: '#2F4E6F',
    fontWeight: '500'
  }
});
