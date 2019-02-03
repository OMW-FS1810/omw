import React from 'react';
import { StyleSheet } from 'react-native';
import { Constants } from 'expo';
import { SingleEventMap } from '../components';
import { connect } from 'react-redux';
import AllEventsMap from '../components/AllEventsMap';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class EventMap extends React.Component {
  // //this updates the map region when the user interacts with the map
  // updateMapRegion = region => {
  //   this.setState({ region });
  // };
  // //This gets our initial position and region for our map
  // getLocationAsync = async () => {
  //   try {
  //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //     if (status !== 'granted') {
  //       this.setState({
  //         errorMessage: 'Permission to access location was denied'
  //       });
  //     }
  //     const location = await Location.getCurrentPositionAsync({});
  //     //send initial location to the DB
  //     try {
  //       await database.ref(`/Devices/${deviceId}`).update({
  //         coords: location.coords,
  //         timestamp: location.timestamp
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }

  //     //might want to calculate starting delta based on event location so it's shown along with user position
  //     const region = {
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //       latitudeDelta: 0.0922,
  //       longitudeDelta: 0.043
  //     };
  //     this.setState({ region });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // locateMembers = members => {
  //   //rearrange users by email

  //   const membersByEmail = {};
  //   // eslint-disable-next-line guard-for-in
  //   for (let key in members) {
  //     if (members[key].email) {
  //       let thisEmail = members[key].email.toLowerCase();
  //       membersByEmail[thisEmail] = members[key];
  //     }
  //   }
  //   this.setState({ membersByEmail });
  // };
  // async componentDidMount() {
  //   try {
  //     //gets my location
  //     await this.getLocationAsync();

  //     //FIX!!!!! This will have to be event-specific eventually -- and tied into users
  //     // local state can be set to match redux store selected event or the props can just be passed down from the store to the map
  //     const userLocationsDB = database.ref(`/Devices/`);

  //     await userLocationsDB.on('value', snapshot => {
  //       return this.locateMembers(snapshot.val());
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  render() {
    const { navigation, event } = this.props;
    return Object.keys(event.selectedEvent).length ? (
      <SingleEventMap navigation={navigation} />
    ) : (
      <AllEventsMap navigation={navigation} />
    );
  }
}
const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(EventMap);
