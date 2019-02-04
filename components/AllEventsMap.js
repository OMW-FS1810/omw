/* eslint-disable guard-for-in */
import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Text
} from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';

import { fetchAllEvents, setSelectedEvent } from '../redux/store';

import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';

class AllEventsMap extends React.Component {
  state = {
    loading: false
  };

  //creates the individual event cards
  renderEventCard = () => {
    if (this.props.allEvents.length) {
      const allEvents = this.props.allEvents;
      return allEvents.map(eventData => {
        //this is a trick to get the objects out -- there's only one 'uid' for each event
        let event, title, time, date, description;
        for (let uid in eventData) {
          event = eventData[uid];
          title = event.name;
          time = event.time;
          date = event.date;
          description = event.location.locationName;
        }
        const thisId = Object.keys(eventData)[0];
        const eventLocation = {
          latitude: event.location.locationGeocode.lat,
          longitude: event.location.locationGeocode.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.043
        };
        console.log(event);
        return (
          <TouchableOpacity
            key={thisId}
            onPress={() => {
              this.props.animateToMapPosition(eventLocation);
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

  async componentDidMount() {
    this.index = 0;

    if (this.props.user.email) {
      await this.props.fetchEvents(this.props.user.email);
    }
  }

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

    return null;
    // {/* <View style={styles.container}> */}
    //   {/* <ActivityIndicator
    //     animating={this.state.loading}
    //     color="white"
    //     size="large"
    //     style={{ margin: 15 }}
    //   /> */}

    //   {/* {this.props.allEvents.length
    //     ? this.props.allEvents.map((eventData, index) => {
    //         for (let uid in eventData) {
    //           const event = eventData[uid];
    //           const latitude = event.location.locationGeocode.lat;
    //           const longitude = event.location.locationGeocode.lng;
    //           const title = event.name;
    //           const id = uid;

    //           const scaleStyle = {
    //             transform: [
    //               {
    //                 scale: interpolations[index].scale
    //               }
    //             ]
    //           };

    //           const opacityStyle = {
    //             opacity: interpolations[index].opacity
    //           };

    //           return (
    //             <MapView.Marker
    //               key={id}
    //               title={title}
    //               coordinate={{ latitude, longitude }}
    //             >
    //               <Animated.View style={[styles.markerWrap, opacityStyle]}>
    //                 <Animated.View style={[styles.ring, scaleStyle]} />
    //                 <View style={styles.marker} />
    //               </Animated.View>
    //             </MapView.Marker>
    //           );
    //         }
    //       })
    //     : null}
    //   </View>
    //   */}
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
  animation: state.animate.allEventsAnimate
});

const mapDispatch = dispatch => ({
  fetchEvents: email => dispatch(fetchAllEvents(email)),
  setSelectedEvent: event => dispatch(setSelectedEvent(event))
});

export default connect(
  mapState,
  mapDispatch
)(AllEventsMap);
