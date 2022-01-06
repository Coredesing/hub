/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useWeb3Default } from 'components/web3'
import GameCarousel from 'components/Pages/Home/GameCarousel'

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

const items = [
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/dhatsJO.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/4rav4Pk.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/mAMucft.png'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/u1NM6S6.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/9lfkSWM.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/yFevUKf.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/rCPySIK.jpeg'
  }
]

const PageIndex = () => {
  return (
    <Layout title="GameFi">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        <GameCarousel items={items}></GameCarousel>
      </div>
    </Layout>
  )
}

export default PageIndex
