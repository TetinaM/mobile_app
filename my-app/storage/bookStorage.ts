import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/Book';

const STORAGE_KEY = 'books'; // key for AsyncStorage

// get all books from storage
export const getBooks = async (): Promise<Book[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY); // read data from storage
    if (!json) return []; // if no data, return empty array
    return JSON.parse(json) as Book[]; // parse json to Book array
  } catch (error) {
    console.error('Error reading books from storage:', error); // log error
    return []; // return empty array on error
  }
};

// get a single book by id
export const getBookById = async (id: string): Promise<Book | null> => {
  const books = await getBooks(); // get all books
  return books.find((b) => b.id === id) || null; // find book by id or return null
};

// add a new book to storage
export const addBook = async (book: Book): Promise<void> => {
  const books = await getBooks(); // get current books
  books.push(book); // add new book
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)); // save updated array
};

// update an existing book
export const updateBook = async (updatedBook: Book): Promise<void> => {
  const books = await getBooks(); // get current books
  const index = books.findIndex((b) => b.id === updatedBook.id); // find index of book
  if (index === -1) return; // if book not found, do nothing
  books[index] = updatedBook; // replace book
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)); // save updated array
};

// delete a book by id
export const deleteBook = async (id: string): Promise<void> => {
  const books = (await getBooks()).filter((b) => b.id !== id); // remove book with matching id
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)); // save updated array
};