/* eslint-disable no-use-before-define */
/* eslint-disable guard-for-in */
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Animated
} from 'react-native';
import { MapView } from 'expo';
import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

export default class AllEventsMapCards extends React.Component {
  render() {
    //creates the individual event cards

    if (this.props.allEvents.length) {
      const allEvents = this.props.allEvents;
      return allEvents.map((eventData, index) => {
        //*********** ,index)
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

        const opacityStyle = {
          opacity: this.props.interpolations[index].opacity
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
            <View
              style={
                [styles.card]
                //************** opacityStyle
              }
              // opacity={opacityStyle}
              // opacity=".875"
            >
              {locationPhoto !== '' && (
                <View style={styles.imageContent}>
                  <Image
                    source={{
                      uri: locationPhoto
                    }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
              )}
              <View style={styles.textContent}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={styles.cardtitle}
                >
                  {title}
                </Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={styles.cardDescription}
                >
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
    elevation: 2,
    backgroundColor: color.orange,
    opacity: 0.875,
    marginHorizontal: 5,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    flexDirection: 'column',
    borderRadius: 4
  },

  focused: {
    backgroundColor: color.orange
  },

  cardImage: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 4
  },

  imageContent: {
    flex: 2,
    paddingTop: padding / 2,
    paddingHorizontal: padding / 2
  },

  textContent: {
    flex: 2,
    paddingVertical: padding,
    justifyContent: 'flex-end'
  },
  cardtitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.regular,
    color: color.darkBlue,
    alignSelf: 'center'
  },
  cardDescription: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: color.blue,
    alignSelf: 'center'
  }
});
