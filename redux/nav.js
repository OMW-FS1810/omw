import {
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

import AppNavigation from '../navigation/AppNavigation'

const navReducer = createNavigationReducer(AppNavigation)

export default navReducer
