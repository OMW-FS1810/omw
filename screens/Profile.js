import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { setUserAndDevice } from '../redux/store';
// import { Button } from 'react-native-paper'

class Profile extends Component {

  render() {
    console.log('User in profile screen: ', this.props);
    return (
      <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={{uri: `${this.props.user.pictureUrl}`}}/>

                <Text style={styles.name}>{this.props.user.firstName} {this.props.user.lastName} </Text>
                <Text style={styles.userInfo}>{this.props.user.email} </Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.item}>
              <View style={styles.iconContent}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/home/win8/50/ffffff'}}/>
              </View>
              <TouchableOpacity style={styles.infoContent}
               color='#ffffff'
                onPress={()=> this.props.navigation.navigate('Event Map')}>
                <Text>Home</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.item}>
              <View style={styles.iconContent}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/events/win8/50/ffffff'}}/>
              </View>
              <TouchableOpacity style={styles.infoContent}
                onPress={()=> this.props.navigation.navigate('Create an Event')}>
                <Text>Events</Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#DCDCDC",
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
  },
  userInfo:{
    fontSize:16,
    color:"#778899",
    fontWeight:'600',
  },
  body:{
    backgroundColor: "#778899",
    height:500,
    alignItems:'center',
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5,
    paddingTop: 10
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5
  },
  icon:{
    width:30,
    height:30,
    marginTop:20,
  },
  info:{
    fontSize:18,
    marginTop:20,
    color: "#FFFFFF",
    width:30,
    height:30
  }
});

const mapStateToProps = state => ({
  user: state.user.user
});

const mapDispatchToProps = dispatch => ({
  setUserAndDevice(user) {
    return dispatch(setUserAndDevice(user));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
