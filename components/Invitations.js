import React from 'react';
import {Contacts, MailComposer} from 'expo'
import Communications from 'react-native-communications';

export default class Invitations extends React.Component {

  findContacts = async () => {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Emails],
    });

    if (data.length > 0) {
      const contact = data[0];
      console.log(contact);
    }

  }
  composeMail = async () => {
    //the url link will be changed when the project is published
    MailComposer.composeAsync({
      recipients: ['apoyando@yahoo.com'],
      subject: `Nice! You've been invited to an OMW event!`,
      body: `To join the fun, click <a href='exp://ez-94f.apoyando.omw.exp.direct:80'>here</a> on your mobile device and sign up/sign in with this email address.`,
      isHtml: true,
      attachments: []
    });
  }
  render() {
    return (

    )
  }
}
