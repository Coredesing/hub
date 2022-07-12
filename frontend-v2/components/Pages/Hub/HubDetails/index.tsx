import { useState, useEffect } from 'react'
import Carousel from './Carousel'
import GameRight from './GameRight'
import MoreLike from './MoreLike'
import { gtagEvent, numberWithCommas, printNumber, shorten, formatPrice, imageCMS, isEmptyDataParse } from '@/utils'
import RenderEditorJs from '@/components/Base/RenderEditorJs'
import Image from 'next/image'
import BGRank from '@/assets/images/aggregator/bg-rank-gamefi.png'
import BGRankVer from '@/assets/images/aggregator/bg-rank-gamefi-ver.png'
import { useScreens } from '@/components/Pages/Home/utils'
import get from 'lodash.get'
import { format } from 'date-fns'
import { AVAX, BNB, ETH, FTM, MATIC, switchNetwork } from '@/components/web3'
import ReviewList from '@/components/Pages/Hub/Reviews/List'
import isEmpty from 'lodash.isempty'
import { PriceChange, PriceChangeBg } from './PriceChange'
import News from './News/index'
import Tippy from '@tippyjs/react'
import TwitterFeed from './TwitterFeed'
import { useMyWeb3 } from '@/components/web3/context'
import toast from 'react-hot-toast'
import ERC20_ABI from '@/components/web3/abis/ERC20.json'
import { ethers } from 'ethers'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { nFormatter } from '@/components/Pages/Hub/utils'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const networks = [{
  name: 'Ethereum',
  alias: 'eth',
  currency: ETH.symbol,
  image: require('@/assets/images/networks/eth.svg'),
  image2: require('@/assets/images/networks/ethereum.svg')
}, {
  name: 'BNB Chain',
  alias: 'bsc',
  currency: BNB.symbol,
  image: require('@/assets/images/networks/bsc.svg'),
  image2: require('@/assets/images/networks/bnbchain.svg'),
  colorText: '#28282E'
}, {
  name: 'Polygon',
  alias: 'polygon',
  currency: MATIC.symbol,
  image: require('@/assets/images/networks/matic.svg'),
  image2: require('@/assets/images/networks/polygon.svg')
}, {
  name: 'Avalanche',
  alias: 'avax',
  currency: AVAX.symbol,
  image: require('@/assets/images/networks/avax.svg'),
  image2: require('@/assets/images/networks/avalanche.svg')
}, {
  name: 'Arbitrum One',
  alias: 'arb',
  currency: ETH.symbol,
  image: require('@/assets/images/networks/arb.svg'),
  image2: require('@/assets/images/networks/arbitrum.svg')
}, {
  name: 'Fantom Opera',
  alias: 'ftm',
  currency: FTM.symbol,
  image: require('@/assets/images/networks/ftm.svg'),
  image2: require('@/assets/images/networks/fantom.svg')
}, {
  name: 'Solana',
  alias: 'solana',
  currency: 'SOL',
  image: require('@/assets/images/networks/solana.svg'),
  image2: require('@/assets/images/networks/solana.svg')
}, {
  name: 'Algorand',
  alias: 'algorand',
  currency: 'ALGO',
  image: require('@/assets/images/networks/algorand.png'),
  image2: require('@/assets/images/networks/algorand.png')
}]

const DEFAULT_HEIGHT_BEFORE_SHOW_MORE = 168

interface GameDetail {
  name: string;
  rate: string;
  roi: string;
  igoDate: string;
  totalViews: number;
  totalFavorites: number;
  totalReviews: number;
  gameDownloads: any;
  releaseStatus: string;
  youtubeLinks: any;
  mobileThumbnail: any;
  ranking: any;
  gallery: any;
  project: any;
  reviews: any;
  rates: any;
  userRanks: any;
}

function formatRoi (price: string): string {
  if (!price) return '-'

  const priceInFloat = parseFloat(price)
  if (priceInFloat > 1) {
    return `${priceInFloat.toFixed(4)}`
  }

  const matches = price?.toString()?.match(/(\.([0])*)/)
  if (!matches?.[0]) {
    return price
  }

  const position = price?.toString()?.indexOf(matches[0])
  return `${price?.toString()?.slice(0, position + matches[0]?.length + 4)}`
}

function isOverDefaultHeight (id) {
  const el = document.getElementById(id)
  const divHeight = el?.offsetHeight

  return divHeight > DEFAULT_HEIGHT_BEFORE_SHOW_MORE
}

const handleData = (
  {
    name = '',
    rate = '',
    roi = '',
    igoDate = '',
    releaseStatus = '',
    totalViews = 0,
    totalFavorites = 0,
    totalReviews = 0,
    youtubeLinks = [],
    gameDownloads = null,
    mobileThumbnail = null,
    ranking = null,
    gallery = null,
    project = null,
    reviews = [],
    rates = {},
    userRanks = {}
  }: GameDetail
) => {
  let items = []
  let dataGameRight = null
  let dataOverview = null
  let dataTokenSummary = null
  let dataReviews = []
  let dataGuilds = null
  let dataUserRanks = []

  if (!gallery?.data) return { items, dataGameRight, dataOverview, dataTokenSummary, dataGuilds, dataReviews, dataUserRanks }

  const images = gallery.data

  if (!images?.length) return { items, dataGameRight, dataOverview, dataTokenSummary, dataGuilds, dataReviews, dataUserRanks }

  items = images
    .map(g => g.attributes)
    .filter(x => !!x)

  const video = youtubeLinks.filter(x => !!x.url)

  items = video?.length !== 0 ? video.concat(items) : items

  if (!mobileThumbnail?.data) return { items, dataGameRight, dataOverview, dataTokenSummary, dataGuilds, dataReviews, dataUserRanks }

  if (!project) return { items, dataGameRight, dataOverview, dataTokenSummary, dataGuilds, dataReviews, dataUserRanks }

  const { logo, categories, studio, tokenomic, shortDesc } = get(project, 'data.attributes', {})

  dataGuilds = get(project, 'data.attributes.guilds.data', [])

  const networkData = tokenomic?.network?.map(v => {
    return networks.find(network => network.alias === v.name)
  }) || ''

  dataGameRight = {
    shortDesc: shortDesc || '-',
    developer: studio?.[0]?.name || '-',
    igoDate,
    currentPrice: tokenomic?.currentPrice,
    rating: parseFloat(rate) || '-',
    network: networkData,
    releaseStatus: releaseStatus || '-',
    guildSupported: dataGuilds?.length || '',
    mobileThumbnail: mobileThumbnail.data?.[0]?.attributes?.url || '-',
    gameDownloads,
    categories: categories?.data || [],
    totalFavorites: nFormatter(totalFavorites)
  }

  dataOverview = {
    cmcRank: ranking?.cmcRank && ranking?.cmcRank !== '0' ? numberWithCommas(ranking?.cmcRank) : '-',
    gamefiRank: ranking?.gamefiRank && ranking?.gamefiRank !== '0' ? numberWithCommas(ranking?.gamefiRank) : '-',
    coingeckoRank: ranking?.coingeckoRank && ranking?.coingeckoRank !== '0' ? numberWithCommas(ranking?.coingeckoRank) : '-',
    cryptoRank: ranking?.cryptoRank && ranking?.cryptoRank !== '0' ? numberWithCommas(ranking?.cryptoRank) : '-',
    totalViews: nFormatter(totalViews),
    totalFavorites: nFormatter(totalFavorites),
    totalReviews: nFormatter(totalReviews)
  }

  dataTokenSummary = {
    icon: get(tokenomic, 'icon.data.attributes.url', null),
    logo: get(logo, 'data.attributes.url', null),
    igoDate,
    tokenSymbol: tokenomic?.tokenSymbol || '-',
    publicPrice: tokenomic?.publicPrice,
    network: networkData?.[0]?.image || '/',
    networkData,
    address: tokenomic?.network?.[0]?.address || '-',
    roi: roi ? formatRoi(roi) : '-',
    name: name || '-',
    currentPrice: tokenomic?.currentPrice,
    priceChange24h: tokenomic?.priceChange24h ? (tokenomic?.priceChange24h) : '-',
    marketCap: (tokenomic?.marketCap && tokenomic.marketCap !== '0')
      ? nFormatter(tokenomic?.marketCap)
      : ((tokenomic?.selfReportedMarketCap && tokenomic.selfReportedMarketCap !== '0') ? nFormatter(tokenomic?.selfReportedMarketCap) : '-'),
    volume24h: tokenomic?.volume24h ? nFormatter(tokenomic?.volume24h) : '-',
    volumeChange24h: tokenomic?.volumeChange24h ? (tokenomic?.volumeChange24h) : '-',
    totalSupply: tokenomic?.totalSupply ? nFormatter(tokenomic?.totalSupply) : '-',
    valuation: tokenomic?.valuation ? nFormatter(tokenomic?.valuation) : '-',
    initTokenCirculation: tokenomic?.initTokenCirculation ? nFormatter(tokenomic?.initTokenCirculation) : '-',
    initialMarketCap: tokenomic?.initMarketCap ? nFormatter(tokenomic?.initMarketCap) : '-'
  }

  dataReviews = reviews?.data?.length && reviews.data.map(e => {
    const { author = {}, publishedAt, rate, review, title, likeCount, dislikeCount, commentCount } = e?.attributes || {}
    const { level, rank, repPoint, firstName, lastName, avatar, walletAddress, reviewCount, rates } = author?.data?.attributes || {}

    return {
      id: e?.id || '',
      publishedAt,
      rate,
      title,
      review,
      likeCount,
      dislikeCount,
      commentCount,
      user: {
        id: get(author, 'data.id'),
        level,
        rank,
        firstName,
        lastName,
        reps: repPoint,
        avatar: {
          url: avatar?.data?.attributes?.url
        },
        walletAddress,
        reviewCount,
        rates
      }
    }
  })

  const typeRank = get(userRanks, 'fields', []).filter(e => e.name === 'rank')
  dataUserRanks = get(typeRank?.[0] || {}, 'type.enumValues', []).map(e => e.name)

  return { items, dataGameRight, dataOverview, dataTokenSummary, dataGuilds, dataReviews, dataRating: rates, dataUserRanks, totalReviews: get(reviews, 'meta.pagination.total', 0) }
}

const GamefiRanking = ({ data }) => {
  const [bg, setBg] = useState(BGRank)
  const screen = useScreens()

  useEffect(() => {
    setBg(screen.mobile === true ? BGRankVer : BGRank)
  }, [screen])

  return (
    <div className="flex flex-col md:flex-row w-full md:h-44 items-center justify-between mt-10 md:mt-14 md:pl-4 rounded-sm" style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover' }}>
      <div className='w-full md:w-96 p-5 md:p-0 relative'>
        <div className="flex flex-col md:w-80 h-36 bg-black px-8 py-4 rounded-md">
          <div className='flex font-mechanic font-semibold text-base items-center'>
            <span className='mr-[7px]'>GAMEFI RANKING</span>
            <Tippy
              placement="top"
              content={<div className='w-52 p-2 md:w-52'>GameFi Ranking (GFR) is the rank of a project on GameFi.org. This indicator is calculated according to GameFi.org&#39;s algorithm and methodology.</div>}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="white" />
              </svg>
            </Tippy>
          </div>
          <div className="flex items-center font-mechanic h-full">
            <div className="text-3xl font-medium"><span>Coming Soon</span></div>
          </div>
        </div>
        <div className='absolute top-7 md:top-1 left-64 md:left-[200px]'>
          <Image src={require('@/assets/images/aggregator/rank.png')} alt="" width={140} height={130} />
        </div>
      </div>
      <div className='hidden md:flex justify-evenly w-5/6'>
        <div className="flex flex-col justify-evenly w-72 h-36 text-black">
          <div className="flex">
            <p className='font-medium'>Coinmarketcap Ranking</p>
            <strong className="ml-auto">{data?.cmcRank}</strong>
          </div>
          <div className="flex">
            <p className='font-medium'>Coingecko Ranking</p>
            <strong className="ml-auto">{data?.coingeckoRank}</strong>
          </div>
          <div className="flex">
            <p className='font-medium'>Cryptorank Ranking</p>
            <strong className="ml-auto">{data?.cryptoRank}</strong>
          </div>
        </div>
        <div className="flex flex-col justify-evenly w-64 h-36 text-black">
          <div className="flex">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_8008_18455)">
                  <path d="M8 14C11.6113 14 14.4201 10.9 15.6238 9.1C16.1254 8.4 16.1254 7.5 15.6238 6.8C14.4201 5.1 11.6113 2 8 2C4.38871 2 1.57994 5.1 0.376176 6.9C-0.125392 7.6 -0.125392 8.5 0.376176 9.1C1.57994 10.9 4.38871 14 8 14ZM8 5C9.70533 5 11.0094 6.3 11.0094 8C11.0094 9.7 9.70533 11 8 11C6.29467 11 4.9906 9.7 4.9906 8C4.9906 6.3 6.29467 5 8 5Z" fill="#C8C8C8" />
                </g>
                <defs>
                  <clipPath id="clip0_8008_18455">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p className='font-medium  ml-2'>Views</p>
            </div>
            <strong className="ml-auto">{data?.totalViews}</strong>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6234 6.25585H8.87353V2.76758C8.87353 1.45947 8.17587 1.02344 7.12939 1.02344C6.86777 1.02344 6.60615 1.19785 6.60615 1.45947C6.60615 1.45947 4.60039 7.99999 4.51318 7.99999V14.9765H12.013C13.1467 14.9765 14.1059 14.1045 14.2804 12.9708L14.978 8.95926C15.0652 8.26161 14.8908 7.56395 14.4548 7.12792C14.0187 6.51747 13.3211 6.25585 12.6234 6.25585Z" fill="#C8C8C8" />
                <path d="M2.76904 8H1.0249V14.9766H2.76904V8Z" fill="#C8C8C8" />
              </svg>
              <p className='font-medium  ml-2'>Likes</p>
            </div>
            <strong className="ml-auto">{data?.totalFavorites}</strong>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75 2H13.25C13.664 2 14 2.336 14 2.75V10.25C14 10.664 13.664 11 13.25 11H9.5L5 14V11H2.75C2.336 11 2 10.664 2 10.25V2.75C2 2.336 2.336 2 2.75 2Z" fill="#C8C8C8" />
              </svg>
              <p className='font-medium  ml-2'>Reviews</p>
            </div>
            <strong className="ml-auto">{data?.totalReviews}</strong>
          </div>
        </div>
      </div>
      <div className='flex md:hidden w-full'>
        <div className="flex flex-col justify-evenly w-full px-5 md:w-64 md:px-0 h-72 text-black">
          <div className="flex">
            <p className='font-medium'>Coinmarketcap Ranking</p>
            <strong className="ml-auto">{data?.cmcRank}</strong>
          </div>
          <div className="flex">
            <p className='font-medium'>Coingecko Ranking</p>
            <strong className="ml-auto">{data?.coingeckoRank}</strong>
          </div>
          <div className="flex">
            <p className='font-medium'>Cryptorank Ranking</p>
            <strong className="ml-auto">{data?.cryptoRank}</strong>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_8008_18455)">
                  <path d="M8 14C11.6113 14 14.4201 10.9 15.6238 9.1C16.1254 8.4 16.1254 7.5 15.6238 6.8C14.4201 5.1 11.6113 2 8 2C4.38871 2 1.57994 5.1 0.376176 6.9C-0.125392 7.6 -0.125392 8.5 0.376176 9.1C1.57994 10.9 4.38871 14 8 14ZM8 5C9.70533 5 11.0094 6.3 11.0094 8C11.0094 9.7 9.70533 11 8 11C6.29467 11 4.9906 9.7 4.9906 8C4.9906 6.3 6.29467 5 8 5Z" fill="#C8C8C8" />
                </g>
                <defs>
                  <clipPath id="clip0_8008_18455">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p className='font-medium  ml-2'>Views</p>
            </div>
            <strong className="ml-auto">{data?.totalViews}</strong>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6234 6.25585H8.87353V2.76758C8.87353 1.45947 8.17587 1.02344 7.12939 1.02344C6.86777 1.02344 6.60615 1.19785 6.60615 1.45947C6.60615 1.45947 4.60039 7.99999 4.51318 7.99999V14.9765H12.013C13.1467 14.9765 14.1059 14.1045 14.2804 12.9708L14.978 8.95926C15.0652 8.26161 14.8908 7.56395 14.4548 7.12792C14.0187 6.51747 13.3211 6.25585 12.6234 6.25585Z" fill="#C8C8C8" />
                <path d="M2.76904 8H1.0249V14.9766H2.76904V8Z" fill="#C8C8C8" />
              </svg>
              <p className='font-medium  ml-2'>Likes</p>
            </div>
            <strong className="ml-auto">{data?.totalFavorites}</strong>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75 2H13.25C13.664 2 14 2.336 14 2.75V10.25C14 10.664 13.664 11 13.25 11H9.5L5 14V11H2.75C2.336 11 2 10.664 2 10.25V2.75C2 2.336 2.336 2 2.75 2Z" fill="#C8C8C8" />
              </svg>
              <p className='font-medium  ml-2'>Reviews</p>
            </div>
            <strong className="ml-auto">{data?.totalReviews}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export const KeyMetrics = ({ data }) => {
  return (
    <div className='grid md:grid-rows-3 md:grid-flow-col gap-4 rounded-sm'>
      <div className='flex justify-between md:grid md:grid-cols-2 gap-2'>
        <div className='text-white/50'><span>Symbol</span></div>
        <div className='flex'>
          <img src={imageCMS(data?.icon)} alt="" className='w-6 h-6 mr-3' />
          <strong>{data?.tokenSymbol !== '-' && '$'}{data?.tokenSymbol}</strong>
        </div>
      </div>
      <div className='flex justify-between md:grid md:grid-cols-2 gap-2'>
        <div className='text-white/50'><span>Public sales price</span></div>
        <div className='flex'>
          <img src={imageCMS(data?.icon)} alt="" className='w-6 h-6 mr-3' />
          <strong>{data?.publicPrice > 0 ? `$${printNumber(data?.publicPrice)}` : '-'}</strong>
        </div>
      </div>
      <div className='flex justify-between md:grid md:grid-cols-2 gap-2'>
        <div className='text-white/50'><span>Token Supply</span></div>
        <div className='flex'>
          <div className='w-6 h-6 mr-3'></div>
          <strong>{data?.totalSupply}</strong>
        </div>
      </div>
      <div className='flex justify-between md:grid md:grid-cols-2 gap-2'>
        <div className='text-white/50'><span>Project Valuation</span></div>
        <div className='flex'>
          <strong>{data?.valuation}</strong>
        </div>
      </div>
      <div className='flex justify-between md:grid md:grid-cols-2 gap-2'>
        <div className='text-white/50'><span>Initial Token Circulation</span></div>
        <div className='flex'>
          <strong>{data?.initTokenCirculation}</strong>
        </div>
      </div>
      <div className='flex justify-between md:grid md:grid-cols-2 gap-2'>
        <div className='text-white/50'><span>Initial Market Cap</span></div>
        <div className='flex'>
          <strong>{data?.initialMarketCap}</strong>
        </div>
      </div>
    </div>
  )
}

export const TokenSummary = ({ data }) => {
  const { library, network } = useMyWeb3()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const networkData = get(data, 'networkData.[0]') || {}
  const { network: poolNetwork } = useLibraryDefaultFlexible(networkData?.name)
  const addToWallet = async () => {
    try {
      if (!library?.provider?.isMetaMask) {
        toast.error('MetaMask wallet is not found!')
        return
      }

      if (network?.alias !== networkData?.name) {
        return switchNetwork(library?.provider, poolNetwork?.id)
      }

      const tokenContract = new ethers.Contract(networkData.address, ERC20_ABI, library.getSigner())

      if (!tokenContract) {
        return
      }

      const symbol = await tokenContract.symbol()
      const decimals = await tokenContract.decimals()
      const name = await tokenContract.name()

      await library?.provider?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenContract.address,
            symbol,
            decimals,
            name
          }
        }
      })
    } catch (error) {
      console.debug('addToWallet catch err: ', error)
    }
  }

  const onCopyContractAddress = (address = '') => {
    if (!address) return

    navigator.clipboard.writeText(address)
    toast.success('Copied!', { position: 'top-center' })
    setCopiedAddress(true)
  }

  return (
    <>
      <div className='flex flex-col md:flex-row p-6 md:px-4 md:py-3 items-center bg-gradient-to-r from-[#3B3F4B] to-[#2A2D36] rounded gap-7 md:gap-0'>
        <div className='flex mr-auto rounded items-center'>
          <div className='flex w-10 h-10 mr-3 items-center'>
            {data?.logo && <img src={imageCMS(data?.logo)} alt="logo-token" />}
          </div>
          <div className='mx-3'><span>{data?.name}</span></div>
          <Tippy
            placement="top-start"
            content={<div className='w-52 p-2 md:w-52'>The database is calculated from many sources in the market</div>}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 12C7.4 12 7 11.6 7 11C7 10.4 7.4 10 8 10C8.6 10 9 10.4 9 11C9 11.6 8.6 12 8 12ZM9 9H7V4H9V9Z" fill="white" />
            </svg>
          </Tippy>
        </div>
        {data?.address !== '-' && <div className='flex items-center w-full md:w-auto flex-wrap'>
          <span className='md:mr-7 text-sm mr-5'>Contract</span>
          {data?.network && <Image width={20} height={20} className="inline-block rounded-full" src={data?.network} alt=""></Image>}
          <Tippy content={`${copiedAddress ? 'Copied' : 'Click to copy'}`}>
            <div className='flex-1 font-semibold overflow-hidden mx-1 sm:mx-3 text-sm cursor-pointer min-w-[100px]' onMouseOut={() => setCopiedAddress(false)} onClick={() => onCopyContractAddress(data?.address)}><span>{shorten(data?.address, 15)}</span></div>
          </Tippy>
          <Tippy content="Add to Metamask">
            <button
              className="w-6 h-6 hover:opacity-90"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => addToWallet()}
            >
              <Image src={require('@/assets/images/wallets/metamask.svg')} alt=""></Image>
            </button>
          </Tippy>
        </div>}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-12 2xl:gap-20'>
        <div className='flex flex-col justify-between gap-5 md:gap-0 md:col-span-3 xl:col-span-1'>
          <div className='uppercase text-white/50 text-xs font-bold'><span>Current price</span></div>
          <div className='flex items-center'>
            <div className='text-2xl font-mechanic'><strong>{data?.currentPrice > 0 ? `${formatPrice(data?.currentPrice)}` : '-'}</strong></div>
            <PriceChangeBg className='mx-2 text-xs gap-1 py-[2px]' priceChange24h={data?.priceChange24h} />
          </div>
        </div>
        <div className='flex flex-col justify-between gap-5 md:gap-0 mt-2 md:mt-0'>
          <div className='flex'>
            <div className='uppercase text-sm text-white/50 mr-auto'><span>Token roi:</span></div>
            <div className='font-semibold text-sm'><span>{data?.roi}{data?.roi !== '-' && 'x'}</span></div>
          </div>
          <div className='flex items-center'>
            <div className='uppercase text-sm text-white/50 mr-auto'><span>Token:</span></div>
            {data?.icon && <img src={imageCMS(data?.icon)} alt="" className='w-4 h-4 mr-3' />}
            <div className='font-semibold text-sm'><span>{data?.tokenSymbol}</span></div>
          </div>
        </div>
        <div className='flex flex-col justify-between gap-5 md:gap-0'>
          <div className='flex'>
            <div className='uppercase text-sm text-white/50 mr-auto'><span>Market Cap:</span></div>
            <div className='font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap'><strong>{data?.marketCap}</strong></div>
          </div>
          <div className='flex'>
            <div className='uppercase text-sm text-white/50 mr-auto'><span>Vol (24h):</span></div>
            <div className='font-semibold text-sm'><span>{data?.volume24h}</span></div>
            {!!data?.volumeChange24h && (
              <PriceChange className='text-xs gap-1 py-[2px] pr-0' priceChange24h={data?.volumeChange24h} />
            )}
          </div>
        </div>
        <div className='flex flex-col justify-between gap-5 md:gap-0'>
          <div className='flex'>
            <div className='uppercase text-sm text-white/50 mr-auto'><span>Public sales price:</span></div>
            <div className='font-semibold text-sm'><span>{data?.publicPrice > 0 ? `$${printNumber(data?.publicPrice)}` : '-'}</span></div>
          </div>
          <div className='flex'>
            <div className='uppercase text-sm text-white/50 mr-auto'><span>{data?.igoDate && 'Igo date:'}</span></div>
            <div className='font-semibold text-sm'><span>{data?.igoDate && format(new Date(data?.igoDate), 'dd MMM, yyyy')}</span></div>
          </div>
        </div>
      </div>
    </>
  )
}

const HubDetail = ({ data }) => {
  const [isOver, setIsOverDefaultHeight] = useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const [introductionHeight, setIntroductionHeight] = useState(0)

  const router = useRouter()
  const screen = useScreens()
  const { items, dataGameRight, dataOverview, dataTokenSummary, dataGuilds, dataReviews, dataRating, dataUserRanks } = handleData(data)

  const isMobile = screen.mobile || screen.tablet

  useEffect(() => {
    const _isOver = isOverDefaultHeight('introduction')
    setIsOverDefaultHeight(_isOver)
  }, [introductionHeight])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const elm = document.getElementById('introduction')
    if (!elm) return
    setIntroductionHeight(elm.clientHeight)
  })

  const slug = router.query?.slug?.toString() || ''
  return (
    <div className="flex flex-col font-casual gap-2 w-full">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-8/12 relative">
          <GameRight
            data={dataGameRight}
            dataBase={data}
            callApi={isMobile}
            className="mt-6 md:hidden" />
          <Carousel items={items} length={data?.youtubeLinks?.length} className="" />
        </div>
        <GameRight data={dataGameRight} dataBase={data} callApi={false} className="hidden md:block" />
      </div>
      <GamefiRanking data={dataOverview} />
      {isEmptyDataParse(data?.introduction) && <>
        <div className="flex items-center w-full mt-5 md:mt-12">
          <div className="mt-6 text-lg md:text-2xl font-mechanic uppercase mr-2"><strong>Introduction</strong></div>
        </div>
        <div id='container_introduction' className={!isShowMore ? 'max-h-[168px] overflow-hidden relative' : ''}>
          <RenderEditorJs data={data?.introduction} index={'introduction'} />
          <div className={`absolute z-40 bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gamefiDark-900 to-transparent ${isOver && !isShowMore ? 'visible' : 'invisible'}`} />
        </div>
        {
          isOver && !isShowMore && <div
            className='w-fit self-end capitalize font-semibold text-gamefiGreen-500 text-md leading-5 cursor-pointer hover:underline hover:opacity-95 font-casual'
            onClick={() => setIsShowMore(true)}>Read More</div>
        }
      </>}
      {(dataTokenSummary?.currentPrice > 0 || dataTokenSummary?.publicPrice > 0) && <div className='flex flex-col bg-[#292C36] gap-6 mt-9 md:mt-14 px-6 py-8 md:p-8 rounded-sm'>
        <div className='flex items-center'>
          <div className='text-lg md:text-2xl font-mechanic uppercase'><strong>Token Summary</strong></div>
          <Link href={`/hub/${data?.slug}/token`} passHref>
            <a className="p-2 text-gamefiGreen cursor-pointer text-sm"
              onClick={() => {
                gtagEvent('hub_token_details', { game: data?.slug })
              }}>
              <span className='mt-auto'>View Details</span>
            </a>
          </Link>
        </div>
        {
          dataTokenSummary?.currentPrice > 0
            ? (
              <TokenSummary data={dataTokenSummary} />
            )
            : (
              <KeyMetrics data={dataTokenSummary} />
            )
        }
      </div>}

      {!!dataGuilds?.length && <>
        <div className="mt-10 md:mt-16 text-lg md:text-2xl font-mechanic uppercase flex items-center">
          <strong className="pr-2">Guilds Supported</strong>
          <Tippy
            placement="top"
            content={<div className='w-52 p-2 md:w-52'>Guilds Supported is the list of guilds that provide scholarships for this game.</div>}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="white" />
            </svg>
          </Tippy>
        </div>
        <div className='mt-2 md:mt-4'>
          {dataGuilds?.map((e, i) => {
            const attributes = get(e, 'attributes', {})
            const guilds = {
              logo: get(attributes, 'logo.data.attributes.url', null),
              name: attributes?.name || '-',
              region: attributes?.region || '-',
              discordMember: attributes?.discordMember ? numberWithCommas(attributes?.discordMember) : '-',
              scholarship: attributes?.scholarship ? numberWithCommas(attributes?.scholarship) : '-',
              slug: get(attributes, 'slug')
            }

            return (
              <div className="flex flex-col md:flex-row w-full md:h-24 p-4 bg-[#292C36] mt-2 rounded-sm" key={i}>
                <a className='flex items-center' href={`/guilds/${guilds.slug}`}>
                  <img className="w-16 h-16 object-cover mr-4" src={imageCMS(guilds?.logo)} alt="" />
                  <div className='w-[176px] font-semibold'><p>{guilds?.name}</p></div>
                </a>
                <div className='flex-1 grid grid-cols-2 mt-6 md:mt-0 md:grid-cols-3 gap-6 md:gap-6 md:ml-20'>
                  <div className="flex flex-col md:h-full py-1 md:mx-3 justify-center">
                    <div className="text-xs uppercase mb-1 opacity-50 font-mechanic font-semibold"><span>Region</span></div>
                    <p>{guilds?.region}</p>
                  </div>
                  <div className="flex flex-col md:h-full py-1 md:mx-3 justify-center">
                    <div className="text-xs uppercase mb-1 opacity-50 font-mechanic font-semibold"><span>Discord member</span></div>
                    <p>{guilds?.discordMember}</p>
                  </div>
                  <div className="flex flex-col md:h-full py-1 md:mx-3 justify-center">
                    <div className="text-xs uppercase mb-1 opacity-50 font-mechanic font-semibold"><span>Scholarship</span></div>
                    <p>{guilds?.scholarship}</p>
                  </div>
                </div>
              </div>)
          })
          }
        </div></>
      }
      <News />
      <TwitterFeed />
      <div>
        <div className="flex items-center mt-10 md:mt-14 text-lg md:text-2xl font-mechanic uppercase">
          <strong>Reviews</strong>
          {!isEmpty(dataReviews) && <Link href={`/hub/${slug}/reviews/createOrUpdate`} passHref><a onClick={() => {
            gtagEvent('hub_write_review', { game: slug })
          }} className="bg-gamefiGreen-700 md:self-end text-gamefiDark-900 py-0.5 px-6 rounded-sm clipped-t-r hover:opacity-90 cursor-pointer ml-auto">
            <span className="uppercase font-bold text-[13px] tracking-[0.02em] text-[#0D0F15] not-italic font-mechanic">Write my review</span>
          </a></Link>}
        </div>
        {
          !isEmpty(dataReviews)
            ? <>
              <ReviewList viewAll={dataReviews?.length >= 5} data={{ data: dataReviews, rates: dataRating }} ranks={dataUserRanks} />
            </>
            : <>
              <div className='flex flex-col w-full items-center'>
                <Image src={require('@/assets/images/hub/no-review.png')} width={93} height={75} alt="no-review" />
                <span className='text-sm font-normal opacity-50 mt-[14px]'>No review available</span>
                <Link href={`/hub/${slug}/reviews/createOrUpdate`} passHref>
                  <a className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1 mt-6" onClick={() => {
                    gtagEvent('hub_write_review', { game: slug })
                  }}>
                    <div className='font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-[13px]'>
                      Write first review
                    </div>
                  </a>
                </Link>
              </div>
            </>
        }
      </div>
      <div className="mt-10 md:mt-14 text-lg md:text-2xl font-mechanic uppercase"><strong>Related games</strong></div>
      <MoreLike categories={get(data, 'project.data.attributes.categories.data', [])} slug={slug} />
    </div>
  )
}

export default HubDetail
