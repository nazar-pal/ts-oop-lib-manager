/**
 * Repository utility functions to reduce boilerplate
 */

/**
 * Safely gets the first element from an array or throws an error
 */
export function getFirstOrThrow<T>(
  array: T[],
  errorMessage: string
): T {
  const first = array[0]
  if (first === undefined) {
    throw new Error(errorMessage)
  }
  return first
}

/**
 * Validates that an entity has an ID, throwing an error if not
 */
export function requireId<T extends { id: number | null }>(
  entity: T,
  errorMessage: string
): number {
  const id = entity.id
  if (id === null) {
    throw new Error(errorMessage)
  }
  return id
}

