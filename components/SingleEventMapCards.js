/* eslint-disable no-use-before-define */
/* eslint-disable guard-for-in */
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { MapView } from 'expo';
import { CARD_HEIGHT, CARD_WIDTH, height, width } from '../styles/cards';
import { convertTimestamp } from '../helpers/convertTimestamp';
import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

export default class SingleEventMapCards extends React.Component {
  async componentDidMount(){
    const memberArr = Object.keys(this.props.eventMembers).map(member => {
      return [member, this.props.eventMembers[member]];
    });

    await memberArr.forEach(async member => {

    if (member[1].user.pictureUrl) {
      await Image.prefetch(member[1].user.pictureUrl);
     }
    })
  }
  render() {
    //creates the individual member cards

    const memberArr = Object.keys(this.props.eventMembers).map(member => {
      return [member, this.props.eventMembers[member]];
    });

    return memberArr.map( member => {
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
              }}
            >
              <View style={styles.card}>
                {member[1].user.pictureUrl && (
                  <View style={styles.imageContent}>
                    <Image
                      source={{
                        uri: member[1].user.pictureUrl
                      }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </View>
                )}

                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {markerName}
                  </Text>

                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {convertTimestamp(member[1].timestamp)}
                  </Text>
                  <Text style={styles.cardDescription}>
                    Status: {member[1].status}
                  </Text>
                  <Text style={styles.cardDescription}>Distance to event:</Text>
                  <Text style={styles.cardDescription}>
                    {member[1].distance.toFixed(3)} miles
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
    borderWidth: 1,
    flexDirection: 'row'
  },
  cardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  imageContent: {
    flex: 2,
    paddingTop: padding / 2,
    paddingHorizontal: padding / 2
  },
  textContent: {
    flex: 3
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    paddingBottom: 2
  },
  cardDescription: {
    fontSize: 12,
    color: '#444'
  }
});
