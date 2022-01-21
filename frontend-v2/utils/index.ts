type PaginatorInput = {
    current: number;
    last: number;
    betweenFirstAndLast?: number;
};

type Paginator = {
    first: number;
    current: number;
    last: number;
    pages: Array<number>;
    leftCluster: boolean;
    rightCluster: boolean;
};

export const paginator = (options: PaginatorInput): Paginator | null => {
  const current = options.current
  const total = options.last
  const center = [current - 2, current - 1, current, current + 1, current + 2]
  const filteredCenter: number[] = center.filter((p) => p > 1 && p < total)
  const includeThreeLeft = current === 5
  const includeThreeRight = current === total - 4
  const includeLeftDots = current > 5
  const includeRightDots = current < total - 4

  if (includeThreeLeft) filteredCenter.unshift(2)
  if (includeThreeRight) filteredCenter.push(total - 1)

  let leftCluster = false; let rightCluster = false
  if (includeLeftDots) {
    leftCluster = true
  }

  if (includeRightDots) {
    rightCluster = true
  }

  return {
    current,
    first: 1,
    pages: filteredCenter,
    last: total,
    leftCluster,
    rightCluster
  }
}

export const fetcher = (url, ...args) => fetch(url, ...args).then(res => res.json())

export const formatterUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export function formatPrice (price: string): string {
  const priceInFloat = parseFloat(price)
  if (priceInFloat > 1) {
    return `$${priceInFloat.toFixed(4)}`
  }

  const matches = price.match(/(\.([0])*)/)
  if (!matches?.[0]) {
    return price
  }

  const position = price.indexOf(matches[0])
  return `$${price.slice(0, position + matches[0].length + 4)}`
}