/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
// import { useWeb3Default } from 'components/web3'
import GameCarousel from 'components/Pages/Home/GameCarousel'
import Image from 'next/image'

import axios from 'axios'
import { GetStaticProps } from 'next'
import PoolBanner from 'components/Base/PoolBanner'
import { Carousel } from 'react-responsive-carousel'
import { useMediaQuery } from 'react-responsive'
import TopGame from 'components/Pages/Home/TopGame'
import FilterDropdown from 'components/Pages/Home/FilterDropdown'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
// example of default provider
// function ChainId() {
//   const { chainId } = useWeb3Default()

//   return (
//     <>
//       <span>Chain Id</span>
//       <span role="img" aria-label="chain">
//         ⛓
//       </span>
//       <span>{chainId ?? ''}</span>
//     </>
//   )
// }

const PageIndex = ({ featuredGames, likes, upcomingIGOs, upcomingINOs }) => {

  const isMobile = useMediaQuery({maxWidth: '1000px'})
  const router = useRouter()

  const [topGames, setTopGames] = useState([])

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

  useEffect(() => {
    void axios.get(`${BASE_URL}/aggregator?display_area=${router?.query?.topGames?.toString() || 'Top Favourite'}&price=true&limit=4`).then(res => {
      setTopGames(res?.data?.data?.data)
    })

    if (router?.query?.topGames) {
      setGameFilterOption(router?.query?.topGames?.toString())
    }
  }, [router?.query?.topGames])

  const handleChangeGameFilter = async (item: any) => {
    await router.push({query: {topGames: item.value || 'Top Favourite'}}, undefined, {shallow: true})
    setGameFilterOption(item?.value)
    await axios.get(`${BASE_URL}/aggregator?display_area=${router?.query?.topGames || 'Top Favourite'}&price=true&limit=4`).then(res => {
      setTopGames(res?.data?.data?.data)
    })
  }

  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        {/* Load error here */}
        {/* Loading here */}
        {featuredGames && featuredGames.length && <GameCarousel likes={likes} items={featuredGames}></GameCarousel>}
      </div>
      {
        upcomingIGOs && upcomingIGOs.length ? <div className="md:px-4 lg:px-16 mx-auto bg-gamefiDark-700 mt-20 pb-14">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
            Upcoming IGOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
          </div>
        </div>
        {
          isMobile ? 
            <div className='mt-14'>
              <Carousel
                showIndicators={false}
                showStatus={false}
                infiniteLoop
                centerMode
                centerSlidePercentage={80}
                showArrows={false}
              >
                {upcomingIGOs.map(item => (
                  <PoolBanner key={item.id} item={item} color="yellow"></PoolBanner>
                ))}
              </Carousel>
            </div>
          : <div className="grid grid-cols-3 gap-x-4 2xl:gap-x-6 gap-y-12 container mt-14 2xl:px-16">
            {upcomingIGOs.map(item => (
              <PoolBanner key={item.id} item={item} color="yellow"></PoolBanner>
            ))}
          </div>
        }
      </div> : <></>
      }
      {
        upcomingINOs && upcomingINOs.length ? <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
            <div className="uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
              Upcoming INOs
            </div>
            <div className="absolute -bottom-5 left-0 right-0">
              <Image src={require('assets/images/under-stroke-green.svg')} alt="understroke"></Image>
            </div>
          </div>
          {
            isMobile ?
              <div className='mt-14'>
                <Carousel
                  showIndicators={false}
                  showStatus={false}
                  infiniteLoop
                  centerMode
                  centerSlidePercentage={80}
                  showArrows={false}
                >
                  { upcomingINOs.map(item => (
                    <PoolBanner key={item.id} item={item} color="green"></PoolBanner>
                  ))}
                </Carousel>
              </div>
            : <div className="grid grid-cols-3 gap-x-4 gap-y-12 container mt-14 2xl:gap-x-6 2xl:px-16">
              {upcomingINOs.map(item => (
                <PoolBanner key={item.id} item={item} color="green"></PoolBanner>
              ))}
            </div>
          }
        </div> : <></>
      }
      {
        topGames && topGames.length ?
        <div className="md:px-4 lg:px-16 2xl:px-32 mx-auto mt-20 pb-14">
          <div className="md:text-lg 2xl:text-3xl uppercase font-bold flex">
            <FilterDropdown items={gameFilterOptions} selected={gameFilterOption} onChange={handleChangeGameFilter}></FilterDropdown> <span className="ml-2">Games</span>
          </div>
          <div className="w-full relative bg-gamefiDark-600" style={{height: '4px'}}>
            <div className="absolute bottom-0 right-0 dark:bg-gamefiDark-900 clipped-t-l-full-sm" style={{height: '3px', width: 'calc(100% - 60px)'}}></div>
          </div>
          <div className="mt-12">
            {
              isMobile ?
              <>
                <div className="w-full">
                  <TopGame item={topGames[0]} like={likes.find(like => like?.game_id === topGames[0].id)} isTop={true}></TopGame>
                </div>
                <div className="mt-4 flex w-full overflow-x-auto hide-scrollbar">
                  {topGames.map((item, i) => (
                    i!== 0 ? <div style={{minWidth: '250px'}} key={item.id}>
                      <TopGame item={item} like={likes.find(like => like?.game_id === item.id)} isTop={false}></TopGame>
                    </div> : <></>
                  ))}
                </div>
              </> :
              <div className="grid grid-cols-5 gap-4">
              {
                topGames.map((item, i) => (
                  <div className={`${i === 0 ? 'col-span-2' : ''}`} key={item.id}>
                    <TopGame item={item} like={likes.find(like => like?.game_id === item.id)} isTop={i === 0}></TopGame>
                  </div>
                ))
              }
            </div>
            }
          </div>
        </div> : <></>
      }
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const gameLikeIds = []
  const featuredGames = await axios.get(`${BASE_URL}/aggregator?display_area=Top Game`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e))
  if (!featuredGames || !featuredGames.length) return {
    props: {
      featuredGames: [],
      likes: []
    }
  }

  featuredGames.map(game => gameLikeIds.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)

  const upcomingIGOs = await axios.get(`${BASE_URL}/pools/upcoming-pools?token_type=erc20&limit=20&page=1&is_private=0`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e)) || []

  const upcomingINOs = await axios.get(`${BASE_URL}/pools/upcoming-pools?token_type=box&limit=20&page=1&is_private=0`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e)) || []

  const topGames = await axios.get(`${BASE_URL}/aggregator?display_area=Top Favourite&price=true&limit=4`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e)) || []

  topGames.map(game => gameLikeIds.indexOf(game.id) === -1 ? gameLikeIds.push(game.id) : null)

  const likes = await axios.get(`${BASE_URL}/aggregator/get-like?ids=${gameLikeIds.join(',')}`).then(res => {
    return res?.data?.data
  }).catch(e => console.log(e)) || []

  return {
    props: {
      featuredGames,
      likes,
      upcomingIGOs,
      upcomingINOs,
      topGames
    }
  }
}

export default PageIndex
