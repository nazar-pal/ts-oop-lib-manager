import { eq } from 'drizzle-orm'
import { members } from '../db/schema'
import { type MemberRow } from '../db/types'
import { Member } from '../models/Member'
import { BaseRepository } from './BaseRepository'
import { getFirstOrThrow, requireId } from './utils'

/**
 * Member Repository
 * Demonstrates: Repository Pattern implementation
 */
export class MemberRepository extends BaseRepository<Member, MemberRow> {
  protected rowToEntity(row: MemberRow): Member {
    return Member.fromDatabaseRow(row)
  }

  async findById(id: number): Promise<Member | null> {
    const [row] = await this.db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1)
    if (!row) {
      return null
    }

    return this.rowToEntity(row)
  }

  async findAll(): Promise<Member[]> {
    const results = await this.db.select().from(members)
    return results.map(row => this.rowToEntity(row))
  }

  async findByEmail(email: string): Promise<Member | null> {
    const [row] = await this.db
      .select()
      .from(members)
      .where(eq(members.email, email))
      .limit(1)
    if (!row) {
      return null
    }

    return this.rowToEntity(row)
  }

  async create(member: Member): Promise<Member> {
    const row = member.toDatabaseRow()
    const result = await this.db.insert(members).values(row).returning()
    const created = getFirstOrThrow(result, 'Failed to create member')
    return this.rowToEntity(created)
  }

  async update(member: Member): Promise<Member> {
    const memberId = requireId(member, 'Cannot update member without ID')
    const row = member.toDatabaseRow()
    const result = await this.db
      .update(members)
      .set(row)
      .where(eq(members.id, memberId))
      .returning()
    const updated = getFirstOrThrow(result, 'Member not found')
    return this.rowToEntity(updated)
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(members)
      .where(eq(members.id, id))
      .returning()
    return result.length > 0
  }
}
