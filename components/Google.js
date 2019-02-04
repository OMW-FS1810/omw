import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { setUserAndDevice } from '../redux/store';
import { connect } from 'react-redux';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';
// import { Expo } from 'expo';
import { GOOGLE_IOS_LOGIN_KEY } from '../secrets';
import { database } from '../config/firebase';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  containerView: {
    width: windowWidth - 40
  },

  socialButton: {
    height: normalize(55),
    borderRadius: 4,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: color.darkOrange
  },
  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.bold
  }
});

const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.user.id
        // GoogleUser.getBasicProfile().getId()
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

class Google extends React.Component {
  state = {
    loading: false
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
      }
    });
  }

  onSignIn = googleUser => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function(result) {
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/Users/' + result.user.uid)
                  .set({
                    email: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    // locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function(snapshot) {});
              } else {
                firebase
                  .database()
                  .ref('/Users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .then(result => {})
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
        }
      });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        // androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId: GOOGLE_IOS_LOGIN_KEY,
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.setState({ loading: true });
        await this.onSignIn(result);
        const currUser = await database.ref('/Users/');
        let thisUid;
        await currUser
          .orderByChild('email')
          .equalTo(result.user.email)
          .on('value', async snapshot => {
            thisUid = await snapshot.val();
            if (thisUid) {
              const thisUidFormatted = Object.keys(thisUid)[0];
              const user = Object.values(thisUid)[0];
              const thisUser = {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                pictureUrl: user.profile_picture,
                uid: thisUidFormatted
              };
              this.props.setUserAndDevice(thisUser);
              this.setState({ loading: false });
              this.props.navigation.navigate('App');
              return result.accessToken;
            }
          });
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <>
        <SocialIcon
          raised
          button
          type="google"
          title="SIGN UP WITH GOOGLE"
          iconSize={19}
          style={[styles.containerView, styles.socialButton]}
          fontStyle={styles.buttonText}
          onPress={this.signInWithGoogleAsync}
          underlayColor= {color.orange}
        />
        <ActivityIndicator
          animating={this.state.loading}
          color="white"
          size="large"
          style={{ margin: 15 }}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setUserAndDevice: user => dispatch(setUserAndDevice(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Google);
