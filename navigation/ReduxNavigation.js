import React from 'react'
import ReactNavigation from 'react-navigation'
import {connect} from 'react-redux'
import AppNavigation from './AppNavigation'

function ReduxNavigation (props){
  const {dispatch, nav} = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    state: nav
  })

  return <AppNavigation navigation={navigation}/>
}

const mapStateToProps = state => ({ nav: state.nav})
export default connect(mapStateToProps)(ReduxNavigation)
