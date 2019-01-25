import { auth } from '../config/firebase'

const initialState = {
  user: {}
}

const SET_USER = 'SET_USER';

export const setUser = user => ({
  type: SET_USER,
  payload: user
});

// export const createUser = (userInformation) => {
//   return dispatch => {
//     fetch("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyBgM-03lU0sxaiu78BgZTmH2r0Lo2nMBMQ", {
//       method: "POST",
//       body: JSON.stringify({
//         email: userInformation.email,
//         password: userInformation.password,
//         returnSecureToken: true
//       }),
//       headers: {
//         "Content-type": "application/json"
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       alert("Authentication failed, please try again!")
//     })
//     .then(res => res.json())
//     .then(parsedRes => {
//       console.log(parsedRes)
//     })
//   }
// }

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newUserState = {...state, user: action.payload}
      return newUserState;
    }
    default:
      return state;
  }
}

export default AuthReducer
