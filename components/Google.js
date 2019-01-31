import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { setUserAndDevice } from '../redux/store';
import { connect } from 'react-redux';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';
// import { Expo } from 'expo';
import { GOOGLE_IOS_LOGIN_KEY } from '../secrets';
import { database } from '../config/firebase';

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
        await this.onSignIn(result);
        // console.log(result);
        const currUser = await database.ref('/Users/');
        let thisUid;
        await currUser
          .orderByChild('email')
          .equalTo(result.user.email)
          .on('value', async snapshot => {
            thisUid = await snapshot.val();
            if (thisUid) {

              const thisUidFormatted = Object.keys(thisUid)[0];
              console.log('User: ', Object.values(thisUid)[0]);
              const user = Object.values(thisUid)[0];
              const thisUser = {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                pictureUrl: user.profile_picture,
                uid: thisUidFormatted
              };
              this.props.setUserAndDevice(thisUser);
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
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.signInWithGoogleAsync}
        >
          <Text style={styles.buttonText}>Sign up with Google</Text>
        </TouchableOpacity>
      </View>
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
