import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import { database } from '../config/firebase';
import { setUserAndDevice } from '../redux/store';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: color.whiteBlue
  },
  content: {
    alignItems: 'center'
  },
  inputContainer: {
    width: windowWidth - 40,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: fontFamily.light,
    color: color.darkBlue,
    marginVertical: 15
  },
  button: {
    width: windowWidth - 40,
    backgroundColor: color.darkOrange,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

class Signup extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    error: ''
  };

  static navigationOptions = {
    title: 'SIGN UP',
    headerStyle: {
      backgroundColor: color.darkBlue,
      fontSize: fontSize.regular
    },
    headerTintColor: color.whiteBlue,
    headerTitleStyle: {
      fontFamily: fontFamily.medium
    },
  };

  handlePress = async () => {
    const { email, password, firstName, lastName } = this.state;
    try {
      const data = await firebase
        .auth()
        .createUserWithEmailAndPassword(email.trim(), password);
      if (data) {
        await firebase
          .database()
          .ref('/Users/' + data.user.uid)
          .set({
            email,
            // profile_picture: result.additionalUserInfo.profile.picture,
            // locale: result.additionalUserInfo.profile.locale,
            first_name: firstName,
            last_name: lastName,
            created_at: Date.now()
          });
        const thisUser = {
          email,
          firstName,
          lastName,
          uid: data.user.uid
        };
        this.setState({ email: '', password: '' });
        this.props.setUserAndDevice(thisUser);
        this.props.navigation.navigate('App');
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text> {this.state.error} </Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="First Name"
            placeholderTextColor="#aaa"
            clearButtonMode="while-editing"
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
            marginTop={50}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="Last Name"
            placeholderTextColor="#aaa"
            clearButtonMode="while-editing"
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="Email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            clearButtonMode="while-editing"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            style={styles.inputContainer}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
            clearButtonMode="while-editing"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            marginBottom={50}
          />
          <TouchableOpacity style={styles.button} onPress={this.handlePress}>
            <Text style={styles.buttonText}>SIGN UP WITH EMAIL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});

const mapDispatchToProps = dispatch => ({
  setUserAndDevice: user => dispatch(setUserAndDevice(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
