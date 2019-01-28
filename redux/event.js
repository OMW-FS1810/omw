import { database } from '../config/firebase';
import store from './store';

// ACTION TYPES
const POPULATE_EVENT_DEETS = 'POPULATE_EVENT_DEETS';
const POPULATE_EVENT_INVITES = 'POPULATE_EVENT_INVITES';
const CLEAR_PENDING_INFO = 'CLEAR_PENDING_INFO';

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

// THUNK CREATORS
export const createEvent = (eventDeets, eventInvites) => async dispatch => {
  const { name, date, time, location } = eventDeets;

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

// DEFAULT STATE
const defaultEvent = {
  allEvents: [],
  currentEvent: {},
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
    default:
      return state;
  }
};

export default eventReducer;
