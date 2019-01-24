/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { TextInput, Button } from 'react-native-paper';
import { connect } from 'react-redux';

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
        <View style={styles.titleView}>
          <Text style={styles.title}>Create an event!</Text>
        </View>
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
        <View style={styles.bottom}>
          <Button
            onPress={() => console.log('button pressed')}
            type="contained"
            disabled={!this.state.date || !this.state.name || !this.state.time}
          >
            <Text style={styles.butonText}>next</Text>
          </Button>
        </View>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: '#98B1C4'
  },
  titleView: {
    marginTop: 100,
    flex: 1
  },
  input: {
    // backgroundColor: '#C8D7E3',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    width: '95%'
  },
  title: {
    fontFamily: 'System',
    fontSize: 40,
    paddingBottom: 20,
    marginBottom: 20,
    color: '#2F4E6F',
    fontWeight: '500'
  },
  date: {
    marginBottom: 5,
    // backgroundColor: '#C8D7E3',
    marginTop: 10,
    width: '95%',
    justifyContent: 'center',
    borderRadius: 5
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  butonText: {
    // color: 'black',
    fontSize: 30,
    position: 'absolute',
    bottom: 0
  },
  button: {}
});

export default CreateEvent;
