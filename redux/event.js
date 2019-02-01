/* eslint-disable guard-for-in */
import { database } from '../config/firebase';
import { sendInvites } from '../helpers/invitations';
import { store } from './store';

// ACTION TYPES
const POPULATE_EVENT_DEETS = 'POPULATE_EVENT_DEETS';
const POPULATE_EVENT_INVITES = 'POPULATE_EVENT_INVITES';
const CLEAR_PENDING_INFO = 'CLEAR_PENDING_INFO';
const REQUEST_EVENTS = 'FETCH_EVENTS';
const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
const ADD_EVENT_TO_LIST = 'ADD_EVENT_TO_LIST';

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
export const setSelectedEvent = event => ({
  type: SET_SELECTED_EVENT,
  event
});
const addEventToList = event => ({
  type: ADD_EVENT_TO_LIST,
  event
});

// THUNK CREATORS
export const createEvent = (eventDeets, eventInvites) => async dispatch => {
  try {
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
    await dispatch(addEventToList({ [newUID]: newEvent }));
    console.log('newEvent in thunk', newEvent);
    dispatch(setSelectedEvent({ [newUID]: newEvent }));
    //first we send the invitations
    const host = store.getState().user.user;
    const invitesNotUser = eventInvites.filter(invite => invite !== host.email);
    // const mailedInvites =
    sendInvites(invitesNotUser, eventDeets, host);
    // }
    // do we need an error message here if the user cancels the invitations (or there's another issue)?
  } catch (err) {
    console.error(err);
  }
};
export const fetchAllEvents = email => async dispatch => {
  try {
    // query all events where this email is in invites
    const eventRef = database.ref('/Events/');
    let invitedEvents = [];
    eventRef.once('value', async snapshot => {
      let snappy = await snapshot.val();
      for (let uid in snappy) {
        snappy[uid].invites.map(value => {
          if (value.toLowerCase() === email.toLowerCase()) {
            invitedEvents.push({ [uid]: snappy[uid] });
          }
        });
      }
      dispatch(requestEvents(invitedEvents));
    });
    // setTimeout(() => {
    //   dispatch(requestEvents(invitedEvents));
    // }, 100);
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
    case SET_SELECTED_EVENT: {
      return {
        ...state,
        selectedEvent: action.event
        // state.allEvents.filter(x => x[action.uid])[0]
      };
    }
    case ADD_EVENT_TO_LIST: {
      return {
        ...state,
        allEvents: [...state.allEvents, action.event]
      };
    }
    default:
      return state;
  }
};

export default eventReducer;
