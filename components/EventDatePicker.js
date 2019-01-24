import React, { Component } from 'react';
import { DatePickerIOS, View, StyleSheet } from 'react-native';

const EventDatePicker = props => {
  return (
    <View>
      <DatePickerIOS date={props.date} />
    </View>
  );
};

export default EventDatePicker;
