/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useWeb3Default } from 'components/web3'
import GameCarousel from 'components/Pages/Home/GameCarousel'

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

const PageIndex = ({ topGames, likes, upcomingIGOs }) => {
  const isMobile = useMediaQuery({ query: `(max-width: 1000px)` })

  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        {/* Load error here */}
        {/* Loading here */}
        {topGames && topGames.length && <GameCarousel likes={likes} items={topGames}></GameCarousel>}
      </div>
      <div className="md:px-4 lg:px-16 mx-auto bg-gamefiDark-700 mt-20 pb-14">
        <div className="uppercase bg-gamefiDark-900 w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center p-4 clipped-b overflow-hidden font-bold md:text-lg lg:text-xl">
          Upcoming IGOs
        </div>
        {
          isMobile ? <></> : <div className="grid grid-cols-3 gap-4 container mt-14">
            {upcomingIGOs && upcomingIGOs.length && upcomingIGOs.map(item => (
              <PoolBanner key={item.id} item={item}></PoolBanner>
            ))}
          </div>
        }
      </div>
      <div className="md:px-4 lg:px-16 mx-auto mt-20 pb-14">
        <div className="uppercase bg-gamefiDark-900 w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center p-4 clipped-b overflow-hidden font-bold md:text-lg lg:text-xl">
          Upcoming INO
        </div>
        <div className="grid grid-cols-3 gap-4 md:container mt-14">
          {upcomingIGOs && upcomingIGOs.length && upcomingIGOs.map(item => (
            <PoolBanner key={item.id} item={item}></PoolBanner>
          ))}
        </div>
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

  return {
    props: {
      topGames,
      likes,
      upcomingIGOs
    }
  }
}

export default PageIndex
