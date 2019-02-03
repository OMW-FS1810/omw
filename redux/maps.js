// ACTION TYPES
const SET_ALLEVENTS_MAP_LOCATION = 'SET_ALLEVENTS_MAP_LOCATION';
const SET_SINGLEEVENT_MAP_LOCATION = 'SET_SINGLEEVENT_MAP_LOCATION';

// ACTION CREATORS
export const setAllEventsMapLocation = location => ({
  type: SET_ALLEVENTS_MAP_LOCATION,
  location
});
export const setSingleEventMapLocation = location => ({
  type: SET_SINGLEEVENT_MAP_LOCATION,
  location
});

// DEFAULT STATE
const defaultState = {
  allEventsMap: null,
  singleEventMap: null
};

// REDUCER
const mapReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_ALLEVENTS_MAP_LOCATION:
      return {
        ...state,
        allEventsMap: action.location
      };
    case SET_SINGLEEVENT_MAP_LOCATION:
      return {
        ...state,
        singleEventMap: action.location
      };
    default:
      return state;
  }
};

export default mapReducer;
