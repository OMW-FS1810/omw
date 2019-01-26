/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { TextInput, Button, Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import { populateEventDeets } from '../redux/event';
import { GOOGLE_API } from '../secrets';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class CreateEvent extends Component {
  state = {
    name: '',
    date: '',
    time: '',
    location: '',
    locationName: '',
    locationAddress: '',
    locationGeocode: {}
  };

  componentDidMount() {
    // if (this.props.state.deets.name) {
    //   this.setState({ ...this.props.state.deets });
    // }
  }

  handlePress = () => {
    this.props.navigation.navigate('Invite');
    this.props.populateDeets(this.state);
    this.setState({
      name: '',
      date: '',
      time: '',
      location: '',
      locationName: '',
      locationAddress: '',
      locationGeocode: {}
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
          placeholder="Location"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          // returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details.geometry);
          }}
          getDefaultValue={() => ''}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: GOOGLE_API,
            language: 'en' // language of the results
            // types: '(cities)' // default: 'geocode'
          }}
          styles={{
            textInputContainer: {
              // backgroundColor: 'rgba(0,0,0,0)',
              // borderColor: 'black',
              // borderWidth: 1,
              margin: 10,
              width: '95%',
              borderRadius: 3
            },

            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            }
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
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
        {/* <DatePicker
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
        /> */}
        <View style={styles.bottom}>
          <Button
            onPress={this.handlePress}
            type="contained"
            disabled={
              // !this.state.date ||
              !this.state.name ||
              // !this.state.time ||
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
  location: {},
  button: {}
});

const mapState = state => ({
  deets: state.event.pendingCreateEventDeets
});

const mapDispatch = dispatch => ({
  populateDeets: event => dispatch(populateEventDeets(event))
});

export default connect(
  null,
  mapDispatch
)(CreateEvent);
