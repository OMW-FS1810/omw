import { database } from '../config/firebase';

// ACTION TYPES

// ACTION CREATORS

// THUNK CREATORS
// export const createEvent = () => async dispatch => {
//   try {
//   } catch (err) {
//     console.error(err);
//   }
// };

const defaultEvent = {
  events: []
};
// REDUCER
const event = (state = defaultEvent, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default event;
