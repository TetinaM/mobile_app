import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { addBook } from '../../storage/bookStorage';
import { Book } from '../../types/Book';
import { scheduleReadingReminder } from '../../services/notifications';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon } from '../../components/Icon';

export default function CreateBookScreen() {
  const router = useRouter(); // router for navigation
  const colorScheme = useColorScheme(); // get current theme
  const theme = Colors[colorScheme ?? 'light'];
  const FIXED_ACCENT_COLOR = '#0a7ea4'; // color for labels and buttons

  // states for form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'planned' | 'reading' | 'finished'>('planned');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // function to reset form
  const handleReset = () => {
    if (!title && !author && !reminderEnabled) return;
    Alert.alert('Reset Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Reset', 
        style: 'destructive', 
        onPress: () => {
          setTitle('');
          setAuthor('');
          setStatus('planned');
          setReminderEnabled(false);
          setDate(new Date());
        } 
      },
    ]);
  };

  // function to handle date change in picker
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false); // hide picker on android after selection
    if (selectedDate) {
      setDate(selectedDate);
      setReminderEnabled(true); // enable reminder if date selected
    }
  };

  // function to save book
  const handleSave = async () => {
    if (!title.trim()) return; // do not save empty title

    const book: Book = {
      id: uuid.v4().toString(), // generate unique id
      title: title.trim(),
      author: author.trim(),
      status,
      reminderTime: reminderEnabled ? date.toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    await addBook(book); // save to storage
    if (reminderEnabled) {
      await scheduleReadingReminder(book.id, book.title, date); // schedule reminder
    }

    router.back(); // go back to previous screen
  };

  return (
    // wrap content to avoid keyboard overlapping inputs
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
        {/* header with title and reset button */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>New Book</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Icon name="refresh" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* title input */}
          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Book Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
            placeholder="Enter title..."
            placeholderTextColor={theme.icon}
            value={title}
            onChangeText={setTitle}
          />

          {/* author input */}
          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Author</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
            placeholder="Enter author name..."
            placeholderTextColor={theme.icon}
            value={author}
            onChangeText={setAuthor}
          />

          {/* status picker */}
          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Reading Status</Text>
          <View style={[styles.pickerContainer, { backgroundColor: theme.cardBackground }]}> 
            <Picker
              selectedValue={status}
              onValueChange={(v) => setStatus(v as any)}
              dropdownIconColor={FIXED_ACCENT_COLOR}
              style={{ color: theme.text }}
            >
              <Picker.Item label="Planned" value="planned" />
              <Picker.Item label="Reading" value="reading" />
              <Picker.Item label="Finished" value="finished" />
            </Picker>
          </View>

          {/* reminder button */}
          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Reminder</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { backgroundColor: theme.cardBackground }]}
            onPress={() => setShowPicker(true)}
          >
            <View style={styles.dateButtonContent}>
              <Icon 
                name="calendar-clock" 
                size={20} 
                color={reminderEnabled ? FIXED_ACCENT_COLOR : theme.icon} 
              />
              <Text style={[styles.dateButtonText, { color: theme.text }]}> 
                {reminderEnabled 
                  ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) 
                  : 'Set reading reminder'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* date picker for reminder */}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* save button */}
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: FIXED_ACCENT_COLOR }]} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Add to Library</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 5,
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  dateButton: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateButtonText: {
    fontSize: 16,
  },
  saveButton: {
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});