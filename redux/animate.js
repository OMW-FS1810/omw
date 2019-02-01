import { Animated } from 'react-native';

const initialState = {
  allEventsAnimate: new Animated.Value(0)
};

const AnimateReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default AnimateReducer;
