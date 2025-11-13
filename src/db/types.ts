import { type InferSelectModel } from 'drizzle-orm'
import { authors, books, loans, members } from './schema'

export type AuthorRow = InferSelectModel<typeof authors>
export type BookRow = InferSelectModel<typeof books>
export type MemberRow = InferSelectModel<typeof members>
export type LoanRow = InferSelectModel<typeof loans>
