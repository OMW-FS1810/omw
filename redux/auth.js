const initialState = {
  user: {}
};

const SET_USER = 'SET_USER';

export const setUser = user => ({
  type: SET_USER,
  payload: user
});

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newUserState = { ...state, user: action.payload };
      return newUserState;
    }
    default:
      return state;
  }
};

export default authReducer;
