import { eq } from 'drizzle-orm'
import { books } from '../db/schema'
import { type BookRow } from '../db/types'
import { Author } from '../models/Author'
import { Book } from '../models/Book'
import { AuthorRepository } from './AuthorRepository'
import { BaseRepository } from './BaseRepository'
import { getFirstOrThrow, requireId } from './utils'

/**
 * Book Repository
 * Demonstrates: Dependency Injection, Composition
 *
 * This repository needs AuthorRepository to load author data
 * when fetching books (since books reference authors)
 */
export class BookRepository extends BaseRepository<Book, BookRow> {
  private authorRepository: AuthorRepository

  constructor(authorRepository: AuthorRepository) {
    super()
    // Dependency Injection: We inject AuthorRepository instead of creating it
    // This makes the code more testable and follows Dependency Inversion Principle
    this.authorRepository = authorRepository
  }

  protected rowToEntity(row: BookRow): Book {
    // This method is not used directly because we need to load the author
    // See findById and findAll for proper implementation
    throw new Error('Use findById or findAll instead')
  }

  /**
   * Finds a book by ID, including author information
   */
  async findById(id: number): Promise<Book | null> {
    const [bookRow] = await this.db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1)
    if (!bookRow) {
      return null
    }
    const author = await this.authorRepository.findById(bookRow.authorId)

    if (!author) {
      throw new Error(`Author with ID ${bookRow.authorId} not found`)
    }

    return Book.fromDatabaseRow(bookRow, author)
  }

  /**
   * Finds all books with their authors
   */
  async findAll(): Promise<Book[]> {
    const bookRows = await this.db.select().from(books)
    return this.hydrateBooksWithAuthors(bookRows)
  }

  /**
   * Finds books by author ID
   */
  async findByAuthorId(authorId: number): Promise<Book[]> {
    const bookRows = await this.db
      .select()
      .from(books)
      .where(eq(books.authorId, authorId))

    const author = await this.authorRepository.findById(authorId)
    if (!author) {
      throw new Error(`Author with ID ${authorId} not found`)
    }

    return bookRows.map(bookRow => Book.fromDatabaseRow(bookRow, author))
  }

  /**
   * Finds available books
   */
  async findAvailable(): Promise<Book[]> {
    const bookRows = await this.db
      .select()
      .from(books)
      .where(eq(books.available, true))
    return this.hydrateBooksWithAuthors(bookRows)
  }

  /**
   * Creates a new book
   */
  async create(book: Book): Promise<Book> {
    const row = book.toDatabaseRow()
    const result = await this.db.insert(books).values(row).returning()
    const created = getFirstOrThrow(result, 'Failed to create book')
    const author = await this.authorRepository.findById(created.authorId)
    if (!author) {
      throw new Error(`Author with ID ${created.authorId} not found`)
    }

    return Book.fromDatabaseRow(created, author)
  }

  /**
   * Updates a book
   */
  async update(book: Book): Promise<Book> {
    const bookId = requireId(book, 'Cannot update book without ID')
    const row = book.toDatabaseRow()
    const result = await this.db
      .update(books)
      .set(row)
      .where(eq(books.id, bookId))
      .returning()
    const updated = getFirstOrThrow(result, 'Book not found')
    const author = await this.authorRepository.findById(updated.authorId)
    if (!author) {
      throw new Error(`Author with ID ${updated.authorId} not found`)
    }

    return Book.fromDatabaseRow(updated, author)
  }

  /**
   * Deletes a book by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(books)
      .where(eq(books.id, id))
      .returning()
    return result.length > 0
  }

  /**
   * Helper to hydrate book rows with their authors efficiently
   */
  private async hydrateBooksWithAuthors(bookRows: BookRow[]): Promise<Book[]> {
    const authorIds = new Set(bookRows.map(b => b.authorId))
    const authorsMap = new Map<number, Author>()
    for (const authorId of authorIds) {
      const author = await this.authorRepository.findById(authorId)
      if (author) {
        authorsMap.set(authorId, author)
      }
    }
    const booksWithAuthors: Book[] = []
    for (const bookRow of bookRows) {
      const author = authorsMap.get(bookRow.authorId)
      if (author) {
        booksWithAuthors.push(Book.fromDatabaseRow(bookRow, author))
      }
    }
    return booksWithAuthors
  }
}
