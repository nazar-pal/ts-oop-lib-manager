import { db } from '../db'

/**
 * Base Repository - Abstract Class
 * Demonstrates: Abstraction, Template Method Pattern
 *
 * This abstract class provides common database operations
 * that can be shared across all repositories
 */
export abstract class BaseRepository<T, TRow = unknown> {
  protected db = db

  /**
   * Abstract method - must be implemented by subclasses
   * This enforces that each repository defines how to convert
   * database rows to domain objects
   */
  protected abstract rowToEntity(row: TRow): T

  /**
   * Finds an entity by ID
   * @param id Entity ID
   * @returns Entity or null if not found
   */
  abstract findById(id: number): Promise<T | null>

  /**
   * Finds all entities
   * @returns Array of entities
   */
  abstract findAll(): Promise<T[]>

  /**
   * Deletes an entity by ID
   * @param id Entity ID
   * @returns True if deleted, false if not found
   */
  abstract delete(id: number): Promise<boolean>
}
