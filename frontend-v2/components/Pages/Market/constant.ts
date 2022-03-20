import { BNB, BUSD_BSC, GAFI } from "@/components/web3"
import { ethers } from "ethers"

export const MARKET_ACTIVITIES = {
  TokenOfferCanceled: 'Cancel',
  TokenBought: 'Buy',
  TokenOffered: 'Offer',
  TokenDelisted: 'Delist',
  TokenListed: 'Listing'
}

const getTimeNumberLastDays = (days: number) => {
  const durationDay = days * 24 * 60 * 60 * 1000
  const currentTime = Date.now()
  const lastTimeByDay = currentTime - durationDay
  return new Date(new Date(lastTimeByDay).toDateString()).getTime() / 1000
}

export const FILTER_TIMES = [
  { name: 'All Time', value: '' },
  { name: '7 Days', value: getTimeNumberLastDays(7) },
  { name: '30 Days', value: getTimeNumberLastDays(30) }
]

export const filterPriceOptions = [
  {
    key: 'newest',
    label: 'Newest',
    value: ''
  },
  {
    key: 'price-ascending',
    label: 'Price Ascending',
    value: 'asc'
  },
  {
    key: 'price-descending',
    label: 'Price Descending',
    value: 'desc'
  }
]

export const currencies = [
  {
    ...BNB,
    address: ethers.constants.AddressZero,
    color: '#546BC7',
    colorText: '#fff',
    colorAlt: '#e6b300',
    icon: require('@/assets/images/icons/bnb.png')
  },
  {
    ...GAFI,
    color: '#546BC7',
    colorText: '#fff',
    colorAlt: '#6CDB00',
    icon: require('@/assets/images/icons/gafi.png')
  },
  {
    ...BUSD_BSC,
    color: '#546BC7',
    colorText: '#fff',
    colorAlt: '#e6b300',
    icon: require('@/assets/images/icons/busd.png')
  }
]
