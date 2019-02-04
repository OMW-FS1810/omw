import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import { addEmailToEvent } from '../redux/store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  boxContainer: {
    flex: 1
  },
  box1: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center'
  },
  box2: {
    backgroundColor: 'blue',
    flex: 3,
    fontSize: 48
  },
  box3: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center'
  },
  box4: {
    backgroundColor: 'blue',
    flex: 3,
    fontSize: 48
  },
  text: {
    color: 'white',
    fontSize: 60
  }
});

class SingleEvent extends Component {
  state = {
    editing: false,
    emailInput: '',
    uid: '',
    editName: '',
    editDate: '',
    editTime: ''
  };

  handleAddToInviteList = () => {
    const { uid, emailInput } = this.state;

    this.props.addEmail(uid, emailInput);
    this.setState({ emailInput: '' });
  };

  async componentDidMount() {
    if (this.props.selectedEvent) {
      const { name, date, time } = Object.values(this.props.selectedEvent)[0];
      const uid = Object.keys(this.props.selectedEvent)[0];
      await this.setState({
        uid,
        editName: name,
        editDate: date,
        editTime: time
      });
    }
  }

  static navigationOptions = { title: 'Single Event' };
  render() {
    // const { navigation } = this.props;
    let event = false;
    if (Object.keys(this.props.selectedEvent).length) {
      event = Object.values(this.props.selectedEvent)[0];
      return (
        { event } && (
          <View style={styles.container}>
            <View style={[styles.boxContainer, styles.box1]}>
              <Text style={styles.text}>DETAILS</Text>
            </View>
            <View style={[styles.boxContainer, styles.box2]}>
              <Text>Event:</Text>
              <Text>{event.name}</Text>
              <Text>Location:</Text>
              <Text>{event.location.locationName}</Text>
              <Text>Date:</Text>
              <Text>{event.date}</Text>
              <Text>Time:</Text>
              <Text>{event.time}</Text>
            </View>
            <View style={[styles.boxContainer, styles.box3]}>
              <Text style={styles.text}>INVITEES</Text>
            </View>
            <View style={[styles.boxContainer, styles.box4]}>
              <Text>Email:</Text>
              {event.invites.map(invitee => (
                <Text key={invitee}> {invitee} </Text>
              ))}
              {this.state.editing ? (
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
              ) : null}
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

            <View style={styles.box1}>
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
