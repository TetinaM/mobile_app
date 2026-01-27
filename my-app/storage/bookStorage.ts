import * as SQLite from 'expo-sqlite';
import { Book } from '../types/Book';

const DB_NAME = 'library_v5.db';
let dbInstance: SQLite.SQLiteDatabase | null = null;

// Get or create database instance
const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) return dbInstance;
  
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  await dbInstance.execAsync('PRAGMA journal_mode = WAL;');
  
  return dbInstance;
};

// 1. Initialize Database
export const initDatabase = async () => {
  try {
    const db = await getDatabase();

    // Create table with imageUri support
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        status TEXT DEFAULT 'planned',
        reminderTime TEXT,
        notes TEXT,
        createdAt INTEGER,
        imageUri TEXT
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// 2. Get all books
export const getBooks = async (): Promise<Book[]> => {
  try {
    const db = await getDatabase();
    const allRows = await db.getAllAsync('SELECT * FROM books ORDER BY id DESC');
    return allRows.map((row: any) => ({ ...row, id: row.id.toString() }));
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
};

// 3. Add a book
export const addBook = async (book: Omit<Book, 'id'>) => {
  try {
    const db = await getDatabase();
    const result = await db.runAsync(
      'INSERT INTO books (title, author, notes, status, reminderTime, createdAt, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?)',
      book.title,
      book.author,
      book.notes ?? '',
      book.status,
      book.reminderTime ?? null,
      Date.now(),
      book.imageUri ?? null
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// 4. Delete a book
export const deleteBook = async (id: string | number) => {
  try {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM books WHERE id = ?', Number(id));
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

// 5. Get book by ID
export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const db = await getDatabase();
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

// 6. Update a book
export const updateBook = async (book: Book) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE books SET title = ?, author = ?, status = ?, reminderTime = ?, notes = ?, imageUri = ? WHERE id = ?',
      book.title, 
      book.author, 
      book.status, 
      book.reminderTime ?? null, 
      book.notes ?? '',
      book.imageUri ?? null,
      Number(book.id)
    );
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};