import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Appearance,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon } from '@/components/Icon';
import { cancelAllReminders } from '@/services/notifications';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const FIXED_ACCENT = '#0a7ea4';

  const handleClearNotifications = async () => {
    Alert.alert(
      'Clear Reminders',
      'Are you sure you want to cancel all scheduled reading reminders?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await cancelAllReminders();
            Alert.alert('Success', 'All reminders have been cleared.');
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    const nextTheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(nextTheme);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: FIXED_ACCENT }]}>Appearance</Text>
        <TouchableOpacity
          style={[styles.item, { backgroundColor: theme.cardBackground }]}
          onPress={toggleTheme}
        >
          <View style={styles.itemLeft}>
            <Icon 
              name={colorScheme === 'dark' ? 'weather-night' : 'weather-sunny'} 
              size={22} 
              color={FIXED_ACCENT} 
            />
            <Text style={[styles.itemText, { color: theme.text }]}>Theme</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.statusText, { color: theme.icon }]}>
              {colorScheme === 'dark' ? 'Dark' : 'Light'}
            </Text>
            <Icon name="chevron-right" size={20} color={theme.icon} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: FIXED_ACCENT }]}>Notifications</Text>
        <TouchableOpacity
          style={[styles.item, { backgroundColor: theme.cardBackground }]}
          onPress={handleClearNotifications}
        >
          <View style={styles.itemLeft}>
            <Icon name="bell-remove-outline" size={22} color="#FF3B30" />
            <Text style={[styles.itemText, { color: theme.text }]}>Clear All Reminders</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: FIXED_ACCENT }]}>About</Text>
        <View style={[styles.item, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.itemLeft}>
            <Icon name="information-outline" size={22} color={theme.icon} />
            <Text style={[styles.itemText, { color: theme.text }]}>Version</Text>
          </View>
          <Text style={[styles.statusText, { color: theme.icon }]}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1.2 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, marginBottom: 8 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemText: { fontSize: 16, fontWeight: '500' },
  statusText: { fontSize: 14 },
});