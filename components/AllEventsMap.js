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
    markers: []
  };
  renderEventMarker = () => {
    // console.log('event info for adam 🔥', this.props.allEvents);
    // if (this.props.allEvents.length) {
    //   const allEvents = this.props.allEvents;
    //   allEvents.map(event => {
    //     this.setState({
    //       markers: [
    //         ...this.state.markers,
    //         this.state.markers.push({
    //           coordinate: {
    //             // latitude:
    //           }
    //         })
    //       ]
    //     });
    //   });
    // }
  };

  componentDidMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
    if (this.props.user.email) this.props.fetchEvents(this.props.user.email);

    // this.props.fetchEvents(this.props.user.email);
    // console.log('fetch called');
  }

  render() {
    const { region } = this.props;
    this.renderEventMarker();
    return (
      <View style={styles.container}>
        <MapView ref={map => (this.map = map)} initialRegion={region} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
