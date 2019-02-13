/* eslint-disable camelcase */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  // Button,
  AsyncStorage
} from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { setUserAndDevice, setUser } from '../redux/store';
// import { Button } from 'react-native-paper'
import { database } from '../config/firebase';
import * as firebase from 'firebase';
import { ImagePicker, Permissions, Location, ImageManipulator } from 'expo';
import { setBackgroundLocationToggle } from '../helpers/location';

const SEND_LOCATION = 'sendLocation';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DCDCDC'
  },
  headerContent: {
    padding: 30,
    alignItems: 'center'
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600'
  },
  userInfo: {
    fontSize: 16,
    color: '#778899',
    fontWeight: '600'
  },
  body: {
    backgroundColor: '#778899',
    height: 500,
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row'
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingTop: 10
  },
  iconContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: '#FFFFFF',
    width: 30,
    height: 30
  },
  input: {
    // backgroundColor: '#C8D7E3',
    borderColor: 'black',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    width: '50%'
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
    color: '#000'
  }
});

class Profile extends Component {
  state = {
    isEditing: false,
    editFirstName: this.props.user.firstName,
    editLastName: this.props.user.lastName,
    err: '',
    editSuccess: '',
    profilePicture: null,
    isPolling: false
  };

  // Current state is based on previous state
  toggleEdit = () => {
    this.setState(prevState => ({ isEditing: !prevState.isEditing }));
  };

  editInfo = () => {
    const { editFirstName, editLastName, pictureUrl } = this.state;
    // not currently updating user photo until logout / login need to look into why we can't pull the updated image -- it's probably due to authentication issues
    const { uid, deviceId, email } = this.props.user;
    if (editFirstName.trim().length > 0 && editLastName.trim().length > 0) {
      database
        .ref(`/Users/${this.props.user.uid}`)
        .update({
          first_name: editFirstName,
          last_name: editLastName
        })
        .catch(err => this.setState({ err: err.message }));
      this.setState(prevState => ({
        isEditing: !prevState.isEditing,
        editSuccess: 'Successfully updated'
      }));

      this.props.setUser({
        uid,
        email,
        firstName: editFirstName,
        lastName: editLastName,
        pictureUrl,
        deviceId
      });
      // Clear any error messages if the user successfully edits their info
      this.setState({ err: '' });
      setTimeout(() => {
        this.setState({ editSuccess: '' });
      }, 1000);
    } else {
      this.setState({ err: 'First name and last name cannot be blank' });
    }
  };

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      this.props.setUser({});
      await AsyncStorage.removeItem('user');
      this.props.navigation.navigate('loginScreen');
    } catch (err) {
      this.setState({ err: err.message });
    }
    // Logout in our store (set user to {})
  };

  selectPicture = async () => {
    const { uid } = this.props.user;
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      this.uploadImage(result.uri, `profile_picture/${uid}`)
        .then(url => {
          Alert.alert('Success');
          database.ref(`/Users/${uid}/profile_picture`).set(url);
          this.setState({ profilePicture: url });
        })
        .catch(error => {
          Alert.alert(error);
        });
    }
  };

  takePicture = async () => {
    const { uid } = this.props.user;
    await Permissions.askAsync(Permissions.CAMERA);
    let result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      this.uploadImage(result.uri, `profile_picture/${uid}`)
        .then(url => {
          Alert.alert('Success');
          database.ref(`/Users/${uid}/profile_picture`).set(url);
          this.setState({ profilePicture: url });
        })
        .catch(error => {
          Alert.alert(error);
        });
    }
  };

  uploadImage = async (uri, imageName) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 200 } }],
        { compress: 0.8, format: 'jpeg' }
      );

      const newUri = await resizedImage.uri;
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.error(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', newUri, true);
        xhr.send(null);
      });

      var ref = firebase
        .storage()
        .ref()
        .child('images/' + imageName);
      var metadata = {
        contentType: 'image/jpeg'
      };
      const snapshot = await ref.put(blob, metadata);

      blob.close();

      return snapshot.ref.getDownloadURL();
    } catch (err) {
      console.error(err);
    }
  };
  async componentDidMount() {
    let locationStatus = await Location.hasStartedLocationUpdatesAsync(
      SEND_LOCATION
    );
    this.setState({
      isPolling: locationStatus,
      profilePicture: this.props.user.pictureUrl
    });
  }
  render() {
    const {
      isEditing,
      err,
      editSuccess,
      profilePicture,
      isPolling
    } = this.state;
    return (
      <View style={styles.container}>
        {isEditing ? (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                source={{ uri: profilePicture || this.props.user.pictureUrl }}
              />
              <Button
                title="Choose image from library..."
                onPress={this.selectPicture}
              >
                Picture Library{' '}
              </Button>
              <Button title="Take Picture..." onPress={this.takePicture}>
                Take Picture{' '}
              </Button>
              <TextInput
                style={styles.inputContainer}
                onChangeText={editFirstName => this.setState({ editFirstName })}
                autoCapitalize="sentences"
                autoComplete="name"
                placeholder={this.props.user.firstName}
              />
              <TextInput
                style={styles.inputContainer}
                onChangeText={editLastName => this.setState({ editLastName })}
                autoCapitalize="sentences"
                autoComplete="name"
                placeholder={this.props.user.lastName}
              />
            </View>
          </View>
        ) : (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                source={{ uri: profilePicture || this.props.user.pictureUrl }}
              />
              <Text style={styles.name}>
                {this.props.user.firstName} {this.props.user.lastName}{' '}
              </Text>
              <Text style={styles.userInfo}>{this.props.user.email} </Text>
            </View>
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.item}>
            <View style={styles.iconContent}>
              <Image
                style={styles.icon}
                source={{
                  uri: 'https://png.icons8.com/home/win8/50/ffffff'
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.infoContent}
              color="#ffffff"
              onPress={() => this.props.navigation.navigate('EVENT MAP')}
            >
              <Text>Home</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.item}>
            <View style={styles.iconContent}>
              <Image
                style={styles.icon}
                source={{
                  uri: 'https://png.icons8.com/events/win8/50/ffffff'
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.infoContent}
              onPress={() => this.props.navigation.navigate('CREATE EVENT')}
            >
              <Text>Events</Text>
            </TouchableOpacity>
          </View>

          <Button
            color={'black'}
            mode="outlined"
            title="Sign out"
            onPress={this.signOutUser}
          >
            Sign out
          </Button>
          {editSuccess ? <Text> {editSuccess} </Text> : null}
          {err ? <Text> {err} </Text> : null}
          {!isEditing && (
            <Button
              title="Edit"
              color={'black'}
              mode="outlined"
              onPress={this.toggleEdit}
            >
              Edit
            </Button>
          )}
          {isEditing && (
            <Button
              title="Save"
              mode="contained"
              color={'black'}
              onPress={this.editInfo}
            >
              Save
            </Button>
          )}

          {isPolling ? (
            <Button
              mode="outlined"
              color={'black'}
              title="Stop Background Location"
              onPress={() => {
                setBackgroundLocationToggle();
                this.setState({ isPolling: false });
              }}
            >
              Stop Background Location
            </Button>
          ) : (
            <Button
              mode="outlined"
              color={'black'}
              title="Start Background Location"
              onPress={() => {
                setBackgroundLocationToggle();
                this.setState({ isPolling: true });
              }}
            >
              Start Background Location
            </Button>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});

const mapDispatchToProps = dispatch => ({
  setUserAndDevice(user) {
    return dispatch(setUserAndDevice(user));
  },
  setUser(user) {
    return dispatch(setUser(user));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
