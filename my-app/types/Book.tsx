export type BookStatus = 'planned' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  
  // Дополнительные поля
  notes?: string;
  imageUri?: string;
  reminderTime?: string;
  createdAt?: number | string; // В базе это число (Date.now()), но иногда приводим к строке
  
  // Поля для прогресса (используются в BookCard)
  totalPages?: number;
  currentPage?: number;
  rating?: number;
  lastReadDate?: string;
}