import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MapView, Constants } from 'expo';
// import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { mapStyle } from './mapStyle';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const { Marker, Callout } = MapView;
const myId = Constants.installationId;

export default class EventMap extends React.Component {
  renderMemberMarkers = () => {
    return this.props.eventMembers.map(member => {
      return member[0] === myId ? (
        <Marker
          key={member[0]}
          title="Me"
          description={member[0]}
          coordinate={member[1].location.coords}
          pinColor="green"
        />
      ) : (
        <Marker
          key={member[0]}
          title="Event Member"
          description={member[0]}
          coordinate={member[1].location.coords}
          pinColor="blue"
        />
      );
    });
  };
  componentDidMount() {}
  render() {
    const { region, updateMapRegion } = this.props;

    return (
      <MapView
        style={styles.container}
        // showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        region={region}
        onRegionChangeComplete={e => updateMapRegion(e)}
        provider={MapView.PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
      >
        {this.renderMemberMarkers()}
        <Marker
          coordinate={this.props.coordinate}
          title={this.props.coordinate.title}
          description={this.props.coordinate.description}
          // draggable={true}
          // onDragEnd={e =>
          //   this.setState({ coordinate: e.nativeEvent.coordinate })
          // }
        />
      </MapView>
    );
  }
}
