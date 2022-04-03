import { utils } from 'ethers'
import { GAFI } from '@/components/web3'

export type Tier = {
  name: string;
  method: string | null;
  image: any;
  config: {
    delay?: number;
    tokens?: number | string;
    max?: number;
    requirement?: string;
    requirementDescription?: string;
    social?: boolean;
  };
}

export const TIERS = [{
  id: 0,
  name: 'Start',
  method: null,
  image: require('@/assets/images/ranks/start.png'),
  config: {
    delay: null,
    tokens: 0,
    social: true
  }
}, {
  id: 1,
  name: 'Rookie',
  method: 'Lottery',
  image: require('@/assets/images/ranks/rookie.png'),
  config: {
    delay: 5,
    tokens: parseFloat(utils.formatUnits('20000000000000000000', GAFI.decimals)),
    max: 60,
    social: true
  }
}, {
  id: 2,
  name: 'Elite',
  method: 'Lottery',
  image: require('@/assets/images/ranks/elite.png'),
  config: {
    delay: 8,
    tokens: parseFloat(utils.formatUnits('100000000000000000000', GAFI.decimals)),
    max: 300,
    social: true
  }
}, {
  id: 3,
  name: 'Pro',
  method: 'Lottery',
  image: require('@/assets/images/ranks/pro.png'),
  config: {
    delay: 12,
    tokens: parseFloat(utils.formatUnits('500000000000000000000', GAFI.decimals)),
    max: 700
  }
}, {
  id: 4,
  name: 'Legend',
  method: 'Guaranteed 20% Pool',
  image: require('@/assets/images/ranks/legend.png'),
  config: {
    delay: 30,
    tokens: parseFloat(utils.formatUnits('1000000000000000000000', GAFI.decimals)),
    requirement: 'Auction NFT required',
    requirementDescription: 'GameFi.org holds an auction for NFT Legend tickets monthly. Legend tickets will belong to 12 people who have staked the most $GAFI at the end of auction.'
  }
}]

export function getTierById (id: any) {
  id = id ?? false
  if (id === false) {
    return
  }

  return TIERS.find(tier => tier.id === id)
}
