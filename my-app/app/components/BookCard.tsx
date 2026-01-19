import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types/Book';
import StatusBadge from './StatusBadge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BookCardProps {
  // The book data to be displayed in the card
  book: Book;
  // Optional callback function triggered when the card is pressed
  onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  // Hook to detect light or dark mode
  const colorScheme = useColorScheme();
  // Selecting theme colors based on current appearance
  const theme = Colors[colorScheme ?? 'light'];

  // Safety check: if book data is missing, don't render anything
  if (!book) return null;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.cardBackground,
          shadowColor: '#000',
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Container for title and status badge */}
      <View style={styles.row}>
        {/* Main book title text */}
        <Text style={[styles.title, { color: theme.text }]}>
          {book.title}
        </Text>
        
        {/* Visual indicator for reading status */}
        <StatusBadge status={book.status} />
      </View>

      {/* Author name display */}
      <Text style={[styles.author, { color: theme.icon }]}>
        {book.author}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  author: {
    marginTop: 4,
    fontSize: 14,
  },
});

export default BookCard;