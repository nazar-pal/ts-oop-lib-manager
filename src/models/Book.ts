import { type BookRow } from '../db/types'
import { Author } from './Author'

/**
 * Book Domain Model - Base Class
 * Demonstrates: Classes, Encapsulation, Composition (has an Author)
 */
export class Book {
  protected _id: number | null
  protected _title: string
  protected _isbn: string
  protected _author: Author // Composition: Book has an Author
  protected _publishedYear: number | null
  protected _genre: string | null
  protected _available: boolean
  protected _createdAt: Date

  constructor(
    title: string,
    isbn: string,
    author: Author,
    publishedYear: number | null = null,
    genre: string | null = null,
    id: number | null = null,
    available: boolean = true,
    createdAt: Date | null = null
  ) {
    this._id = id
    this._title = title
    this._isbn = isbn
    this._author = author // Composition relationship
    this._publishedYear = publishedYear
    this._genre = genre
    this._available = available
    this._createdAt = createdAt || new Date()
  }

  // Getters
  get id(): number | null {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get isbn(): string {
    return this._isbn
  }

  get author(): Author {
    return this._author // Returns the composed Author object
  }

  get publishedYear(): number | null {
    return this._publishedYear
  }

  get genre(): string | null {
    return this._genre
  }

  get available(): boolean {
    return this._available
  }

  get createdAt(): Date {
    return this._createdAt
  }

  // Setters
  set title(value: string) {
    if (value.trim().length === 0) {
      throw new Error('Title cannot be empty')
    }
    this._title = value
  }

  set isbn(value: string) {
    // Basic ISBN validation
    if (value.trim().length < 10) {
      throw new Error('ISBN must be at least 10 characters')
    }
    this._isbn = value
  }

  set available(value: boolean) {
    this._available = value
  }

  // Instance methods
  /**
   * Marks the book as borrowed
   */
  borrow(): void {
    if (!this._available) {
      throw new Error('Book is not available for borrowing')
    }
    this._available = false
  }

  /**
   * Marks the book as returned
   */
  return(): void {
    this._available = true
  }

  /**
   * Gets book information as a formatted string
   * This method can be overridden in subclasses (Polymorphism)
   */
  getInfo(): string {
    return `${this._title} by ${this._author.getFullName()} (${
      this._publishedYear || 'Unknown year'
    })`
  }

  // Static method
  static fromDatabaseRow(row: BookRow, author: Author): Book {
    return new Book(
      row.title,
      row.isbn,
      author,
      row.publishedYear,
      row.genre,
      row.id,
      row.available,
      row.createdAt
    )
  }

  toDatabaseRow(): Omit<BookRow, 'id'> {
    const authorId = this._author.id
    if (authorId === null) {
      throw new Error('Author must be saved to database before creating book')
    }
    return {
      title: this._title,
      isbn: this._isbn,
      authorId,
      publishedYear: this._publishedYear,
      genre: this._genre,
      available: this._available,
      createdAt: this._createdAt
    }
  }
}

/**
 * EBook - Inherits from Book
 * Demonstrates: Inheritance, Method Overriding (Polymorphism)
 */
export class EBook extends Book {
  private _fileSize: number // in MB
  private _format: string // PDF, EPUB, etc.

  constructor(
    title: string,
    isbn: string,
    author: Author,
    fileSize: number,
    format: string,
    publishedYear: number | null = null,
    genre: string | null = null,
    id: number | null = null,
    available: boolean = true,
    createdAt: Date | null = null
  ) {
    // Call parent constructor using super()
    super(title, isbn, author, publishedYear, genre, id, available, createdAt)
    this._fileSize = fileSize
    this._format = format
  }

  // Additional getters for EBook-specific properties
  get fileSize(): number {
    return this._fileSize
  }

  get format(): string {
    return this._format
  }

  // Method Overriding - Polymorphism
  // This method overrides the parent class's getInfo() method
  override getInfo(): string {
    return `${super.getInfo()} [E-Book: ${this._format}, ${this._fileSize}MB]`
  }

  // EBook-specific method
  /**
   * Checks if the ebook can be downloaded based on file size
   * @param maxSize Maximum file size in MB
   * @returns True if file size is acceptable
   */
  canDownload(maxSize: number = 100): boolean {
    return this._fileSize <= maxSize
  }
}
