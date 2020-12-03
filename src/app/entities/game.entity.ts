import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Game {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string
}
