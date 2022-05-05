import GameCarousel from '@/components/Pages/Home/GameCarouselV2'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import IGOList from 'components/Pages/Home/IGOList'
import INOList from 'components/Pages/Home/INOList'
import GameList from 'components/Pages/Home/GameList'
// import NFTList from 'components/Pages/Home/NFTList'
import Instruction from 'components/Pages/Home/Instruction'

import { API_BASE_URL } from '@/utils/constants'
import Partners from '@/components/Pages/Home/Partners'
import Performance from '@/components/Pages/Home/Performance'
import { fetcher } from '@/utils'
import Layout from '@/components/Layout'
import Banners from '@/components/Banners'

const PageIndex = () => {
  const router = useRouter()

  const [featuredGames, setFeaturedGames] = useState([])
  const [gameLikeIds, setGameLikesIds] = useState([])
  const [likes, setLikes] = useState([])

  const { data: fetchFeaturedGamesResponse } = useSWR(`${API_BASE_URL}/aggregator?display_area=Top Game&sort_by=created_at&sort_order=desc`, fetcher)
  const { data: fetchLikesResponse } = useSWR(`${API_BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`, fetcher)

  useEffect(() => {
    setFeaturedGames(fetchFeaturedGamesResponse?.data?.data)
  }, [featuredGames, fetchFeaturedGamesResponse, fetchLikesResponse, gameLikeIds, router])

  useEffect(() => {
    featuredGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    setGameLikesIds(gameLikeIds)
    setLikes(fetchLikesResponse?.data)
  }, [featuredGames, gameLikeIds, fetchLikesResponse?.data])

  return (
    <Layout title="GameFi.org">
      {/* <GameFiCarousel likes={likes} items={featuredGames}></GameFiCarousel> */}
      <div className="md:px-4 lg:px-16 mt-4 md:container mx-auto lg:block">
        <Banners></Banners>
        {/* Load error here */}
        {/* Loading here */}
        {featuredGames && featuredGames.length ? <GameCarousel likes={likes} items={featuredGames}></GameCarousel> : <></>}
      </div>
      <Instruction></Instruction>
      <IGOList></IGOList>
      <div className="bg-gamefiDark-900">
        <INOList></INOList>
        <GameList></GameList>
        {/* <NFTList></NFTList> */}
        <Partners></Partners>
      </div>
      <Performance></Performance>
    </Layout>
  )
}

export default PageIndex
