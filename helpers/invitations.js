import React from 'react';
import { Contacts, MailComposer } from 'expo';
import { database } from '../config/firebase';
import { sendPushNotification } from './notificationSetup';

//NOTE: the app url link will be changed when the project is published -- in dev it will need to be the developer's own tunnel
const appUrl = 'exp://ez-94f.apoyando.omw.exp.direct:80';

export const sendInvites = async (
  inviteesArr,
  eventDetails,
  host,
  newEventObject,
  isUpdate,
  thisIndex,
  myEmail
) => {
  // need to invite unregistered users, notify registered users, and notify host
  const currUsers = database.ref('/Users/');
  const allUsers = await currUsers
    .orderByChild('email')
    .once('value', async snapshot => {
      const userObj = snapshot.val();
      //rearrange users by email
      const userByEmail = {};
      console.log(userObj);
      for (let key in userObj) {
        let thisEmail = await userObj[key].email;
        console.log(thisEmail);
        //.toLowerCase();
        userByEmail[thisEmail] = userObj[key];
      }
      //sort invitees into emails and messages
      let emailInvites = [];
      let messageInvites = [];
      inviteesArr.forEach(invitee => {
        let thisInvitee;
        if (isUpdate) {
          thisInvitee = invitee.email.toLowerCase();
        } else {
          thisInvitee = invitee.toLowerCase();
        }

        if (thisInvitee in userByEmail) {
          if (userByEmail[thisInvitee].token) {
            messageInvites.push(userByEmail[thisInvitee].token);
          }
        } else {
          emailInvites.push(invitee);
        }
      });
      if (isUpdate) {
        console.log('made it here', messageInvites);
        messageInvites.forEach(token => {
          if (token)
            sendPushNotification(
              token,
              eventDetails.name,
              `${host} has changed their status to ${newEventObject}`,

              '',
              'update',
              newEventObject,
              thisIndex,
              myEmail
            );
        });
      } else {
        //send push notifications
        messageInvites.forEach(token => {
          if (token)
            sendPushNotification(
              token,
              eventDetails.name,
              `${host.email} has invited you to a new event`,
              // at ${
              //   eventDetails.location.locationName
              // } on ${eventDetails.date} at ${eventDetails.time}`,
              host.token,
              'new-event',
              newEventObject
            );
        });
        //send emails

        if (emailInvites.length > 0) {
          await composeMail(messageInvites, eventDetails, host.email);
        }
      }
    });

  return { status: 'sent' };
};

export const composeMail = (inviteesArr, eventDetails, hostEmail) => {
  return MailComposer.composeAsync({
    recipients: inviteesArr,
    subject: `You've been invited to '${eventDetails.name}'`,
    body: `${hostEmail} has invited you to an event at ${
      eventDetails.location.locationName
    } on ${eventDetails.date} at ${
      eventDetails.time
    }. To join the fun, click <a href=${appUrl}>here</a> on your mobile device and sign up or sign in to OMW with this email address. Cheers!`,
    isHtml: true,
    attachments: []
  });
};

//find contacts is not in use and is just a placeholder for now
const findContacts = async () => {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Emails]
  });

  if (data.length > 0) {
    const contact = data[0];
  }
};
