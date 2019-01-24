import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MapView } from 'expo';
// import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
const Marker = MapView.Marker;

export default class EventMap extends React.Component {
  constructor() {
    super();
    this.state = {
      coordinate: { latitude: 10, longitude: 10 }
    };
  }

  componentDidMount() {
    this.setState({
      coordinate: this.props.coordinate
    });
  }
  render() {
    const { region } = this.props;
    let { coordinate } = this.state;

    return (
      <MapView
        style={styles.container}
        // showsUserLocation={true}
        region={region}
        provider={MapView.PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={this.state.coordinate}
          draggable={true}
          // coordinate={this.props.coordinate}
          onDragEnd={e =>
            this.setState({ coordinate: e.nativeEvent.coordinate })
          }
        />
      </MapView>
    );
  }
}
