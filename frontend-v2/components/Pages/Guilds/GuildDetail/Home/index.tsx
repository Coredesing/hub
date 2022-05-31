import React from 'react'
import SupportedGames from './SupportedGames'
import Introduction from './Introduction'
import Investors from './Investors'
import RoadMap from './RoadMap'
import Team from './Team'
// import TwitterFeed from './TwitterFeed'
import Gallery from './Gallery'

const Home = () => {
  return (
    <div className="w-full flex flex-col gap-12">
      <Introduction />
      <SupportedGames />
      <RoadMap />
      <Gallery></Gallery>
      <Investors />
      <Team/>
      <TwitterFeed/>
    </div>
  )
}

export default Home
