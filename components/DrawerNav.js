import React from 'react'
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'react-native-paper';

export default class DrawerNav extends React.Component {
  state={
    active: 'first'
  }

  render(){
    const {active} = this.state
    return(
      <Drawer.Section title="EVENTS">
        <Drawer.Item
          label="Event 1"
          active={active ==='first'}
          onPress={()=> {this.setState({active:'first'})}}
        />
        <Drawer.Item
          label="Event 2"
          active={active ==='first'}
          onPress={()=> {this.setState({active:'first'})}}
        />
        <Drawer.Item
          label="Event 3"
          active={active ==='first'}
          onPress={()=> {this.setState({active:'first'})}}
        />
      </Drawer.Section>
    )
  }
}
