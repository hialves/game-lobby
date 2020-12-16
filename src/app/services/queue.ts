import BullQueue from 'bull'
import redisConfig from '@config/redis'

import * as jobs from '@jobs/index'
import { IQueue } from '@interfaces/queue.interface'

class Queue {
  public queues: IQueue[]

  constructor() {
    this.queues = Object.values(jobs).map(job => ({
      bull: new BullQueue(job.key, { redis: redisConfig }),
      name: job.key,
      handle: job.handle,
      options: job.options,
    }))
  }

  add(name: string, data: any) {
    const queue = this.queues.find(queue => queue.name === name)

    if (queue) return queue.bull.add(data, queue.options)
  }

  process() {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle)

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data)
        console.log(err)
      })
    })
  }
}

export default new Queue()
