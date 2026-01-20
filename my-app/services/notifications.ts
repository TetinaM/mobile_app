import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// request permission to show notifications
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false; // notifications not supported on web

  const { status } = await Notifications.getPermissionsAsync(); // check current permission
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync(); // ask user for permission
    return newStatus === 'granted'; // return true if granted
  }

  return true; // already granted
};

// schedule a local notification for a book reminder
export const scheduleReadingReminder = async (
  bookId: string,
  bookTitle: string,
  date: Date
) => {
  const hasPermission = await requestNotificationPermissions(); // check permission
  if (!hasPermission) return; // stop if no permission

  const now = new Date();
  if (date <= now) return; // do not schedule past dates

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to read "${bookTitle}"`, // notification title
        body: "Don't forget to read your book!", // notification body
        data: { bookId }, // send book id with notification
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE, // schedule by date
        date: date, // when to show notification
      } as Notifications.DateTriggerInput,
    });
  } catch (error) {
    console.error("Error scheduling notification:", error); // show error in console
  }
};

// cancel all scheduled notifications
export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync(); // remove all reminders
};