import { hexbin as d3Hexbin } from 'd3-hexbin'
import { zoom as d3Zoom, select } from 'd3'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import fonts from '@/components/Pages/Adventure/index.module.scss'

import logoKucoin from '@/components/Pages/Adventure/images/lands/kucoin-logo.png'
import imgKucoin from '@/components/Pages/Adventure/images/lands/kucoin.png'
import logoHeroesLand from '@/components/Pages/Adventure/images/lands/heroes-land-logo.png'
import imgHeroesLand from '@/components/Pages/Adventure/images/lands/heroes-land.jpeg'
import logoThunderlands from '@/components/Pages/Adventure/images/lands/thunderlands-logo.png'
import imgThunderlands from '@/components/Pages/Adventure/images/lands/thunderlands.png'
import logoEnginesOfFury from '@/components/Pages/Adventure/images/lands/engines-of-fury-logo.png'
import imgEnginesOfFury from '@/components/Pages/Adventure/images/lands/engines-of-fury.png'
import logoSummonersArena from '@/components/Pages/Adventure/images/lands/summoners-arena-logo.png'
import imgSummonersArena from '@/components/Pages/Adventure/images/lands/summoners-arena.png'
import logoDarkCountry from '@/components/Pages/Adventure/images/lands/dark-country-logo.png'
import imgDarkCountry from '@/components/Pages/Adventure/images/lands/dark-country.png'
import logoDinox from '@/components/Pages/Adventure/images/lands/dinox-logo.png'
import imgDinox from '@/components/Pages/Adventure/images/lands/dinox.png'
import logoIguVerse from '@/components/Pages/Adventure/images/lands/iguverse-logo.png'
import imgIguVerse from '@/components/Pages/Adventure/images/lands/iguverse.png'
import imgGameFi from '@/components/Pages/Adventure/images/lands/gamefi.jpeg'
import logoGameFi from '@/components/Pages/Adventure/images/lands/gamefi-logo.png'
import imgEpicwar from '@/components/Pages/Adventure/images/lands/epic-war.png'
import logoEpicwar from '@/components/Pages/Adventure/images/lands/epic-war-logo.png'
import logoAradena from '@/components/Pages/Adventure/images/lands/aradena-logo.png'
import imgAradena from '@/components/Pages/Adventure/images/lands/aradena.png'
import logoCodyfight from '@/components/Pages/Adventure/images/lands/codyfight-logo.png'
import imgCodyfight from '@/components/Pages/Adventure/images/lands/codyfight.png'
import imgIsekaiverse from '@/components/Pages/Adventure/images/lands/isekaiverse.png'
import logoIsekaiverse from '@/components/Pages/Adventure/images/lands/isekaiverse-logo.png'
import logoDvision from '@/components/Pages/Adventure/images/lands/dvision-logo.png'
import imgDvision from '@/components/Pages/Adventure/images/lands/dvision.png'
import logoGoonsOfBalatroon from '@/components/Pages/Adventure/images/lands/goons-of-balatroon-logo.png'
import imgGoonsOfBalatroon from '@/components/Pages/Adventure/images/lands/goons-of-balatroon.png'
import logoAetherGames from '@/components/Pages/Adventure/images/lands/aether-games-logo.png'
import imgAetherGames from '@/components/Pages/Adventure/images/lands/aether-games.png'
import logoMonsterEra from '@/components/Pages/Adventure/images/lands/monster-era-logo.png'
import imgMonsterEra from '@/components/Pages/Adventure/images/lands/monster-era.png'
import logoMonsterra from '@/components/Pages/Adventure/images/lands/monsterra-logo.png'
import imgMonsterra from '@/components/Pages/Adventure/images/lands/monsterra.png'
import logoMoverse from '@/components/Pages/Adventure/images/lands/moverse-logo.png'
import imgMoverse from '@/components/Pages/Adventure/images/lands/moverse.png'
import logoPlanetSandbox from '@/components/Pages/Adventure/images/lands/planet-sandbox-logo.png'
import imgPlanetSandbox from '@/components/Pages/Adventure/images/lands/planet-sandbox.png'
import logoTitanHunters from '@/components/Pages/Adventure/images/lands/titan-hunters-logo.png'
import imgTitanHunters from '@/components/Pages/Adventure/images/lands/titan-hunters.png'
import logoBeFitter from '@/components/Pages/Adventure/images/lands/befitter-logo.png'
import imgBeFitter from '@/components/Pages/Adventure/images/lands/befitter.png'
import logoMetashooter from '@/components/Pages/Adventure/images/lands/metashooter-logo.png'
import imgMetashooter from '@/components/Pages/Adventure/images/lands/metashooter.png'
import logoMoonStrike from '@/components/Pages/Adventure/images/lands/moon-strike-logo.png'
import imgMoonStrike from '@/components/Pages/Adventure/images/lands/moon-strike.png'
import logoTheUnfettered from '@/components/Pages/Adventure/images/lands/the-unfettered-logo.png'
import imgTheUnfettered from '@/components/Pages/Adventure/images/lands/the-unfettered.jpg'
import logoNinneko from '@/components/Pages/Adventure/images/lands/ninneko-logo.png'
import imgNinneko from '@/components/Pages/Adventure/images/lands/ninneko.png'
import logoMetacity from '@/components/Pages/Adventure/images/lands/metacity-logo.png'
import imgMetacity from '@/components/Pages/Adventure/images/lands/metacity.png'
import logoPikaster from '@/components/Pages/Adventure/images/lands/pikaster-logo.png'
import imgPikaster from '@/components/Pages/Adventure/images/lands/pikaster.png'
import logoPlanetMojo from '@/components/Pages/Adventure/images/lands/planet-mojo-logo.png'
import imgPlanetMojo from '@/components/Pages/Adventure/images/lands/planet-mojo.png'
import logoRiseOfImmortals from '@/components/Pages/Adventure/images/lands/rise-of-immortals-logo.png'
import imgRiseOfImmortals from '@/components/Pages/Adventure/images/lands/rise-of-immortals.png'
import imgDEsports from '@/components/Pages/Adventure/images/lands/desports.png'
import logoDEsports from '@/components/Pages/Adventure/images/lands/desports-logo.png'
import imgEvermoon from '@/components/Pages/Adventure/images/lands/evermoon.png'
import logoEvermoon from '@/components/Pages/Adventure/images/lands/evermoon-logo.png'
import logoAniwar from '@/components/Pages/Adventure/images/lands/aniwar-logo.png'
import imgAniwar from '@/components/Pages/Adventure/images/lands/aniwar.png'
import logoHomieWar from '@/components/Pages/Adventure/images/lands/homie-wars-logo.png'
import imgHomieWar from '@/components/Pages/Adventure/images/lands/homie-wars.png'

import clsx from 'clsx'
import { fetcher, gtagEvent } from '@/utils'
import Link from 'next/link'

enum LandShape {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  ELEVEN = 11,
  TWELVE = 12,
  THIRTEEN = 13,
  FOURTEEN = 14,
  FIFTEEN = 15,
  SIXTEEN = 16,
  SEVENTEEN = 17,
  EIGHTEEN = 18
}

enum TooltipPlacement {
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM = 'bottom',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left'
}

type LandRaw = {
  slug: string;
  shape: LandShape;
  positions: [number, number];
  name: string;
  categories: string[];
  description: string;
  img: StaticImageData;
  logo: { src: string };
  tooltip?: [number, number];
  tooltipPlacement?: TooltipPlacement;
  ping: number;
}
type Land = LandRaw & {
  status: string;
  points: number[];
  hexagons: number[][];
  tooltipPosition(): number[];
}

// eslint-disable-next-line no-unused-expressions
fonts // this is intentional to avoid tree-shaking

const landShapes: Record<LandShape, (x: number) => number[][]> = {
  [LandShape.ONE]: (x: number) => {
    return [
      [x + 4],
      [x + 3, x + 4],
      [x + 1, x + 2, x + 3, x + 4],
      [x, x + 1, x + 2, x + 3],
      [x, x + 1, x + 2, x + 3, x + 4, x + 5],
      [x, x + 1, x + 2, x + 3, x + 4],
      [x + 1, x + 2, x + 4],
      [x + 1]
    ]
  },

  [LandShape.TWO]: (x: number) => {
    return [
      [x + 3, x + 4, x + 5],
      [x, x + 1, x + 2, x + 3, x + 4, x + 5],
      [x + 2, x + 3, x + 5, x + 6],
      [x + 1, x + 2, x + 4],
      [x + 1, x + 2, x + 3, x + 4, x + 5],
      [x + 3]
    ]
  },

  [LandShape.THREE]: (x: number) => {
    return [
      [x + 4, x + 5],
      [x, x + 1, x + 3, x + 4, x + 5],
      [x + 1, x + 2, x + 3, x + 4, x + 5],
      [x, x + 1, x + 2, x + 3],
      [x + 2, x + 3, x + 4],
      [x + 4]
    ]
  },

  [LandShape.FOUR]: (x: number) => {
    return [
      [x + 4],
      [x + 1, x + 3, x + 4, x + 5],
      [x + 2, x + 3],
      [x + 3, x + 4],
      [x + 1, x + 3, x + 4],
      [x + 1, x + 2, x + 3, x + 4, x + 5],
      [x + 3]
    ]
  },

  [LandShape.FIVE]: (x: number) => {
    return [
      [x + 1],
      [x, x + 1],
      [x, x + 1, x + 2, x + 3],
      [x + 1, x + 2],
      [x + 1, x + 2, x + 3, x + 4],
      [x, x + 1, x + 2, x + 3],
      [x + 2, x + 3]
    ]
  },

  [LandShape.SIX]: (x: number) => {
    return [
      [x],
      [x, x + 1, x + 2],
      [x + 1, x + 2, x + 3],
      [x - 1, x, x + 3],
      [x, x + 1, x + 3, x + 4],
      [x, x + 1, x + 2]
    ]
  },

  [LandShape.SEVEN]: (x: number) => {
    return [
      [x + 1, x + 2],
      [x, x + 1],
      [x]
    ]
  },

  [LandShape.EIGHT]: (x: number) => {
    return [
      [x + 1],
      [x + 1, x + 2],
      [x + 2, x + 3]
    ]
  },

  [LandShape.NINE]: (x: number) => {
    return [
      [x + 1, x + 2],
      [x, x + 1, x + 2],
      [x + 1, x + 2]
    ]
  },

  [LandShape.TEN]: (x: number) => {
    return [
      [x + 1],
      [x, x + 1],
      [x]
    ]
  },

  [LandShape.ELEVEN]: (x: number) => {
    return [
      [x + 1],
      [x, x + 1],
      [x + 1, x + 2]
    ]
  },

  [LandShape.TWELVE]: (x: number) => {
    return [
      [x + 3, x + 4, x + 5],
      [x + 1, x + 2, x + 3, x + 4],
      [x + 2, x + 3, x + 5, x + 6],
      [x + 1, x + 2, x + 4],
      [x + 3, x + 4, x + 5],
      [x + 3]
    ]
  },

  [LandShape.THIRTEEN]: (x: number) => {
    return [
      [x, x + 1],
      [x]
    ]
  },

  [LandShape.FOURTEEN]: (x: number) => {
    return [
      [x]
    ]
  },

  [LandShape.FIFTEEN]: (x: number) => {
    return [
      [x + 4],
      [x + 3, x + 4],
      [x + 1, x + 2, x + 3, x + 4],
      [x, x + 1, x + 2, x + 3],
      [x, x + 1, x + 2, x + 3, x + 4, x + 5],
      [x, x + 1, x + 3, x + 4],
      [x + 4]
    ]
  },

  [LandShape.SIXTEEN]: (x: number) => {
    return [
      [x, x + 1],
      [x + 1]
    ]
  },

  [LandShape.SEVENTEEN]: (x: number) => {
    return [
      [x + 3],
      [x + 1, x + 2, x + 3],
      [x + 3, x + 4],
      [x + 1, x + 3, x + 4],
      [x + 1, x + 2, x + 3, x + 4, x + 5],
      [x + 3]
    ]
  },

  [LandShape.EIGHTEEN]: (x: number) => {
    return [
      [x],
      [x, x + 1]
    ]
  }
}

const universe = (matrix: (number) => number[][], perRow: number, top = 1, left = 1) => {
  // TODO: I'm fucking genius
  return matrix(top * perRow).reduce((acc, val, index) => {
    val.forEach(v => {
      acc.push(perRow * index + v + (top % 2 && top % 2 === index % 2 ? 1 : 0))
    })

    return acc
  }, []).map(x => x + left)
}

const landsDefault: LandRaw[] = [{
  slug: 'gamefi',
  shape: LandShape.ONE,
  positions: [4, 12],
  name: 'GameFi.org',
  categories: ['Hub', 'Launchpad', 'Community', 'Marketplace'],
  description: '',
  img: imgGameFi,
  logo: logoGameFi,
  ping: 15
}, {
  slug: 'moon-strike',
  shape: LandShape.SEVEN,
  positions: [18, 12],
  name: 'Moon Strike',
  categories: ['FPS', 'Strategy'],
  description: 'A Sci-Fi NFTs multiplayer with shooter and development based on AAA quality from Unreal Engine.',
  img: imgMoonStrike,
  logo: logoMoonStrike,
  ping: 2
}, {
  slug: 'kucoin',
  shape: LandShape.TWO,
  positions: [16, 18],
  name: 'Kucoin',
  categories: ['Exchange', 'CEX'],
  description: 'KuCoin is a global crypto currency exchange for numerous digital assets and crypto currencies. Launched in September2017, KuCoin has grown into one of the most popular crypto exchanges and already has over 20 million registered users across 207 countries and regions around the world.',
  img: imgKucoin,
  logo: logoKucoin,
  ping: 4
}, {
  slug: 'isekaiverse',
  shape: LandShape.EIGHT,
  positions: [10, 19],
  name: 'Isekaiverse',
  categories: ['Strategy', 'NFT', 'Card'],
  description: 'Isekai battle game is a real-time, head-to-head battle game set in Isekai Island. Build your battle deck and outsmart the enemy in a fast paced real-time battle starring your favourite Isekai Island characters and more. Start battling against players from around the world!',
  img: imgIsekaiverse,
  logo: logoIsekaiverse,
  ping: 2
}, {
  slug: 'dvision',
  shape: LandShape.THREE,
  positions: [3, 22],
  name: 'Dvision Network',
  categories: ['Action', 'NFT', 'Metaverse'],
  description: 'Dvision Network is a multichain metaverse platform that is built on top of the Ethereum Network and Binance Smart Chain and is powered by the DVI utility and governance token across its all platform pillars, which powers the robust and diversified NFT marketplace within its augmented reality. Dvision is based on three primary platform features, which are known as NFT Market, Meta-Space, and Meta-City.',
  img: imgDvision,
  logo: logoDvision,
  tooltipPlacement: TooltipPlacement.TOP_LEFT,
  ping: 5
}, {
  slug: 'epic-war',
  shape: LandShape.FOUR,
  positions: [13, 26],
  name: 'Epic War',
  categories: ['FPS', 'Strategy', 'Role Playing'],
  description: 'Epic War is a 3D Blockchain Cinematic Game that is free-to-play-to-earn (F2P2E). It is a massively multiplayer real-time strategy game (MMORTS) and social network based on blockchain technology. Epic War offers gamers the thrill of first-person shooter action in a cutting-edge gaming environment.',
  img: imgEpicwar,
  logo: logoEpicwar,
  tooltipPlacement: TooltipPlacement.TOP_LEFT,
  ping: 5
}, {
  slug: 'engine-of-fury',
  shape: LandShape.TEN,
  positions: [3, 31],
  name: 'Engines of Fury',
  categories: ['Role Playing', 'MOBA', 'NFT'],
  description: 'Engines of Fury is a battle arena game built on Unity with rich 3D visuals and numerous addictive single & multiplayer gameplay modes. It has a 1-token deflationary in-game economy where FURY is at the center of the game with lots of utility & ever-increasing demand.',
  img: imgEnginesOfFury,
  logo: logoEnginesOfFury,
  ping: 1
}, {
  slug: 'ninneko',
  shape: LandShape.FIVE,
  positions: [7, 34],
  name: 'Ninneko',
  categories: ['Idol', 'RPG', 'NFT'],
  description: 'Ninneko is an idle-rpg game, based on a japanese theme. With a wide variety of skills and strategy, Ninneko will surely bring you a new gaming experience with unpredictable gameplay. Dive in and become the strongest.',
  img: imgNinneko,
  logo: logoNinneko,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 7
}, {
  slug: 'goons-of-balatroon',
  shape: LandShape.ELEVEN,
  positions: [18, 35],
  name: 'Goons of Balatroon',
  categories: ['Strategy', 'Turn-based', 'Card'],
  description: 'Goons of Balatroon is a free-to-play humorous, edgy, and fast paced P2E digital trading card game that pits Goon factions against each other. The game features P2E mechanics, and uses both free cards, and NFT cards that can be bought or won using P2E rewards. Build customizable 30 card decks made up of creatures, spells, mystery cards from the lore of Balatroon to defeat your opponent, and climb up the leaderboard!',
  img: imgGoonsOfBalatroon,
  logo: logoGoonsOfBalatroon,
  ping: 0
}, {
  slug: 'monsterra',
  shape: LandShape.TWELVE,
  positions: [4, 40],
  name: 'Monsterra',
  categories: ['Adventure', 'NFT', 'Strategy'],
  description: 'Monsterra is a multi-chain game run on BNB, Avalanche and Terra networks inspired by the Axie Infinity game\'s pet world and the gameplay in Clash of Clan or Boom Beach of Supercell.',
  img: imgMonsterra,
  logo: logoMonsterra,
  tooltipPlacement: TooltipPlacement.TOP_LEFT,
  ping: 4
}, {
  slug: 'codyfight',
  shape: LandShape.THIRTEEN,
  positions: [14, 40],
  name: 'Codyfight',
  categories: ['Strategy', 'Turn-based', 'Metaverse'],
  description: 'Codyfight is a turn-based strategy metaverse for AI and Humans that leverages NFTs and rewards creativity in a scalable Create2Earn model. Codyfight features 1v1 robot battles and enables players to move away from grinding by allowing scaling automation via AI robot farms.',
  img: imgCodyfight,
  logo: logoCodyfight,
  ping: 2
}, {
  slug: 'titan-hunters',
  shape: LandShape.SIX,
  positions: [16, 44],
  name: 'Titan Hunters',
  categories: ['NFT', 'Casual', 'Adventure'],
  description: 'Titan Hunters is a rogue-like mobile game where you hunt ferocious Titans and earn real money with the power of NFTs. Titan Hunters is the first popular GameFi in Japan with impressive achievements: ranked 3rd in Japan’s App Store, gone viral on Twitter Japan, and appeared in 50+ big Japanese newspapers.',
  img: imgTitanHunters,
  logo: logoTitanHunters,
  ping: 3
}, {
  slug: 'desports',
  shape: LandShape.FIFTEEN,
  positions: [8, 49],
  name: 'DESports',
  categories: ['eSports', 'Tournament', 'Organizer'],
  description: 'Desports, powered by Icetea Labs - leading blockchain incubator in the world & 500Bros - top SEA eSports organisers, is Decentralised Esports Platform which is the pioneer & revolution for Web3 Gaming.',
  img: imgDEsports,
  logo: logoDEsports,
  tooltipPlacement: TooltipPlacement.TOP_LEFT,
  ping: 5
}, {
  slug: 'aradena',
  shape: LandShape.SIXTEEN,
  positions: [3, 52],
  name: 'Aradena',
  categories: ['Card', 'Strategy', 'Turn-based'],
  description: 'Free-to-play and insanely fun, Aradena: Battlegrounds is a PvP trading card hex-battler launching in Q1 2023. Aradena: Battlegrounds is a TCG where players can build their deck, trade their cards, and compete for rewards on an immersive 3D battlefield. Trade, Battle, and Earn in the next generation of strategy gaming.',
  img: imgAradena,
  logo: logoAradena,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 2
}, {
  slug: 'the-unfettered',
  shape: LandShape.NINE,
  positions: [18, 53],
  name: 'The Unfettered',
  categories: ['Action', 'Role Playing', 'NFT'],
  description: 'The Unfettered is the first AA quality Story-based play-to-earn pc game that covers the Soulslike and RPG genres on the BNB Smart Chain. With a gameplay mechanism that is unique in the blockchain, The Unfettered takes you to the story of the lonely woman\'s remarkable journey with an atmosphere of a dark fantasy and high-quality graphics.',
  img: imgTheUnfettered,
  logo: logoTheUnfettered,
  ping: 3
}, {
  slug: 'pikaster',
  shape: LandShape.SIXTEEN,
  positions: [11, 56],
  name: 'Pikaster',
  categories: ['Card', 'NFT', 'Strategy'],
  description: 'Pikaster is a play-to-earn gamefi project developed by Metaland, powered by Unity Engine. A card-based battle strategy PvE and PvP game, featuring Pikaster (NFTs), an innovative NFTs staking and evolution system, scholarship system, guilds and wars, World Trees, marketplace and in-game wallets.',
  img: imgPikaster,
  logo: logoPikaster,
  ping: 0
}, {
  slug: 'heroes-land',
  shape: LandShape.FIVE,
  positions: [3, 61],
  name: 'Heroes Land',
  categories: ['Casual', 'Role Playing', 'Puzzle'],
  description: 'Heroes Land is a match-3 puzzle RPG game with a unique dual-gameplay model combining both traditional gameplay mode and blockchain game mode. There are various game activities where users can enjoy and utilize their skills, from evolving and summoning heroes, and upgrading lands to Daily Quests, Tower Conquest, PvE, PvP, and Clan to earn game tokens.',
  img: imgHeroesLand,
  logo: logoHeroesLand,
  ping: 5
}, {
  slug: 'metacity',
  shape: LandShape.THREE,
  positions: [16, 61],
  name: 'Metacity',
  categories: ['Metaverse', 'Simulation', 'NFT'],
  description: 'Metacity is the most aesthetic Build2Earn Citiverse ecosystem, powered by House3D and Icetea Labs. It is a striking 3D city simulated metaverse developed as a co-creation platform that allows everyone to express their aesthetic and uniqueness by easily creating their dream living spaces. Here, you can enjoy your free time with exciting built-in Build2Earn and Design2Earn gameplay, as well as a variety of third party games in Citiverse games, and immerse in spectacular 3D/VR experiences with friends.',
  img: imgMetacity,
  logo: logoMetacity,
  ping: 5
}, {
  slug: 'dinox-world',
  shape: LandShape.SEVENTEEN,
  positions: [7, 66],
  name: 'DINOX WORLD',
  categories: ['NFT', 'Strategy', 'Turn-based'],
  description: 'DINOX World is the ultimate dinosaur-themed NFT combat & strategy game. Own, battle, & level up your very own NFT dinosaurs or play for free with in-game non-NFT dinos. Hatch your own unique dino and use specialized Action Cards to strategize & defeat wopponents in this entertaining, turn-based tactical game!',
  img: imgDinox,
  logo: logoDinox,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 9
}, {
  slug: 'evermoon',
  shape: LandShape.THIRTEEN,
  positions: [3, 70],
  name: 'Evermoon',
  categories: ['Action', 'Strategy', 'MOBA'],
  description: 'Evermoon is The First Free-To-Play-To-Earn Multiplayer Online Battle Arena (MOBA) NFT game. Evermoon offers a thrilling & fun 3-lanes 5v5 fighting mechanics, sustainable economy, and many in-game DeFi features that will entertain, empower, and enrich players around the world emotionally, physically, and financially.',
  img: imgEvermoon,
  logo: logoEvermoon,
  ping: 2
}, {
  slug: 'metashooter',
  shape: LandShape.TWO,
  positions: [16, 70],
  name: 'MetaShooter',
  categories: ['Action', 'PvP', 'Strategy'],
  description: 'MetaShooter is the first decentralized blockchain-based hunting metaverse. MetaShooter joins millions of gaming enthusiasts in a community where they can experience realistic hunting in the open world and develop many activities with monetization opportunities.',
  img: imgMetashooter,
  logo: logoMetashooter,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 16
}, {
  slug: 'iguverse',
  shape: LandShape.EIGHT,
  positions: [11, 74],
  name: 'IguVerse',
  categories: ['NFT', 'Socialize-to-earn', 'Move-to-earn'],
  description: 'IguVerse GameFi app redefines the whole concept of NFT using AI / ML technologies. Unique user-generated NFTs will become the new standard NFT 2.0, dethroning faceless collections. In our GameFi app, we introduce an innovative game mechanic Socialize to Earn, along with two more Earn concepts - Move to Earn and Play to Earn. We associate them with simple tasks and offer users to walk their own NFT pets, feed them and share their photos on social media to get rewards.',
  img: imgIguVerse,
  logo: logoIguVerse,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 1
}, {
  slug: 'befitter',
  shape: LandShape.FIFTEEN,
  positions: [3, 79],
  name: 'beFITTER',
  categories: ['Move-to-earn', 'SocialFi', 'FitnessFi'],
  description: 'beFITTER is a web3 fitnessfi and socialfi app that aims to build a healthier ecosystem helping users balance their lives, improve their mental & physical health, gain achievements, and still get monetary incentives.',
  img: imgBeFitter,
  logo: logoBeFitter,
  tooltipPlacement: TooltipPlacement.TOP_LEFT,
  ping: 12
}, {
  slug: 'moverse-run',
  shape: LandShape.NINE,
  positions: [14, 79],
  name: 'Moverse.run',
  categories: ['Move-to-earn', 'FitnessFi', 'NFT'],
  description: 'Moverse is a web3.0 fitness and social lifestyle app presenting Move To Earn and Engage To Earn activities to make one healthy physically, mentally, and financially. Moverse is powered by BNB Chain.',
  img: imgMoverse,
  logo: logoMoverse,
  ping: 3
}, {
  slug: 'aether-games',
  shape: LandShape.EIGHTEEN,
  positions: [20, 79],
  name: 'Aether Games',
  categories: ['Card', 'Digital Collectibles', 'NFT'],
  description: 'Cards of Ethernity is a digital collectible competitive PC card game with P2E and F2P options, developed by Aether Games Inc. Players are able to trade, rent and sell their finest quality 2D Dark Fantasy NFTs freely, with the same level of ownership as if they were real, tangible cards.',
  img: imgAetherGames,
  logo: logoAetherGames,
  ping: 1
}, {
  slug: 'planet-sandbox',
  shape: LandShape.SIX,
  positions: [16, 86],
  name: 'Planet Sandbox',
  categories: ['TPS', 'Action', 'NFT'],
  description: 'Planet Sandbox is a physics-powered TPS sandbox shooting NFT game that allows players to build and own arenas to fight other players in different game modes using their own NFT weapons and accessories. Powered by the $PSB tokens, Planet Sandbox has created multiple play-to-earn opportunities within their Metaverse.',
  img: imgPlanetSandbox,
  logo: logoPlanetSandbox,
  ping: 6
}, {
  slug: 'dark-country',
  shape: LandShape.FOUR,
  positions: [8, 87],
  name: 'Dark Country',
  categories: ['MMO', 'Card', 'NFT'],
  description: 'Dark Country is a PlayAndEarn American Gothic NFT Trading Card and Strategy Game in a somber Wild West setting with rangers, cowboys, haunted Indians, zombies, ghosts, and demons. The main game idea & mechanics are inspired by classic CCGs like Magic: the Gathering and HearthStone.',
  img: imgDarkCountry,
  logo: logoDarkCountry,
  tooltipPlacement: TooltipPlacement.TOP_LEFT,
  ping: 5
}, {
  slug: 'monster-era',
  shape: LandShape.TEN,
  positions: [3, 88],
  name: 'Monster Era',
  categories: ['Puzzle', 'NFT', 'Casual'],
  description: 'The opening product of Hubgame\'s gamefi ecosystem, the puzzle genre is suitable for all audiences and focuses on NFT development.',
  img: imgMonsterEra,
  logo: logoMonsterEra,
  ping: 2
}, {
  slug: 'summoners-arena',
  shape: LandShape.FIVE,
  positions: [9, 96],
  name: 'Summoners Arena',
  categories: ['Idol', 'NFT', 'Strategy'],
  description: 'Summoners Arena is set out to be a multi-game universe of various genres made into a franchise supported by Onechain Technology. Summoners Arena Idle is the franchise flagship where players collect, upgrade, evolve Heroes, and forge Items to compete in different game modes.',
  img: imgSummonersArena,
  logo: logoSummonersArena,
  ping: 5
}, {
  slug: 'rise-of-immortals',
  shape: LandShape.THIRTEEN,
  positions: [4, 100],
  name: 'Rise of Immortals',
  categories: ['Strategy', 'Turn-based', 'Metaverse'],
  description: 'Rise of Immortals is an AAA hero-based strategy game powered by NFTs on the Ethereum blockchain (Layer 2 Immutable X).',
  img: imgRiseOfImmortals,
  logo: logoRiseOfImmortals,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 2
}, {
  slug: 'thunder-lands',
  shape: LandShape.SEVEN,
  positions: [19, 94],
  name: 'Thunder Lands',
  categories: ['FPS', 'Strategy'],
  description: 'Thunder Lands is a virtual gaming metaverse set in the Dark Fantasy genre. Classical gameplay + aspects of innovative blockchain. The Thunder Lands are worlds where the sound of gold and cold steel play their part in equal measure. These are worlds where players will have to engage in a never-ending struggle for resources, territorial conquest and political domination, create their own fractions or join the strongest guilds to influence the situation in the Thunder Lands.',
  img: imgThunderlands,
  logo: logoThunderlands,
  ping: 2
}, {
  slug: 'planet-mojo',
  shape: LandShape.EIGHT,
  positions: [18, 101],
  name: 'Planer Mojo',
  categories: ['Auto Chest', 'Auto Battler'],
  description: 'Planet Mojo is a magical Web3 gaming metaverse platform being built by gaming veterans. Players compete with customized teams in a suite of eSports, PvP games, set on a mysterious alien planet with an evolving narrative. The long-term goal is to create a sustainable gaming project for the next generation of gamers, where they own their in-game assets & have a say in the project’s future direction.',
  img: imgPlanetMojo,
  logo: logoPlanetMojo,
  ping: 1
}, {
  slug: 'aniwar',
  shape: LandShape.SIXTEEN,
  positions: [8, 104],
  name: 'Aniwar',
  categories: ['MMO', 'Sandbox', 'Strategy'],
  description: 'Aniwar.io owns a pretty graphic background with character designs, funny and cute interface. The game was developed with an idea similar to pokemon & tank shooter.',
  img: imgAniwar,
  logo: logoAniwar,
  ping: 0
}, {
  slug: 'homie-wars',
  shape: LandShape.EIGHTEEN,
  positions: [13, 104],
  name: 'Homie Wars',
  categories: ['Battle Royale', 'Family Friendly', 'Metaverse'],
  description: 'Homie Wars is the first free-to-play, free-to-earn battle royale crypto game, inspired by Fall Guys and introducing an action-packed metaverse that houses exciting activities, various game modes, and creative opportunities to interact with your homies!',
  img: imgHomieWar,
  logo: logoHomieWar,
  tooltipPlacement: TooltipPlacement.BOTTOM_LEFT,
  ping: 1
}]

const World = ({ width = 1600, height = 750, screens = 3, r = 22, items = landsDefault, className = '' }) => {
  const ref = useRef<SVGSVGElement | undefined>()
  const [translate, setTranslate] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 })
  const widthMax = useMemo(() => width * screens, [width, screens])
  const hexbin = useMemo(() => d3Hexbin().radius(r).extent([[0, 0], [widthMax - r, height]]), [height, r, widthMax])
  const centers: number[][] = useMemo(() => hexbin.centers(), [hexbin])
  const widthPerHexagon = useMemo(() => Math.sqrt(3) * r, [r])
  const hexagonsPerRow = useMemo(() => Math.ceil(widthMax / widthPerHexagon), [widthMax, widthPerHexagon])
  const debug = false
  const isLargeScreen = () => window?.innerWidth >= 1260

  const [projects, setProjects] = useState([])
  useEffect(() => {
    fetcher('https://catventure.gamefi.org/v1/projects')
      .then(response => {
        setProjects(response?.data || [])
      })
      .catch(() => {
        setProjects([])
      })
  }, [])

  const lands: Land[] = useMemo(() => {
    return items.map(land => {
      if (land?.positions?.length !== 2) {
        return undefined
      }

      const project = projects.find(x => x.slug === land.slug)

      let points = []
      points = universe(landShapes[land.shape], hexagonsPerRow, land.positions[0], land.positions[1])

      const item: Land = {
        ...land,
        status: land.slug === 'gamefi' ? 'INTRO' : (project?.status || 'LOCK'),
        points,
        hexagons: points.map(v => {
          return centers[v]
        }),
        tooltipPosition () {
          if (land.tooltip?.length === 2) {
            return centers[hexagonsPerRow * land.tooltip[0] + land.tooltip[1]]
          }

          return centers[points[land.ping]]
        }
      }

      return item
    })
  }, [centers, hexagonsPerRow, items, projects])

  const [landActive, setLandActive] = useState(null)
  const [warningZoom, setWarningZoom] = useState(false)

  const landActiveNext = useMemo(() => {
    if (!landActive) {
      return null
    }

    const idx = lands.findIndex(x => x.slug === landActive.slug)
    if (idx === undefined) {
      return null
    }

    return lands[idx + 1]
  }, [landActive, lands])
  const landActivePrev = useMemo(() => {
    if (!landActive) {
      return null
    }

    const idx = lands.findIndex(x => x.slug === landActive.slug)
    if (!idx) {
      return null
    }

    return lands[idx - 1]
  }, [landActive, lands])

  let warningTimeout = null
  const zoom = d3Zoom()
    .scaleExtent([1, 2])
    .extent([[0, 0], [width, height]])
    .translateExtent([[0, 0], [widthMax, height]])
    .filter((event) => {
      if (!event.ctrlKey && event.type === 'wheel') {
        if (warningTimeout) {
          clearTimeout(warningTimeout)
        }

        setWarningZoom(true)
        warningTimeout = setTimeout(() => {
          setWarningZoom(false)
        }, 800)
        return false
      }

      return !event.button
    })
    .on('zoom', (e) => {
      const transform = e.transform
      setTranslate({
        x: transform.x,
        y: transform.y,
        k: transform.k
      })
    })

  const zoomRef = useRef(zoom)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    select(ref.current).call(zoomRef.current)
  }, [height, width, widthMax])

  const resetZoom = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    select(ref.current).transition().duration(300).call(zoomRef.current.scaleTo, 1)
  }, [])

  const zoomIn = useCallback((k = 1.5) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    select(ref.current).transition().duration(300).call(zoomRef.current.scaleTo, k)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onLandsClicked = useCallback((land, e) => {
    gtagEvent('catventure_land', { land: land.slug })
    setLandActive(v => {
      if (v && v.slug === land.slug) {
        return null
      }

      return land
    })
  }, [])

  useEffect(() => {
    if (!landActive) {
      resetZoom()
      return
    }

    const center = landActive.hexagons?.[landActive.ping] || landActive.hexagons?.[0]
    if (!center) {
      resetZoom()
      return
    }

    const [x, y] = center
    if (!x && !y) {
      resetZoom()
      return
    }

    select(ref.current)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .call(zoomRef.current.scaleTo, isLargeScreen() ? 1 : 1.5)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .transition().duration(400).call(zoomRef.current.translateTo, x, y)
  }, [height, landActive, resetZoom, width])

  useEffect(() => {
    select(ref.current)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .transition().duration(300).call(zoomRef.current.translateTo, (width * 3 / 4), (height * 3 / 4))
  }, [height, width])

  return (
    <div className={clsx('mx-auto', className)}>
      <div className="w-full h-full flex justify-center relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-hidden cursor-move" strokeWidth={1.5} ref={ref}>
          <g transform={`translate(${translate.x}, ${translate.y}) scale(${translate.k})`} className="stroke-gamefiDark-650">
            <path d={hexbin.mesh()} fill="none"></path>
          </g>
          {debug && <g transform={`translate(${translate.x}, ${translate.y}) scale(${translate.k})`} strokeWidth="0" className="">
            {centers.map((p, i) => <text key={i} transform={`translate(${p[0]}, ${p[1]})`} dy="0.38em" textAnchor="middle" fill="#fff">{i}</text>)}
          </g>}

          {lands.map(land => (
            <g onClick={(e) => {
              onLandsClicked(land, e)
            }} key={land.slug} transform={`translate(${translate.x}, ${translate.y}) scale(${translate.k})`} className={`transition-colors cursor-pointer fill-[#BEBEBE] hover:fill-[#00FFFF] hover:[fill-opacity:0.1] stroke-[#FFFFFF] hover:stroke-[#ABFFFF] ${landActive?.slug === land.slug && 'fill-[#93FF61] stroke-[#93FF61]'}`} fillOpacity={0.15} strokeOpacity={0.4}>
              {land.hexagons.map((p, i) => !!p && <path key={i} d={`M${p[0]},${p[1]}${hexbin.hexagon()}`}></path>)}

              <LandTooltip land={land}></LandTooltip>

              {land.hexagons[land.ping] && <g stroke="none" fillOpacity={80}>
                <circle r="30" cx={land.hexagons[land.ping][0]} cy={land.hexagons[land.ping][1]} fill="white" fillOpacity={0.1} className="animate-pulse"></circle>
                <circle r="15" cx={land.hexagons[land.ping][0]} cy={land.hexagons[land.ping][1]} fill="white" fillOpacity={0.3} className="animate-pulse"></circle>
                <circle r="5" cx={land.hexagons[land.ping][0]} cy={land.hexagons[land.ping][1]} fill="white"></circle>
              </g>}
            </g>
          ))}

          <g className={warningZoom ? 'block' : 'hidden'} onClick={() => setWarningZoom(false)}>
            <rect x="0" y="0" width="100%" height="100%" stroke="none" fill="black" fillOpacity={0.4} />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" stroke="none" fill="#fff" fontSize={20} fontWeight="semi-bold" className="font-atlas">Use Ctrl + scroll to zoom the map</text>
          </g>
        </svg>
        <div className={clsx('h-full bg-black absolute left-0 border-r border-gamefiDark-500 hidden md:flex flex-col w-1/3 xl:w-1/4 transition-transform', landActive ? 'translate-x-0' : 'translate-x-[-100%]')}>
          {landActive && <LandDetails land={landActive} onClose={() => setLandActive(null)}></LandDetails>}
        </div>

        <div className="absolute bottom-2 right-2 flex gap-x-2 leading-none text-sm lg:text-base">
          {translate?.k < (isLargeScreen ? 1.5 : 2) && <div onClick={() => zoomIn(isLargeScreen ? 1.5 : 2)} className="inline-flex items-center gap-2 border border-white rounded-md py-1 px-2 lg:px-4 lg:py-2 cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg> Zoom In
          </div>}
          {translate?.k && translate?.k > 1 && <div onClick={() => resetZoom()} className="inline-flex items-center gap-2 border border-white rounded-md py-1 px-2 lg:px-4 lg:py-2 cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg> Zoom Out
          </div>}

          {landActivePrev && <div onClick={() => {
            gtagEvent('catventure_land', { land: landActivePrev.slug })
            setLandActive(landActivePrev)
          }} className="select-none inline-flex items-center gap-2 border border-white rounded-md py-1 px-2 lg:px-4 lg:py-2 cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg> Prev
          </div>}
          {landActiveNext && <div onClick={() => {
            gtagEvent('catventure_land', { land: landActiveNext.slug })
            setLandActive(landActiveNext)
          }} className="select-none inline-flex items-center gap-2 border border-white rounded-md py-1 px-2 lg:px-4 lg:py-2 cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg> Next
          </div>}
        </div>
      </div>

      {landActive && <div className='md:hidden fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center'>
        <div className="max-w-md flex w-full h-full">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <LandDetails land={landActive} onClose={() => setLandActive(null)}></LandDetails>
        </div>
      </div>}
    </div>
  )
}

const LandDetails = ({ land, onClose }: { land: Land; onClose: () => void }) => {
  const [missions, setMissions] = useState([])

  useEffect(() => {
    fetcher(`https://catventure.gamefi.org/v1/projects/${land.slug}/tasks`)
      .then(response => {
        setMissions((response?.data?.tasks || []).filter(x => (x.name || '').indexOf('dummy') === -1))
      })
      .catch(() => {
        setMissions([])
      })
  }, [land?.slug])
  return <div className="flex flex-col w-full h-full sm:h-auto md:h-full font-atlas bg-black relative">
    <div className="block md:absolute xl:relative z-0 w-full"><Image src={land.img} alt="image" layout="responsive"></Image></div>
    <div className="p-4 flex-1 flex flex-col overflow-hidden z-10 md:pt-28 lg:pt-36 xl:pt-4">
      <p className="text-xs xl:text-sm 2xl:text-base text-white xl:text-gamefiDark-300 mb-2" style={{ textShadow: '0px 0px 4px black' }}>{land.categories.join(', ')}</p>
      <Link href={`/happy-gamefiversary/tasks/?g=${land?.slug}`} passHref={true}><a className="font-spotnik text-xl xl:text-2xl 2xl:text-[32px] leading-none uppercase font-bold hover:underline underline-offset-8" style={{ textShadow: '0px 0px 4px black' }}>{land.name}</a></Link>
      <p className="leading-normal my-4 xl:my-6 2xl:my-8 text-sm 2xl:text-base line-clamp-4 lg:line-clamp-3 xl:line-clamp-4 2xl:line-clamp-none" style={{ textShadow: '0px 0px 4px black' }}>
        {land.status !== 'INTRO' ? land.description : <>GameFi.org is a one-stop destination for Web3 gaming. We aim to build digital communities and manage virtual economies for mainstream adoption with <strong>ONE</strong> digital platform, <strong>ONE</strong> virtual identity requiring <strong>ZERO</strong> blockchain knowledge.</>}
      </p>
      <p className="font-bold mb-2 text-sm 2xl:text-base 2xl:mb-4">Missions</p>
      <div className="flex-1 overflow-auto mb-4">
        {!!missions?.length && missions.map(mission =>
          <div className="flex items-center mb-2 2xl:mb-4" key={mission.id}>
            <input type="radio" value="" disabled className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label className="ml-2 text-xs xl:text-sm 2xl:text-base dark:text-gray-300">{mission.name}</label>
          </div>
        )}

        {!missions?.length && 'Coming Soon'}
      </div>
      <Link href={`/happy-gamefiversary/tasks/?g=${land?.slug}`} passHref={true}>
        <a className="mt-auto bg-gradient-to-r from-[#93FF61] to-[#FAFF00] text-black font-casual font-semibold text-[12px] uppercase block w-full clipped-t-r py-3 mb-2 lg:mb-4 text-center" onClick={() => {
          gtagEvent('catventure_join', { land: land.slug })
        }}>
          Join Now
        </a>
      </Link>
    </div>
    <svg onClick={onClose} className="absolute right-1 top-1 w-6 h-6 cursor-pointer stroke-white hover:stroke-gamefiGreen-500 z-10 drop-shadow-xl" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L9 9L12 12M18 18L15 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
}

const LandTooltip = ({ land, width = 140, height = 61 }: { land: Land; width?: number; height?: number }) => {
  const position = land?.tooltipPosition()
  if (position?.length !== 2) {
    return null
  }

  const placement = land.tooltipPlacement || TooltipPlacement.TOP_RIGHT
  let [x, y] = position
  if ([TooltipPlacement.TOP, TooltipPlacement.TOP_RIGHT, TooltipPlacement.TOP_LEFT].indexOf(placement) > -1) {
    y = y - height
  }

  if (placement === TooltipPlacement.TOP) {
    x = x - width / 2
  }

  if (placement === TooltipPlacement.TOP_LEFT) {
    x = x - width
  }

  if (placement === TooltipPlacement.BOTTOM) {
    x = x - width / 2
  }

  if (placement === TooltipPlacement.BOTTOM_LEFT) {
    x = x - width
  }

  return <g strokeWidth={1} className="[fill-opacity:0.7] hover:[fill-opacity:1]">
    <rect x={x} y={y} width={width} height={height} fill="black" rx="2"></rect>
    <image xlinkHref={land.logo.src} x={x} y={y} width={width} height={height} />
  </g>
}
export default World
