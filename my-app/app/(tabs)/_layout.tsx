import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '../components/TabsHeader';
import { Icon } from '../components/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Main tab navigation layout configuration.
 * Defines the look and behavior of the bottom tab bar.
 */
export default function TabLayout() {
  // Detect current system theme (light or dark)
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Consistent brand color for active UI elements
  const FIXED_GREEN = '#0a7ea4';

  return (
    <Tabs
      screenOptions={{
        // Define color for the currently selected tab icon and label
        tabBarActiveTintColor: FIXED_GREEN,
        // Define color for unselected tab items
        tabBarInactiveTintColor: theme.icon,
        // Global header is hidden as screens implement their own headers
        headerShown: false,
        // Use custom button with haptic feedback for all tab items
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.cardBackground,
        },
      }}
    >
      {/* Main library screen tab 
      */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon size={28} name="home" color={color} />,
        }}
      />

      {/* Screen for adding new books to the collection 
      */}
      <Tabs.Screen
        name="book/create"
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color }) => <Icon size={28} name="plus-box" color={color} />,
        }}
      />

      {/* User settings and appearance preferences 
      */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={28} name="cog" color={color} />,
        }}
      />

      {/* Book detail screen configuration. 
          Setting 'href: null' ensures this screen exists in the stack but doesn't appear as a tab icon.
      */}
      <Tabs.Screen
        name="book/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}