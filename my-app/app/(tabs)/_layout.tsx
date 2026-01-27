import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/TabsHeader';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const FIXED_GREEN = '#0a7ea4';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: FIXED_GREEN,
        tabBarInactiveTintColor: theme.icon,
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            backgroundColor: theme.background,
            borderTopColor: theme.cardBackground,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="book/create"
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color }) => <Icon size={28} name="plus-box" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={28} name="cog" color={color} />,
        }}
      />

      <Tabs.Screen
        name="book/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}