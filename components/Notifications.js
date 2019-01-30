import React from 'react';
import { Constants, Permissions, Notifications } from 'expo';
import { View } from 'react-native';

const deviceId = Constants.installationId;

export default class Notify extends React.Component {
  state = {
    incoming: {},
    outgoing: {
      token: '',
      title: '',
      body: ''
    }
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    //WE WANT TO PUT THIS IN THE DB
    console.log(token);
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();
    //do i need 'this'?
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  _handleNotification = notification => {
    this.setState({ incoming: notification });
    console.log(this.state);
  };
  sendPushNotification = (
    token = this.state.outgoing.token,
    title = this.state.outgoing.title,
    body = this.state.outgoing.body
  ) => {
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: { message: `${title} - ${body}` }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Origin: {this.state.notification.origin}</Text>
        <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
      </View>
    );
  }
}
