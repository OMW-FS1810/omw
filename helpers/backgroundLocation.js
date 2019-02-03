import { TaskManager, Constants } from 'expo';
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

export const setBackgroundLocation = async () => {
  const isPolling = await Location.hasStartedLocationUpdatesAsync(
    SEND_LOCATION
  );
  if (isPolling) {
    await Location.stopLocationUpdatesAsync(SEND_LOCATION);
    this.setState({ backgroundLocation: false });
  } else {
    //triggers sending my location -- works in the background on iOS
    await Location.startLocationUpdatesAsync(SEND_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 50,
      timeInterval: 60000
    });
    this.setState({ backgroundLocation: true });
  }
};
