/**
 * Library Management System - Main Entry Point
 *
 * This file demonstrates:
 * - Object-Oriented Programming concepts in TypeScript
 * - Class instantiation and usage
 * - Database operations with Drizzle ORM
 * - Service layer pattern
 * - Repository pattern
 * - Inheritance and Polymorphism
 */

import { EBook } from './models/Book'
import { Loan } from './models/Loan'
import { AuthorRepository } from './repositories/AuthorRepository'
import { BookRepository } from './repositories/BookRepository'
import { LoanRepository } from './repositories/LoanRepository'
import { MemberRepository } from './repositories/MemberRepository'
import { LibraryService } from './services/LibraryService'
import { LoanService } from './services/LoanService'

async function main() {
  // Create repositories (Data Access Layer)
  console.log('\n1️⃣ Creating Repositories...')
  const authorRepository = new AuthorRepository()
  const bookRepository = new BookRepository(authorRepository)
  const memberRepository = new MemberRepository()
  const loanRepository = new LoanRepository(bookRepository, memberRepository)

  // Create services (Business Logic Layer)
  console.log('2️⃣ Creating Services...')
  const libraryService = new LibraryService(
    authorRepository,
    bookRepository,
    memberRepository
  )
  const loanService = new LoanService(
    loanRepository,
    bookRepository,
    memberRepository
  )

  console.log('✅ System initialized\n')

  // ============================================
  // DEMONSTRATING OOP CONCEPTS
  // ============================================

  console.log('='.repeat(60))
  console.log('📖 DEMONSTRATING OBJECT-ORIENTED PROGRAMMING CONCEPTS')
  console.log('='.repeat(60))

  // 1. CLASS INSTANTIATION & ENCAPSULATION
  console.log('\n📌 Concept 1: Class Instantiation & Encapsulation')
  console.log('-'.repeat(60))
  console.log('Creating authors using the Author class...\n')

  const author1 = await libraryService.registerAuthor(
    'J.K.',
    'Rowling',
    'jk.rowling@example.com',
    'British author, best known for the Harry Potter series'
  )
  console.log(`✅ Created author: ${author1.getFullName()}`)
  console.log(`   ID: ${author1.id}, Email: ${author1.email}`)
  console.log(`   Has bio: ${author1.hasBio()}`)

  const author2 = await libraryService.registerAuthor(
    'George',
    'Orwell',
    'george.orwell@example.com',
    'English novelist and essayist, known for 1984 and Animal Farm'
  )
  console.log(`✅ Created author: ${author2.getFullName()}`)

  // 2. COMPOSITION (Book has an Author)
  console.log('\n📌 Concept 2: Composition')
  console.log('-'.repeat(60))
  console.log('Creating books - each book contains an Author object...\n')

  const author1Id = author1.id
  if (author1Id === null) {
    throw new Error('Author ID is required')
  }

  const book1 = await libraryService.addBook(
    "Harry Potter and the Philosopher's Stone",
    '978-0747532699',
    author1Id,
    1997,
    'Fantasy'
  )
  console.log(`✅ Created book: ${book1.title}`)
  console.log(
    `   Author: ${book1.author.getFullName()} (Composition: Book has Author)`
  )
  console.log(`   Available: ${book1.available}`)

  const author2Id = author2.id
  if (author2Id === null) {
    throw new Error('Author ID is required')
  }

  const book2 = await libraryService.addBook(
    '1984',
    '978-0451524935',
    author2Id,
    1949,
    'Dystopian Fiction'
  )
  console.log(`✅ Created book: ${book2.title}`)

  // 3. INHERITANCE & POLYMORPHISM
  console.log('\n📌 Concept 3: Inheritance & Polymorphism')
  console.log('-'.repeat(60))
  console.log('Creating an EBook (inherits from Book)...\n')

  // Create an ebook using the EBook class (inherits from Book)
  const ebook = new EBook(
    'Animal Farm',
    '978-0451526342',
    author2,
    2.5, // file size in MB
    'EPUB',
    1945,
    'Political Satire'
  )

  // Save ebook to database (it's still a Book, so we can use BookRepository)
  const savedEbook = await bookRepository.create(ebook)
  console.log(`✅ Created ebook: ${savedEbook.title}`)

  // Polymorphism: EBook overrides getInfo() method
  if (savedEbook instanceof EBook) {
    console.log(`   Info: ${savedEbook.getInfo()}`)
    console.log(
      `   Format: ${savedEbook.format}, Size: ${savedEbook.fileSize}MB`
    )
    console.log(`   Can download (<100MB): ${savedEbook.canDownload()}`)
  }

  // Compare with regular book's getInfo()
  console.log(`\n   Regular book info: ${book1.getInfo()}`)
  console.log(`   EBook info: ${savedEbook.getInfo()}`)
  console.log('   → Same method, different behavior (Polymorphism)')

  // 4. MEMBER MANAGEMENT
  console.log('\n📌 Concept 4: Member Class with Methods')
  console.log('-'.repeat(60))
  console.log('Creating library members...\n')

  const member1 = await libraryService.registerMember(
    'John',
    'Doe',
    'john.doe@example.com',
    '+1-555-0100'
  )
  console.log(`✅ Created member: ${member1.getFullName()}`)
  console.log(`   Membership duration: ${member1.getMembershipDuration()} days`)

  const member2 = await libraryService.registerMember(
    'Jane',
    'Smith',
    'jane.smith@example.com',
    '+1-555-0101'
  )
  console.log(`✅ Created member: ${member2.getFullName()}`)

  // 5. LOAN OPERATIONS & BUSINESS LOGIC
  console.log('\n📌 Concept 5: Loan Class & Business Logic')
  console.log('-'.repeat(60))
  console.log('Borrowing books...\n')

  const book1Id = book1.id
  const member1Id = member1.id
  if (book1Id === null || member1Id === null) {
    throw new Error('Book or Member ID is required')
  }

  const loan1 = await loanService.borrowBook(book1Id, member1Id)
  console.log(
    `✅ Loan created: ${loan1.book.title} → ${loan1.member.getFullName()}`
  )
  console.log(`   Loan date: ${loan1.loanDate.toLocaleDateString()}`)
  console.log(`   Due date: ${loan1.dueDate.toLocaleDateString()}`)
  console.log(`   Status: ${loan1.getStatus()}`)

  const book2Id = book2.id
  const member2Id = member2.id
  if (book2Id === null || member2Id === null) {
    throw new Error('Book or Member ID is required')
  }

  const loan2 = await loanService.borrowBook(book2Id, member2Id)
  console.log(
    `✅ Loan created: ${loan2.book.title} → ${loan2.member.getFullName()}`
  )

  // 6. STATIC PROPERTIES & METHODS
  console.log('\n📌 Concept 6: Static Properties')
  console.log('-'.repeat(60))
  console.log(
    `Loan duration (static property): ${Loan.LOAN_DURATION_DAYS} days`
  )
  console.log('   → Static properties are shared across all instances')

  // 7. GETTERS & SETTERS
  console.log('\n📌 Concept 7: Getters & Setters (Encapsulation)')
  console.log('-'.repeat(60))
  console.log(`Book availability (using getter): ${book1.available}`)

  // Try to borrow an already borrowed book (should fail)
  try {
    const book1Id = book1.id
    const member2Id = member2.id
    if (book1Id === null || member2Id === null) {
      throw new Error('Book or Member ID is required')
    }
    await loanService.borrowBook(book1Id, member2Id)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(`   ❌ Error (expected): ${message}`)
    console.log('   → Business logic prevents double-borrowing')
  }

  // 8. QUERYING DATA
  console.log('\n📌 Concept 8: Querying Data through Services')
  console.log('-'.repeat(60))

  const availableBooks = await libraryService.getAvailableBooks()
  console.log(`\n📚 Available books: ${availableBooks.length}`)
  availableBooks.forEach(book => {
    console.log(`   - ${book.title} by ${book.author.getFullName()}`)
  })

  const activeLoans = await loanService.getActiveLoans()
  console.log(`\n📖 Active loans: ${activeLoans.length}`)
  activeLoans.forEach(loan => {
    console.log(
      `   - ${
        loan.book.title
      } → ${loan.member.getFullName()} (${loan.getStatus()})`
    )
  })

  // 9. RETURNING BOOKS
  console.log('\n📌 Concept 9: Returning Books')
  console.log('-'.repeat(60))

  const loan1Id = loan1.id
  if (loan1Id === null) {
    throw new Error('Loan ID is required')
  }

  const returnedLoan = await loanService.returnBook(loan1Id)
  console.log(`✅ Book returned: ${returnedLoan.book.title}`)
  console.log(
    `   Return date: ${returnedLoan.returnDate?.toLocaleDateString()}`
  )
  console.log(`   Status: ${returnedLoan.getStatus()}`)

  // Check availability after return
  const book1IdForCheck = book1.id
  if (book1IdForCheck === null) {
    throw new Error('Book ID is required')
  }

  const updatedBook = await libraryService.getBookById(book1IdForCheck)
  console.log(`   Book now available: ${updatedBook?.available}`)

  // 10. OVERDUE CALCULATIONS
  console.log('\n📌 Concept 10: Business Logic Methods')
  console.log('-'.repeat(60))

  // Create a loan with past due date for demonstration
  // First, let's use the ebook which should still be available
  const pastDueDate = new Date()
  pastDueDate.setDate(pastDueDate.getDate() - 5) // 5 days ago

  const loanDate = new Date(pastDueDate.getTime() - 14 * 24 * 60 * 60 * 1000) // 14 days before due date

  const overdueLoan = new Loan(savedEbook, member1, loanDate, pastDueDate)

  // Mark book as borrowed and save
  overdueLoan.book.borrow()
  await bookRepository.update(overdueLoan.book)
  const savedOverdueLoan = await loanRepository.create(overdueLoan)

  console.log(`\n📅 Checking overdue loans...`)
  const overdueLoans = await loanService.getOverdueLoans()
  console.log(`   Found ${overdueLoans.length} overdue loan(s)`)

  overdueLoans.forEach(loan => {
    const fine = loan.calculateFine()
    console.log(`   - ${loan.book.title}: ${fine.toFixed(2)} fine`)
    console.log(`     Status: ${loan.getStatus()}`)
  })

  const totalFines = await loanService.calculateTotalFines()
  console.log(`\n💰 Total fines: $${totalFines.toFixed(2)}`)

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY OF OOP CONCEPTS DEMONSTRATED')
  console.log('='.repeat(60))
  console.log(`
✅ Classes & Constructors      - Created Author, Book, Member, Loan classes
✅ Encapsulation               - Private properties with getters/setters
✅ Inheritance                 - EBook extends Book
✅ Polymorphism                - Method overriding (getInfo())
✅ Composition                 - Book contains Author, Loan contains Book & Member
✅ Static Properties           - Loan.LOAN_DURATION_DAYS
✅ Instance Methods            - getFullName(), isOverdue(), etc.
✅ Abstraction                 - BaseRepository abstract class
✅ Repository Pattern          - Data access layer separation
✅ Service Pattern             - Business logic layer separation
✅ Dependency Injection        - Services receive repositories via constructor
✅ Database Integration        - SQLite with Drizzle ORM
  `)

  console.log('✅ Example completed successfully!\n')
}

// Run the example
main().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
