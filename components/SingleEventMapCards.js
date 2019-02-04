/* eslint-disable guard-for-in */
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MapView } from 'expo';
import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';
import { convertTimestamp } from '../helpers/convertTimestamp';

export default class SingleEventMapCards extends React.Component {
  render() {
    //creates the individual member cards

    const memberArr = Object.keys(this.props.eventMembers).map(memberEmail => {
      return [memberEmail, this.props.eventMembers[memberEmail]];
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

        return (
          member[1].coords && (
            <TouchableOpacity
              key={member[0]}
              onPress={() => {
                const memberRegion = {
                  ...member[1].coords,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.043
                };
                this.props.animateToMapPosition(memberRegion);
                console.log('you pressed a person');
              }}
            >
              <View style={styles.card}>
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {markerName}
                  </Text>
                  {/* <Text numberOfLines={1} style={styles.cardDescription}>
                  {description}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {date}
                </Text> */}
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {convertTimestamp(member[1].timestamp)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        );
      } else {
        return null;
      }
    });
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
