/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useWeb3Default } from 'components/web3'
import GameCarousel from 'components/Pages/Home/GameCarousel'

import axios from 'axios'
import { GetStaticProps } from 'next'

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

const PageIndex = ({ topGames, likes }) => {
  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        {/* Load error here */}
        {/* Loading here */}
        {topGames === []}
        {topGames && <GameCarousel likes={likes} items={topGames}></GameCarousel>}
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
  })

  return {
    props: {
      topGames,
      likes
    }
  }
}

export default PageIndex
