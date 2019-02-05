/* eslint-disable guard-for-in */
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { MapView } from 'expo';
import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

export default class AllEventsMapCards extends React.Component {
  render() {
    //creates the individual event cards

    if (this.props.allEvents.length) {
      const allEvents = this.props.allEvents;
      return allEvents.map(eventData => {
        //this is a trick to get the objects out -- there's only one 'uid' for each event
        let event, title, time, date, description, locationPhoto;
        for (let uid in eventData) {
          event = eventData[uid];
          title = event.name;
          time = event.time;
          date = event.date;
          description = event.location.locationName;
          locationPhoto = event.location.locationPhoto || '';
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
                  {date} {time}
                </Text>
              </View>
              {locationPhoto !== '' && (
                <View style={styles.textContent}>
                  <Image
                    source={{
                      uri: locationPhoto
                    }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>
              )}
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
    elevation: 2,
    backgroundColor: color.orange,
    marginHorizontal: 5,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    flexDirection: 'column',
    borderRadius: 4
  },

  focused: {
    backgroundColor: color.darkOrange
  },

  cardImage: {
    flex: 3,
    width: '100%',
    height: '80%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
    padding: padding
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold'
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
    overflow: 'visible'
  }
});
