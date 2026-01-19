export type BookStatus = 'planned' | 'reading' | 'finished';

// structure of a book object
export interface Book {
  id: string; // unique id
  title: string; // book title
  author: string; // book author
  status: BookStatus; // current status
  reminderTime?: string; // optional reminder time
  createdAt: string; // creation date
}