import { type AuthorRow } from '../db/types'

/**
 * Author Domain Model
 * Demonstrates: Classes, Encapsulation, Getters/Setters
 */
export class Author {
  // Private properties - Encapsulation: data is protected from direct access
  private _id: number | null
  private _firstName: string
  private _lastName: string
  private _email: string
  private _bio: string | null
  private _createdAt: Date

  /**
   * Constructor - Creates a new Author instance
   * @param firstName Author's first name
   * @param lastName Author's last name
   * @param email Author's email (must be unique)
   * @param bio Optional biography
   * @param id Optional ID (for existing authors from database)
   * @param createdAt Optional creation date
   */
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    bio: string | null = null,
    id: number | null = null,
    createdAt: Date | null = null
  ) {
    this._id = id
    this._firstName = firstName
    this._lastName = lastName
    this._email = email
    this._bio = bio
    this._createdAt = createdAt || new Date()
  }

  // Getters - Controlled access to private properties
  get id(): number | null {
    return this._id
  }

  get firstName(): string {
    return this._firstName
  }

  get lastName(): string {
    return this._lastName
  }

  get email(): string {
    return this._email
  }

  get bio(): string | null {
    return this._bio
  }

  get createdAt(): Date {
    return this._createdAt
  }

  // Setters - Controlled modification of private properties
  set firstName(value: string) {
    if (value.trim().length === 0) {
      throw new Error('First name cannot be empty')
    }
    this._firstName = value
  }

  set lastName(value: string) {
    if (value.trim().length === 0) {
      throw new Error('Last name cannot be empty')
    }
    this._lastName = value
  }

  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('Invalid email format')
    }
    this._email = value
  }

  set bio(value: string | null) {
    this._bio = value
  }

  // Instance methods
  /**
   * Gets the full name of the author
   * @returns Full name string
   */
  getFullName(): string {
    return `${this._firstName} ${this._lastName}`
  }

  /**
   * Checks if the author has a biography
   * @returns True if bio exists
   */
  hasBio(): boolean {
    return this._bio !== null && this._bio.trim().length > 0
  }

  // Static method - Can be called on the class itself, not an instance
  /**
   * Creates an Author from a database row
   * @param row Database row object
   * @returns Author instance
   */
  static fromDatabaseRow(row: AuthorRow): Author {
    return new Author(
      row.firstName,
      row.lastName,
      row.email,
      row.bio,
      row.id,
      row.createdAt
    )
  }

  /**
   * Converts the author to a plain object for database insertion
   * Uses camelCase to match Drizzle schema property names
   * @returns Plain object
   */
  toDatabaseRow(): Omit<AuthorRow, 'id'> {
    return {
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      bio: this._bio,
      createdAt: this._createdAt
    }
  }
}
