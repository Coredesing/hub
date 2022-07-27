import { useRef } from 'react'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import GameInfo from './GameInfo'
import TokenPrice from './TokenPrice'
import Reviews from './Reviews'
import get from 'lodash.get'
import { getNetworkByAlias } from '@/components/web3'
import { nFormatter } from '@/components/Pages/Hub/utils'

interface GameDetail {
  introduction: string;
  playMode: string;
  playToEarnModel: string;
  roi: string;
  igoDate: string;
  gameDownloads: any;
  project: any;
  reviews: any;
  rates: any;
  totalReviews: any;
  pageCountReviews: number;
}

function formatRoi (price: string): string {
  if (!price) return '0'

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

const handleData = (
  {
    introduction = '',
    playMode = '',
    playToEarnModel = '',
    roi = '',
    igoDate = '',
    gameDownloads = null,
    project = null,
    reviews = [],
    rates = {},
    pageCountReviews = 0,
    totalReviews = 0
  }: GameDetail
) => {
  let dataGameInfo = null
  let dataTokenPrice = null
  let dataPreview = null
  let dataReviews = []

  if (!project) return { dataGameInfo, dataTokenPrice, dataPreview, dataReviews }

  const {
    logo,
    name,
    categories,
    highlightFeatures,
    roadmap,
    backers,
    advisor,
    studio,
    tokenomic
  } = get(project, 'data.attributes', null)

  const networkData = tokenomic?.network?.map(v => getNetworkByAlias(v.name)) || '-'

  dataGameInfo = {
    introduction,
    playMode,
    playToEarnModel,
    highlightFeatures,
    roadmap,
    backers: backers?.data,
    advisor,
    studio,
    categories: categories.data,
    gameDownloads: gameDownloads?.filter(e => e.type && e.link)
  }

  dataTokenPrice = {
    icon: get(tokenomic, 'icon.data.attributes.url', null),
    logo: get(logo, 'data.attributes.url', null),
    igoDate,
    tokenSymbol: tokenomic?.tokenSymbol || '-',
    publicPrice: tokenomic?.publicPrice,
    currentPrice: tokenomic?.currentPrice,
    network: networkData?.[0]?.image || '/',
    networkData: tokenomic?.network,
    address: tokenomic?.network?.[0]?.address || '-',
    roi: roi ? formatRoi(roi) : '-',
    name: name || '-',
    priceChange24h: tokenomic?.priceChange24h ? (tokenomic?.priceChange24h) : '-',
    marketCap: (tokenomic?.marketCap && tokenomic.marketCap !== '0')
      ? nFormatter(tokenomic?.marketCap)
      : ((tokenomic?.selfReportedMarketCap && tokenomic.selfReportedMarketCap !== '0') ? nFormatter(tokenomic?.selfReportedMarketCap) : '-'),
    volume24h: tokenomic?.volume24h ? nFormatter(tokenomic?.volume24h) : '-',
    volumeChange24h: tokenomic?.volumeChange24h ? (tokenomic?.volumeChange24h) : '-',
    totalSupply: tokenomic?.totalSupply ? nFormatter(tokenomic?.totalSupply) : '-',
    valuation: tokenomic?.valuation ? nFormatter(tokenomic?.valuation) : '-',
    initTokenCirculation: tokenomic?.initTokenCirculation ? nFormatter(tokenomic?.initTokenCirculation) : '-',
    initialMarketCap: tokenomic?.initMarketCap ? nFormatter(tokenomic?.initMarketCap) : '-',
    tokenUtilities: tokenomic?.tokenUtilities,
    tokenEconomy: tokenomic?.tokenEconomy,
    tokenDistribution: tokenomic?.tokenDistribution,
    vestingSchedule: tokenomic?.vestingSchedule,
    chartSymbol: tokenomic?.chartSymbol || false
  }

  dataPreview = {}

  dataReviews = reviews?.data?.length && reviews.data.map(e => {
    const { author = {}, publishedAt, rate, review, title, likeCount, dislikeCount, commentCount } = e?.attributes || {}
    const { level, rank, repPoint, firstName, lastName, avatar, walletAddress, reviewCount, rates } = author?.data?.attributes || {}

    return {
      id: e.id || '',
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

  return { dataGameInfo, dataTokenPrice, dataPreview, dataReviews, dataRating: rates, totalReviews, pageCountReviews }
}

interface PropsTab {
  data: any;
  tab: any;
  index: any;
  setIndex: (tab: number) => any;
}

const Tab = ({ data, tab, index, setIndex }: PropsTab) => {
  const tabRef = useRef(null)
  const { dataGameInfo, dataTokenPrice, dataReviews, dataRating, totalReviews, pageCountReviews } = handleData(data)

  return (
    <div>
      <Tabs
        titles={[
          'Game information',
          'Token',
          'Rating & Reviews'
        ]}
        currentValue={index}
        onChange={setIndex}
        className="mt-5 md:mt-10"
      />
      <div className="mt-6 mb-10 editor-content text-gray-200 leading-6">
        <TabPanel value={tab} index={'info'}>
          {dataGameInfo && <GameInfo data={dataGameInfo} tabRef={tabRef}/>}
        </TabPanel>
        <TabPanel value={tab} index={'token'}>
          {dataTokenPrice ? <TokenPrice data={dataTokenPrice} tabRef={tabRef}/> : <div className="uppercase font-bold text-3xl mb-6 font-mechanic">Coming Soon</div>}
        </TabPanel>
        <TabPanel value={tab} index={'reviews'}>
          <Reviews data={dataReviews} totalReviews={totalReviews} pageCountReviews={pageCountReviews} rates={dataRating} id={data?.id} tabRef={tabRef} />
        </TabPanel>
      </div>
    </div>
  )
}

export default Tab
