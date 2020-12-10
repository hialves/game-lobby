// TODO add function to verify unique fields
import { EntityRepository, Repository } from 'typeorm'
import { GameEntity } from '@entity/index'

@EntityRepository(GameEntity)
export default class GameRepository extends Repository<GameEntity> {
  async checkIfExists(key: string, value: any) {
    return await this.findOne({
      where: `${key} ILIKE '%${value}%'`,
    })
  }
}
