import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import { MapView, Constants } from 'expo';
// import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { mapStyle } from './mapStyle';
//vectir icons '@expo/vector-icons'

let styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // }
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  callout: {
    padding: 10,
    bottom: 50,
    borderRadius: 3,
    backgroundColor: 'grey'
  }
});

const { Marker, Callout } = MapView;
const deviceId = Constants.installationId;

export default class Map extends React.Component {
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
    });
  };
  componentDidMount() {}
  render() {
    const {
      region,
      updateMapRegion,
      user,
      backgroundLocation,
      setBackgroundLocation
    } = this.props;
    return (
      region && (
        <View style={styles.container}>
          <MapView
            style={styles.map}
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
          <Callout style={styles.callout}>
            <TouchableOpacity onPress={setBackgroundLocation}>
              {backgroundLocation ? (
                <Text>Stop Background Location</Text>
              ) : (
                <Text>Start Background Location</Text>
              )}
            </TouchableOpacity>
          </Callout>
        </View>
      )
    );
  }
}
