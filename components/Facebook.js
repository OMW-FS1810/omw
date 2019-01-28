import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { setUser } from '../redux/store';
import { connect } from 'react-redux';
// import { Button } from 'react-native-paper'
import * as firebase from 'firebase';

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

class Facebook extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
      }
    });
  }

  signInWithFacebookAsync = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      '1189665244533421',
      {
        permissions: ['public_profile']
      }
    );
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      // const response = await fetch(
      //   `https://graph.facebook.com/me?access_token=${token}`);
      // Alert.alert(
      //   'Logged in!',
      //   `Hi ${(await response.json()).name}!`,
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      const user = await firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential);
      if (user.additionalUserInfo.isNewUser) {
        firebase
          .database()
          .ref('/Users/' + user.user.uid)
          .set({
            email: user.user.email,
            profile_picture: user.additionalUserInfo.profile.picture.data.url,
            // locale: user.additionalUserInfo.profile.locale,
            first_name: user.additionalUserInfo.profile.first_name,
            last_name: user.additionalUserInfo.profile.last_name,
            created_at: Date.now()
          })
          .then(function(snapshot) {});
      } else {
        firebase
          .database()
          .ref('/Users/' + user.user.uid)
          .update({
            last_logged_in: Date.now()
          });
      }
    }
  };

  render() {
    return (
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.signInWithFacebookAsync}
        >
          <Text style={styles.buttonText}>Sign up with Facebook</Text>
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
)(Facebook);
