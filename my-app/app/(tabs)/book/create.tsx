import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  Platform, KeyboardAvoidingView, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { addBook } from '../../../storage/bookStorage';
import { scheduleReadingReminder } from '../../../services/notifications';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon } from '../../../components/Icon'; 

export default function CreateBookScreen() {
  const router = useRouter(); 
  const colorScheme = useColorScheme(); 
  const theme = Colors[colorScheme ?? 'light'];
  const FIXED_ACCENT_COLOR = '#0a7ea4'; 

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'planned' | 'reading' | 'finished'>('planned');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const handleReset = () => {
    if (!title && !author && !reminderEnabled) return;
    Alert.alert('Reset', 'Clear fields?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { setTitle(''); setAuthor(''); setStatus('planned'); setReminderEnabled(false); } },
    ]);
  };

  const handleDatePress = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: 'time',
              onChange: (event, finalDate) => {
                if (event.type === 'set' && finalDate) {
                  setDate(finalDate);
                  setReminderEnabled(true);
                }
              },
            });
          }
        },
      });
    } else {
      setShowPicker(true);
    }
  };

  const onIOSDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      setReminderEnabled(true);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert("Error", "Enter title"); return; }
    
    try {
        const reminderTime = reminderEnabled ? date.toISOString() : undefined;
        
        // ИСПРАВЛЕНИЕ: Передаем 'status' третьим аргументом
        const newBookId = await addBook(title, author, status, '', reminderTime); 
        
        if (reminderEnabled && newBookId) {
           await scheduleReadingReminder(newBookId.toString(), title, date);
        }
        
        if (router.canGoBack()) router.back(); else router.replace('/');
    } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to save");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>New Book</Text>
          <TouchableOpacity onPress={handleReset} style={{padding:5}}><Icon name="refresh" size={24} color={theme.icon} /></TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Title</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]} value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor={theme.icon} />

          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Author</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]} value={author} onChangeText={setAuthor} placeholder="Author" placeholderTextColor={theme.icon} />

          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Status</Text>
          <View style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: theme.cardBackground }}> 
            <Picker selectedValue={status} onValueChange={(v) => setStatus(v as any)} dropdownIconColor={FIXED_ACCENT_COLOR} style={{ color: theme.text }}>
              <Picker.Item label="Planned" value="planned" /><Picker.Item label="Reading" value="reading" /><Picker.Item label="Finished" value="finished" />
            </Picker>
          </View>

          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Reminder</Text>
          <TouchableOpacity style={[styles.dateButton, { backgroundColor: theme.cardBackground }]} onPress={handleDatePress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="calendar-clock" size={20} color={reminderEnabled ? FIXED_ACCENT_COLOR : theme.icon} />
              <Text style={{ fontSize: 16, color: theme.text }}>{reminderEnabled ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Set reminder'}</Text>
            </View>
          </TouchableOpacity>

          {Platform.OS === 'ios' && showPicker && <DateTimePicker value={date} mode="datetime" display="spinner" onChange={onIOSDateChange} minimumDate={new Date()} />}

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: FIXED_ACCENT_COLOR }]} onPress={handleSave}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Add to Library</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  form: { gap: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, textTransform: 'uppercase' },
  input: { height: 55, borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  dateButton: { height: 55, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15 },
  saveButton: { height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
});