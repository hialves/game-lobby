// TODO add function to verify unique fields
import { EntityRepository, Repository } from 'typeorm'
import { UserEntity } from '@entity/index'

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  checkIfExists(key: string, value: any) {
    return this.findOne({ where: { [key]: value } })
  }
}
