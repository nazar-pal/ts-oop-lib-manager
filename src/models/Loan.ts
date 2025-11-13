import { type LoanRow } from '../db/types'
import { Book } from './Book'
import { Member } from './Member'

/**
 * Loan Domain Model
 * Demonstrates: Classes, Composition (has Book and Member), Business Logic
 */
export class Loan {
  private _id: number | null
  private _book: Book // Composition: Loan has a Book
  private _member: Member // Composition: Loan has a Member
  private _loanDate: Date
  private _dueDate: Date
  private _returnDate: Date | null

  // Static constant - shared across all instances
  static readonly LOAN_DURATION_DAYS = 14

  constructor(
    book: Book,
    member: Member,
    loanDate: Date | null = null,
    dueDate: Date | null = null,
    returnDate: Date | null = null,
    id: number | null = null
  ) {
    this._id = id
    this._book = book
    this._member = member
    this._loanDate = loanDate || new Date()

    // Calculate due date if not provided (default: 14 days from loan date)
    if (dueDate) {
      this._dueDate = dueDate
    } else {
      this._dueDate = new Date(this._loanDate)
      this._dueDate.setDate(this._dueDate.getDate() + Loan.LOAN_DURATION_DAYS)
    }

    this._returnDate = returnDate
  }

  // Getters
  get id(): number | null {
    return this._id
  }

  get book(): Book {
    return this._book
  }

  get member(): Member {
    return this._member
  }

  get loanDate(): Date {
    return this._loanDate
  }

  get dueDate(): Date {
    return this._dueDate
  }

  get returnDate(): Date | null {
    return this._returnDate
  }

  // Instance methods
  /**
   * Checks if the loan is overdue
   * @returns True if the book is overdue
   */
  isOverdue(): boolean {
    if (this._returnDate) {
      return false // Already returned
    }
    return new Date() > this._dueDate
  }

  /**
   * Returns the book and marks the loan as complete
   */
  returnBook(): void {
    if (this._returnDate) {
      throw new Error('Book has already been returned')
    }
    this._returnDate = new Date()
    this._book.return() // Update book availability
  }

  /**
   * Calculates the fine if the book is overdue
   * @param dailyFine Amount charged per day overdue
   * @returns Fine amount (0 if not overdue)
   */
  calculateFine(dailyFine: number = 0.5): number {
    if (!this.isOverdue()) {
      return 0
    }
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - this._dueDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * dailyFine
  }

  /**
   * Gets loan status as a string
   * @returns Status string
   */
  getStatus(): string {
    if (this._returnDate) {
      return 'Returned'
    }
    if (this.isOverdue()) {
      return `Overdue (${this.calculateFine().toFixed(2)} fine)`
    }
    return 'Active'
  }

  // Static method
  static fromDatabaseRow(row: LoanRow, book: Book, member: Member): Loan {
    return new Loan(
      book,
      member,
      row.loanDate,
      row.dueDate,
      row.returnDate,
      row.id
    )
  }

  toDatabaseRow(): Omit<LoanRow, 'id'> {
    const bookId = this._book.id
    const memberId = this._member.id
    if (bookId === null || memberId === null) {
      throw new Error(
        'Book and Member must be saved to database before creating loan'
      )
    }
    return {
      bookId,
      memberId,
      loanDate: this._loanDate,
      dueDate: this._dueDate,
      returnDate: this._returnDate
    }
  }
}
