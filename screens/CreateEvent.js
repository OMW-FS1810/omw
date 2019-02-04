/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import { populateEventDeets, fetchAllEvents } from '../redux/event';
import { GOOGLE_API } from '../secrets';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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


  // static navigationOptions = {title: 'Create Event'}

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
          <Text style={styles.title}>Create an event!</Text>
        </View>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Event Name"
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />

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
            await this.setState({
              location: {
                locationName: data.structured_formatting.main_text,
                locationAddress: data.description,
                locationGeocode: details.geometry.location
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
              width: '95%',
              marginTop: 10,
              borderWidth: 1,
              borderColor: 'grey',
              marginBottom: 5,
              borderRadius: 4
            },
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              padding: 0,
              borderTopWidth: 0
            },
            textInput: {
              width: '100%',
              paddingLeft: 3,
              paddingRight: 3
            },

            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
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

        {/* below is the old location input */}
        {/* <TextInput
          style={styles.input}
          mode="outlined"
          label="Location"
          value={this.state.location}
          onChangeText={location => this.setState({ location })}
        /> */}
        <DatePicker
          label="Date"
          date={this.state.date}
          mode="date"
          showIcon={false}
          style={styles.date}
          onDateChange={date => this.setState({ date })}
          placeholder="select date"
          format="MM-DD-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
        />
        <DatePicker
          mode="time"
          showIcon={false}
          date={this.state.time}
          placeholder="select time"
          style={styles.date}
          onDateChange={time => this.setState({ time })}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
        />
        <View style={styles.bottom}>
          <Button
            onPress={this.handlePress}
            title='next'
            type="contained"
            disabled={
              !this.state.date ||
              !this.state.name ||
              !this.state.time ||
              !this.state.location
            }
          >
            <Text style={styles.butonText}>next</Text>
          </Button>
        </View>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
    // backgroundColor: '#98B1C4'
  },
  titleView: { padding: 10 },
  input: {
    // backgroundColor: '#C8D7E3',
    borderColor: '#98B1C4',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    width: '95%'
  },
  title: {
    fontFamily: 'System',
    fontSize: 40,
    marginBottom: 0,
    paddingBottom: 0,
    color: '#2F4E6F',
    fontWeight: '500'
  },
  date: {
    marginBottom: 5,
    // backgroundColor: '#C8D7E3',
    marginTop: 10,
    width: '95%',
    justifyContent: 'center',
    borderRadius: 5
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  butonText: {
    fontSize: 30,
    position: 'absolute',
    bottom: 0
  },
  location: {
    borderWidth: 0
  },
  button: {}
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
