import { utils } from 'ethers'
import { GAFI } from '@/components/web3'

export type TierConfigs = {
  delays: number[];
  tiers: string[];
}

type Tier = {
  name: string;
  method: string | null;
  image: any;
  config: {
    delay?: number;
    tokens?: number | string;
    max?: number;
    requirement?: string;
    requirementDescription?: string;
  };
}

const tiers = [{
  id: 0,
  name: 'Start',
  method: null,
  image: require('@/assets/images/ranks/start.png'),
  config: {
    delay: null,
    tokens: 0
  }
}, {
  id: 1,
  name: 'Rookie',
  method: 'Lottery',
  image: require('@/assets/images/ranks/rookie.png'),
  config: {
    max: 60
  }
}, {
  id: 2,
  name: 'Elite',
  method: 'Lottery',
  image: require('@/assets/images/ranks/elite.png'),
  config: {
    max: 300
  }
}, {
  id: 3,
  name: 'Pro',
  method: 'Lottery',
  image: require('@/assets/images/ranks/pro.png'),
  config: {
    max: 700
  }
}, {
  id: 4,
  name: 'Legend',
  method: 'Guaranteed 20% Pool',
  image: require('@/assets/images/ranks/legend.png'),
  config: {
    requirement: 'Auction NFT required',
    requirementDescription: 'GameFi.org holds an auction for NFT Legend tickets monthly. Legend tickets will belong to 12 people who have staked the most $GAFI at the end of auction.'
  }
}]

export function tiersFromConfigs (configs: TierConfigs): Tier[] {
  return tiers.map((tier, i) => {
    if (i === 0) {
      return tier
    }

    return {
      ...tier,
      config: {
        ...tier.config,
        delay: configs.delays[i - 1],
        tokens: utils.formatUnits(configs.tiers[i - 1], GAFI.decimals)
      }
    }
  })
}

export function getTierById (id: any) {
  if (!id) {
    return
  }

  return tiers.find(tier => tier.id === id)
}
