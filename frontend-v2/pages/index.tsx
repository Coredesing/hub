import Layout from '@/components/Layout'
import GameCarousel from '@/components/Pages/Home/GameCarousel'

import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import IGOList from '@/components/Pages/Home/IGOList'
import INOList from '@/components/Pages/Home/INOList'
import GameList from '@/components/Pages/Home/GameList'
import NFTList from '@/components/Pages/Home/NFTList'

import { API_BASE_URL } from '@/utils/constants'

const PageIndex = () => {
  const router = useRouter()

  const [featuredGames, setFeaturedGames] = useState([])
  const [gameLikeIds, setGameLikesIds] = useState([])
  const [likes, setLikes] = useState([])
  const fetcher = url => axios.get(url).then(res => res?.data)

  const { data: fetchFeaturedGamesResponse, error: fetchFeaturedGamesError } = useSWR(`${API_BASE_URL}/aggregator?display_area=Top Game`, fetcher)
  const { data: fetchLikesResponse, error: fetchLikesError } = useSWR(`${API_BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`, fetcher)

  useEffect(() => {
    setFeaturedGames(fetchFeaturedGamesResponse?.data?.data)
  }, [featuredGames, fetchFeaturedGamesResponse, fetchLikesResponse, gameLikeIds, router])

  useEffect(() => {
    featuredGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    setGameLikesIds(gameLikeIds)
    setLikes(fetchLikesResponse?.data)
  }, [featuredGames, gameLikeIds, fetchLikesResponse?.data])

  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 mt-14 md:container mx-auto lg:block">
        {/* Load error here */}
        {/* Loading here */}
        {featuredGames && featuredGames.length ? <GameCarousel likes={likes} items={featuredGames}></GameCarousel> : <></>}
      </div>
      <IGOList></IGOList>
      <INOList></INOList>
      <GameList></GameList>
      {/* <NFTList></NFTList> */}
    </Layout>
  )
}

export default PageIndex
