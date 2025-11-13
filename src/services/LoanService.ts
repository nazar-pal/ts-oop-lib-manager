import { Loan } from '../models/Loan'
import { BookRepository } from '../repositories/BookRepository'
import { LoanRepository } from '../repositories/LoanRepository'
import { MemberRepository } from '../repositories/MemberRepository'

/**
 * Loan Service
 * Demonstrates: Complex Business Logic, Transaction-like Operations
 *
 * This service handles loan operations and enforces business rules
 * like checking book availability, managing due dates, etc.
 */
export class LoanService {
  private loanRepository: LoanRepository
  private bookRepository: BookRepository
  private memberRepository: MemberRepository

  constructor(
    loanRepository: LoanRepository,
    bookRepository: BookRepository,
    memberRepository: MemberRepository
  ) {
    this.loanRepository = loanRepository
    this.bookRepository = bookRepository
    this.memberRepository = memberRepository
  }

  /**
   * Borrows a book
   * Business logic: Book must be available, member must exist
   */
  async borrowBook(bookId: number, memberId: number): Promise<Loan> {
    // Business rule: Book must exist
    const book = await this.bookRepository.findById(bookId)
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`)
    }

    // Business rule: Book must be available
    if (!book.available) {
      throw new Error('Book is not available for borrowing')
    }

    // Business rule: Member must exist
    const member = await this.memberRepository.findById(memberId)
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`)
    }

    // Create loan
    const loan = new Loan(book, member)

    // Update book availability
    book.borrow()
    await this.bookRepository.update(book)

    // Save loan to database
    return await this.loanRepository.create(loan)
  }

  /**
   * Returns a borrowed book
   * Business logic: Loan must exist and be active
   */
  async returnBook(loanId: number): Promise<Loan> {
    // Business rule: Loan must exist
    const loan = await this.loanRepository.findById(loanId)
    if (!loan) {
      throw new Error(`Loan with ID ${loanId} not found`)
    }

    // Business rule: Book must not already be returned
    if (loan.returnDate) {
      throw new Error('Book has already been returned')
    }

    // Return the book
    loan.returnBook()

    // Update book availability
    await this.bookRepository.update(loan.book)

    // Update loan in database
    return await this.loanRepository.update(loan)
  }

  /**
   * Gets all active loans
   */
  async getActiveLoans(): Promise<Loan[]> {
    return await this.loanRepository.findActive()
  }

  /**
   * Gets all loans for a specific member
   */
  async getMemberLoans(memberId: number): Promise<Loan[]> {
    const member = await this.memberRepository.findById(memberId)
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`)
    }

    return await this.loanRepository.findByMemberId(memberId)
  }

  /**
   * Gets overdue loans
   */
  async getOverdueLoans(): Promise<Loan[]> {
    const activeLoans = await this.loanRepository.findActive()
    return activeLoans.filter(loan => loan.isOverdue())
  }

  /**
   * Calculates total fines for overdue books
   */
  async calculateTotalFines(dailyFine: number = 0.5): Promise<number> {
    const overdueLoans = await this.getOverdueLoans()
    return overdueLoans.reduce(
      (total, loan) => total + loan.calculateFine(dailyFine),
      0
    )
  }

  /**
   * Gets loan by ID
   */
  async getLoanById(id: number): Promise<Loan | null> {
    return await this.loanRepository.findById(id)
  }
}
