import React from 'react';
import { StyleSheet } from 'react-native';
import { Location, Permissions, TaskManager, Constants } from 'expo';
import { Map } from '../components';
import { database } from '../config/firebase';
import { connect } from 'react-redux';
import { store } from '../redux/store';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const SEND_LOCATION = 'sendLocation';

const deviceId = Constants.installationId;

//This logs our location, running in the background -- eventually move this to when the app is opened
TaskManager.defineTask(SEND_LOCATION, async ({ data: { locations }, err }) => {
  if (err) {
    console.error(err);
    return;
  }
  try {
    await database.ref(`/Devices/${deviceId}`).update({
      coords: locations[0].coords,
      timestamp: locations[0].timestamp
    });
  } catch (error) {
    console.error(error);
  }
});

class EventMap extends React.Component {
  constructor() {
    super();
    this.state = {
      region: null,
      eventLocation: {
        latitude: 41.8789,
        longitude: -87.6358,
        title: 'Event Title',
        description: 'Description of event'
      },
      eventMembers: [],
      errorMessage: ''
    };
  }
  //this updates the map region when the user interacts with the map
  updateMapRegion = region => {
    this.setState({ region });
  };
  //This gets our initial position and region for our map
  getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied'
        });
      }
      const location = await Location.getCurrentPositionAsync({});
      //send initial location to the DB
      try {
        await database.ref(`/Devices/${deviceId}`).update({
          coords: location.coords,
          timestamp: location.timestamp
        });
      } catch (error) {
        console.error(error);
      }

      //might want to calculate starting delta based on event location so it's shown along with user position
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0461,
        longitudeDelta: 0.021
      };
      this.setState({ region });
    } catch (err) {
      console.error(err);
    }
  };
  locateMembers = members => {
    //turns the object into an array
    const eventMembers = Object.keys(members)
      // filters this device out of the group of members (disabled)
      // .filter(member => member !== myId)
      .map(device => {
        return [device, members[device]];
      });
    this.setState({ eventMembers });
  };
  async componentDidMount() {
    try {
      //gets my location
      await this.getLocationAsync();
      //triggers sending my location -- works in the background on iOS
      await Location.startLocationUpdatesAsync(SEND_LOCATION, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 50,
        timeInterval: 60000
      });

      //FIX!!!!! This will have to be event-specific eventually -- and tied into users
      const userLocationsDB = database.ref(`/Devices/`);

      await userLocationsDB.on('value', snapshot => {
        return this.locateMembers(snapshot.val());
      });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const { region, eventMembers, eventLocation } = this.state;
    const { user } = this.props;
    return (
      <Map
        user={user.user}
        region={region}
        eventMembers={eventMembers}
        coordinate={eventLocation}
        updateMapRegion={this.updateMapRegion}
      />
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(EventMap);
