import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  AsyncStorage
} from 'react-native';
import { database } from '../config/firebase';
import { setUser } from '../redux/store';
import { connect } from 'react-redux';
import { Constants, MailComposer } from 'expo';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';
import { Login, Google, Facebook } from '../components';
import Communications from 'react-native-communications';

const deviceId = Constants.installationId;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
  content: {
    alignItems: 'center'
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#aaa',
    textAlign: 'center'
  }
});

class Auth extends React.Component {
  static navigationOptions = {
    title: 'OMW'
  };

  componentDidMount() {
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user != null) {
    //   }
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Login
            navigation={this.props.navigation}
            onPress={this._signInAsync}
          />

          {/* <Facebook navigation={this.props.navigation} /> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('signupScreen')}
          >
            <Text style={styles.buttonText}>Sign up with email</Text>
          </TouchableOpacity>
          <Google navigation={this.props.navigation} />
        </View>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'password');
    this.props.navigate('App');
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setUser(user) {
    return dispatch(setUser(user));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
