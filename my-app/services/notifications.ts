import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    // Only request on physical device
    if (!Device.isDevice) {
      console.log("Not a physical device, skipping notification permissions");
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    console.log('Notification permission granted');

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleReadingReminder = async (
  bookId: string,
  bookTitle: string,
  date: Date
) => {
  try {
    const now = new Date();
    if (date <= now) {
      console.error('Reminder date must be in the future');
      return;
    }

    // Calculate milliseconds from now
    const delayMs = date.getTime() - now.getTime();
    const delaySeconds = Math.max(Math.ceil(delayMs / 1000), 1); // At least 1 second

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reading Reminder',
        body: `Time to read: ${bookTitle}`,
        data: { bookId, bookTitle },
        sound: 'default',
      },
      trigger: {
        type: 'timeInterval' as any,
        seconds: delaySeconds,
        repeats: false,
      },
    });

    console.log(`Reminder scheduled for ${bookTitle} at ${date}`);
  } catch (error) {
    console.error('Error scheduling reminder:', error);
  }
};

export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
  } catch (error) {
    console.error('Error cancelling reminders:', error);
  }
};