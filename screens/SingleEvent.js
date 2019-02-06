import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import {
  addEmailToEvent,
  declineEvent,
  updateMyEventStatus
} from '../redux/store';
import * as theme from '../styles/theme';
import { RadioButton } from 'react-native-paper';

const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  detailsContainer: {
    flex: 1.25
  },
  emailsContainer: {
    flex: 1
  },
  emailsList: {
    alignItems: 'flex-start'
  },
  titleBox: {
    backgroundColor: color.blue,
    alignItems: 'center'
  },
  inputContainer: {
    width: windowWidth - 33,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: fontFamily.light,
    color: color.darkBlue,
    marginVertical: 15,
    alignSelf: 'center'
  },
  titleText: {
    fontFamily: fontFamily.bold,
    color: color.whiteGrey,
    padding,
    fontSize: fontSize.xLarge
  },
  subtitle: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.large,
    color: color.darkBlue,
    padding
  },
  text: {
    flex: 1,
    color: color.indigoBlue,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.large,
    paddingLeft: padding * 2
  },
  emailText: {
    color: color.indigoBlue,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.large,
    paddingLeft: padding * 2
  },
  addButton: {
    padding: padding * 2
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
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    alignItems: 'center'
  }
});

class SingleEvent extends Component {
  state = {
    editing: false,
    emailInput: '',
    uid: '',
    myStatus: ''
  };

  handleAddToInviteList = () => {
    const { uid, emailInput } = this.state;

    this.props.addEmail(uid, emailInput);
    this.setState({ emailInput: '' });
  };

  handlePressAddEmail = () => {
    this.setState({ editing: true });
  };

  handleSubmitEmail = () => {
    this.props.addEmail(this.state.uid, this.state.emailInput);
    this.setState({ emailInput: '', editing: false });
  };

  handlePressBack = () => {
    // this.props.navigation.navigate('EVENT MAP');

    this.props.navigation.navigate('eventMapScreen');
  };

  handlePressDecline = () => {
    const uid = Object.keys(this.props.selectedEvent)[0];
    this.props.decline(uid);
    this.props.navigation.navigate('Event Map');
  };

  async componentDidMount() {
    if (this.props.selectedEvent) {
      const uid = Object.keys(this.props.selectedEvent)[0];
      await this.setState({
        uid,
        myStatus: Object.values(this.props.selectedEvent)[0].invites.filter(
          invite => invite.email === this.props.myEmail
        )[0].status
      });
    }
  }

  static navigationOptions = { title: 'Single Event' };
  render() {
    let event = false;
    if (Object.keys(this.props.selectedEvent).length) {
      event = Object.values(this.props.selectedEvent)[0];

      return (
        { event } && (
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            // contentContainerStyle={styles.container}
            scrollEnabled={false}
            style={styles.container}
          >
            <View style={styles.detailsContainer}>
              <View style={styles.titleBox}>
                <Text style={styles.titleText}>DETAILS</Text>
              </View>
              <Text style={styles.subtitle}>Event:</Text>
              <Text style={styles.text}>{event.name}</Text>
              <Text style={styles.subtitle}>Location:</Text>
              <Text style={styles.text}>{event.location.locationName}</Text>

              {/*
              add image with src of event.location.locationPhoto
              i.e...
              {locationPhoto !== '' && (
                <View style={styles.textContent}>
                  <Image
                    source={{
                      uri: locationPhoto
                    }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
              )}


              */}
              <Text style={styles.subtitle}>Date:</Text>
              <Text style={styles.text}>{event.date}</Text>
              <Text style={styles.subtitle}>Time:</Text>
              <Text style={styles.text}>{event.time}</Text>
            </View>

            <RadioButton.Group
              onValueChange={value => {
                this.setState({ myStatus: value });
                this.props.updateMyEventStatus(this.state.uid, value);
              }}
              value={this.state.myStatus}
              style={{
                marginLeft: 20,
                padding: 5,
                borderWidth: 1,
                borderColor: 'black'
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <RadioButton value="invited" />
                <Text>Invited</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <RadioButton value="on the way" />
                <Text>On the Way</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <RadioButton value="arrived" />
                <Text>Arrived</Text>
              </View>
            </RadioButton.Group>
            <View style={styles.emailsContainer}>
              <View style={styles.titleBox}>
                <Text style={styles.titleText}>WHO'S GOING</Text>
              </View>
              <View style={styles.emailList}>
                {event.invites.map(invitee => (
                  <Text key={invitee.email} style={styles.emailText}>
                    {invitee.email}
                  </Text>
                ))}
                {this.state.editing ? (
                  <>
                    <TextInput
                      style={styles.inputContainer}
                      placeholder="Email"
                      placeholderTextColor="#aaa"
                      clearButtonMode="while-editing"
                      borderBottomColor={theme.blue}
                      value={this.state.emailInput}
                      onChangeText={emailInput => this.setState({ emailInput })}
                    />
                    <TouchableOpacity
                      disabled={!this.state.emailInput}
                      onPress={this.handleSubmitEmail}
                    >
                      <AntDesign
                        style={{ left: 16 }}
                        name="enter"
                        size={30}
                        color={theme.orange}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    disabled={this.state.editing}
                    onPress={this.handlePressAddEmail}
                  >
                    <Text
                      style={[
                        styles.addButton,
                        {
                          color: this.state.editing
                            ? color.grey
                            : color.darkOrange
                        }
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="email-plus"
                        size={30}
                        style={styles.addButton}
                      />
                      {'  '}Invite another friendo!
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.bottom}>
                  <TouchableOpacity
                    style={[styles.button, styles.bottom]}
                    onPress={this.handlePressDecline}
                  >
                    <Text style={styles.buttonText}>DECLINE THIS EVENT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        )
      );
    } else {
      return null;
    }
  }
}

const mapState = ({ event, user }) => ({
  selectedEvent: event.selectedEvent,
  allEvents: event.allEvents,
  myEmail: user.user.email
});

const mapDispatch = dispatch => ({
  addEmail: (uid, email) => dispatch(addEmailToEvent(uid, email)),
  decline: uid => dispatch(declineEvent(uid)),
  updateMyEventStatus: (uid, status) =>
    dispatch(updateMyEventStatus(uid, status))
});

export default connect(
  mapState,
  mapDispatch
)(SingleEvent);
