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
import { mapStyle } from '../styles/mapStyle';
//vectir icons '@expo/vector-icons'
import { convertTimestamp } from '../helpers/convertTimestamp';
import { setSelectedEvent, setSingleEventMapLocation } from '../redux/store';
import { database } from '../config/firebase';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

const { Marker, Callout } = MapView;
const deviceId = Constants.installationId;

class Map extends React.Component {
  state = {
    eventMembers: []
  };

  renderMemberMarkers = () => {
    return this.state.eventMembers.map(member => {
      let markerName;
      if (member[0] && member[1]) {
        markerName = member[0];

        return (
          //only return members who are not this device -- give device ID as description -- it's no longer keyed by user id!!
          // member[0] !== deviceId &&
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
      } else {
        return null;
      }
    });
  };
  locateMembers = async members => {
    // const membersByEmail = {};
    // // eslint-disable-next-line guard-for-in
    // for (let key in members) {
    //   if (members[key].email) {
    //     let thisEmail = members[key].email.toLowerCase();
    //     membersByEmail[thisEmail] = members[key];
    //   }
    // }

    // rearrange users by email
    // try {
    //   const userLocationsDB = database.ref(`/Devices/`);

    //   await userLocationsDB.on('value', snapshot => {
    //     return this.locateMembers(snapshot.val());
    //   });
    // } catch (err) {
    //   console.error(err);
    // }

    // if (Object.keys(this.state.event).length) {
    //   let { membersByEmail } = this.props;
    //   const thisEvent = this.state.event;

    //   const eventMembers = [];
    //   thisEvent.invites.forEach(invite => {
    //     eventMembers.push([invite, membersByEmail[invite.toLowerCase()]]);
    //   });
    //   this.setState({ eventMembers });
    // }
    console.log(members);
  };
  updateMapRegion = region => {
    this.props.setSingleEventMapLocation(region);
  };
  async componentDidMount() {
    this.index = 0;
    //TO DO: connect animations (if any) to store value
    this.animation = new Animated.Value(0);

    await this.locateMembers(this.props.selectedEvent.invites);
  }

  render() {
    const { selectedEvent, location } = this.props;
    if (Object.keys(selectedEvent).length) {
      const coordinate = {
        latitude: selectedEvent.location.locationGeocode.lat,
        longitude: selectedEvent.location.locationGeocode.lng
      };
      return (
        location && (
          <View style={styles.container}>
            <MapView
              style={styles.map}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              showsScale={true}
              region={location}
              onRegionChangeComplete={e => this.updateMapRegion(e)}
              provider={MapView.PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
            >
              {/* {this.renderMemberMarkers()} */}
              <Marker
                coordinate={coordinate}
                title={selectedEvent.name}
                description={`${selectedEvent.location.locationName} ${
                  selectedEvent.date
                } ${selectedEvent.time}`}
              />
            </MapView>
            <Callout style={styles.callout}>
              <TouchableOpacity
                onPress={() => {
                  this.props.setSingleEventMapLocation({});
                  this.props.setSelectedEvent({});
                }}
              >
                <Text>See All Events</Text>
              </TouchableOpacity>
            </Callout>
          </View>
        )
      );
    } else {
      return null;
    }
  }
}

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

const mapStateToProps = ({ event, maps, user }) => ({
  selectedEvent: Object.values(event.selectedEvent)[0],
  location: maps.singleEventMap,
  myEmail: user.user.email
});
const mapDispatchToProps = dispatch => ({
  setSelectedEvent: event => dispatch(setSelectedEvent(event)),
  setSingleEventMapLocation: location =>
    dispatch(setSingleEventMapLocation(location))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
