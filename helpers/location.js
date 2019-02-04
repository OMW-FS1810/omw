import { TaskManager, Constants, Permissions, Location } from 'expo';
import { database } from '../config/firebase';

const deviceId = Constants.installationId;

const SEND_LOCATION = 'sendLocation';

//This logs our location, running in the background -- eventually move this to when the app is opened
TaskManager.defineTask(SEND_LOCATION, async ({ data: { locations }, err }) => {
  if (err) {
    console.error(err);
    return;
  }
  try {
    await database.ref(`/Devices/${deviceId}`).update({
      coords: locations[0].coords,
      timestamp: locations[0].timestamp
    });
  } catch (error) {
    console.error(error);
  }
});

export const setBackgroundLocationOn = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    return;
  }
  try {
    //triggers regularly sending my location -- works in the background on iOS
    await Location.startLocationUpdatesAsync(SEND_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 50,
      timeInterval: 60000
    });
  } catch (err) {
    console.error(err);
  }
};

export const setBackgroundLocationToggle = async () => {
  const isPolling = await Location.hasStartedLocationUpdatesAsync(
    SEND_LOCATION
  );
  if (isPolling) {
    try {
      await Location.stopLocationUpdatesAsync(SEND_LOCATION);
    } catch (err) {
      console.error(err);
    }
  } else {
    setBackgroundLocationOn();
  }
};

export const getMyLocationNow = async () => {
  try {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.043
    };
    //also send location to the DB
    try {
      await database.ref(`/Devices/${deviceId}`).update({
        coords: location.coords,
        timestamp: location.timestamp
      });
    } catch (error) {
      console.error(error);
    }
    //return my map region
    return region;
  } catch (err) {
    console.error(err);
  }
};
