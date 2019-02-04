/* eslint-disable guard-for-in */
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MapView } from 'expo';
import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';

export default class AllEventsMapCards extends React.Component {
  render() {
    //creates the individual event cards

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
        return (
          <TouchableOpacity
            key={thisId}
            onPress={() => {
              // this.props.animateToMapPosition(eventLocation);
              this.props.selectEvent(eventData);
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
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
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
    overflow: 'hidden',
    borderColor: 'teal',
    borderWidth: 1
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
  }
});
