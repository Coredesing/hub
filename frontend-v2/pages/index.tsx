/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
import { useWeb3Default } from 'components/web3'
import GameCarousel from 'components/Pages/Home/GameCarousel'
import Image from 'next/image'

import axios from 'axios'
import { GetStaticProps } from 'next'
import PoolBanner from 'components/Base/PoolBanner'
import { useMediaQuery } from 'react-responsive'

// example of default provider
function ChainId() {
  const { chainId } = useWeb3Default()

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ?? ''}</span>
    </>
  )
}

const BASE_URL = process.env.NEXT_BASE_URL

const PageIndex = ({ topGames, likes, upcomingIGOs, upcomingINOs }) => {
  const isMobile = useMediaQuery({ query: `(max-width: 1000px)` })

  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        {/* Load error here */}
        {/* Loading here */}
        {topGames && topGames.length && <GameCarousel likes={likes} items={topGames}></GameCarousel>}
      </div>
      <div className="md:px-4 lg:px-16 mx-auto bg-gamefiDark-700 mt-20 pb-14">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
            Upcoming IGOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('assets/images/under-stroke-yellow.svg')} alt="understroke"></Image>
          </div>
        </div>
        {
          isMobile ? <></> : <div className="grid grid-cols-3 gap-x-6 gap-y-12 container mt-14 md:px-4 lg:px-16">
            {upcomingIGOs && upcomingIGOs.length && upcomingIGOs.map(item => (
              <PoolBanner key={item.id} item={item} color="yellow"></PoolBanner>
            ))}
          </div>
        }
      </div>
      <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
      <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl">
            Upcoming INOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('assets/images/under-stroke-green.svg')} alt="understroke"></Image>
          </div>
        </div>
        {
          isMobile ? <div></div> : <div className="grid grid-cols-3 gap-x-6 gap-y-12 container mt-14 md:px-4 lg:px-16">
            {upcomingINOs && upcomingINOs.length && upcomingINOs.map(item => (
              <PoolBanner key={item.id} item={item} color="green"></PoolBanner>
            ))}
          </div>
        }
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const topGames = await axios.get(`${BASE_URL}/aggregator?display_area=Top Game`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e))
  if (!topGames || !topGames.length) return {
    props: {
      topGames: [],
      likes: []
    }
  }

  const topGameIds = topGames.map(game => game.id)
  const likes = await axios.get(`${BASE_URL}/aggregator/get-like?ids=${topGameIds.join(',')}`).then(res => {
    return res?.data?.data
  }).catch(e => console.log(e))

  const upcomingIGOs = await axios.get(`https://hub.gamefi.org/api/v1/pools/upcoming-pools?token_type=erc20&limit=20&page=1&is_private=0`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e))

  const upcomingINOs = await axios.get(`https://hub.gamefi.org/api/v1/pools/upcoming-pools?token_type=box&limit=20&page=1&is_private=0`).then(res => {
    return res?.data?.data?.data
  }).catch(e => console.log(e))

  return {
    props: {
      topGames,
      likes,
      upcomingIGOs,
      upcomingINOs
    }
  }
}

export default PageIndex
