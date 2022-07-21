import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { normalize } from '@/graphql/utils'
import useHubProfile from '@/hooks/useHubProfile'
import { printNumber, fetcher } from '@/utils'
import ReviewRating from '@/components/Base/Review/Rating'
import ReviewList from '@/components/Base/Review/List'

function getOverall (rates = {}) {
  const { five = 0, four = 0, three = 0, two = 0, one = 0 }: any = rates
  const totalFiveStar = 5 * five
  const totalFourStar = four * 4
  const totalThreeStar = three * 3
  const totalTwoStar = two * 2
  const totalOneStar = one * 1
  const totalAllStar = totalFiveStar + totalFourStar + totalThreeStar + totalTwoStar + totalOneStar
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const countRating = getCountRating(rates)
  if (!countRating) return '0.0'
  const overall = (totalAllStar / (countRating))

  return overall.toFixed(1)
}

function getCountRating (rates = {}) {
  const { five = 0, four = 0, three = 0, two = 0, one = 0 }: any = rates

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return five + four + three + two + one
}

function getRatePercent (rates = {}) {
  const countRating = getCountRating(rates)
  const { five = 0, four = 0, three = 0, two = 0, one = 0 }: any = rates
  const fiveStarPercent = (five / countRating * 100).toFixed(0)
  const fourStarPercent = (four / countRating * 100).toFixed(0)
  const threeStarPercent = (three / countRating * 100).toFixed(0)
  const twoStarPercent = (two / countRating * 100).toFixed(0)
  const oneStarPercent = (one / countRating * 100).toFixed(0)

  return [
    {
      level: 5,
      percent: fiveStarPercent
    }, {
      level: 4,
      percent: fourStarPercent
    }, {
      level: 3,
      percent: threeStarPercent
    }, {
      level: 2,
      percent: twoStarPercent
    }, {
      level: 1,
      percent: oneStarPercent
    }
  ]
}

const Reviews = ({ data, totalReviews, rates, id, tabRef, currentResource = 'hub' as 'guilds' | 'hub' }) => {
  const [, setLoading] = useState(false)
  const [currentRate, setCurrentRate] = useState(0)
  const router = useRouter()

  const { accountHub } = useHubProfile()

  const overall = getOverall(rates)
  const countRating = getCountRating(rates)

  const ratesWithPercent = getRatePercent(rates)

  useEffect(() => {
    tabRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tabRef])

  useEffect(() => {
    if (isEmpty(accountHub)) {
      setCurrentRate(0)
      return
    }

    fetcher('/api/hub/reviews', {
      method: 'POST',
      body: JSON.stringify({
        variables: {
          userId: accountHub.id,
          slug: router.query.slug
        },
        query: 'GET_REVIEW_AND_RATE_BY_USER_ID_FOR_AGGREGATOR'
      })
    }).then((res) => {
      setLoading(false)
      if (!isEmpty(res)) {
        const data = normalize(res.data)
        const rate = get(data, 'rates[0].rate', '')
        if (rate) {
          setCurrentRate(rate)
        } else {
          setCurrentRate(0)
        }
      }
    }).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub, router.query.slug])

  return (
    <div className="flex flex-col">
      <ReviewRating
        overall={overall}
        totalCount={countRating}
        rates={ratesWithPercent}
        currentRate={currentRate}
        setCurrentRate={setCurrentRate}
        id={id}
        currentResource="guilds"
      />
      <div className="mt-14 uppercase text-lg md:text-2xl"><strong>{`All Reviews ${totalReviews ? `(${printNumber(totalReviews)})` : ''}`}</strong></div>
      <ReviewList data={{ ...data, totalReviews: totalReviews }} filter loadMore={totalReviews > data?.length} currentResource={currentResource} />
    </div>
  )
}

export default Reviews
