import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native';
// import { Button } from 'react-native-paper'

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
  content: {
    alignItems: 'center',
  },
  inputContainer: {
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#aaa',
    marginVertical: 10
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#aaa',
    textAlign: 'center'
  }
});


class HomePage extends React.Component{
  state = {

  }

  placeNameChangeHandler = val => {
    this.setState({
      placeName: val
    })
  }

  render (){
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TextInput style={styles.inputContainer}
            placeholder="Email"
            placeholderTextColor = "#aaa"
            keyboardType="email-address"
            onChangeText={this.placeNameChangeHandler}
            />
          <TextInput style={styles.inputContainer}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor='#aaa'
            />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign in{this.props.type}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign up withGoogle{this.props.type}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign up with Facebook{this.props.type}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign up with email{this.props.type}</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
    }
  }


  export { HomePage }
