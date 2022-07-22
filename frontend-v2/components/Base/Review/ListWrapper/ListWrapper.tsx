import Link from 'next/link'
import Image from 'next/image'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { gtagEvent } from '@/utils'
import ReviewList from '@/components/Base/Review/List'

interface GuildReviewData {
  reviews: any;
  rates: any;
}

const handleData = ({ reviews = [], rates = {} }: GuildReviewData) => {
  let dataReviews = []

  dataReviews = reviews?.data?.length && reviews.data.map(e => {
    const { author = {}, publishedAt, rate, review, title, likeCount, dislikeCount, commentCount } = e?.attributes || {}
    const { level, rank, repPoint, firstName, lastName, avatar, walletAddress, reviewCount, rates } = author?.data?.attributes || {}

    return {
      id: e?.id || '',
      publishedAt,
      rate,
      title,
      review,
      likeCount,
      dislikeCount,
      commentCount,
      user: {
        id: get(author, 'data.id'),
        level,
        rank,
        firstName,
        lastName,
        reps: repPoint,
        avatar: {
          url: avatar?.data?.attributes?.url
        },
        walletAddress,
        reviewCount,
        rates
      }
    }
  })

  return { dataReviews, dataRating: rates }
}

interface ReviewListWrapperProps {
  data: any;
  slug: string;
  currentResource: 'guilds' | 'hub';
}

const ReviewListWrapper = ({ data, slug, currentResource }: ReviewListWrapperProps) => {
  const { dataReviews, dataRating } = handleData(data)
  const createOrUpdateReviewPageUrl = `/${currentResource}/${slug}/reviews/createOrUpdate`

  return (
    <>
      <div className="flex items-center mt-10 md:mt-14 text-lg md:text-2xl font-mechanic uppercase">
        <strong>Reviews</strong>
        {!isEmpty(dataReviews) && (
          <Link href={createOrUpdateReviewPageUrl} passHref>
            <a
              className="bg-gamefiGreen-700 md:self-end text-gamefiDark-900 py-0.5 px-6 rounded-sm clipped-t-r hover:opacity-90 cursor-pointer ml-auto"
              onClick={() => { gtagEvent('hub_write_review', { game: slug }) }}
            >
              <span className="uppercase font-bold text-[13px] tracking-[0.02em] text-[#0D0F15] not-italic font-mechanic">Write my review</span>
            </a>
          </Link>
        )}
      </div>
      {isEmpty(dataReviews)
        ? (
          <div className="flex flex-col w-full items-center">
            <Image src={require('@/assets/images/hub/no-review.png')} width={93} height={75} alt="no-review" />
            <span className="text-sm font-normal opacity-50 mt-[14px]">No review available</span>
            <Link href={createOrUpdateReviewPageUrl} passHref>
              <a
                className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1 mt-6"
                onClick={() => { gtagEvent('hub_write_review', { game: slug }) }}
              >
                <div className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-[13px]">
                  Write first review
                </div>
              </a>
            </Link>
          </div>
        )
        : (
          <ReviewList viewAll={dataReviews?.length >= 5} data={{ data: dataReviews, rates: dataRating }} currentResource={currentResource} review={false}/>
        )
      }
    </>
  )
}

export default ReviewListWrapper
