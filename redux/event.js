/* eslint-disable no-use-before-define */
/* eslint-disable complexity */
/* eslint-disable guard-for-in */
import { database } from '../config/firebase';
import { sendInvites } from '../helpers/invitations';
import { store } from './store';
import distance from '../helpers/distance';

// ACTION TYPES
const POPULATE_EVENT_DEETS = 'POPULATE_EVENT_DEETS';
const POPULATE_EVENT_INVITES = 'POPULATE_EVENT_INVITES';
const CLEAR_PENDING_INFO = 'CLEAR_PENDING_INFO';
const REQUEST_EVENTS = 'FETCH_EVENTS';
const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
const ADD_EVENT_TO_LIST = 'ADD_EVENT_TO_LIST';
const JUST_MADE_EVENT_TOGGLE = 'JUST_MADE_EVENT_TOGGLE';
const START_EVENT_MEMBER_TRACKING = 'START_EVENT_MEMBER_TRACKING';
const STOP_EVENT_MEMBER_TRACKING = 'STOP_EVENT_MEMBER_TRACKING';

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
export const addEventToList = event => ({
  type: ADD_EVENT_TO_LIST,
  event
});
export const justMadeEventToggle = () => ({
  type: JUST_MADE_EVENT_TOGGLE
});
const startMemberTracking = (memberEmail, member) => ({
  type: START_EVENT_MEMBER_TRACKING,
  memberEmail,
  member
});
const stopMemberTracking = () => ({
  type: STOP_EVENT_MEMBER_TRACKING
});

// THUNK CREATORS
export const createEvent = (eventDeets, eventInvites) => async dispatch => {
  try {
    let newEvent;
    const eventRef = await database.ref('Events/').push({
      ...eventDeets,
      invites: eventInvites.map(email => ({ email, status: 'invited' }))
    });

    await eventRef.once('value', snapshot => {
      newEvent = snapshot.val();
    });
    const newUID = String(eventRef).slice(-19);
    dispatch(clearPendingInfo);
    const newEventObject = { [newUID]: newEvent };
    await dispatch(addEventToList(newEventObject));
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
    const eventRef = database.ref('Events/');
    let invitedEvents = [];
    eventRef.once('value', async snapshot => {
      let snappy = await snapshot.val();
      for (let uid in snappy) {
        snappy[uid].invites.map(value => {
          if (value.email.toLowerCase() === email.toLowerCase()) {
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
      let oldInvitesArr = await snapshot.val();

      let newInvitesArr = [...oldInvitesArr, { email, status: 'invited' }];
      eventRef.update({
        invites: newInvitesArr
      });
      // grab *my* logged in email to refetch all events
      const myEmail = store.getState().user.user.email;
      // grab current event to update invites in store.selectedEvent
      const currEvent = store.getState().event.selectedEvent;
      const key = Object.keys(currEvent)[0];
      // push new email into old emails arr
      currEvent[key].invites.push({ email, status: 'invited' });
      await dispatch(fetchAllEvents(myEmail));
      // await dispatch(setSelectedEvent(currEvent));
      const location = await currEvent[key].location;
      const latitude = location.locationGeocode.lat;
      const longitude = location.locationGeocode.lng;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.1226,
        longitudeDelta: 0.0467
      };

      await dispatch(trackMembersStop(oldInvitesArr));

      await dispatch(trackMembersStart(newInvitesArr, newRegion));
      const host = store.getState().user.user;
      sendInvites([email], currEvent[key], host, currEvent);
    });
  } catch (err) {
    console.error(err);
  }
};
export const declineEvent = uid => async dispatch => {
  try {
    let eventUid;
    // dispatch trackMembersStop to stop tracking members for an event we're no longer watching
    const currEvent = store.getState().event.selectedEvent;
    const currEventMembers = Object.values(currEvent)[0].invites;
    await dispatch(trackMembersStop(currEventMembers));

    // this is annoying.. >:[ the event snapshot UID we're sending into our store from firebase has a '-' at the front of it, but elsewhere it doesnt.. so check to make sure we have a '-' infront of the UID before the request is sent to firebase.
    if (uid[0] === '-') {
      eventUid = String(uid);
    } else {
      eventUid = '-' + uid;
    }
    // grab reference to the event
    const eventRef = database.ref(`Events/${eventUid}`);
    // find *my* email
    const myEmail = store.getState().user.user.email;
    // update the invites list to remove *my* email
    await eventRef.child('invites').once('value', async snapshot => {
      let oldInvitesArr = snapshot.val();
      // filter out *my* email from the invites array
      let newInvitesArr = oldInvitesArr.filter(
        snapshotEmail =>
          snapshotEmail.email.toLowerCase() !== myEmail.toLowerCase()
      );
      if (!newInvitesArr.length) {
        await eventRef.remove();
      } else {
        await eventRef.update({
          invites: newInvitesArr
        });
      }

      // refetch all events to trigger re-render
      await dispatch(fetchAllEvents(myEmail));
      // re-initialize store with default store.setSelectedEvent
      await dispatch(setSelectedEvent({}));

      // remove from my list of events
      // remove from selected
      // remove email from invites
    });
  } catch (err) {
    console.error(err);
  }
};
export const updateMyEventStatus = (uid, status, event) => async dispatch => {
  try {
    // grab reference to the event
    let eventUid;
    if (uid[0] === '-') {
      eventUid = String(uid);
    } else {
      eventUid = '-' + uid;
    }
    const eventRef = database.ref(`Events/${eventUid}/invites`);
    // find *my* email
    const myEmail = store.getState().user.user.email;
    // update the invites list to UPDATE *my* email
    await eventRef
      .orderByChild('email')
      .equalTo(myEmail)
      .once('value', async snapshot => {
        let thisIndex = Object.keys(snapshot.val())[0];
        const updateRef = database.ref(
          `Events/${eventUid}/invites/${thisIndex}`
        );
        await updateRef.update({ email: myEmail, status });
        await dispatch(fetchAllEvents(myEmail));
        const eventsToUpdate = store.getState().event.allEvents;
        const updatedEvent = eventsToUpdate[eventUid];
        const myName = store.getState().user.user.firstName;
        sendInvites(event.invites, event, myName, status, true, thisIndex, myEmail);
        //NEED TO UPDATE SINGLE EVENT PAGE AND MAP!!!
        // await dispatch(setSelectedEvent({}))
        // await dispatch(setSelectedEvent(updatedEvent));
        // await dispatch(trackMembersStop(oldInvitesArr));

        // await dispatch(trackMembersStart(newInvitesArr, newRegion));
      });

    // refetch all events to trigger re-render
  } catch (err) {
    console.error(err);
  }
};

// const checkMembersInDB = async members => {
//   console.log('members in', members);
//   const currUsers = database.ref('/Users/');
//   let membersToTrack = [];
//   const allUsers = await currUsers
//     .orderByChild('email')
//     .once('value', async snapshot => {
//       const userObj = snapshot.val();
//       //rearrange users by email

//       const userByEmail = {};
//       for (let key in userObj) {
//         let thisEmail = userObj[key]['email'].toLowerCase();
//         userByEmail[thisEmail] = userObj[key];
//       }

//       members.forEach(invitee => {
//         let thisInvitee = invitee.email.toLowerCase();
//         if (thisInvitee in userByEmail) {
//           membersToTrack.push(invitee);
//         }
//       });
//     });
//   return membersToTrack;
// };

export const trackMembersStart = (members, newRegion) => async dispatch => {
  try {
    // let members = await checkMembersInDB(unfMembers);

    const userLocationsDB = database.ref(`/Devices/`);
    members.forEach(async member => {
      await userLocationsDB
        .orderByChild('email')
        .equalTo(member.email.toLowerCase())
        .on('value', snapshot => {
          let thisMember = Object.values(snapshot.val())[0];
          let memberDistance = distance(
            thisMember.coords.latitude,
            thisMember.coords.longitude,
            newRegion.latitude,
            newRegion.longitude
          );

          dispatch(
            startMemberTracking(
              member.email.toLowerCase(),
              snapshot.val() && {
                ...thisMember,
                status: member.status,
                distance: memberDistance
              }
            )
          );
        });
    });
  } catch (err) {
    console.error(err);
  }
};

export const trackMembersStop = members => async dispatch => {
  try {
    // let members = await checkMembersInDB(unfMembers);
    const userLocationsDB = database.ref(`/Devices/`);

    members.forEach(async member => {
      await userLocationsDB
        .orderByChild('email')
        .equalTo(member.email.toLowerCase())
        .off('value');
    });
    dispatch(stopMemberTracking());
  } catch (err) {
    console.error(err);
  }
};

// DEFAULT STATE
const defaultEvent = {
  allEvents: {},
  selectedEvent: {},
  pendingCreateEventDeets: {},
  pendingCreateEventInvites: [],
  eventJustMade: false,
  eventMembers: {}
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
    case JUST_MADE_EVENT_TOGGLE: {
      return {
        ...state,
        eventJustMade: !state.eventJustMade
      };
    }
    case START_EVENT_MEMBER_TRACKING: {
      return {
        ...state,
        eventMembers: {
          ...state.eventMembers,
          [action.memberEmail]: action.member
        }
      };
    }
    case STOP_EVENT_MEMBER_TRACKING: {
      return {
        ...state,
        eventMembers: {}
      };
    }

    default:
      return state;
  }
};

export default eventReducer;
