import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ unique: true })
	nickname: string

	@Column({ unique: true })
	email: string
}
