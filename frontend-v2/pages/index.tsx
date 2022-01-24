/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
// import { useWeb3Default } from 'components/web3'
import GameCarousel from 'components/Pages/Home/GameCarousel'
import Image from 'next/image'

import axios from 'axios'
import PoolBanner from 'components/Base/PoolBanner'
import { Carousel } from 'react-responsive-carousel'
import { useMediaQuery } from 'react-responsive'
import TopGame from 'components/Pages/Home/TopGame'
import FilterDropdown from 'components/Pages/Home/FilterDropdown'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const PageIndex = () => {
  const isMobile = useMediaQuery({ maxWidth: '1000px' })
  const router = useRouter()

  const [featuredGames, setFeaturedGames] = useState([])
  const [upcomingIGOs, setUpcomingIGOs] = useState([])
  const [latestIGOs, setLatestIGOs] = useState([])
  const [upcomingINOs, setUpcomingINOs] = useState([])
  const [latestINOs, setLatestINOs] = useState([])
  const [topGames, setTopGames] = useState([])
  const [gameLikeIds, setGameLikesIds] = useState([])
  const [likes, setLikes] = useState([])
  const fetcher = url => axios.get(url).then(res => res?.data)

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
  const [gameFilterOption, setGameFilterOption] = useState(gameFilterOptions[0].value)

  const { data: fetchTopGamesResponse, error: fetchTopGamesError } = useSWR(`${BASE_URL}/aggregator?display_area=${router?.query?.topGames?.toString() || 'Top Favourite'}&price=true&per_page=4`, fetcher)
  const { data: fetchFeaturedGamesResponse, error: fetchFeaturedGamesError } = useSWR(`${BASE_URL}/aggregator?display_area=Top Game`, fetcher)
  const { data: fetchUpcomingIGOsResponse, error: fetchUpcompingIGOsError } = useSWR(`${BASE_URL}/pools/upcoming-pools?token_type=erc20&limit=20&page=1&is_private=0`, fetcher)
  const { data: fetchLatestIGOsResponse, error: fetchLatestIGOsError } = useSWR(`${BASE_URL}/pools?token_type=erc20&limit=5&page=1&is_private=0`, fetcher)
  const { data: fetchUpcomingINOsResponse, error: fetchUpcomingINOsError } = useSWR(`${BASE_URL}/pools/upcoming-pools?token_type=box&limit=20&page=1&is_private=0`, fetcher)
  const { data: fetchLatestINOsResponse, error: fetchLatestINOsError } = useSWR(`${BASE_URL}/pools?token_type=box&limit=5&page=1&is_private=0`, fetcher)
  const { data: fetchLikesResponse, error: fetchLikesError } = useSWR(`${BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`, fetcher)

  useEffect(() => {
    setFeaturedGames(fetchFeaturedGamesResponse?.data?.data)
    setUpcomingIGOs(fetchUpcomingIGOsResponse?.data?.data)
    if (!upcomingIGOs?.length) {
      setLatestIGOs(fetchLatestIGOsResponse?.data?.data)
    }
    setUpcomingINOs(fetchUpcomingINOsResponse?.data?.data)
    if (!upcomingINOs?.length) {
      setLatestINOs(fetchLatestINOsResponse?.data?.data)
    }
    setTopGames(fetchTopGamesResponse?.data?.data)

    if (router?.query?.topGames) {
      setGameFilterOption(router?.query?.topGames?.toString())
    }
  }, [featuredGames, fetchFeaturedGamesResponse, fetchLatestIGOsResponse, fetchLatestINOsResponse, fetchLikesResponse, fetchTopGamesResponse, fetchUpcomingIGOsResponse, fetchUpcomingINOsResponse, gameLikeIds, router, topGames, upcomingIGOs, upcomingINOs])

  useEffect(() => {
    featuredGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    topGames?.map(game => gameLikeIds?.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)
    setGameLikesIds(gameLikeIds)
    setLikes(fetchLikesResponse?.data)
  }, [featuredGames, topGames, gameLikeIds, fetchLikesResponse?.data])

  const handleChangeGameFilter = async (item: any) => {
    await router.push({ query: { topGames: item.value || 'Top Favourite' } }, undefined, { shallow: true })
    setGameFilterOption(item?.value)
    setTopGames(fetchTopGamesResponse?.data?.data)
  }

  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        {/* Load error here */}
        {/* Loading here */}
        {featuredGames && featuredGames.length && <GameCarousel likes={likes} items={featuredGames}></GameCarousel>}
      </div>
      {
        upcomingIGOs && upcomingIGOs.length
          ? <div className="md:px-4 lg:px-16 mx-auto bg-gamefiDark-700 mt-20 pb-14">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
            Upcoming IGOs
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              isMobile
                ? <div className='mt-14'>
                  <Carousel
                    showIndicators={false}
                    showStatus={false}
                    infiniteLoop
                    centerMode
                    centerSlidePercentage={80}
                    showArrows={false}
                  >
                    {upcomingIGOs.map(item => (
                      <PoolBanner key={item.id} item={item} color="yellow" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                    ))}
                  </Carousel>
                </div>
                : <div className="mx-auto md:container mt-14 2xl:px-16">
                  {upcomingIGOs?.length
                    ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                      {upcomingIGOs.map(item => (
                        <SwiperItem key={item.id}>
                          <PoolBanner item={item} color="yellow" className="mx-3" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                        </SwiperItem>
                      ))}
                    </ListSwiper>
                    : <></>}
                </div>
            }
          </div>
          : <div className="md:px-4 lg:px-16 mx-auto bg-gamefiDark-700 mt-20 pb-14">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
            Latest IGOs
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              isMobile
                ? <div className='mt-14'>
                  <Carousel
                    showIndicators={false}
                    showStatus={false}
                    infiniteLoop
                    centerMode
                    centerSlidePercentage={80}
                    showArrows={false}
                  >
                    {latestIGOs?.length && latestIGOs.map(item => (
                      <PoolBanner key={item.id} item={item} color="yellow" countdownStatus="ended" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                    ))}
                  </Carousel>
                </div>
                : <div className="mx-auto flex container mt-14 2xl:px-16">
                  {latestIGOs?.length
                    ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                      {latestIGOs.map(item => (
                        <SwiperItem key={item.id}>
                          <PoolBanner item={item} color="yellow" className="mx-3" countdownStatus="Ended" url={`https://hub.gamefi.org/#/buy-token/${item.id}`}></PoolBanner>
                        </SwiperItem>
                      ))}
                    </ListSwiper>
                    : <></>}
                </div>
            }
          </div>
      }
      {
        upcomingINOs && upcomingINOs.length
          ? <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
              Upcoming INOs
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('assets/images/under-stroke-green.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              isMobile
                ? <div className='mt-14'>
                  <Carousel
                    showIndicators={false}
                    showStatus={false}
                    infiniteLoop
                    centerMode
                    centerSlidePercentage={80}
                    showArrows={false}
                  >
                    { upcomingINOs.map(item => (
                      <PoolBanner key={item.id} item={item} url={`https://hub.gamefi.org/#/mystery-box/${item.id}`}></PoolBanner>
                    ))}
                  </Carousel>
                </div>
                : <div className="mx-auto md:container mt-14 2xl:gap-x-6 2xl:px-16">
                  {upcomingINOs?.length
                    ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                      {upcomingINOs.map(item => (
                        <SwiperItem key={item.id}>
                          <PoolBanner item={item} className="mx-3" url={`https://hub.gamefi.org/#/mystery-box/${item.id}`}></PoolBanner>
                        </SwiperItem>
                      ))}
                    </ListSwiper>
                    : <></>}
                </div>
            }
          </div>
          : <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
            <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
              <div className="uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
              Latest INOs
              </div>
              <div className="absolute -bottom-5 left-0 right-0">
                <Image src={require('assets/images/under-stroke-green.svg')} alt="understroke"></Image>
              </div>
            </div>
            {
              isMobile
                ? <div className='mt-14'>
                  <Carousel
                    showIndicators={false}
                    showStatus={false}
                    infiniteLoop
                    centerMode
                    centerSlidePercentage={80}
                    showArrows={false}
                  >
                    { latestINOs?.length && latestINOs.map(item => (
                      <PoolBanner key={item.id} item={item} countdownStatus="ended" url={`https://hub.gamefi.org/#/mystery-box/${item.id}`}></PoolBanner>
                    ))}
                  </Carousel>
                </div>
                : <div className="mx-auto md:container mt-14 2xl:px-16">
                  {latestINOs?.length
                    ? <ListSwiper showItemsNumber={3} step={3} transition='0.5s' hasHeader={false}>
                      {latestINOs.map(item => (
                        <SwiperItem key={item.id}>
                          <PoolBanner item={item} className="mx-3" countdownStatus="Ended" url={`https://hub.gamefi.org/#/mystery-box/${item.id}`}></PoolBanner>
                        </SwiperItem>
                      ))}
                    </ListSwiper>
                    : <></>}
                </div>
            }
          </div>
      }
      {
        topGames && topGames.length
          ? <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 pb-14">
            <div className="md:text-lg 2xl:text-3xl uppercase font-bold flex">
              <FilterDropdown items={gameFilterOptions} selected={gameFilterOption} onChange={handleChangeGameFilter}></FilterDropdown> <span className="ml-2">Games</span>
            </div>
            <div className="w-full relative bg-gamefiDark-600" style={{ height: '4px' }}>
              <div className="absolute bottom-0 right-0 dark:bg-gamefiDark-900 clipped-t-l-full-sm" style={{ height: '3px', width: 'calc(100% - 60px)' }}></div>
            </div>
            <div className="mt-12">
              {
                isMobile
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
            </div>
          </div>
          : <></>
      }
    </Layout>
  )
}

export default PageIndex
