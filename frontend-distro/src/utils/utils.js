import { utils, constants } from 'ethers'
export const parseEther = utils.parseEther
export const MaxUint256 = constants.MaxUint256
export function formatEther (bn) {
  const str = utils.formatEther(bn)
  const parts = str.split('.')
  if (parts.length < 2) {
    return str
  }

  return `${parts[0]}.${parts[1].substring(0, 3)}`
}

export function shorten (s, max) {
  return s.length > max ? s.substring(0, (max / 2) - 1) + '…' + s.substring(s.length - (max / 2) + 2, s.length) : s
}
