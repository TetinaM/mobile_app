// app/services/notifications.ts

// NOTE: We are disabling notifications for now because 'expo-notifications' 
// causes a crash in the latest version of Expo Go on Android.
// import * as Notifications from 'expo-notifications'; 
import { Platform } from 'react-native';

export const requestNotificationPermissions = async (): Promise<boolean> => {
  console.log("Notifications are disabled in Expo Go to prevent crashes.");
  return false;
};

export const scheduleReadingReminder = async (
  bookId: string,
  bookTitle: string,
  date: Date
) => {
  console.log(`[Mock] Reminder set for ${bookTitle} at ${date}`);
  // In the future, use a Development Build to enable this feature again.
};

export const cancelAllReminders = async () => {
  console.log("[Mock] All reminders cancelled");
};