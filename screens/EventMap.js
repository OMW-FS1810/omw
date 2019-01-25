import React from 'react';
import { StyleSheet } from 'react-native';
import { Location, Permissions, TaskManager, Constants } from 'expo';
import { Map } from '../components';
import { database } from '../config/firebase';
import { connect } from 'react-redux';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const SEND_LOCATION = 'sendLocation';

const myId = Constants.installationId;

//This logs our location, running in the background -- eventually move this to when the app is opened
TaskManager.defineTask(SEND_LOCATION, async ({ data: { locations }, err }) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Sending new location:', locations[0]);
  try {
    await database.ref(`/Locations/${myId}`).set({
      location: locations[0]
    });
  } catch (error) {
    console.error(error);
  }
});

export default class EventMap extends React.Component {
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
    //filters this device out of the group of members and turns the object into an array
    const eventMembers = Object.keys(members)
      .filter(member => member !== myId)
      .map(key => {
        return [key, members[key]];
      });
    this.setState({ eventMembers });
    console.log('state in locate mems: ', this.state);
  };
  async componentDidMount() {
    try {
      //gets my location
      await this.getLocationAsync();
      //triggers sending my location -- works in the background on iOS
      await Location.startLocationUpdatesAsync(SEND_LOCATION, {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
        timeInterval: 5000
      });
      //create array to use for markers BELOW

      //FIX!!!!! This will have to be event-specific eventually -- and tied into users
      const userLocationsDB = database.ref(`/Locations/`);

      const userLocations = await userLocationsDB.on('value', snapshot => {
        return this.locateMembers(snapshot.val());
      });
      this.locateMembers(userLocations);
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const { region, eventMembers, eventLocation } = this.state;
    return (
      <Map
        region={region}
        eventMembers={eventMembers}
        coordinate={eventLocation}
        updateMapRegion={this.updateMapRegion}
      />
    );
  }
}
