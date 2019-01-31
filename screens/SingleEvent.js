import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import { setSingleEvent } from '../redux/store';
import { connect } from 'react-redux';

var { height } = Dimensions.get('window');

var boxCount = 3;
var boxHeight = height / boxCount;

class SingleEvent extends Component {
  render() {
    return (
        <View style={styles.container}>
            <View style={[styles.box, styles.box1]} />
            <View style={[styles.box, styles.box2]} />
            <View style={[styles.box, styles.box3]} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box: {
    height: boxHeight
  },
  box1: {
    backgroundColor: '#2196F3'
  },
  box2: {
    backgroundColor: '#8BC34A'
  },
  box3: {
    backgroundColor: '#e3aa1a'
  }
});

const mapStateToProps = state => ({
  email: state.email
});

const mapDispatchToProps = dispatch => ({
  singleEvent: event => dispatch(setSingleEvent(event))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleEvent);
