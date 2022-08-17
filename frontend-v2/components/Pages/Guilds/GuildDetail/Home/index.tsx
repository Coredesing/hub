import { useRouter } from 'next/router'
import SupportedGames from './SupportedGames'
import Introduction from './Introduction'
import Investors from './Investors'
import RoadMap from './RoadMap'
import Team from './Team'
import TwitterFeed from './TwitterFeed'
import Gallery from './Gallery'
import Reviews from './Reviews'

const Home = ({ guildReviewsData, totalFavorites, showMoreIntroduction }) => {
  const router = useRouter()
  const slug = router.query?.slug?.toString() || ''

  return (
    <div className="w-full flex flex-col gap-12">
      <Introduction totalFavorites={totalFavorites} showMoreIntroduction={showMoreIntroduction} />
      <TwitterFeed/>
      <Reviews data={guildReviewsData} slug={slug} />
      <SupportedGames />
      <RoadMap />
      <Gallery></Gallery>
      <Investors />
      <Team/>
    </div>
  )
}

export default Home
