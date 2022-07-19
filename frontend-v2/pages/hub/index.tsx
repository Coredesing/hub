import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { TopReviewsHub, GameBanner, TopPlayerHub, TopRoiHub, TopReleasedHub, TopViewHub, TrendingHub, TopRatingHub, TopRight, Categories, ListLaunchedOnGamefi } from '@/components/Pages/Hub/HubHome'
import { GET_AGGREGATORS_HOME } from '@/graphql/aggregator'
import { normalize } from '@/graphql/utils'
import { client } from '@/graphql/apolloClient'
import HubCountdown from '@/components/Pages/Hub/HubHome/HubCountDown'
import { GAME_HUB_START_TIME } from '@/utils/constants'
import { fetcher } from '@/utils'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'

function Hub ({ data, validCountdownTime }) {
  const [isEnded, setIsEnded] = useState(!validCountdownTime)
  const { categories } = data || {}
  const [listFavorite, setListFavorite] = useState({})
  const [listFavoriteTrending, setListFavoriteTrending] = useState({})
  const [listFavoriteRating, setListFavoriteRating] = useState({})

  useEffect(() => {
    setListFavorite({ ...listFavorite, ...listFavoriteTrending, ...listFavoriteRating })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFavoriteTrending, listFavoriteRating])

  const clearFavorite = () => {
    setListFavorite({})
    setListFavoriteTrending({})
    setListFavoriteRating({})
  }

  const getListFavoriteByUser = (v: any[], setLoading: (arg0: boolean) => void, userId: any, source) => {
    setLoading(true)
    // setListFavorite({})
    const action = source === 'trending' ? setListFavoriteTrending : setListFavoriteRating
    fetcher('/api/hub/favorite/getListFavoriteByUserId', { method: 'POST', body: JSON.stringify({ variables: { userId, aggregatorIds: v.map(v => v.id) } }) }).then((result) => {
      setLoading(false)
      if (!isEmpty(result)) {
        action(get(result, 'data.favorites.data', [])?.reduce((total: { [x: string]: any }, v: { attributes: any }) => {
          const objectId = v?.attributes?.objectID
          total[objectId] = objectId
          return total
        }, {}))
      } else action({})
    }).catch((err) => {
      setLoading(false)
      console.debug('err', err)
    })
  }

  return (
    <Layout
      title="GameFi.org - Games"
      description="An ultimate gaming destination for gamers, investors, and other game studios."
      hideTopBar={validCountdownTime && !isEnded}
      disableFooter={validCountdownTime && !isEnded}
      className="overflow-x-hidden"
    >
      {(!validCountdownTime || isEnded) && (
        <div className="px-4 xl:p-16 2xl:px-32 container mx-auto lg:block">
          {/* <div className="flex flex-col sm:flex-row gap-6 mt-14 w-full"> */}
          <div className="md:grid grid-rows md:grid-cols-4 md:gap-4 xl:gap-6 mb-4 md:mb-10">
            <div className="md:col-span-3 mb-4 md:mb-10">
              <GameBanner data={data.gameBanners} />
              <TopPlayerHub data={data.topPlayer} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TopReleasedHub />
                <TopViewHub />

              </div>
            </div>
            {/* <div className="w-full sm:w-60 xl:w-80 col-span-1"> */}
            <div className="md:col-span-1">
              {/* <EventLeaderboard event="game-league" /> */}
              <TopRight />
              <TopRoiHub data={data.topROI} />
              <Categories data={categories || []} />
              <ListLaunchedOnGamefi />
            </div>
          </div>
          <TrendingHub getListFavoriteByUser={getListFavoriteByUser} setListFavorite={setListFavorite} clearFavorite={clearFavorite} listFavorite={listFavorite} />
          <TopRatingHub getListFavoriteByUser={getListFavoriteByUser} setListFavorite={setListFavorite} clearFavorite={clearFavorite} listFavorite={listFavorite} />
          <TopReviewsHub />
        </div>
      )}
      {validCountdownTime && !isEnded && <HubCountdown onEnded={() => setIsEnded(true)} />}
    </Layout>
  )
}

export async function getServerSideProps () {
  const validCountdownTime = GAME_HUB_START_TIME && new Date().getTime() < new Date(GAME_HUB_START_TIME).getTime()
  try {
    const res = await client.query({
      query: GET_AGGREGATORS_HOME
    })
    return {
      props: { data: normalize(res), validCountdownTime }
    }
  } catch (error) {
    return {
      props: { data: {}, validCountdownTime }
    }
  }
}

export default Hub
