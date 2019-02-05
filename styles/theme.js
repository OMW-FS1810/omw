import { Dimensions, Platform } from 'react-native';
import { moderateScale as normalize } from 'react-native-size-matters';

//checkout /assets/colors.jpg from TOP to BOTTOM
const color = {
  grey: '#827B84',
  lightGrey: '#9F9DA9',
  whiteGrey: '#CFCED3',
  whiteBlue: '#D0D8E0',
  lightBlue: '#7288A2',
  blue: '#384D66',
  darkBlue: '#242D49',
  indigoBlue: '#040421',
  darkOrange: '#D15A2E',
  orange: '#E8A389'
};

const colors = {
  accent: color.orange
};

const fontSize = {
  small: normalize(12),
  regular: normalize(14),
  large: normalize(21),
  xLarge: normalize(30)
};

const fontFamily = {
  extrabold: 'RobotoExtraBold',
  bold: 'RobotoBold',
  medium: 'RobotoMedium',
  regular: 'RobotoRegular',
  light: 'RobotoLight'
};

const fonts = fontFamily;

const padding = 8;
const navbarHeight = Platform.OS === 'ios' ? 64 : 54;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const tabColor =
  Platform.OS === 'ios' ? 'rgba(73,75,76, .5)' : 'rgba(255,255,255,.8)';
const selectedTabColor = Platform.OS === 'ios' ? '#D6545C' : '#fff';

const tabIconStyle = { size: 21, color: tabColor, selected: selectedTabColor };
const navTitleStyle = {
  fontSize: fontSize.regular,
  fontFamily: fontFamily.extrabold,
  color: color.indigoBlue
};

export {
  color,
  colors,
  fontSize,
  fonts,
  fontFamily,
  padding,
  navbarHeight,
  windowWidth,
  windowHeight,
  tabIconStyle,
  navTitleStyle,
  normalize
};
