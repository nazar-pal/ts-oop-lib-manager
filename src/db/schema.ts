import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Authors table - stores information about book authors
export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  bio: text('bio'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
})

// Books table - stores information about books
export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  isbn: text('isbn').notNull().unique(),
  authorId: integer('author_id')
    .notNull()
    .references(() => authors.id, { onDelete: 'cascade' }),
  publishedYear: integer('published_year'),
  genre: text('genre'),
  available: integer('available', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
})

// Members table - stores information about library members
export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  membershipDate: integer('membership_date', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
})

// Loans table - tracks which books are borrowed by which members
export const loans = sqliteTable('loans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  memberId: integer('member_id')
    .notNull()
    .references(() => members.id, { onDelete: 'cascade' }),
  loanDate: integer('loan_date', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  returnDate: integer('return_date', { mode: 'timestamp' })
})

// Define relationships between tables
export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books)
}))

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id]
  }),
  loans: many(loans)
}))

export const membersRelations = relations(members, ({ many }) => ({
  loans: many(loans)
}))

export const loansRelations = relations(loans, ({ one }) => ({
  book: one(books, {
    fields: [loans.bookId],
    references: [books.id]
  }),
  member: one(members, {
    fields: [loans.memberId],
    references: [members.id]
  })
}))
