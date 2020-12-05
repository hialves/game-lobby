import { EntityBase } from './base'
import { Entity, Column } from 'typeorm'

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
  email: string

  @Column()
  password: string
}

export default User
