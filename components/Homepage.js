import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { View, Text } from 'react-native';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class Homepage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello world!</Text>
      </View>
    );
  }
}
