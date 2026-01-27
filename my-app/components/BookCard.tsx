import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types/Book';
import StatusBadge from './StatusBadge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

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
      <View style={styles.row}>
        <Text style={[styles.title, { color: theme.text }]}>
          {book.title}
        </Text>
        
        <StatusBadge status={book.status} />
      </View>

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