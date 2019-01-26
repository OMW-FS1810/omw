import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MapView, Constants } from 'expo';
// import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { mapStyle } from './mapStyle';
//vectir icons '@expo/vector-icons'

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const { Marker, Callout } = MapView;
const deviceId = Constants.installationId;

export default class EventMap extends React.Component {
  renderMemberMarkers = () => {
    return this.props.eventMembers.map(member => {
      let markerName;
      if (member[1].email) {
        markerName = member[1].email;
      } else {
        markerName = 'Unknown Member';
      }
      return (
        //only return members who are not this device -- give device ID as description
        member[0] !== deviceId &&
        member[1].coords && (
          <Marker
            key={member[0]}
            title={markerName}
            description={member[0]}
            coordinate={member[1].coords}
            pinColor="blue"
          />
        )
      );
      // );
    });
  };
  componentDidMount() {}
  render() {
    const { region, updateMapRegion, user } = this.props;
    return (
      region && (
        <MapView
          style={styles.container}
          showsUserLocation={true}
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
      )
    );
  }
}
