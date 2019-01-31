/* eslint-disable guard-for-in */
import { database } from '../config/firebase';
<<<<<<< HEAD
import { sendInvites } from '../helpers/invitations';
import { store } from './store';
=======
>>>>>>> 7fc50e8fe7546be16906e090b96f27c8dad63b66

// ACTION TYPES
const POPULATE_EVENT_DEETS = 'POPULATE_EVENT_DEETS';
const POPULATE_EVENT_INVITES = 'POPULATE_EVENT_INVITES';
const CLEAR_PENDING_INFO = 'CLEAR_PENDING_INFO';
const REQUEST_EVENTS = 'FETCH_EVENTS';
<<<<<<< HEAD
const SET_SINGLE_EVENT = 'SET_SINGLE_EVENT';
=======
const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
const ADD_EVENT_TO_LIST = 'ADD_EVENT_TO_LIST';
>>>>>>> 7fc50e8fe7546be16906e090b96f27c8dad63b66

// ACTION CREATORS
export const populateEventDeets = event => ({
  type: POPULATE_EVENT_DEETS,
  event
});
export const populateEventEmails = emails => ({
  type: POPULATE_EVENT_INVITES,
  emails
});
const clearPendingInfo = () => ({
  type: CLEAR_PENDING_INFO
});
const requestEvents = events => ({
  type: REQUEST_EVENTS,
  events
});
export const setSelectedEvent = uid => ({
  type: SET_SELECTED_EVENT,
  uid
});
const addEventToList = event => ({
  type: ADD_EVENT_TO_LIST,
  event
});

// THUNK CREATORS
export const createEvent = (eventDeets, eventInvites) => async dispatch => {
  try {
<<<<<<< HEAD
    //first we send the invitations
    const host = store.getState().user.user;
    const invitesNotUser = eventInvites.filter(invite => invite !== host.email);
    const mailedInvites = await sendInvites(invitesNotUser, eventDeets, host);
    //when the invites are sent we create the DB record and end the create event process
    if (mailedInvites.status === 'sent') {
      const data = await database.ref('Events/').push({
        ...eventDeets,
        invites: eventInvites
      });
      dispatch(clearPendingInfo);
    }
    // do we need an error message here if the user cancels the invitations (or there's another issue)?
=======
    let newEvent;
    const eventRef = await database.ref('Events/').push({
      ...eventDeets,
      invites: eventInvites
    });
    await eventRef.once('value', snapshot => {
      newEvent = snapshot.val();
    });
    const newUID = String(eventRef).slice(-19);
    dispatch(clearPendingInfo);
    dispatch(addEventToList(newEvent));
    dispatch(setSelectedEvent(newUID));
>>>>>>> 7fc50e8fe7546be16906e090b96f27c8dad63b66
  } catch (err) {
    console.error(err);
  }
};
export const fetchAllEvents = email => async dispatch => {
  try {
    // query all events where this email is in invites
    const eventRef = database.ref('/Events/');
    let invitedEvents = [];
    eventRef.once('value', snapshot => {
      let snappy = snapshot.val();
      for (let uid in snappy) {
        snappy[uid].invites.map(value => {
          if (value.toLowerCase() === email.toLowerCase()) {
            invitedEvents.push({ [uid]: snappy[uid] });
          }
        });
      }
    });
    setTimeout(() => {
      dispatch(requestEvents(invitedEvents));
    }, 100);
  } catch (err) {
    console.error(err);
  }
};

<<<<<<< HEAD
export const fetchSingleEvent = email => async dispatch => {
  try {
    const eventRef = database.ref(`/Events/${email.uid}`);
    dispatch(setSingleEvent(eventRef));
  } catch (err) {
    console.error(err);
  }
};

=======
>>>>>>> 7fc50e8fe7546be16906e090b96f27c8dad63b66
// DEFAULT STATE
const defaultEvent = {
  allEvents: {},
  selectedEvent: {},
  pendingCreateEventDeets: {},
  pendingCreateEventInvites: []
};

// REDUCER
const eventReducer = (state = defaultEvent, action) => {
  switch (action.type) {
    case POPULATE_EVENT_DEETS: {
      return {
        ...state,
        pendingCreateEventDeets: action.event
      };
    }
    case POPULATE_EVENT_INVITES: {
      return {
        ...state,
        pendingCreateEventInvites: action.emails
      };
    }
    case CLEAR_PENDING_INFO: {
      return {
        ...state,
        pendingCreateEventDeets: {},
        pendingCreateEventInvites: []
      };
    }
    case REQUEST_EVENTS: {
      return {
        ...state,
        allEvents: action.events
      };
    }
<<<<<<< HEAD
    case SET_SINGLE_EVENT: {
      const newEventState = { ...state, selectedEvent: action.event };
      return newEventState;
=======
    case SET_SELECTED_EVENT: {
      return {
        ...state,
        selectedEvent: state.allEvents.filter(x => x[action.uid])[0]
      };
    }
    case ADD_EVENT_TO_LIST: {
      return {
        ...state,
        allEvents: [...state.allEvents, action.event]
      };
>>>>>>> 7fc50e8fe7546be16906e090b96f27c8dad63b66
    }
    default:
      return state;
  }
};

export default eventReducer;
