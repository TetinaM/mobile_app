import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
// Updated import path:
import { initDatabase } from '../storage/bookStorage';
import { requestNotificationPermissions } from '../services/notifications';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database
        await initDatabase();
        
        // Request notification permissions
        await requestNotificationPermissions();
        
        setIsDbReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsDbReady(true);
      }
    };

    initApp();
  }, []);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}