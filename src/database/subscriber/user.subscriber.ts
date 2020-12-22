import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { UserEntity } from '@entity/index'
import { hashPassword } from '@utils/helpers'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    event.entity.password = await hashPassword(event.entity.password)
  }
}
