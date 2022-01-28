import { API_BASE_URL } from '@/constants/api'
import { fetcher } from 'utils'
import ShadowLoader from 'components/Base/ShadowLoader'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FilterDropdown from '../FilterDropdown'
import TopGame from '../TopGame'
import { useFetch, useScreens } from '../utils'

const gameFilterOptions = [
  {
    key: 1,
    label: 'Top Favorite',
    value: 'Top Favourite'
  },
  {
    key: 2,
    label: 'Top Trending',
    value: 'Trending'
  }
]

const GameList = () => {
  const router = useRouter()

  const [gameLikeIds, setGameLikesIds] = useState([])
  const [likes, setLikes] = useState([])
  const screens = useScreens()
  const [gameFilterOption, setGameFilterOption] = useState(router?.query?.topGames?.toString() || gameFilterOptions[0].value)

  const topGamesUrl = `/aggregator?display_area=${gameFilterOption}&price=true&per_page=4`
  const { response: topGamesResponse, loading: topGamesLoading } = useFetch(topGamesUrl)

  const topGames = useMemo(() => {
    return topGamesResponse?.data?.data || []
  }, [topGamesResponse])

  useEffect(() => {
    if (router?.query?.topGames) {
      setGameFilterOption(router?.query?.topGames?.toString())
    }
    topGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    setGameLikesIds(gameLikeIds)
    const getLikes = async () => {
      const res = await fetcher(`${API_BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`)
      setLikes(res?.data)
    }

    getLikes().catch(e => console.debug(e?.message))
  }, [gameLikeIds, router?.query?.topGames, topGames])

  const handleChangeGameFilter = async (item: any) => {
    setGameFilterOption(item?.value)
    await router.push({ query: { topGames: item.value || 'Top Favourite' } }, undefined, { shallow: true })
  }

  return <>
    {
      topGames && topGames.length > 0
        ? <div className="px-4 lg:px-16 md:container mx-auto mt-20 pb-14">
          <div className="md:text-lg 2xl:text-3xl uppercase font-bold flex">
            <FilterDropdown items={gameFilterOptions} selected={gameFilterOption} onChange={handleChangeGameFilter}></FilterDropdown> <span className="ml-2">Games</span>
          </div>
          <div className="w-full relative bg-gamefiDark-600" style={{ height: '4px' }}>
            <div className="absolute bottom-0 right-0 dark:bg-gamefiDark-900 clipped-t-l-full-sm" style={{ height: '3px', width: 'calc(100% - 60px)' }}></div>
          </div>
          <div className="mt-12">
            {
              screens.mobile || screens.tablet
                ? <>
                  <div className="w-full">
                    <TopGame item={topGames[0]} like={likes?.find(like => like?.game_id === topGames[0].id)} isTop={true}></TopGame>
                  </div>
                  <div className="mt-4 flex w-full overflow-x-auto hide-scrollbar">
                    {topGames.map((item, i) => (
                      i !== 0
                        ? <div style={{ minWidth: '250px' }} key={item.id}>
                          <TopGame item={item} like={likes?.find(like => like?.game_id === item.id)} isTop={false}></TopGame>
                        </div>
                        : <></>
                    ))}
                  </div>
                </>
                : <div className="grid grid-cols-5 gap-4">
                  {
                    topGames.map((item, i) => (
                      <div className={`${i === 0 ? 'col-span-2' : ''}`} key={item.id}>
                        <TopGame item={item} like={likes?.find(like => like?.game_id === item.id)} isTop={i === 0}></TopGame>
                      </div>
                    ))
                  }
                </div>
            }
            {
              topGamesLoading
                ? <div className="grid grid-cols-5 gap-4">
                  <ShadowLoader></ShadowLoader>
                  <ShadowLoader></ShadowLoader>
                  <ShadowLoader></ShadowLoader>
                  <ShadowLoader></ShadowLoader>
                  <ShadowLoader></ShadowLoader>
                </div>
                : <></>
            }
          </div>
        </div>
        : <></>
    }
  </>
}

export default GameList
