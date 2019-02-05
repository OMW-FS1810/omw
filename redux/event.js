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
    const newEventObject = { [newUID]: newEvent };
    // await dispatch(addEventToList(newEventObject));
    dispatch(setSelectedEvent(newEventObject));
    //first we send the invitations
    const host = store.getState().user.user;
    const invitesNotUser = eventInvites.filter(invite => invite !== host.email);

    sendInvites(invitesNotUser, eventDeets, host, newEventObject);
    // do we need an error message here if the user cancels the invitations (or there's another issue)?
  } catch (err) {
    console.error(err);
  }
};
export const fetchAllEvents = email => dispatch => {
  try {
    // query all events where this email is in invites
    const eventRef = database.ref('/Events/');
    let invitedEvents = [];
    eventRef.on('value', async snapshot => {
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
  } catch (err) {
    console.error(err);
  }
};
export const addEmailToEvent = (uid, email) => dispatch => {
  try {
    // grab reference to this event
    const eventRef = database.ref(`Events/${uid}`);
    // update the invites arr in database to match new array with spread invites
    eventRef.child('invites').once('value', async snapshot => {
      let oldInvitesArr = snapshot.val();
      let newInvitesArr = [...oldInvitesArr, email];
      eventRef.update({
        invites: newInvitesArr
      });
      // grab *my* logged in email to refetch all events
      const myEmail = store.getState().user.user.email;
      // grab current event to update invites in store.selectedEvent
      const currEvent = store.getState().event.selectedEvent;
      const key = Object.keys(currEvent)[0];
      // push new email into old emails arr
      currEvent[key].invites.push(email);
      await dispatch(fetchAllEvents(myEmail));
      await dispatch(setSelectedEvent(currEvent));

      const host = store.getState().user.user;
      sendInvites([email], currEvent[key], host, currEvent);
    });
  } catch (err) {
    console.error(err);
  }
};
export const declineEvent = uid => dispatch => {
  try {
    // grab reference to the event
    const eventRef = database.ref(`Events/${uid}`);
    // find *my* email
    const myEmail = store.getState().user.user.email;
    // update the invites list to remove *my* email
    eventRef.child('invites').once('value', async snapshot => {
      let oldInvitesArr = snapshot.val();
      // filter out *my* email from the invites array
      let newInvitesArr = oldInvitesArr.filter(
        snapshotEmail => snapshotEmail !== myEmail
      );
      await eventRef.update({
        invites: newInvitesArr
      });

      // refetch all events to trigger re-render
      await dispatch(fetchAllEvents(myEmail));
      // re-initialize store with default store.setSelectedEvent
      await dispatch(setSelectedEvent({}));
    });

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
