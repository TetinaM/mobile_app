import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { Book } from '@/types/Book';
// ИСПРАВЛЕНО: имя файла themed-text (маленькими буквами, судя по ошибкам)
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
// ИСПРАВЛЕНО: StatusBadge это default export (без фигурных скобок)
import StatusBadge from '@/components/StatusBadge';
import { Icon } from '@/components/Icon';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

export function BookCard({ book, onPress }: BookCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  // Если onPress не передан, используем стандартную навигацию
  const handlePress = onPress || (() => {
    router.push(`/book/${book.id}`);
  });

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: theme.cardBackground || theme.background, // Fallback if cardBackground is missing
          borderColor: theme.icon,
          // Добавляем небольшую тень для iOS и Android
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        {/* 1. Обложка книги (слева) */}
        {book.imageUri ? (
          <Image 
            source={{ uri: book.imageUri }} 
            style={styles.cover} 
          />
        ) : (
          /* Заглушка, если фото нет (опционально, можно убрать этот блок else, если не нужна иконка) */
          <View style={[styles.cover, styles.placeholder, { backgroundColor: theme.icon + '20' }]}>
            <Icon name="book-open-page-variant" size={32} color={theme.icon} />
          </View>
        )}

        {/* 2. Текстовая информация (справа) */}
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.title}>
              {book.title}
            </ThemedText>
            {/* Статус (справа сверху) */}
            <StatusBadge status={book.status} />
          </View>

          <ThemedText style={{ color: theme.icon, marginTop: 4, fontSize: 14 }} numberOfLines={1}>
            {book.author}
          </ThemedText>
          
          {/* Дополнительная инфо (страницы, рейтинг или дата) - опционально */}
          {book.totalPages && (
            <View style={styles.footer}>
              <Icon name="book-open-outline" size={14} color={theme.icon} />
              <ThemedText style={{ color: theme.icon, fontSize: 12, marginLeft: 4 }}>
                {book.currentPage || 0} / {book.totalPages} p.
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    // Граница опциональна, зависит от твоего дизайна
    // borderWidth: 1, 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Выравнивание по центру по вертикали (или 'flex-start' для верха)
  },
  cover: {
    width: 70,
    height: 105, // Пропорция 2:3
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#eee', // Цвет фона пока грузится
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    height: 105, // Чтобы растянуть контент по высоте картинки
    justifyContent: 'space-between', // Распределить заголовок и подвал
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1, // Чтобы текст не наезжал на бейдж
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto', // Прижать к низу
  },
});