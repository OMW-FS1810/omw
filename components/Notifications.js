import React from 'react';
import { Notifications } from 'expo';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

export default class Notify extends React.Component {
  state = {
    incoming: {},
    outgoing: {
      token: '',
      title: '',
      body: ''
    },
    visible: false
  };

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  _handleNotification = notification => {
    this.setState({ incoming: notification });
    console.log(this.state);
  };

  render() {
    const { visible } = this.state;
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.setState(state => ({ visible: !state.visible }))}
        >
          {this.state.visible ? 'Hide' : 'Show'}
        </Button>
        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
            }
          }}
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
      </View>
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Text>Origin: {this.state.notification.origin}</Text>
      //   <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
