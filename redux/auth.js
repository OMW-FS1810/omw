import { database } from '../config/firebase';
import { Constants } from 'expo';

const deviceId = Constants.installationId;

const initialState = {
  user: {
    uid: null,
    email: '',
    firstName: '',
    lastName: '',
    pictureUrl: '',
    deviceId: null
  }
};

const SET_USER = 'SET_USER';

export const setUser = user => ({
  type: SET_USER,
  payload: user
});

export const setUserAndDevice = user => async dispatch => {
  try {
    console.log('user', user);
    await database.ref(`/Users/${user.uid}`).update({
      deviceId
    });
    const currDevices = await database.ref(`/Users/`);
    currDevices
      .orderByChild('deviceId')
      .equalTo(deviceId)
      .once('value', async snapshot => {
        const allUsers = snapshot.val();
        const oldUser = Object.keys(allUsers).filter(
          thisUser => thisUser !== user.uid
        )[0];
        await database.ref(`/Users/${oldUser}`).update({
          deviceId: null
        });
      });
    dispatch(setUser(user));
  } catch (error) {
    console.error(error);
  }
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newUserState = { ...state, user: action.payload };
      return newUserState;
    }
    default:
      return state;
  }
};

export default AuthReducer;
