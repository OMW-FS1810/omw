/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
import { database } from '../config/firebase';
import store from './store';

// ACTION TYPES
const POPULATE_EVENT_DEETS = 'POPULATE_EVENT_DEETS';
const POPULATE_EVENT_INVITES = 'POPULATE_EVENT_INVITES';
const CLEAR_PENDING_INFO = 'CLEAR_PENDING_INFO';
const REQUEST_EVENTS = 'FETCH_EVENTS';

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

// THUNK CREATORS
export const createEvent = (eventDeets, eventInvites) => async dispatch => {
  try {
    const data = await database.ref('Events/').push({
      ...eventDeets,
      invites: eventInvites
    });
    dispatch(clearPendingInfo);
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
          if (value === email) {
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
    default:
      return state;
  }
};

export default eventReducer;
