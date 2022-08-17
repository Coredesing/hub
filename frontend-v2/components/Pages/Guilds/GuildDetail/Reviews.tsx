import { useEffect } from 'react'
import { printNumber } from '@/utils'
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

const Reviews = ({ data, totalReviews, rates, id, tabRef, currentResource = 'hub' as 'guilds' | 'hub', currentRate, setCurrentRate, pageCountReviews }) => {
  const overall = getOverall(rates)
  const countRating = getCountRating(rates)

  const ratesWithPercent = getRatePercent(rates)

  useEffect(() => {
    tabRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tabRef])

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
      <ReviewList data={{ ...data, totalReviews: totalReviews }} filter loadMore={totalReviews > 5} currentResource={currentResource} pageCountReviews={pageCountReviews} />
    </div>
  )
}

export default Reviews
