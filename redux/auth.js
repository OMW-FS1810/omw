import {AsyncStorage} from 'react-native'

const initialState = {
  user: null
}

const SET_USER = 'SET_USER';

export const setUser = user => ({
  type: SET_USER,
  payload: user
});

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newUserState = {...state, user: action.payload}

      AsyncStorage.multiSet([['user', JSON.stringify(action.payload)]])
      return newUserState;
    }
    default:
      return state;
  }
}

export default AuthReducer
