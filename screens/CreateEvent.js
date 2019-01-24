import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    // paddingLeft: 20,
    // paddingRight: 20,
    width: '95%'
  },
  title: {
    fontFamily: 'System',
    fontSize: 30,
    paddingBottom: 20,
    marginBottom: 20
  },
  date: {
    marginBottom: 5,
    marginTop: 10,
    // flex: 1,
    width: '95%',
    // backgroundColor: 'powderblue'
    justifyContent: 'center',
    borderRadius: 5
  }
});
const now = new Date();
class CreateEvent extends Component {
  state = {
    name: '',
    date: '',
    time: ''
  };

  render() {
    console.log(this.state);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create an event!</Text>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Name"
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <DatePicker
          label="Date"
          date={this.state.date}
          mode="date"
          showIcon={false}
          style={styles.date}
          onDateChange={date => this.setState({ date })}
          placeholder="select date"
          format="MM-DD-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
        />
        <DatePicker
          mode="time"
          showIcon={false}
          date={this.state.time}
          placeholder="select time"
          style={styles.date}
          onDateChange={time => this.setState({ time })}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
        />
      </View>
    );
  }
}
// </View>

export default CreateEvent;
