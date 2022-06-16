import GameCarousel from '@/components/Pages/Home/GameCarouselV2'

import { useMemo } from 'react'
import IGOList from 'components/Pages/Home/IGOList'
import GameList from 'components/Pages/Home/GameList'
import Instruction from 'components/Pages/Home/Instruction'

import { API_BASE_URL } from '@/utils/constants'
import Partners from '@/components/Pages/Home/Partners'
import { fetcher } from '@/utils'
import Layout from '@/components/Layout'
import Banners from '@/components/Banners'
import INOList from '@/components/Pages/Home/INOList'

const PageIndex = ({ featuredGames = [], currentPools = [], likes = [] }) => {
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

  const itemsSorted = useMemo(() => {
    const _items = featuredGames.map(aggregator => {
      const poolDetail = listPublic.find(pool => pool.aggregator_slug === aggregator.slug)
      return { ...aggregator, pool: poolDetail }
    })
    return [..._items.filter(e => e.pool), ..._items.filter(e => !e.pool)]
  }, [listPublic, featuredGames])

  return (
    <Layout title="GameFi.org">
      <div className="md:px-4 lg:px-16 mt-4 md:container mx-auto lg:block">
        <Banners></Banners>
        {itemsSorted && itemsSorted.length ? <GameCarousel likes={likes} items={itemsSorted}></GameCarousel> : <></>}
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
    const gameLikeIds = []
    const [featureGamesResponse, currentPoolsResponse] = await Promise.all([
      fetcher(`${API_BASE_URL}/aggregator?display_area=Top Game&sort_by=created_at&sort_order=desc`),
      fetcher(`${API_BASE_URL}/pools/current-pools?token_type=erc20&limit=100000&page=1&is_private=0,1,2,3`)
    ])
    const featuredGames = featureGamesResponse?.data?.data
    featuredGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    const fetchLikesResponse = await fetcher(`${API_BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`)

    serverSideProps.props = {
      featuredGames,
      currentPools: currentPoolsResponse?.data?.data,
      likes: fetchLikesResponse?.data
    }

    return serverSideProps
  } catch (error) {
    return serverSideProps
  }
}

export default PageIndex
