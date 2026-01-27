import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// Updated Imports:
import { getBookById, updateBook, deleteBook } from '../../../storage/bookStorage';
import { Book } from '../../../types/Book';
import { scheduleReadingReminder, requestNotificationPermissions } from '../../../services/notifications';
import { Icon } from '../../../components/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ... rest of the [id].tsx code (logic stays the same) ...
export default function BookDetailsScreen() {
    // ... Copy the rest of the logic from your previous [id].tsx ...
    // ... Ensure handleDatePress (Android fix) is included as provided in previous steps ...
    // Here is the shortened component logic for brevity, make sure to use the full version:
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter(); 
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const FIXED_ACCENT = '#0a7ea4';
  const [book, setBook] = useState<Book | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBookById(id).then(setBook);
  }, [id]);

  if (!book) return <View style={[styles.container, {backgroundColor: theme.background}]}><Text>Loading...</Text></View>;

  const handleBack = () => router.canGoBack() ? router.back() : router.replace('/');

  const handleDatePress = () => {
    if (Platform.OS === 'android') {
      const currentDate = book.reminderTime ? new Date(book.reminderTime) : new Date();
      DateTimePickerAndroid.open({
        value: currentDate, mode: 'date',
        onChange: (e, d) => {
          if (e.type === 'set' && d) {
            DateTimePickerAndroid.open({
              value: d, mode: 'time',
              onChange: (e2, t) => { if (e2.type === 'set' && t) setBook({ ...book, reminderTime: t.toISOString() }); }
            });
          }
        }
      });
    } else { setShowPicker(true); }
  };

  const handleUpdate = async () => {
      await updateBook(book);
      if (book.reminderTime) {
        // Request notification permissions before scheduling reminder
        const permissionGranted = await requestNotificationPermissions();
        if (permissionGranted) {
          await scheduleReadingReminder(book.id, book.title, new Date(book.reminderTime));
        } else {
          Alert.alert('Permission Required', 'Please enable notification permissions to set reminders');
        }
      }
      handleBack();
  };

  const confirmDelete = () => {
      Alert.alert('Delete', 'Confirm?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await deleteBook(book.id); handleBack(); } }]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={{marginLeft: -10}}><Icon name="chevron-left" size={30} color={theme.text} /></TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Details</Text>
            <TouchableOpacity onPress={confirmDelete}><Icon name="trash-can-outline" size={26} color="#FF3B30" /></TouchableOpacity>
        </View>
        <View style={styles.form}>
            <Text style={[styles.label, { color: FIXED_ACCENT }]}>Title</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]} value={book.title} onChangeText={t => setBook({...book, title: t})} />
            
            <Text style={[styles.label, { color: FIXED_ACCENT }]}>Author</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]} value={book.author} onChangeText={t => setBook({...book, author: t})} />

            <Text style={[styles.label, { color: FIXED_ACCENT }]}>Status</Text>
            <View style={{borderRadius: 12, overflow: 'hidden', backgroundColor: theme.cardBackground}}>
                <Picker selectedValue={book.status} onValueChange={v => setBook({...book, status: v as any})} style={{color: theme.text}} dropdownIconColor={FIXED_ACCENT}>
                    <Picker.Item label="Planned" value="planned" /><Picker.Item label="Reading" value="reading" /><Picker.Item label="Finished" value="finished" />
                </Picker>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                <Text style={[styles.label, { color: FIXED_ACCENT }]}>Reminder</Text>
                {book.reminderTime && <TouchableOpacity onPress={() => setBook({...book, reminderTime: undefined})}><Text style={{color:'#FF3B30', fontSize:12, fontWeight:'bold'}}>REMOVE</Text></TouchableOpacity>}
            </View>
            <TouchableOpacity style={[styles.dateButton, { backgroundColor: theme.cardBackground }]} onPress={handleDatePress}>
                <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
                    <Icon name={book.reminderTime ? "bell-ring-outline" : "bell-outline"} size={20} color={book.reminderTime ? FIXED_ACCENT : theme.icon} />
                    <Text style={{fontSize:16, color: theme.text}}>{book.reminderTime ? new Date(book.reminderTime).toLocaleString([], {dateStyle:'medium', timeStyle:'short'}) : 'No reminder set'}</Text>
                </View>
            </TouchableOpacity>
            {Platform.OS === 'ios' && showPicker && <DateTimePicker value={book.reminderTime ? new Date(book.reminderTime) : new Date()} mode="datetime" display="spinner" onChange={(e, d) => {if(d) setBook({...book, reminderTime: d.toISOString()})}} minimumDate={new Date()} />}

            <TouchableOpacity style={[styles.saveButton, { backgroundColor: FIXED_ACCENT }]} onPress={handleUpdate}><Text style={styles.saveButtonText}>Save Changes</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// Styles remain the same as previously provided
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  form: { gap: 15 },
  label: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  input: { height: 55, borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  dateButton: { height: 55, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15 },
  saveButton: { height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});