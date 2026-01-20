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
// ВАЖНО: Добавили DateTimePickerAndroid
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

// ВАЖНО: Пути изменены на ../../../ (выход в корень проекта)
// Если вы НЕ перенесли папки, верните их назад на ../../
import { addBook } from '../../../storage/bookStorage';
import { Book } from '../../../types/Book';
import { scheduleReadingReminder } from '../../../services/notifications';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon } from '@/components/Icon';

export default function CreateBookScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const FIXED_ACCENT_COLOR = '#0a7ea4';

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'planned' | 'reading' | 'finished'>('planned');
  const [date, setDate] = useState(new Date());
  // showPicker теперь используется ТОЛЬКО для iOS
  const [showPicker, setShowPicker] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

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

  // Обновленная функция изменения даты
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'ios') {
       // На iOS мы просто скрываем/показываем компонент по желанию, но здесь логика
       // может отличаться. Обычно на iOS пикер всегда виден или скрывается кнопкой Done.
       // Если используем модальный пикер:
       // setShowPicker(false); 
    }
    
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
      setReminderEnabled(true);
    } else if (event.type === 'dismissed') {
      // Если пользователь отменил выбор на Android
    }
  };

  // Новая функция для открытия календаря
  const showDatepicker = () => {
    if (Platform.OS === 'android') {
      // ИСПРАВЛЕНИЕ: Используем императивный API для Android
      DateTimePickerAndroid.open({
        value: date,
        onChange: onDateChange,
        mode: 'date',
        is24Hour: true,
        minimumDate: new Date(),
      });
    } else {
      // Для iOS просто переключаем стейт
      setShowPicker(!showPicker);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    const book: Book = {
      id: uuid.v4().toString(),
      title: title.trim(),
      author: author.trim(),
      status,
      reminderTime: reminderEnabled ? date.toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    await addBook(book);
    
    if (reminderEnabled) {
      await scheduleReadingReminder(book.id, book.title, date);
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>New Book</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Icon name="refresh" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Book Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
            placeholder="Enter title..."
            placeholderTextColor={theme.icon}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Author</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
            placeholder="Enter author name..."
            placeholderTextColor={theme.icon}
            value={author}
            onChangeText={setAuthor}
          />

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

          <Text style={[styles.label, { color: FIXED_ACCENT_COLOR }]}>Reminder</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { backgroundColor: theme.cardBackground }]}
            onPress={showDatepicker}
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

          {/* DateTimePicker рендерится ТОЛЬКО на iOS через условие */}
          {Platform.OS === 'ios' && showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="spinner"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

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