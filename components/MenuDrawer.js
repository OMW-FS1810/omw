import React from 'react';
import {
	View,
	Text,
	// Image,
	ScrollView,
	// Platform,
	// Dimensions,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

// const WIDTH = Dimensions.get('window').width
// const HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  scroller: {
    flex: 1,
  },
  bottomLinks: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 10,
    paddingBottom: 600,
  },
  link: {
    flex: 1,
    fontSize: 20,
    color: 'white',
    padding: 15,
    paddingLeft: 14,
    margin: 5,
    textAlign: 'left',
  },
})

export default class MenuDrawer extends React.Component {
	navLink(nav, text) {
		return(
			<TouchableOpacity style={{height: 50}} onPress={() => this.props.navigation.navigate(nav)}>
				<Text style={styles.link}>{text}</Text>
			</TouchableOpacity>
		)
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView style={styles.scroller}>
					<View style={styles.bottomLinks}>
						{this.navLink('Event Map', 'Event Map')}
						{this.navLink('Create Event', 'Create an Event')}
						{this.navLink('Profile', 'Profile')}
					</View>
				</ScrollView>
			</View>
		)
	}
}

