import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { addEmailToEvent } from '../redux/store';
import * as theme from '../styles/theme';

const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  detailsContainer: {
    flex: 1.25
    // flexDirection: 'column'
  },
  emailsContainer: {
    flex: 1
    // flexDirection: 'column'
  },
  emailsList: {
    alignItems: 'flex-start'
  },
  titleBox: {
    // flex: 1,
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
    // flex: 2,
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
    // flex: 1,
    color: color.indigoBlue,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.large,
    paddingLeft: padding * 2
  },
  addButton: {
    padding: padding * 2
    // color: color.darkOrange
  }
});

class SingleEvent extends Component {
  state = {
    editing: false,
    emailInput: '',
    uid: ''
  };

  handleAddToInviteList = () => {
    const { uid, emailInput } = this.state;

    this.props.addEmail(uid, emailInput);
    this.setState({ emailInput: '' });
  };

  handlePressAddEmail = () => {
    console.log('PREST!');
    this.setState({ editing: true });
  };

  handleSubmitEmail = () => {
    console.log('email:', this.state.emailInput);
    console.log('uid', this.state.uid);
  };

  async componentDidMount() {
    if (this.props.selectedEvent) {
      const { name, date, time } = Object.values(this.props.selectedEvent)[0];
      const uid = Object.keys(this.props.selectedEvent)[0];
      await this.setState({ uid });
    }
  }

  static navigationOptions = { title: 'Single Event' };
  render() {
    let event = false;
    if (Object.keys(this.props.selectedEvent).length) {
      event = Object.values(this.props.selectedEvent)[0];
      return (
        { event } && (
          <View style={styles.container}>
            <View style={styles.detailsContainer}>
              <View style={styles.titleBox}>
                <Text style={styles.titleText}>DETAILS</Text>
              </View>
              <Text style={styles.subtitle}>Event:</Text>
              <Text style={styles.text}>{event.name}</Text>
              <Text style={styles.subtitle}>Location:</Text>
              <Text style={styles.text}>{event.location.locationName}</Text>
              <Text style={styles.subtitle}>Date:</Text>
              <Text style={styles.text}>{event.date}</Text>
              <Text style={styles.subtitle}>Time:</Text>
              <Text style={styles.text}>{event.time}</Text>
            </View>
            <View style={styles.emailsContainer}>
              <View style={styles.titleBox}>
                <Text style={styles.titleText}>FRIENDS</Text>
              </View>
              <View style={styles.emailList}>
                {/* <Text style={styles.subtitle}>Email:</Text> */}
                {event.invites.map(invitee => (
                  <Text key={invitee} style={styles.emailText}>
                    {invitee}
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
                {/* {this.state.editing ? (
                  <View style={styles.inputContainer}>
                    <TextInput
                      value={this.state.emailInput}
                      label="Invite Another Friendo!"
                      style={styles.input}
                      onChangeText={emailInput => this.setState({ emailInput })}
                    />
                    <Button onPress={this.handleAddToInviteList}>
                      <Text>invite this friendo!</Text>
                    </Button>
                  </View>
                ) : null} */}
              </View>
            </View>
          </View>
        )
      );
    } else {
      return null;
    }
  }
}

const mapState = ({ event }) => ({
  selectedEvent: event.selectedEvent
});

const mapDispatch = dispatch => ({
  addEmail: (uid, email) => dispatch(addEmailToEvent(uid, email))
});

export default connect(
  mapState,
  mapDispatch
)(SingleEvent);

/*

            <View style}>
              <Text>{event.name}</Text>
              <Button
                mode="contained"
                onPress={() => {
                  if (!this.state.editing) {
                    this.setState({ editing: true });
                  } else {
                    this.setState({ editing: false });
                  }
                }}
                style={styles.editButton}
              >
                <Text>{this.state.editing ? 'SAVE' : 'EDIT'}</Text>
              </Button>
            </View>
            {this.state.editing ? (
              <>
                <DatePicker
                  label="Date"
                  date={this.state.editDate}
                  mode="date"
                  showIcon={false}
                  style={styles.date}
                  onDateChange={editDate => this.setState({ editDate })}
                  placeholder="select date"
                  format="MM-DD-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                />
                <DatePicker
                  mode="time"
                  showIcon={false}
                  date={this.state.editTime}
                  placeholder="select time"
                  style={styles.date}
                  onDateChange={editTime => this.setState({ editTime })}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                />
              </>
            ) : (
              <View style={styles.box2}>
                <Text>
                  {event.date} {event.time}
                </Text>
              </View>
            )}
            <View style={styles.box3}>
            
            */
