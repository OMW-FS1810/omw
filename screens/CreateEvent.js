/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';
import { populateEventDeets, fetchAllEvents } from '../redux/event';
import { GOOGLE_API } from '../secrets';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import * as theme from '../styles/theme';
const { padding, color, fontFamily, fontSize, windowWidth, normalize } = theme;

class CreateEvent extends Component {
  state = {
    name: '',
    date: '',
    time: '',
    location: {
      locationName: '',
      locationAddress: '',
      locationGeocode: {}
    },
    host: ''
  };

  componentDidMount() {
    if (this.props.user) {
      this.setState({ host: this.props.user.uid });
    }
  }

  handlePress = () => {
    // FOR TESTING V
    // this.props.fetch(this.props.user.uid);

    this.props.navigation.navigate('inviteScreen');
    this.props.populateDeets(this.state);
    this.setState({
      name: '',
      date: '',
      time: '',
      location: {
        locationName: '',
        locationAddress: '',
        locationGeocode: {}
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>Create Event</Text>
        </View>

        <TextInput
          style={styles.inputContainer}
          placeholder="Event Name"
          placeholderTextColor="#aaa"
          clearButtonMode="while-editing"
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <View style={styles.content}>
          <GooglePlacesAutocomplete
            style={styles.location}
            placeholder="Event Location"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            listViewDisplayed="false" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={async (data, details = null) => {
              // 'details' is provided when fetchDetails = true

              let locationPhoto = '';
              if (details.photos) {
                const photoreference = details.photos[0].photo_reference;
                const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photoreference}&key=${GOOGLE_API}`;
                const photoSearch = await fetch(url);
                locationPhoto = photoSearch.url;
              }

              await this.setState({
                location: {
                  locationName: data.structured_formatting.main_text,
                  locationAddress: data.description,
                  locationGeocode: details.geometry.location,
                  locationPhoto
                }
              });
            }}
            getDefaultValue={() => ''}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_API,
              language: 'en' // language of the results
              // types: '(cities)' // default: 'geocode'
            }}
            styles={{
              container: {
                width: windowWidth - 40,
                marginTop: 10,
                borderWidth: 1,
                borderColor: color.whiteBlue,
                marginBottom: 5,
                borderRadius: 4
              },
              textInputContainer: {
                backgroundColor: color.whiteBlue,
                padding: 0,
                borderTopWidth: 0
              },
              textInput: {
                width: '100%',
                paddingLeft: 3,
                paddingRight: 3,
                fontSize: 18,
                fontFamily: fontFamily.light,
                backgroundColor: color.whiteBlue,
                color: color.darkBlue
              },

              description: {
                fontWeight: 'bold'
              },
              predefinedPlacesDescription: {
                color: color.whiteBlue
              }
            }}
            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance'
              // types: 'food'
            }}
            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_3'
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />

          <DatePicker
            label="Date"
            date={this.state.date}
            mode="date"
            showIcon={false}
            style={styles.picker}
            onDateChange={date => this.setState({ date })}
            placeholder="Select Date"
            format="MM-DD-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
          />
          <DatePicker
            mode="time"
            showIcon={false}
            date={this.state.time}
            placeholder="Pick a Time"
            style={styles.picker}
            onDateChange={time => this.setState({ time })}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
          />
        </View>

        <View style={styles.bottom}>
          <Button
            onPress={this.handlePress}
            title="next"
            type="contained"
            disabled={
              !this.state.date ||
              !this.state.name ||
              !this.state.time ||
              !this.state.location
            }
          >
            <Text style={styles.buttonText}>next</Text>
          </Button>
        </View>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.whiteBlue
  },
  titleView: {
    padding: 10
  },
  inputContainer: {
    width: windowWidth - 33,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: fontFamily.light,
    color: color.darkBlue,
    marginVertical: 15,
    alignSelf: 'center'
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large,
    marginBottom: 0,
    paddingBottom: 0,
    color: color.darkBlue,
    alignSelf: 'center',
    paddingTop: padding * 3
  },
  picker: {
    marginBottom: 5,
    marginTop: 10,
    width: windowWidth - 40,
    justifyContent: 'center',
    borderRadius: 5
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  buttonText: {
    fontSize: 30,
    position: 'absolute',
    bottom: 0
  },
  location: {
    borderWidth: 0
    // alignSelf: 'center'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    width: windowWidth - 40
  }
});

const mapState = state => ({
  eventDeets: state.event.pendingCreateEventDeets,
  user: state.user.user
});

const mapDispatch = dispatch => ({
  populateDeets: event => dispatch(populateEventDeets(event)),
  fetch: userId => dispatch(fetchAllEvents(userId))
});

export default connect(
  mapState,
  mapDispatch
)(CreateEvent);
