import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { setUserAndDevice, setUser } from '../redux/store';
import { Button } from 'react-native-paper'
import { database } from '../config/firebase';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#DCDCDC",
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 16,
    color: "#778899",
    fontWeight: '600',
  },
  body: {
    backgroundColor: "#778899",
    height: 500,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
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
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: "#FFFFFF",
    width: 30,
    height: 30
  }
});

class Profile extends Component {
  state = {
    isEditing: false,
    editFirstName: '',
    editLastName: '',
    err: '',
    editSuccess: ''

  }

  // Current state is based on previous state
  toggleEdit = () => {
    this.setState(prevState => ({isEditing: !prevState.isEditing}))
  }

  editInfo = () => {
    const {editFirstName, editLastName} = this.state;
    const {uid, pictureUrl, deviceId, email } = this.props.user;
      database.ref(`/Users/${this.props.user.uid}`).update({
        first_name: editFirstName,
        last_name: editLastName,
      })
        // .then(() => database.ref.once('value'))
        // .then(snapshot => console.log('HELLO', snapshot.val()))
        .catch(err => this.setState({err: err.message}));
      this.setState(prevState => ({isEditing: !prevState.isEditing, editSuccess: 'Successfully updated'}));
      this.props.setUser({
        uid,
        email,
        firstName: editFirstName,
        lastName: editLastName,
        pictureUrl,
        deviceId
      })
      setTimeout(() => {
        this.setState({ editSuccess: '' });
      }, 5000);
  }

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      this.props.setUser({});
      this.props.navigation.navigate('loginScreen');

    } catch(err) {
      this.setState({err: err.message});
    }
    // Logout in our store (set user to {})
  }

  render() {
    const {isEditing, err, editSuccess} = this.state;
    // console.log('Profile props:', this.props.user);
    return ( <View style={styles.container}>
         <Button title="Sign out" onPress={this.signOutUser}>
          Sign out
          </Button>
        {editSuccess ? <Text> {editSuccess} </Text> : null}
        {err ? <Text> {err} </Text> : null}
        {!isEditing && <Button title="Edit" onPress={this.toggleEdit}>
            Edit
          </Button>}
        {isEditing && <Button title="Edit" onPress={this.editInfo}>
            Save
          </Button>}

        {isEditing ? <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image style={styles.avatar} source={{ uri: `${this.props.user.pictureUrl}` }} />

              <TextInput style={styles.name} onChangeText={editFirstName => this.setState(
                    { editFirstName }
                  )} autoCapitalize="sentences" autoComplete="name" placeholder={this.props.user.firstName} />
              <TextInput style={styles.name} onChangeText={editLastName => this.setState(
                    { editLastName }
                  )} autoCapitalize="sentences" autoComplete="name" placeholder={this.props.user.lastName} />
            </View>
          </View> : <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image style={styles.avatar} source={{ uri: `${this.props.user.pictureUrl}` }} />
              <Text style={styles.name}>
                {this.props.user.firstName} {this.props.user.lastName}{' '}
              </Text>
              <Text style={styles.userInfo}>{this.props.user.email} </Text>
            </View>
          </View>}
        <View style={styles.body}>
          <View style={styles.item}>
            <View style={styles.iconContent}>
              <Image style={styles.icon} source={{ uri: 'https://png.icons8.com/home/win8/50/ffffff' }} />
            </View>
            <TouchableOpacity style={styles.infoContent} color="#ffffff" onPress={() => this.props.navigation.navigate('Event Map')}>
              <Text>Home</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.item}>
            <View style={styles.iconContent}>
              <Image style={styles.icon} source={{ uri: 'https://png.icons8.com/events/win8/50/ffffff' }} />
            </View>
            <TouchableOpacity style={styles.infoContent} onPress={() => this.props.navigation.navigate('Create an Event')}>
              <Text>Events</Text>
            </TouchableOpacity>
          </View>
        </View>


      </View>
    )
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
