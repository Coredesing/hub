import GameCarousel from '@/components/Pages/Home/GameCarouselV2'

import { useMemo } from 'react'
import IGOList from 'components/Pages/Home/IGOList'
import GameList from 'components/Pages/Home/GameList'
import Instruction from 'components/Pages/Home/Instruction'

import { INTERNAL_BASE_URL } from '@/utils/constants'
import Partners from '@/components/Pages/Home/Partners'
import { fetcher } from '@/utils'
import Layout from '@/components/Layout'
import Banners from '@/components/Banners'
import INOList from '@/components/Pages/Home/INOList'
import { client } from '@/graphql/apolloClient'
import { GET_BANNER_AGGREGATORS } from '@/graphql/aggregator'
import { normalize } from '@/graphql/utils'

export type CarouselItem = {
  id: string | number;
  title: string;
  likes: number;
  aggregatorSlug: string;
  slug: string;
  video: string;
  thumbnail: string;
  shortDescription: string;
  upcoming: boolean;
  poolInfo: {
    whitelistStartTime?: Date;
    whitelistEndTime?: Date;
    saleStartTime?: Date;
    saleEndTime?: Date;
    campaignStatus?: string;
    buyType?: string;
  };
}
const PageIndex = ({ currentPools = [], cmsData = [] }) => {
  const [listUpcoming, listPublic] = useMemo<any[]>(() => {
    const origin = currentPools
    let remain = origin
    const tba = origin.filter(item => !item.start_join_pool_time)
    remain = remain.filter(item => !tba.includes(item))
    const preWhitelist = remain.filter(item => new Date().getTime() < new Date(Number(item?.start_join_pool_time) * 1000).getTime()).sort((a, b) => {
      if (a?.start_join_pool_time < b?.start_join_pool_time) return -1
      if (a?.start_join_pool_time > b?.start_join_pool_time) return 1
      return 0
    })
    remain = remain.filter(item => !preWhitelist.includes(item))
    const whitelist = remain.filter(item => new Date().getTime() < new Date(Number(item?.end_join_pool_time) * 1000).getTime()).sort((a, b) => {
      if (a?.end_join_pool_time < b?.end_join_pool_time) return -1
      if (a?.end_join_pool_time < b?.end_join_pool_time) return 1
      return 0
    })
    remain = remain.filter(item => !whitelist.includes(item))
    const preStart = remain.filter(item => new Date().getTime() < new Date(Number(item?.start_time) * 1000).getTime()).sort((a, b) => {
      if (a?.start_time < b?.start_time) return -1
      if (a?.start_time < b?.start_time) return 1
      return 0
    })
    remain = remain.filter(item => !preStart.includes(item))?.sort((a, b) => {
      if (a.finish_time < b.finish_time) return -1
      if (a.finish_time < b.finish_time) return 1
      return 0
    })
    const sortedItems = [].concat(remain).concat(preStart).concat(whitelist).concat(preWhitelist).concat(tba) || []
    return [sortedItems, sortedItems.filter(e => e.is_private === 0)]
  }, [currentPools])

  const itemsSorted = useMemo<CarouselItem[]>(() => {
    const _items = cmsData.map(aggregator => {
      const poolDetail = listPublic.find(pool => pool.aggregator_slug === aggregator.slug)
      return {
        id: aggregator?.id,
        title: aggregator?.name || '',
        aggregatorSlug: aggregator?.slug,
        slug: poolDetail?.slug,
        logo: aggregator?.logo?.url,
        video: aggregator?.youtubeLinks[0]?.url,
        thumbnail: aggregator?.youtubeLinks[0]?.videoThumbnail?.url,
        likes: Number(aggregator?.totalFavorites),
        shortDescription: aggregator?.project?.shortDesc,
        upcoming: !!poolDetail,
        poolInfo: {
          whitelistStartTime: poolDetail?.start_join_pool_time ? new Date(Number(poolDetail?.start_join_pool_time)) : null,
          whitelistEndTime: poolDetail?.end_join_pool_time ? new Date(Number(poolDetail?.end_join_pool_time)) : null,
          saleStartTime: poolDetail?.start_time ? new Date(Number(poolDetail?.start_time)) : null,
          saleEndTime: poolDetail?.end_time ? new Date(Number(poolDetail?.end_time)) : null,
          campaignStatus: poolDetail?.campaign_status || '',
          buyType: poolDetail?.buy_type || ''
        }
      }
    })
    const _sortedItems = [..._items.filter(e => e.upcoming), ..._items.filter(e => !e.upcoming)]
    return _sortedItems
  }, [cmsData, listPublic])

  return (
    <Layout>
      <div className="md:px-4 lg:px-16 mt-4 md:container mx-auto lg:block">
        <Banners></Banners>
        {itemsSorted && itemsSorted.length ? <GameCarousel items={itemsSorted}></GameCarousel> : <></>}
      </div>
      <Instruction></Instruction>
      {/* <TicketList></TicketList> */}
      <IGOList listUpcoming={listUpcoming}></IGOList>
      <INOList></INOList>
      <div className="bg-gamefiDark-900">
        <GameList></GameList>
        <Partners></Partners>
      </div>
    </Layout>
  )
}

export async function getServerSideProps () {
  const serverSideProps = { props: {} }
  try {
    const res = await client.query({
      query: GET_BANNER_AGGREGATORS
    })

    const [currentPoolsResponse] = await Promise.all([
      fetcher(`${INTERNAL_BASE_URL}/pools/current-pools?token_type=erc20&limit=100000&page=1&is_private=0,1,2,3`)
    ])

    serverSideProps.props = {
      currentPools: currentPoolsResponse?.data?.data,
      cmsData: normalize(res)?.aggregators || []
    }

    return serverSideProps
  } catch (error) {
    return serverSideProps
  }
}

export default PageIndex
