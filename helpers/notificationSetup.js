import { Permissions, Notifications } from 'expo';
import { database } from '../config/firebase';

export const registerForPushNotificationsAsync = async () => {
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
  return token;
};

export const sendPushNotification = (
  token,
  title,
  body,
  sender,
  messageType,
  newEventObject = null,
  thisIndex,
  myEmail
) => {
  console.log(token, title, body, sender, messageType, newEventObject, myEmail);
  try {
    fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: `OMW - ${title}`,
        body: body,
        data: {
          message: `${title} - ${body}`,
          messageType,
          newEventObject,
          thisIndex,
          myEmail
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    //add message to db -- DISABLED
    // database.ref('/Messages/').push({
    //   sender,
    //   recipient: token,
    //   title,
    //   body,
    //   messageType,
    //   read: false
    // });
  } catch (err) {
    console.error(err);
  }
};
