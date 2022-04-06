export const dateFromString = (input: string) => {
  if (!input) return null
  return new Date(Number(input) * 1000)
}

export const isInRange = (from: string, to: string, now: Date) => {
  if (!from || !to) return null
  return dateFromString(from).getTime() <= now?.getTime() && dateFromString(to).getTime() > now?.getTime()
}
