import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Image
} from 'react-native';
import { Button, SocialIcon, Divider } from 'react-native-elements';
import { database } from '../config/firebase';
import { setUser } from '../redux/store';
import { connect } from 'react-redux';
import { Constants } from 'expo';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';
import { Login, Google, Facebook } from '../components';
import Communications from 'react-native-communications';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;
const deviceId = Constants.installationId;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.whiteBlue
  },

  topContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: padding * 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.darkBlue
  },

  image: {
    height: 150,
    width: 150,
    backgroundColor: color.darkBlue,
    marginBottom: 1,
    resizeMode: 'contain'
  },

  title: {
    fontSize: fontSize.large + 2,
    lineHeight: fontSize.large + 4,
    fontFamily: fontFamily.bold,
    color: color.whiteBlue,
    letterSpacing: 1
  },

  bottomContainer: {
    backgroundColor: 'white',
    paddingVertical: padding * 3,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  containerView: {
    width: windowWidth - 40
  },

  socialButton: {
    height: normalize(55),
    borderRadius: 4,
    marginTop: 0,
    marginBottom: 0
  },

  button: {
    backgroundColor: color.black,
    height: normalize(55)
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },

  orContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: windowWidth
  },

  divider: {
    backgroundColor: color.blue,
    position: 'absolute',
    top: 19,
    left: 20,
    right: 20
  },

  orText: {
    backgroundColor: color.white,
    fontSize: fontSize.regular,
    fontFamily: fontFamily.medium,
    color: color.indigoBlue,
    paddingHorizontal: padding
  }
});

class Auth extends React.Component {
  static navigationOptions = {
    title: 'OMW',
    header: null
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
        <View style={styles.topContainer}>
          <Image style={styles.image} source={require('../assets/logo.png')} />
          <Text style={styles.title}>ON MY WAY!</Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Login
              navigation={this.props.navigation}
              onPress={this._signInAsync}
            />

            <View style={styles.orContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.orText}>Or</Text>
            </View>

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
