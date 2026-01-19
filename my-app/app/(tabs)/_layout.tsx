import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '../components/TabsHeader';
import { Icon } from '../components/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  // get current color scheme (light or dark)
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // fixed green color for active tab
  const FIXED_GREEN = '#0a7ea4';

  return (
    <Tabs
      // screen options for all tabs
      screenOptions={{
        tabBarActiveTintColor: FIXED_GREEN, // color of active tab
        tabBarInactiveTintColor: theme.icon, // color of inactive tab
        headerShown: false, // hide the header
        tabBarButton: (props) => <HapticTab {...props} />, // custom button with haptic feedback
        tabBarStyle: {
          backgroundColor: theme.background, // background color of tab bar
          borderTopColor: theme.cardBackground, // top border color
        },
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home', // text shown in tab
          tabBarIcon: ({ color }) => <Icon size={28} name="home" color={color} />, // icon for tab
        }}
      />

      {/* Add Book tab */}
      <Tabs.Screen
        name="book/create"
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color }) => <Icon size={28} name="plus-box" color={color} />, // icon for tab
        }}
      />

      {/* Settings tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={28} name="cog" color={color} />, // icon for tab
        }}
      />

      {/* Dynamic book detail screen, not shown in tab bar */}
      <Tabs.Screen
        name="book/[id]"
        options={{
          href: null, // hide from tab bar
        }}
      />
    </Tabs>
  );
}