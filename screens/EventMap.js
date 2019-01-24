import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Location, Permissions } from 'expo';
import { Map } from '../components';
import { connect } from 'react-redux';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class EventMap extends React.Component {
  constructor() {
    super();
    this.state = {
      region: null,
      coordinate: null,
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

    const location = await Location.getCurrentPositionAsync({});

    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    };
    const coordinate = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
    await this.setState({ region, coordinate });
  };
  componentDidMount() {
    this.getLocationAsync();
  }
  render() {
    return (
      <Map region={this.state.region} coordinate={this.state.coordinate} />
    );
  }
}
