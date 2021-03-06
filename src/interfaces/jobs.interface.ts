import { JobOptions } from 'bull'

export interface Job {
  key: string
  handle: ({ data }: { data: any }) => Promise<any>
  options?: JobOptions
}
