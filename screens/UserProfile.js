import React from 'react';
import {
  View,
  StyleSheet,
  AppRegistry,
  Image,
  Text,
  List
} from 'react-native';

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  profilepicWrap: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: 'rgba(0,0,0, 0.4)',
    borderWidth: 10
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    fontWeight: 'bold'
  },
  name: {
    marginTop: 20,
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold'
  },
  pos: {
    fontSize: 14,
    color: '#0394c0',
    fontWeight: '300',
    fontStyle: 'italic'
  }
})

class UserProfile extends React.Component {
  render() {
    return(
      <Image  style={styles.headerBackground}>
        <View style={styles.header}>
          <View style={styles.profilepicWrap}>
            <Image  style={styles.profilepic}/>
          </View>

          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.pos}>Developer</Text>
        </View>
      </Image>
    )
  }
}

export default UserProfile
