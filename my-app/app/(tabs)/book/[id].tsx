import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getBookById, updateBook, deleteBook } from '../../storage/bookStorage';
import { Book } from '../../types/Book';
import { scheduleReadingReminder } from '../../services/notifications';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon } from '../../components/Icon';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // get book id from route parameters
  const router = useRouter(); // navigation object to go back or push screens
  const colorScheme = useColorScheme(); // get current theme (light/dark)
  const theme = Colors[colorScheme ?? 'light']; // select colors based on theme

  const FIXED_ACCENT = '#0a7ea4'; // accent color for labels and buttons

  const [book, setBook] = useState<Book | null>(null); // store book details
  const [showPicker, setShowPicker] = useState(false); // show/hide date picker

  // load book data when screen opens
  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      const b = await getBookById(id); // get book from storage
      setBook(b); // save book in state
    };
    fetchBook();
  }, [id]);

  // show loading text if book is not ready
  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <Text style={{ color: theme.text, textAlign: 'center' }}>Loading...</Text>
      </View>
    );
  }

  // handle changes from the date picker
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false); // hide picker on android
    if (event.type === 'set' && selectedDate) {
      setBook({ ...book, reminderTime: selectedDate.toISOString() }); // update reminder time
    }
  };

  // save updated book data
  const handleUpdate = async () => {
    if (!book.title.trim()) return; // don't save if title is empty
    await updateBook(book); // update book in storage
    if (book.reminderTime) {
      await scheduleReadingReminder(book.id, book.title, new Date(book.reminderTime)); // schedule reminder
    }
    router.back(); // go back to previous screen
  };

  // confirm deletion of book
  const confirmDelete = () => {
    Alert.alert('Delete Book', 'Are you sure you want to remove this book from your library?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          await deleteBook(book.id); // delete book from storage
          router.back(); // go back
        } 
      },
    ]);
  };

  // remove reminder time
  const clearReminder = () => {
    setBook({ ...book, reminderTime: undefined });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
        {/* header with back and delete buttons */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="chevron-left" size={30} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Details</Text>
          <TouchableOpacity onPress={confirmDelete}>
            <Icon name="trash-can-outline" size={26} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* book details form */}
        <View style={styles.form}>
          {/* title input */}
          <Text style={[styles.label, { color: FIXED_ACCENT }]}>Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
            value={book.title}
            onChangeText={(text) => setBook({ ...book, title: text })} // update title in state
          />

          {/* author input */}
          <Text style={[styles.label, { color: FIXED_ACCENT }]}>Author</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
            value={book.author}
            onChangeText={(text) => setBook({ ...book, author: text })} // update author in state
          />

          {/* status picker */}
          <Text style={[styles.label, { color: FIXED_ACCENT }]}>Status</Text>
          <View style={[styles.pickerContainer, { backgroundColor: theme.cardBackground }]}> 
            <Picker
              selectedValue={book.status}
              onValueChange={(v) => setBook({ ...book, status: v as any })} // update status
              dropdownIconColor={FIXED_ACCENT}
              style={{ color: theme.text }}
            >
              <Picker.Item label="Planned" value="planned" />
              <Picker.Item label="Reading" value="reading" />
              <Picker.Item label="Finished" value="finished" />
            </Picker>
          </View>

          {/* reminder label with remove button */}
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: FIXED_ACCENT }]}>Reminder</Text>
            {book.reminderTime && (
              <TouchableOpacity onPress={clearReminder}>
                <Text style={{ color: '#FF3B30', fontSize: 12, fontWeight: 'bold' }}>REMOVE</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* reminder button */}
          <TouchableOpacity 
            style={[styles.dateButton, { backgroundColor: theme.cardBackground }]}
            onPress={() => setShowPicker(true)} // show date picker
          >
            <View style={styles.dateButtonContent}>
              <Icon 
                name={book.reminderTime ? "bell-ring-outline" : "bell-outline"} 
                size={20} 
                color={book.reminderTime ? FIXED_ACCENT : theme.icon} 
              />
              <Text style={[styles.dateButtonText, { color: theme.text }]}> 
                {book.reminderTime 
                  ? new Date(book.reminderTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) 
                  : 'No reminder set'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* date picker component */}
          {showPicker && (
            <DateTimePicker
              value={book.reminderTime ? new Date(book.reminderTime) : new Date()} // default value
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange} // update reminder
              minimumDate={new Date()} // cannot pick past date
            />
          )}

          {/* save changes button */}
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: FIXED_ACCENT }]} 
            onPress={handleUpdate} // save book changes
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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