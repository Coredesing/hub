export function formatPriceHub (price: string): string {
  const priceInFloat = parseFloat(price)
  if (!priceInFloat || priceInFloat <= 0) {
    return ''
  }
  if (priceInFloat > 1) {
    return `$${priceInFloat.toFixed(2)}`
  }
  const totalZero = -Math.floor(Math.log(+price) / Math.log(10) + 1)
  const totalAfterDecimal = price.split('.')[1].length
  let t = 3
  if (totalZero > 0) {
    t = totalZero + (t + (totalZero - 1))
  }
  return `$${priceInFloat.toFixed(t > totalAfterDecimal ? totalAfterDecimal : t)}`
}

export function nFormatter (num, digits = 2) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '-'
}
