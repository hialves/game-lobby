import { Queue } from 'bull'

export interface IQueue {
  bull: Queue
  name: string
  handle: (data: any) => Promise<any>
  options: Object
}
