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
import AllEventsMap from './AllEventsMap';
import { database } from '../config/firebase';
import { setSelectedEvent } from '../redux/event';

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

class Map extends React.Component {
  state = {
    eventMembers: [],
    event: {},
    region: null
  };
  updateMapRegion = region => {
    this.setState({ region });
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
  locateMembers = members => {
    //rearrange users by email

    const membersByEmail = {};
    // eslint-disable-next-line guard-for-in
    for (let key in members) {
      if (members[key].email) {
        let thisEmail = members[key].email.toLowerCase();
        membersByEmail[thisEmail] = members[key];
      }
    }
    const thisEvent = this.state.event;

    const eventMembers = [];
    thisEvent.invites.forEach(invite => {
      eventMembers.push([invite, membersByEmail[invite.toLowerCase()]]);
    });
    this.setState({ eventMembers });
  };
  async componentDidMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
    const userLocationsDB = database.ref(`/Devices/`);

    await this.setState({
      event: Object.values(this.props.selectedEvent)[0]
    });

    const thisEvent = this.state.event;
    await userLocationsDB.on('value', snapshot => {
      return this.locateMembers(snapshot.val());
    });
    const region = {
      latitude: thisEvent.location.locationGeocode.lat,
      longitude: thisEvent.location.locationGeocode.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.043
    };
    await this.setState({
      region
    });
  }

  render() {
    let event = false;
    if (Object.keys(this.state.event).length) {
      event = this.state.event;
      console.log(event);
      const { region } = this.state;
      const { user, backgroundLocation, setBackgroundLocation } = this.props;
      const coordinate = {
        latitude: event.location.locationGeocode.lat,
        longitude: event.location.locationGeocode.lng
      };
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
              onRegionChangeComplete={e => this.updateMapRegion(e)}
              provider={MapView.PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
            >
              {this.renderMemberMarkers()}
              <Marker
                coordinate={coordinate}
                title={event.name}
                description={`${event.location.locationName} ${event.date} ${
                  event.time
                }`}
              />
            </MapView>
            <Callout style={styles.callout}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    eventMembers: [],
                    event: {},
                    region: null
                  });
                  this.props.selectEvent({});
                }}
              >
                <Text>See All Events</Text>
                {/* onPress={setBackgroundLocation}> */}
                {/* {backgroundLocation ? (
                <Text>Stop Background Location</Text>
              ) : (
                <Text>Start Background Location</Text>
              )} */}
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

const mapStateToProps = ({ event }) => ({
  selectedEvent: event.selectedEvent
});
const mapDispatchToProps = dispatch => ({
  selectEvent: event => dispatch(setSelectedEvent(event))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
