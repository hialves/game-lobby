import { EntityBase } from './base'
import { Entity, Column } from 'typeorm'
import { IsEmail, IsNotEmpty } from 'class-validator'

export interface IUser {
  nickname: string
  email: string
  password: string
}

@Entity({ name: 'user' })
class User extends EntityBase implements IUser {
  @Column({ unique: true })
  @IsNotEmpty({ message: 'Provide a nickname' })
  nickname: string

  @Column({ unique: true })
  @IsEmail({}, { message: 'Provide a valid email' })
  email: string

  @Column({ select: false })
  @IsNotEmpty({ message: 'Provide a password' })
  password: string
}

export default User
