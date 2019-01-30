import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import { MapView, Constants } from 'expo';
// import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { mapStyle } from './styles/mapStyle';
//vectir icons '@expo/vector-icons'
import { convertTimestamp } from '../helpers/convertTimestamp';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

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
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden'
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  textContent: {
    flex: 1
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold'
  },
  cardDescription: {
    fontSize: 12,
    color: '#444'
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)'
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)'
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
            description={convertTimestamp(member[1].timestamp)}
            coordinate={member[1].coords}
            pinColor="blue"
          />
        )
      );
    });
  };

  componentDidMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  render() {
    const {
      region,
      updateMapRegion,
      user,
      event,
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
              coordinate={event.location.locationGeocode}
              title={event.name}
              description={`${event.location.locationName} ${event.date} ${
                event.time
              }`}
              //dragging is disabled
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
