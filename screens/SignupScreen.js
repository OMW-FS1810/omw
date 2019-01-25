import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import { auth } from '../config/firebase';
import {setUser} from '../redux/store';
import { connect } from 'react-redux'

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

class SignupScreen extends React.Component {

  state = {
    email: '',
    password: '',
    error: ''
  }

  handlePress = async () => {
    const { email, password } = this.state;
    try {
      const data = await auth.createUserWithEmailAndPassword(email.trim(), password);
      if (data) {
        this.props.setUser(data.user);
        this.props.navigation.navigate('Create an Event');
      }
      this.setState({email: '', password: ''});
    } catch(error) {
      this.setState({error: error.message})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text> {this.state.error} </Text>
          <TextInput style={styles.inputContainer}
            placeholder="Email"
            placeholderTextColor = "#aaa"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            />
          <TextInput style={styles.inputContainer}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor='#aaa'
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            />
            <TouchableOpacity style={styles.button} onPress={this.handlePress}>
            <Text style={styles.buttonText}>Sign up with email </Text>
          </TouchableOpacity>

        </View>
      </View>
    )}
  }

  const mapStateToProps = (state) => ({
    user: state.user.user
  });

  const mapDispatchToProps = (dispatch) => ({
    setUser(user) {
      return dispatch(setUser(user));
    }
  })

  export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
