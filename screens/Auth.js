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

  state = {
    err: ''
  }

  setError = error => {
    this.setState({err: error})
  }

  componentDidMount() {
<<<<<<< HEAD
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
      }
<<<<<<< HEAD
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
      console.log(user.uid);
      currDevices
        .orderByChild('userId')
        .equalTo(user.uid)
        .once('value', async snapshot => {
          const allDevices = snapshot.val();
          const oldDevice = Object.keys(allDevices).filter(
            device => device !== deviceId
          )[0];
          console.log('all', allDevices, 'old', oldDevice);
          await database.ref(`/Devices/${oldDevice}`).remove();
        });
    } catch (error) {
      console.error(error);
    }
  };

  googlePress = async () => {
    console.log('Do I get here?')
    try {
      const data = await auth.signInWithPopup(provider)
      if (data) {
        console.log('Success!!!!')

        // this.props.setUser(data.user);
        // this.props.navigation.navigate('Create an Event');

      }
      // this.setState({email: '', password: ''});
    } catch(error) {
      console.log('Do I get here?')
      this.setState({error: error.message})

    }
  }

  // placeNameChangeHandler = val => {
  //   this.setState({
  //     placeName: val
  //   })
  // }
=======
    });
=======
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user != null) {
    //   }
    // });
>>>>>>> master
  }
>>>>>>> master

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
<<<<<<< HEAD
<<<<<<< HEAD
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
          <TouchableOpacity style={styles.button} onPress={this.handlePress}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.googlePress}>
            <Text style={styles.buttonText}>Sign up with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign up with Facebook</Text>
          </TouchableOpacity>
=======
          <Login navigation={this.props.navigation} onPress={this._signInAsync}/>
          <Google navigation={this.props.navigation} />
          <Facebook navigation={this.props.navigation} />
>>>>>>> master
=======
        <Text>{this.state.err}</Text>
          <Login
            navigation={this.props.navigation}
            setError={this.setError}
            onPress={this._signInAsync}
          />
          <Google navigation={this.props.navigation}
          setError={this.setError}
          />
          <Facebook navigation={this.props.navigation}
          setError={this.setError}
          />
>>>>>>> master
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('signupScreen')}
          >
            <Text style={styles.buttonText}>Sign up with email</Text>
          </TouchableOpacity>
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
