import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Location, Permissions, TaskManager, Notifications } from 'expo';
import { Map } from '../components';
import { connect } from 'react-redux';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const SEND_LOCATION = 'sendLocation';

//This logs our location, running in the background -- NOT IN USE
TaskManager.defineTask(SEND_LOCATION, ({ data: { locations }, err }) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Received new location:', locations[0]);
});

export default class EventMap extends React.Component {
  constructor() {
    super();
    this.state = {
      region: null,
      eventLocation: {
        latitude: 41.8789,
        longitude: -87.6358
      },
      errorMessage: ''
    };
  }
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }
    //This gets our position for our map
    const location = await Location.getCurrentPositionAsync({});

    //might want to calculate starting delta based on event location so it's shown along with user position
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0461,
      longitudeDelta: 0.021
    };
    await this.setState({ region });
  };
  async componentDidMount() {
    //gets my location
    this.getLocationAsync();
    //triggers sending my location in the background -- NOT IN USE
    await Location.startLocationUpdatesAsync(SEND_LOCATION, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 50,
      timeInterval: 60000
    });
  }
  render() {
    return (
      <Map region={this.state.region} coordinate={this.state.eventLocation} />
    );
  }
}
