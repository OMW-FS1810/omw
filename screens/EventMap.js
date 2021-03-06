/* eslint-disable guard-for-in */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  Image,
  View,
  WebView
} from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';

import { MapView } from 'expo';
import {
  SingleEventMapCards,
  AllEventsMapCards,
  MemberMarkers,
  EventMarkers,
  Snackbar
} from '../components';
import { connect } from 'react-redux';
import { mapStyle } from '../styles/mapStyle';
import {
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
  Entypo,
  AntDesign
} from '@expo/vector-icons';
import { getMyLocationNow } from '../helpers/location';
import {
  fetchAllEvents,
  setSelectedEvent,
  justMadeEventToggle,
  trackMembersStart,
  trackMembersStop
} from '../redux/store';
import { database } from '../config/firebase';

import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';
import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

class EventMap extends React.Component {
  state = {
    loading: false,
    localMapRegion: null
    // eventMembers: {}
  };

  static navigationOptions = ({ navigation }) => ({
    title: 'OMW',
    headerStyle: {
      backgroundColor: color.whiteBlue,
      headerTintColor: color.whiteBlue,
      headerTitleStyle: {
        fontFamily: fontFamily.bold
      }
    },
    headerLeft: (
      <Icon
        name="menu"
        color={color.whiteblue}
        containerStyle={{ paddingLeft: 10 }}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    headerRight: (
      <Icon
        name="add"
        color={color.whiteblue}
        containerStyle={{ paddingRight: 10 }}
        onPress={() => navigation.navigate('CREATE EVENT')}
      />
    )
  });

  //this updates the map region when the user interacts with the map
  updateMapRegion = region => {
    this.setState({ localMapRegion: region });
  };

  recenterMap = async () => {
    const myRegion = await getMyLocationNow();
    this.animateToMapPosition(myRegion);
  };

  animateToMapPosition = position => {
    this.map.animateToRegion(position, 300);
  };

  // change region to follow cards
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
        if (Object.keys(this.props.eventMembers).length) {
          const memberArr = Object.keys(this.props.eventMembers)
            .map(memberEmail => {
              return [memberEmail, this.props.eventMembers[memberEmail]];
            })
            .filter(member => member[1]);
          //exit on empty members array
          if (!memberArr.length) return;
          latitude = memberArr[index][1].coords.latitude;
          longitude = memberArr[index][1].coords.longitude;
        } else {
          for (let uid in this.props.allEvents[index]) {
            latitude = this.props.allEvents[index][uid].location.locationGeocode
              .lat;
            longitude = this.props.allEvents[index][uid].location
              .locationGeocode.lng;
          }
        }
        this.animateToMapPosition({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.043
        });
      }
    }, 10);
  };

  selectEvent = async event => {
    await this.props.setSelectedEvent(event);

    const location = Object.values(event)[0].location;
    const latitude = location.locationGeocode.lat;
    const longitude = location.locationGeocode.lng;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.1226,
      longitudeDelta: 0.0467
    };
    await this.animateToMapPosition(newRegion);

    setTimeout(() => {
      this.props.trackMembersStart(Object.values(event)[0].invites, newRegion);
    }, 500);

    //for some reason i can't get a smooth transition here
    // setTimeout(() => {
    // }, 50);

    // this.setState({ localMapRegion: newRegion });
  };

  clearEvent = () => {
    this.props.setSelectedEvent({});
    this.props.trackMembersStop(
      Object.values(this.props.selectedEvent)[0].invites
    );
  };

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      //gets my location
      await this.setState({ localMapRegion: await getMyLocationNow() });
      await this.props.fetchEvents(this.props.user.email);
      this.setState({ loading: false });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { navigation, allEvents, selectedEvent, eventJustMade } = this.props;
    // if (eventJustMade && Object.keys(selectedEvent).length) {
    //   this.trackMembersStart(Object.values(selectedEvent)[0].invites);
    //   this.props.justMadeEventToggle();
    // }
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

    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          color="darkgrey"
          size="large"
          style={{ margin: 15, zIndex: 50 }}
        />
        {this.state.localMapRegion && (
          <>
            <MapView
              ref={map => (this.map = map)}
              style={styles.map}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={false}
              showsScale={true}
              region={this.state.localMapRegion}
              onRegionChangeComplete={e => this.updateMapRegion(e)}
              provider={MapView.PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
            >
              {Object.keys(selectedEvent).length ? (
                <>
                  <MemberMarkers
                    eventMembers={this.props.eventMembers}
                    me={this.props.user.email}
                    selectedEvent={selectedEvent}
                  />
                  <MapView.Marker
                    coordinate={{
                      latitude: Object.values(this.props.selectedEvent)[0]
                        .location.locationGeocode.lat,
                      longitude: Object.values(this.props.selectedEvent)[0]
                        .location.locationGeocode.lng
                    }}
                    title={Object.values(this.props.selectedEvent)[0].name}
                    description={
                      Object.values(this.props.selectedEvent)[0].date
                    }
                    image={
                      Object.values(this.props.selectedEvent)[0].locationPhoto
                    }
                  >
                    <Icon
                      name="location"
                      type="entypo"
                      size={30}
                      color={color.darkOrange}
                    />
                    <MapView.Callout style={styles.selectedEvent}>
                      <View style={styles.card}>
                        <View style={styles.textContent}>
                          <Text>
                            {Object.values(this.props.selectedEvent)[0].name}
                          </Text>
                          <Text>
                            {Object.values(this.props.selectedEvent)[0].date}{' '}
                            {Object.values(this.props.selectedEvent)[0].time}
                          </Text>
                        </View>
                        {Object.values(this.props.selectedEvent)[0]
                          .locationPhoto !== '' && (
                          <View style={styles.textContent}>
                            <Image
                              source={{
                                uri: Object.values(this.props.selectedEvent)[0]
                                  .locationPhoto
                              }}
                              style={styles.cardImage}
                              resizeMode="cover"
                            />
                          </View>
                        )}
                      </View>
                    </MapView.Callout>
                  </MapView.Marker>
                </>
              ) : allEvents.length ? (
                <EventMarkers
                  allEvents={allEvents}
                  interpolations={interpolations}
                  me={this.props.user.email}
                />
              ) : null}
            </MapView>
            {Object.keys(selectedEvent).length ? (
              <>
                <MapView.Callout style={styles.allEventsButton}>
                  <TouchableOpacity
                    onPress={() => {
                      // this.setState({ loading: true });
                      this.clearEvent();
                      // this.setState({ loading: false });
                    }}
                  >
                    <MaterialCommunityIcons
                      name="map-marker-multiple"
                      size={24}
                      color="teal"
                    />
                    <Text>Show all events</Text>
                  </TouchableOpacity>
                </MapView.Callout>
                <MapView.Callout style={styles.eventDetailsButton}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SingleEvent');
                    }}
                  >
                    <MaterialIcons name="event-note" size={24} color="teal" />
                    <Text>Event details</Text>
                  </TouchableOpacity>
                </MapView.Callout>
                <MapView.Callout style={styles.centerEventButton}>
                  <TouchableOpacity
                    onPress={() => {
                      const latitude = Object.values(
                        this.props.selectedEvent
                      )[0].location.locationGeocode.lat;
                      const longitude = Object.values(
                        this.props.selectedEvent
                      )[0].location.locationGeocode.lng;

                      this.animateToMapPosition({
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.043
                      });
                    }}
                  >
                    <Entypo name="location" size={24} color="teal" />
                    <Text>Center event</Text>
                  </TouchableOpacity>
                </MapView.Callout>
              </>
            ) : // <MapView.Callout style={styles.allEventsButton}>
            //   <TouchableOpacity
            //     onPress={() => {
            //       this.props.navigation.navigate('CREATE EVENT');
            //     }}
            //   >
            //     <AntDesign name="pluscircleo" size={45} color="teal" />
            //     <Text>Create Event</Text>
            //   </TouchableOpacity>
            // </MapView.Callout>
            null}

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
                    if (!Object.keys(selectedEvent).length) {
                      this.mapAnimation(event.nativeEvent.contentOffset.x);
                    }
                  }
                },
                { useNativeDriver: true }
              )}
              style={styles.scrollView}
              contentContainerStyle={styles.endPadding}
            >
              {Object.keys(selectedEvent).length ? (
                <>
                  <SingleEventMapCards
                    eventMembers={this.props.eventMembers}
                    me={this.props.user.email}
                    animateToMapPosition={this.animateToMapPosition}
                  />
                  <TouchableOpacity key={Math.random() * 100}>
                    <View style={styles.card} opacity={0.0} />
                  </TouchableOpacity>
                  <TouchableOpacity key={Math.random() * 100}>
                    <View style={styles.card} opacity={0.0} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <AllEventsMapCards
                    allEvents={allEvents}
                    selectEvent={this.selectEvent}
                    interpolations={interpolations}
                    // animateToMapPosition={this.animateToMapPosition}
                  />
                  {/* the following is a blank card to fix scrolling issues */}
                  <TouchableOpacity key={Math.random() * 100}>
                    <View style={styles.card} opacity={0.0} />
                  </TouchableOpacity>
                </>
              )}
            </Animated.ScrollView>

            <MapView.Callout style={styles.myLocationButton}>
              <TouchableOpacity
                onPress={() => {
                  this.recenterMap();
                }}
              >
                <Ionicons name="md-locate" size={40} color="teal" />
              </TouchableOpacity>
            </MapView.Callout>
            <Snackbar navigation={navigation} selectEvent={this.selectEvent} />
          </>
        )}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  myLocationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 1
  },
  scrollView: {
    position: 'absolute',
    bottom: 50,
    paddingVertical: 10,
    paddingHorizontal: padding
  },

  endPadding: {
    paddingRight: width - CARD_WIDTH
  },
  allEventsButton: {
    padding: 10,
    top: 10,
    width: 80,
    height: 100,
    left: 10,
    borderRadius: 5,
    borderColor: 'teal',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  eventDetailsButton: {
    padding: 10,
    top: 10,
    width: 80,
    height: 100,
    left: 100,
    borderRadius: 5,
    borderColor: 'teal',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  centerEventButton: {
    padding: 10,
    top: 120,
    width: 80,
    height: 100,
    left: 10,
    borderRadius: 5,
    borderColor: 'teal',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  selectedEvent: {
    flex: 1,
    flexDirection: 'row'
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT / 1.3,
    width: CARD_WIDTH / 1.3,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '80%',
    alignSelf: 'center'
  },
  textContent: {
    flex: 1,
    padding: 5
  }
});

const mapStateToProps = state => ({
  allEvents: state.event.allEvents,
  selectedEvent: state.event.selectedEvent,
  eventMembers: state.event.eventMembers,
  user: state.user.user,
  animation: state.animate.allEventsAnimate
});

const mapDispatchToProps = dispatch => ({
  fetchEvents: email => dispatch(fetchAllEvents(email)),
  setSelectedEvent: event => dispatch(setSelectedEvent(event)),
  trackMembersStart: (members, newRegion) =>
    dispatch(trackMembersStart(members, newRegion)),
  trackMembersStop: members => dispatch(trackMembersStop(members))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventMap);
