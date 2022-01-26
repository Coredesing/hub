import { Network, networks } from '.'

export const getNetworkInfo = (network: string | number): Network => {
  network = typeof network === 'string' ? String(network).toLowerCase() : network

  return networks.find(item => item.name.toLowerCase() === network)
}
