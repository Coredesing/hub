import { sub } from 'date-fns'

export const getAndFormatData = (d: number) =>
  sub(Date.now(), { days: d }).toISOString()

export const FILTER_TIMES = [
  { name: '7 Days', value: '7d' },
  { name: '30 Days', value: '30d' },
  { name: '90 Days', value: '90d' },
  { name: 'All Time', value: '' }
]
