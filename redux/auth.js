import { database } from '../config/firebase';
import { AsyncStorage } from 'react-native';
import { Constants } from 'expo';
import { registerForPushNotificationsAsync } from '../helpers/notificationSetup';
import { setBackgroundLocationOn } from '../helpers/location';

const deviceId = Constants.installationId;

// ACTIONS
const SET_USER = 'SET_USER';

// ACTION CREATORS
export const setUser = user => ({
  type: SET_USER,
  payload: user
});

// THUNK CREATORS
export const setUserAndDevice = user => async dispatch => {
  try {
    //turn on background location
    await setBackgroundLocationOn();
    //set the user and device in the store
    dispatch(setUser({ ...user, deviceId }));
    //get this device's notification token
    const token = await registerForPushNotificationsAsync();
    //first dispatch loads map, second starts messaging
    dispatch(setUser({ ...user, token }));
    //associate this user with this device in the db
    await database.ref(`/Users/${user.uid}`).update({
      deviceId,
      token
    });
    const email = user.email.toLowerCase();
    await database.ref(`/Devices/${deviceId}`).update({
      email,
      user
    });

    //remove old user associations for this device
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
  } catch (error) {
    console.error(error);
  }
};

// DEFAULT STATE
const initialState = {
  user: {
    uid: null,
    email: '',
    firstName: '',
    lastName: '',
    pictureUrl: '',
    deviceId: null,
    token: null
  }
};

// REDUCER
const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newUserState = { ...state, user: action.payload };

      AsyncStorage.multiSet([['user', JSON.stringify(action.payload)]]);
      return newUserState;
    }
    default:
      return state;
  }
};

export default AuthReducer;
