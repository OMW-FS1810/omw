import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native';
import { database } from '../config/firebase';
import { setUserAndDevice } from '../redux/store';
import { connect } from 'react-redux';
import { Constants } from 'expo';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;
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
    width: windowWidth - 40,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: color.darkBlue,
    marginVertical: 10
  },
  containerView: {
    width: windowWidth - 40
  },
  button: {
    width: 300,
    backgroundColor: color.darkOrange,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    color: color.orange
  },
  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium,
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'linjingt@gmail.com',
      password: '111111'
    };
  }

  handlePress = async () => {
    const { email, password } = this.state;
    try {
      const data = await firebase
        .auth()
        .signInWithEmailAndPassword(email.trim(), password);
      if (data) {
        const currUser = await database.ref(`/Users/${data.user.uid}`);
        let thisUser;
        await currUser.once('value', async snapshot => {
          thisUser = await snapshot.val();
        });
        const thisUserData = {
          email: thisUser.email,
          firstName: thisUser.first_name,
          lastName: thisUser.last_name,
          pictureUrl: thisUser.profile_picture,
          uid: data.user.uid
        };

        this.props.setUserAndDevice(thisUserData);
        this.props.navigation.navigate('App');
      }
      // this.setState({ email: '', password: '' });
    } catch (error) {
      this.props.setError(error.message);
    }
  };

  render() {
    return (
      <View style={styles.content}>
        <Text> {this.state.error} </Text>
        <TextInput
          style={styles.inputContainer}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          style={styles.inputContainer}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#aaa"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TouchableOpacity style={[styles.button, styles.containerView]} onPress={this.handlePress}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setUserAndDevice(user) {
    return dispatch(setUserAndDevice(user));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
