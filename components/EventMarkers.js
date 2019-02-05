/* eslint-disable guard-for-in */
import React from 'react';
import { Text, StyleSheet, Animated, View } from 'react-native';
import { MapView } from 'expo';
import { convertTimestamp } from '../helpers/convertTimestamp';
import { SimpleLineIcons } from '@expo/vector-icons';

export default class EventMarkers extends React.Component {
  render() {
    return this.props.allEvents.map((eventData, index) => {
      for (let uid in eventData) {
        const event = eventData[uid];
        const latitude = event.location.locationGeocode.lat;
        const longitude = event.location.locationGeocode.lng;
        const title = event.name;
        const id = Object.keys(eventData)[0];

        const scaleStyle = {
          transform: [
            {
              scale: this.props.interpolations[index].scale
            }
          ]
        };

        const opacityStyle = {
          opacity: this.props.interpolations[index].opacity
        };
        let iconName = 'location-pin';
        let markerColor = 'red';
        return (
          <MapView.Marker
            key={id}
            title={title}
            coordinate={{ latitude, longitude }}
          >
            <Animated.View style={[styles.markerWrap, opacityStyle]}>
              <Animated.View style={[styles.ring, scaleStyle]} />
              {/* <View style={styles.marker} /> */}
              <SimpleLineIcons name={iconName} size={30} color={markerColor} />
            </Animated.View>
          </MapView.Marker>
        );
      }
    });
  }
}

const styles = StyleSheet.create({
  callout: {
    width: 150
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
    // backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)'
  }
});
