import { type MemberRow } from '../db/types'

/**
 * Member Domain Model
 * Demonstrates: Classes, Encapsulation, Validation
 */
export class Member {
  private _id: number | null
  private _firstName: string
  private _lastName: string
  private _email: string
  private _phone: string | null
  private _membershipDate: Date

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string | null = null,
    id: number | null = null,
    membershipDate: Date | null = null
  ) {
    this._id = id
    this._firstName = firstName
    this._lastName = lastName
    this._email = email
    this._phone = phone
    this._membershipDate = membershipDate || new Date()
  }

  // Getters
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

  get phone(): string | null {
    return this._phone
  }

  get membershipDate(): Date {
    return this._membershipDate
  }

  // Setters with validation
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

  // Instance methods
  getFullName(): string {
    return `${this._firstName} ${this._lastName}`
  }

  /**
   * Calculates how long the member has been a member
   * @returns Number of days since membership
   */
  getMembershipDuration(): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - this._membershipDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Static method
  static fromDatabaseRow(row: MemberRow): Member {
    return new Member(
      row.firstName,
      row.lastName,
      row.email,
      row.phone,
      row.id,
      row.membershipDate
    )
  }

  toDatabaseRow(): Omit<MemberRow, 'id'> {
    return {
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      phone: this._phone,
      membershipDate: this._membershipDate
    }
  }
}
