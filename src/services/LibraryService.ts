import { Author } from '../models/Author'
import { Book } from '../models/Book'
import { Member } from '../models/Member'
import { AuthorRepository } from '../repositories/AuthorRepository'
import { BookRepository } from '../repositories/BookRepository'
import { MemberRepository } from '../repositories/MemberRepository'

/**
 * Library Service
 * Demonstrates: Service Layer Pattern, Business Logic Encapsulation
 *
 * This class contains business logic that coordinates between
 * multiple repositories and enforces business rules
 */
export class LibraryService {
  private authorRepository: AuthorRepository
  private bookRepository: BookRepository
  private memberRepository: MemberRepository

  constructor(
    authorRepository: AuthorRepository,
    bookRepository: BookRepository,
    memberRepository: MemberRepository
  ) {
    // Dependency Injection: Services receive repositories through constructor
    this.authorRepository = authorRepository
    this.bookRepository = bookRepository
    this.memberRepository = memberRepository
  }

  /**
   * Registers a new author
   * Business logic: Check if author with email already exists
   */
  async registerAuthor(
    firstName: string,
    lastName: string,
    email: string,
    bio: string | null = null
  ): Promise<Author> {
    // Business rule: Email must be unique
    const existingAuthor = await this.authorRepository.findByEmail(email)
    if (existingAuthor) {
      throw new Error(`Author with email ${email} already exists`)
    }

    const author = new Author(firstName, lastName, email, bio)
    return await this.authorRepository.create(author)
  }

  /**
   * Adds a new book to the library
   * Business logic: Author must exist, ISBN must be unique
   */
  async addBook(
    title: string,
    isbn: string,
    authorId: number,
    publishedYear: number | null = null,
    genre: string | null = null
  ): Promise<Book> {
    // Business rule: Author must exist
    const author = await this.authorRepository.findById(authorId)
    if (!author) {
      throw new Error(`Author with ID ${authorId} not found`)
    }

    // Business rule: ISBN should be unique (handled by database constraint)
    const book = new Book(title, isbn, author, publishedYear, genre)
    return await this.bookRepository.create(book)
  }

  /**
   * Registers a new library member
   * Business logic: Email must be unique
   */
  async registerMember(
    firstName: string,
    lastName: string,
    email: string,
    phone: string | null = null
  ): Promise<Member> {
    // Business rule: Email must be unique
    const existingMember = await this.memberRepository.findByEmail(email)
    if (existingMember) {
      throw new Error(`Member with email ${email} already exists`)
    }

    const member = new Member(firstName, lastName, email, phone)
    return await this.memberRepository.create(member)
  }

  /**
   * Gets all available books
   */
  async getAvailableBooks(): Promise<Book[]> {
    return await this.bookRepository.findAvailable()
  }

  /**
   * Gets all books by a specific author
   */
  async getBooksByAuthor(authorId: number): Promise<Book[]> {
    const author = await this.authorRepository.findById(authorId)
    if (!author) {
      throw new Error(`Author with ID ${authorId} not found`)
    }

    return await this.bookRepository.findByAuthorId(authorId)
  }

  /**
   * Gets all authors
   */
  async getAllAuthors(): Promise<Author[]> {
    return await this.authorRepository.findAll()
  }

  /**
   * Gets all members
   */
  async getAllMembers(): Promise<Member[]> {
    return await this.memberRepository.findAll()
  }

  /**
   * Gets a book by ID
   */
  async getBookById(id: number): Promise<Book | null> {
    return await this.bookRepository.findById(id)
  }

  /**
   * Gets an author by ID
   */
  async getAuthorById(id: number): Promise<Author | null> {
    return await this.authorRepository.findById(id)
  }

  /**
   * Gets a member by ID
   */
  async getMemberById(id: number): Promise<Member | null> {
    return await this.memberRepository.findById(id)
  }
}
