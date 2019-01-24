import {StackNavigator} from 'react-navigation'
//import LoginScreen

const PrimaryNav = StackNavigator({
  loginStack: {screen : LoginStack},
  DrawerStack: {screen: DrawerNav}
}, {
  headerMode: 'float',
  title: "Main",
  initialRouteName: 'loginStack'
})

export default PrimaryNav
