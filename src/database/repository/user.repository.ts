// TODO add function to verify unique fields
import { EntityRepository, Repository } from 'typeorm'
import { UserEntity } from '@entity/index'

@EntityRepository(UserEntity)
export default class UserRepository extends Repository<UserEntity> {
  async checkIfExists(key: string, value: any) {
    return await this.findOne({
      where: `${key} ILIKE '%${value}%'`,
      select: [
        'id',
        'email',
        'nickname',
        'password',
        'created_at',
        'updated_at',
      ],
    })
  }
}
