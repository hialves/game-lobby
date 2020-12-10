import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { EntityBase } from './base'

export interface IGame extends EntityBase {
  name: string
}

@Entity({ name: 'game' })
class Game extends EntityBase implements IGame {
  @Column()
  name: string
}

export default Game
