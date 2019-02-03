/* eslint-disable guard-for-in */
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  Platform
} from 'react-native';
import { MapView, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { mapStyle } from './styles/mapStyle';
import {
  fetchAllEvents,
  setSelectedEvent,
  setAllEventsMapLocation,
  setSingleEventMapLocation
} from '../redux/store';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = height / 4;
const CARD_HEIGHT = CARD_WIDTH - 50;

class AllEventsMap extends React.Component {
  state = {
    user: {},
    region: null
  };

  renderEventCard = () => {
    if (this.props.allEvents.length) {
      const allEvents = this.props.allEvents;
      let event, title, date, description, time, id, eventDetails;

      return allEvents.map(eventData => {
        for (let uid in eventData) {
          event = eventData[uid];
          title = event.name;
          time = event.time;
          date = event.date;
          description = event.location.locationName;
          id = uid;
        }

        // Touchable opacity on this card that will navigate the user to
        // the single event map and also pass along that event information
        const thisId = Object.keys(eventData)[0];
        const eventLocation = {
          latitude: event.location.locationGeocode.lat,
          longitude: event.location.locationGeocode.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.043
        };
        return (
          <TouchableOpacity
            key={thisId}
            onPress={() => {
              this.props.setSingleEventMapLocation(eventLocation);
              this.props.setSelectedEvent(eventData);
              // this.props.navigation.navigate('SingleEvent', { eventDetails });
            }}
          >
            <View style={styles.card}>
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {title}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {description}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {date}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {time}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    }
  };
  // animate region changes
  mapAnimation = value => {
    let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    if (index >= this.props.allEvents.length) {
      index = this.props.allEvents.length - 1;
    }
    if (index <= 0) {
      index = 0;
    }

    clearTimeout(this.regionTimeout);
    this.regionTimeout = setTimeout(() => {
      if (this.index !== index) {
        this.index = index;
        let latitude, longitude;
        for (let uid in this.props.allEvents[index]) {
          latitude = this.props.allEvents[index][uid].location.locationGeocode
            .lat;
          longitude = this.props.allEvents[index][uid].location.locationGeocode
            .lng;
        }
        this.map.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.043
          },
          350
        );
      }
    }, 10);
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
      //send initial location to the DB -- SHOULD BE DONE IN BACKGROUND?
      // try {
      //   await database.ref(`/Devices/${deviceId}`).update({
      //     coords: location.coords,
      //     timestamp: location.timestamp
      //   });
      // } catch (error) {
      //   console.error(error);
      // }

      //might want to calculate starting delta based on event location (in single event) so it's shown along with user position
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.043
      };
      this.props.setLocation(region);
    } catch (err) {
      console.error(err);
    }
  };
  async componentDidMount() {
    this.index = 0;
    if (this.props.user.email) {
      this.props.fetchEvents(this.props.user.email);
    }

    //gets my location and sets map center
    await this.getLocationAsync();
  }

  //this updates the map region when the user interacts with the map
  updateMapRegion = region => {
    this.props.setAllEventsMapLocation(region);
  };

  render() {
    const { allEvents, location } = this.props;
    let interpolations;
    if (allEvents.length) {
      interpolations = allEvents.map((event, index) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          (index + 1) * CARD_WIDTH
        ];
        const scale = this.props.animation.interpolate({
          inputRange,
          outputRange: [1, 2.5, 1],
          extrapolate: 'clamp'
        });
        const opacity = this.props.animation.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35],
          extrapolate: 'clamp'
        });
        return { scale, opacity };
      });
    }
    //move center map button above cards

    return (
      <View style={styles.container}>
        <MapView
          ref={map => (this.map = map)}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          region={location}
          onRegionChangeComplete={e => this.updateMapRegion(e)}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
        >
          {this.props.allEvents.length
            ? this.props.allEvents.map((eventData, index) => {
                for (let uid in eventData) {
                  const event = eventData[uid];
                  const latitude = event.location.locationGeocode.lat;
                  const longitude = event.location.locationGeocode.lng;
                  const title = event.name;
                  const id = uid;

                  const scaleStyle = {
                    transform: [
                      {
                        scale: interpolations[index].scale
                      }
                    ]
                  };

                  const opacityStyle = {
                    opacity: interpolations[index].opacity
                  };

                  return (
                    <MapView.Marker
                      key={id}
                      title={title}
                      coordinate={{ latitude, longitude }}
                    >
                      <Animated.View style={[styles.markerWrap, opacityStyle]}>
                        <Animated.View style={[styles.ring, scaleStyle]} />
                        <View style={styles.marker} />
                      </Animated.View>
                    </MapView.Marker>
                  );
                }
              })
            : null}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.props.animation
                  }
                }
              }
            ],
            {
              listener: event => {
                this.mapAnimation(event.nativeEvent.contentOffset.x);
              }
            },
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.renderEventCard()}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // justifyContent: 'flex-end',
    // alignItems: 'center'
    flex: 1
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH
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
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)'
  }
});

const mapState = state => ({
  allEvents: state.event.allEvents,
  user: state.user.user,
  animation: state.animate.allEventsAnimate,
  location: state.maps.allEventsMap
});

const mapDispatch = dispatch => ({
  fetchEvents: email => dispatch(fetchAllEvents(email)),
  setSelectedEvent: event => dispatch(setSelectedEvent(event)),
  setAllEventsMapLocation: location =>
    dispatch(setAllEventsMapLocation(location)),
  setSingleEventMapLocation: location =>
    dispatch(setSingleEventMapLocation(location))
});

export default connect(
  mapState,
  mapDispatch
)(AllEventsMap);
