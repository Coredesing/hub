import { fetcher } from '@/utils'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FilterDropdown from '../FilterDropdown'
import TopGame from '../TopGame'
import { useScreens } from '../utils'

const gameFilterOptions = [
  {
    key: 'filter-top-favorite',
    label: 'Top Favorite',
    value: 'Top Favorite'
  },
  {
    key: 'filter-top-trending',
    label: 'Top Trending',
    value: 'Trending'
  }
]

const GameList = () => {
  const router = useRouter()

  // const [gameLikeIds, setGameLikesIds] = useState([])
  // const [likes, setLikes] = useState([])
  const screens = useScreens()
  const [gameFilterOption, setGameFilterOption] = useState(gameFilterOptions[0].value)
  const [topFavoriteGames, setTopFavoriteGames] = useState([])
  const [topTrendingGames, setTopTrendingGames] = useState([])

  const getTopFavorites = useCallback(() => {
    fetcher('/api/hub/home', {
      method: 'POST', body: JSON.stringify({ query: 'GET_TOP_FAVORITE_AGGREGATORS', variables: { filtersValue: 'interactivePoint30d:desc' } })
    }).then(({ data }) => {
      const formatData = data?.aggregators?.data?.map(v => {
        const d = v.attributes
        return { ...d, verticalThumbnail: d?.verticalThumbnail?.data?.attributes, tokenomic: d?.project?.data?.attributes?.tokenomic }
      }) || []
      const chunk = []
      const chunkSize = 5
      for (let i = 0; i < formatData.length; i += chunkSize) {
        chunk.push(formatData.slice(i, i + chunkSize))
      }
      setTopFavoriteGames(formatData?.length > 4 ? formatData.slice(0, 4) : formatData)
      // setChunkData(chunk)
    }).catch((err) => {
      console.debug('err', err)
    })
  }, [])

  const getTrendingFavorites = useCallback(() => {
    fetcher('/api/hub/home', {
      method: 'POST', body: JSON.stringify({ query: 'GET_TRENDING_AGGREGATORS', variables: { filtersValue: 'interactivePoint30d:desc' } })
    }).then(({ data }) => {
      const formatData = data?.aggregators?.data?.map(v => {
        const d = v.attributes
        return { ...d, verticalThumbnail: d?.verticalThumbnail?.data?.attributes, tokenomic: d?.project?.data?.attributes?.tokenomic }
      }) || []
      const chunk = []
      const chunkSize = 5
      for (let i = 0; i < formatData.length; i += chunkSize) {
        chunk.push(formatData.slice(i, i + chunkSize))
      }
      setTopTrendingGames(formatData?.length > 4 ? formatData.slice(0, 4) : formatData)
    }).catch((err) => {
      console.debug('err', err)
    })
  }, [])

  // const { response: topGamesResponse, loading: topGamesLoading } = useFetch('')

  // const topGames = useMemo(() => {
  //   return topGamesResponse?.data?.data || []
  // }, [topGamesResponse])
  const topGames = useMemo(() => {
    switch (gameFilterOption) {
    case gameFilterOptions[0].value:
      return topFavoriteGames
    case gameFilterOptions[1].value:
      return topTrendingGames
    default:
      return topFavoriteGames
    }
  }, [gameFilterOption, topFavoriteGames, topTrendingGames])

  useEffect(() => {
    // if (router?.query?.topGames) {
    //   setGameFilterOption(router?.query?.topGames?.toString())
    // }
    // topGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    // setGameLikesIds(gameLikeIds)
    // const getLikes = async () => {
    //   const res = await fetcher(`${API_BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`)
    //   setLikes(res?.data)
    // }

    // getLikes().catch(e => console.debug(e?.message))
    getTopFavorites()
    getTrendingFavorites()
  }, [getTopFavorites, getTrendingFavorites, router.query.topGames])

  const handleChangeGameFilter = useCallback((item: any) => {
    setGameFilterOption(item?.value)
    // await router.push({ query: { topGames: item.value || 'Top Favorite' } }, undefined, { shallow: true })
  }, [])

  return <>
    {
      topFavoriteGames && topFavoriteGames.length > 0
        ? <div className="px-4 lg:px-16 md:container mx-auto pt-20 pb-14">
          <div className="md:text-lg 2xl:text-3xl uppercase font-bold flex">
            <FilterDropdown items={gameFilterOptions} selected={gameFilterOption} onChange={handleChangeGameFilter}></FilterDropdown> <span className="ml-2">Games</span>
          </div>
          <div className="w-full relative bg-gamefiDark-600" style={{ height: '1px' }}>
            <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px', marginTop: '0', marginLeft: '0' }}></div>
          </div>
          <div className="mt-12">
            {
              screens.mobile || screens.tablet
                ? <>
                  <div className="w-full">
                    <TopGame item={topGames[0]} isTop={true}></TopGame>
                  </div>
                  <div className="mt-4 flex w-full overflow-x-auto hide-scrollbar">
                    {topGames.map((item, i) => (
                      i !== 0
                        ? <div className="mr-4" style={{ minWidth: '300px' }} key={`game-list-${i}`}>
                          <TopGame item={item} isTop={false}></TopGame>
                        </div>
                        : <div key={`game-list-${i}`}></div>
                    ))}
                  </div>
                </>
                : <div className="flex">
                  {
                    topGames.map((item, i) => (
                      <div style={{ width: i === 0 ? 'calc(40% - 1.2rem)' : 'calc(20% + 0.3rem)', paddingLeft: i === 0 ? '' : '0.9rem' }} key={`game-mobile-${i}`}>
                        <TopGame item={item} isTop={i === 0}></TopGame>
                      </div>
                    ))
                  }
                </div>
            }
          </div>
        </div>
        : <></>
    }
  </>
}

export default GameList
