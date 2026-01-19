import * as SQLite from 'expo-sqlite';
import { Book } from '../types/Book';

const DB_NAME = 'library_v5.db';

// 1. Инициализация Базы Данных
export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync('PRAGMA journal_mode = WAL;');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        status TEXT DEFAULT 'planned',
        reminderTime TEXT,
        notes TEXT,
        createdAt INTEGER
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// 2. Получить все книги
export const getBooks = async (): Promise<Book[]> => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const allRows = await db.getAllAsync('SELECT * FROM books ORDER BY id DESC');
    return allRows.map((row: any) => ({ ...row, id: row.id.toString() }));
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
};

// 3. Добавить книгу (ИСПРАВЛЕНО: теперь принимает status)
export const addBook = async (
  title: string, 
  author: string, 
  status: string, // <--- Добавлен аргумент status
  notes: string = '', 
  reminderTime?: string
) => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await db.runAsync(
      // Теперь используем переданный status (4-й вопросительный знак)
      'INSERT INTO books (title, author, notes, status, reminderTime, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      title, author, notes, status, reminderTime ?? null, Date.now()
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// 4. Удалить книгу
export const deleteBook = async (id: string | number) => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.runAsync('DELETE FROM books WHERE id = ?', Number(id));
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

// 5. Получить книгу по ID
export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await db.getFirstAsync<any>(
      'SELECT * FROM books WHERE id = ?', 
      Number(id)
    );
    if (!result) return null;
    return { ...result, id: result.id.toString() };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// 6. Обновить книгу
export const updateBook = async (book: Book) => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.runAsync(
      'UPDATE books SET title = ?, author = ?, status = ?, reminderTime = ? WHERE id = ?',
      book.title, 
      book.author, 
      book.status, 
      book.reminderTime ?? null, 
      Number(book.id)
    );
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};