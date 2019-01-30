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
    // let hostEvents = [];
    // find all events where this user is the host
    // await eventRef
    //   .orderByChild('host')
    //   .equalTo(userId)
    //   .on('value', event => {
    //     hostEvents.push(event);
    //   });
    // find all events where this user is invited

    // first grab the email address since invites are based on email address
    const eventRef = database.ref('/Events/');
    // const emailRef = database.ref(`/Users/${userId}`);
    // let email;
    // await emailRef.once('value', person => {
    //   email = person.val().email;
    // });
    // then query all events where this email is in invites
    let invitedEvents = [];
    eventRef.once('value', snapshot => {
      let snappy = snapshot.val();
      for (let uid in snappy) {
        // console.log('from events store 🛒', snappy)
        snappy[uid].invites.map(value => {
          if (value === email) {
            invitedEvents.push({ [uid]: snappy[uid] });
            console.log('YAY', invitedEvents)
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
