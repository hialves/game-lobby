import { EntityBase } from './base'
import { Entity, Column } from 'typeorm'
import { IsEmail } from 'class-validator'

export interface IUser extends EntityBase {
  nickname: string
  email: string
  password: string
}

@Entity()
class User extends EntityBase implements IUser {
  @Column({ unique: true })
  nickname: string

  @Column({ unique: true })
  @IsEmail({}, { message: 'You must provide a valid email' })
  email: string

  @Column({ select: false })
  password: string
}

export default User
