import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native';
import { database } from '../config/firebase';
import { setUser } from '../redux/store';
import { connect } from 'react-redux';
import { Constants } from 'expo';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';

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
  inputContainer: {
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#aaa',
    marginVertical: 10
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


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: ''
    };
  }


  handlePress = async () => {
    const { email, password } = this.state;
    try {
      const data = await firebase.auth().signInWithEmailAndPassword(
        email.trim(),
        password
      );
      if (data) {
        this.props.setUser(data.user);
        this.associateUserWithDevice(data.user);
        this.props.navigation.navigate('Create an Event');
      }
      this.setState({ email: '', password: '' });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };
  associateUserWithDevice = async user => {
    try {
      await database.ref(`/Devices/${deviceId}`).update({
        userId: user.uid,
        email: user.email
      });
      const currDevices = await database.ref(`/Devices/`);
      currDevices
        .orderByChild('userId')
        .equalTo(user.uid)
        .once('value', async snapshot => {
          const allDevices = snapshot.val();
          const oldDevice = Object.keys(allDevices).filter(
            device => device !== deviceId
          )[0];
          await database.ref(`/Devices/${oldDevice}`).remove();
        });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (

        <View style={styles.content}>
          <Text> {this.state.error} </Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={this.handlePress}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </View>

    );
  }
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
)(Login);
