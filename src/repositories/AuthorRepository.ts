import { eq } from 'drizzle-orm'
import { authors } from '../db/schema'
import { type AuthorRow } from '../db/types'
import { Author } from '../models/Author'
import { BaseRepository } from './BaseRepository'
import { getFirstOrThrow, requireId } from './utils'

/**
 * Author Repository
 * Demonstrates: Inheritance, Single Responsibility Principle
 *
 * This class is responsible ONLY for Author database operations
 * It inherits from BaseRepository and implements specific methods
 */
export class AuthorRepository extends BaseRepository<Author, AuthorRow> {
  /**
   * Converts database row to Author entity
   * Implements abstract method from BaseRepository
   */
  protected rowToEntity(row: AuthorRow): Author {
    return Author.fromDatabaseRow(row)
  }

  /**
   * Finds an author by ID
   */
  async findById(id: number): Promise<Author | null> {
    const [row] = await this.db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1)
    if (!row) {
      return null
    }

    return this.rowToEntity(row)
  }

  /**
   * Finds all authors
   */
  async findAll(): Promise<Author[]> {
    const results = await this.db.select().from(authors)
    return results.map(row => this.rowToEntity(row))
  }

  /**
   * Finds an author by email
   * @param email Author's email
   * @returns Author or null if not found
   */
  async findByEmail(email: string): Promise<Author | null> {
    const [row] = await this.db
      .select()
      .from(authors)
      .where(eq(authors.email, email))
      .limit(1)
    if (!row) {
      return null
    }

    return this.rowToEntity(row)
  }

  /**
   * Creates a new author in the database
   * @param author Author entity
   * @returns Created author with ID
   */
  async create(author: Author): Promise<Author> {
    const row = author.toDatabaseRow()
    const result = await this.db.insert(authors).values(row).returning()
    const created = getFirstOrThrow(result, 'Failed to create author')
    return this.rowToEntity(created)
  }

  /**
   * Updates an existing author
   * @param author Author entity with updated data
   * @returns Updated author
   */
  async update(author: Author): Promise<Author> {
    const authorId = requireId(author, 'Cannot update author without ID')
    const row = author.toDatabaseRow()
    const result = await this.db
      .update(authors)
      .set(row)
      .where(eq(authors.id, authorId))
      .returning()
    const updated = getFirstOrThrow(result, 'Author not found')
    return this.rowToEntity(updated)
  }

  /**
   * Deletes an author by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(authors)
      .where(eq(authors.id, id))
      .returning()
    return result.length > 0
  }
}
