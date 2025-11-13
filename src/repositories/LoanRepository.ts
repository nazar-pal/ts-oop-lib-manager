import { eq, isNull } from 'drizzle-orm'
import { db } from '../db'
import { loans } from '../db/schema'
import { type LoanRow } from '../db/types'
import { Loan } from '../models/Loan'
import { BookRepository } from './BookRepository'
import { MemberRepository } from './MemberRepository'
import { getFirstOrThrow, requireId } from './utils'

/**
 * Loan Repository
 * Demonstrates: Complex queries, Multiple dependencies
 */
export class LoanRepository {
  private db = db
  private bookRepository: BookRepository
  private memberRepository: MemberRepository

  constructor(
    bookRepository: BookRepository,
    memberRepository: MemberRepository
  ) {
    this.bookRepository = bookRepository
    this.memberRepository = memberRepository
  }

  /**
   * Helper method to convert loan row to Loan entity
   */
  private async rowToLoan(loanRow: LoanRow): Promise<Loan | null> {
    const book = await this.bookRepository.findById(loanRow.bookId)
    const member = await this.memberRepository.findById(loanRow.memberId)

    if (!book || !member || loanRow.id === null) {
      return null
    }

    return Loan.fromDatabaseRow(loanRow, book, member)
  }

  /**
   * Helper to convert multiple rows to Loan entities
   */
  private async rowsToLoans(loanRows: LoanRow[]): Promise<Loan[]> {
    const loans = await Promise.all(loanRows.map(row => this.rowToLoan(row)))
    return loans.filter((loan): loan is Loan => loan !== null)
  }

  /**
   * Finds a loan by ID with book and member information
   */
  async findById(id: number): Promise<Loan | null> {
    const [loanRow] = await this.db
      .select()
      .from(loans)
      .where(eq(loans.id, id))
      .limit(1)

    if (!loanRow) {
      return null
    }

    const loan = await this.rowToLoan(loanRow)
    if (!loan) {
      throw new Error('Book or Member not found for loan')
    }
    return loan
  }

  /**
   * Finds all loans
   */
  async findAll(): Promise<Loan[]> {
    const loanRows = await this.db.select().from(loans)
    return this.rowsToLoans(loanRows)
  }

  /**
   * Finds active loans (not returned)
   */
  async findActive(): Promise<Loan[]> {
    const loanRows = await this.db
      .select()
      .from(loans)
      .where(isNull(loans.returnDate))
    return this.rowsToLoans(loanRows)
  }

  /**
   * Finds loans by member ID
   */
  async findByMemberId(memberId: number): Promise<Loan[]> {
    const loanRows = await this.db
      .select()
      .from(loans)
      .where(eq(loans.memberId, memberId))

    const member = await this.memberRepository.findById(memberId)
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`)
    }

    return this.rowsToLoans(loanRows)
  }

  /**
   * Creates a new loan
   */
  async create(loan: Loan): Promise<Loan> {
    const row = loan.toDatabaseRow()
    const result = await this.db.insert(loans).values(row).returning()
    const created = getFirstOrThrow(result, 'Failed to create loan')
    const createdLoan = await this.rowToLoan(created)
    if (!createdLoan) {
      throw new Error('Failed to create loan')
    }
    return createdLoan
  }

  /**
   * Updates a loan (e.g., when returning a book)
   */
  async update(loan: Loan): Promise<Loan> {
    const loanId = requireId(loan, 'Cannot update loan without ID')
    const row = loan.toDatabaseRow()
    const result = await this.db
      .update(loans)
      .set(row)
      .where(eq(loans.id, loanId))
      .returning()
    const updated = getFirstOrThrow(result, 'Loan not found')
    const updatedLoan = await this.rowToLoan(updated)
    if (!updatedLoan) {
      throw new Error('Failed to update loan')
    }
    return updatedLoan
  }

  /**
   * Deletes a loan
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(loans)
      .where(eq(loans.id, id))
      .returning()
    return result.length > 0
  }
}
