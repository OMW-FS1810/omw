import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { MapView } from 'expo';
import { convertTimestamp } from '../helpers/convertTimestamp';
import { MaterialIcons } from '@expo/vector-icons';

export default class MemberMarkers extends React.Component {
  render() {
    const memberArr = Object.keys(this.props.eventMembers).map(member => {
      return [member, this.props.eventMembers[member]];
    });
    return memberArr.map(member => {
      let markerName;
      if (member[0] && member[1]) {
        markerName = member[0];
        if (member[1].user.firstName) {
          markerName = member[1].user.firstName;
          if (member[1].user.lastName) {
            markerName += ` ${member[1].user.lastName}`;
          }
        }
        let markerColor = 'blue';
        let iconName = 'person-pin';
        if (member[0] === this.props.me) {
          markerColor = 'teal';
          iconName = 'person-pin-circle';
        }

        return (
          member[1].coords && (
            <MapView.Marker
              key={member[0]}
              title={markerName}
              description={convertTimestamp(member[1].timestamp)}
              coordinate={member[1].coords}
              // pinColor="blue"
            >
              <MaterialIcons name={iconName} size={40} color={markerColor} />
              <MapView.Callout style={styles.callout}>
                <Text>{markerName}</Text>
                <Text>{convertTimestamp(member[1].timestamp)}</Text>
                {/* <Text>Status: {member[1].status}</Text>
                <Text>Distance to event: {member[1].distance}</Text> */}
              </MapView.Callout>
            </MapView.Marker>
          )
        );
      } else {
        return null;
      }
    });
  }
}

const styles = StyleSheet.create({
  callout: {
    width: 150
  }
});
