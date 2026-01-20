import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ИСПРАВЛЕНО: используем @/ для импортов
import { Icon } from '@/components/Icon';
// ВАЖНО: Убедитесь, что BookCard.tsx тоже перенесен в папку components в корне!
import BookCard from '@/components/BookCard'; 
import { getBooks } from '@/storage/bookStorage';
import { Book } from '@/types/Book';

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const FIXED_GREEN = '#0a7ea4';

  const fetchBooks = async () => {
    const allBooks = await getBooks();
    setBooks(allBooks || []);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBook = (id: string) => {
    router.push(`/book/${id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="book-open-variant" size={64} color={theme.icon} />
      <Text style={[styles.emptyText, { color: theme.text }]}>No books found</Text>
      <TouchableOpacity 
        style={[styles.emptyButton, { backgroundColor: FIXED_GREEN }]}
        onPress={() => router.push('/book/create')}
      >
        <Text style={styles.emptyButtonText}>Add your first book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Library</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: FIXED_GREEN }]}
          onPress={() => router.push('/book/create')}
        >
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground }]}> 
        <Icon name="magnify" size={20} color={theme.icon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by title or author..."
          placeholderTextColor={theme.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={18} color={theme.icon} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => handleOpenBook(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={FIXED_GREEN} 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  addButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 15, height: 50, borderRadius: 12, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 20 },
  emptyButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  emptyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});