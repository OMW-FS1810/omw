/* eslint-disable guard-for-in */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions
} from 'react-native';
import { MapView, Constants } from 'expo';
import { connect } from 'react-redux';
import { mapStyle } from './styles/mapStyle';
import { fetchAllEvents } from '../redux/event';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

class AllEventsMap extends React.Component {
  state = {
    user: {},
    region: null
  };

  renderEventMarker = () => {
    // console.log('hi');

    if (this.props.allEvents.length) {
      const allEvents = this.props.allEvents;
      // return (
      //   <MapView.Marker
      //     key={Math.random() * 100}
      //     coordinate={{
      //       latitude: 41.89526600000001,
      //       longitude: -87.63903499999999
      //     }}
      //   />
      // );
      allEvents.map(eventData => {
        console.log('event info for adam 🔥', eventData);
        for (let uid in eventData) {
          const event = eventData[uid];
          const latitude = event.location.locationGeocode.lat;
          const longitude = event.location.locationGeocode.lng;
          const title = event.name;
          const time = event.time;
          const date = event.date;
          const description = event.location.locationName;
          const id = uid;

          // console.log('latitude', latitude);
          // console.log('longitude', longitude);
          // console.log('title', title);
          // console.log('time', time);
          // console.log('date', date);
          // console.log('description', description);
          // console.log('id', id);
          // 👋 hi

          return (
            <MapView.Marker
              coordinate={{ latitude: 45.524698, longitude: -122.6655507 }}
            />
            // <MapView.Marker key={id} coordinate={{ latitude, longitude }}>
            //   {/* <Animated.View style={styles.markerWrap}>
            //     <Animated.View style={styles.ring} />
            //     <View style={styles.marker} />
            //   </Animated.View> */}
            // </MapView.Marker>
          );
        }
      });
    }
  };

  renderEventCard = () => {
    if (this.props.allEvents.length) {
      const allEvents = this.props.allEvents;
      allEvents.map(async eventData => {
        for (let uid in eventData) {
          const event = eventData[uid];
          const latitude = event.location.locationGeocode.lat;
          const longitude = event.location.locationGeocode.lng;
          const title = event.name;
          const time = event.time;
          const date = event.date;
          const description = event.location.locationName;
          const id = uid;
          return (
            <View key={id} styles={styles.card}>
              <View styles={styles.textContent}>
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
          );
        }
      });
    }
  };

  async componentDidMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
    if (this.props.user.email) this.props.fetchEvents(this.props.user.email);
    await this.setState({ region: this.props.region });
  }

  //this updates the map region when the user interacts with the map
  updateMapRegion = region => {
    this.setState({ region });
  };

  render() {
    const { user, backgroundLocation, setBackgroundLocation } = this.props;
    const { region } = this.state;
    return (
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
          {this.renderEventMarker()}
        </MapView>
        {/* <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation
                  }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.renderEventCard()}
        </Animated.ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)'
  }
});

const mapState = state => ({
  allEvents: state.event.allEvents
});

const mapDispatch = dispatch => ({
  fetchEvents: email => dispatch(fetchAllEvents(email))
});

export default connect(
  mapState,
  mapDispatch
)(AllEventsMap);
