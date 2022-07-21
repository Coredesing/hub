import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import isEmpty from 'lodash.isempty'
import { fetcher } from '@/utils'
import useHubProfile from '@/hooks/useHubProfile'
import Pagination from '@/components/Pages/Hub/Pagination'
import ReviewListFilter from '@/components/Base/Review/List/Filter'
import ReviewListItem from '@/components/Base/Review/List/Item'

interface ReviewListProps {
  data: any;
  pagination?: any;
  viewAll?: boolean;
  filter?: boolean;
  loadMore?: boolean;
  review?: any;
  currentResource: 'guilds' | 'hub';
}

const ReviewList = ({ data, pagination = false, viewAll = false, filter = false, loadMore = false, review = false, currentResource }: ReviewListProps) => {
  const router = useRouter()
  const [, setFilterShown] = useState(false)
  const [page, setPage] = useState<string>(router?.query?.page?.[0] || '1')
  const [likeStatusOfReviews, setLikeStatusOfReviews] = useState({})
  const [pageSize] = useState<string>(data.pageSize)
  const [ratingLevel, setRatingLevel] = useState<string>(data.ratingLevel)
  const [userRank] = useState<string>(data.userRank)
  const [, setLoading] = useState(false)
  const { accountHub } = useHubProfile()
  const { slug } = router.query
  const createOrUpdateReviewUrl = `/${currentResource}/${slug}/reviews/createOrUpdate`

  const onChangeRatingLevel = (value) => {
    setRatingLevel(value)
    setPage('1')
  }

  const params = useMemo(() => {
    const params = new URLSearchParams()

    if (page) {
      params.set('page', page)
    }

    if (pageSize) {
      params.set('page_size', pageSize)
    }

    if (ratingLevel) {
      params.set('rating_level', ratingLevel)
    }

    if (userRank) {
      params.set('user_rank', userRank)
    }

    return `${params}`
  }, [page, pageSize, ratingLevel, userRank])

  useEffect(() => {
    if (router.query.tab === 'reviews' || router.query?.tab?.[0] === 'reviews') {
      setLoading(true)
      switch (currentResource) {
      case 'hub':
        router.replace(`/${currentResource}/${slug}/reviews${params ? `?${params}` : ''}`).finally(() => {
          setLoading(false)
        })
        break
      case 'guilds':
        router.replace(`/${currentResource}/${slug}?tab=reviews${params ? `&${params}` : ''}`).finally(() => {
          setLoading(false)
        })
        break

      default:
        break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  let viewAllReviewsPath
  switch (currentResource) {
  case 'hub':
    viewAllReviewsPath = `/${currentResource}/${slug}/reviews`
    break
  case 'guilds':
    viewAllReviewsPath = `/${currentResource}/${slug}?tab=reviews&&page=1`
    break
  }

  useEffect(() => {
    if (!isEmpty(accountHub)) {
      getLikesByUser()
    } else {
      setLikeStatusOfReviews({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub])

  const getLikesByUser = () => {
    setLoading(true)
    fetcher('/api/hub/likes/getLikesByUserId', {
      method: 'POST',
      body: JSON.stringify({ variables: { userId: accountHub?.id } })
    }).then((result) => {
      setLoading(false)
      if (!isEmpty(result)) {
        setLikeStatusOfReviews(result?.data?.likes?.data?.reduce((total, v) => {
          const like = v.attributes
          if (like.objectType === 'review') {
            total[like.objectId] = like.status
          }
          return total
        }, {}))
      } else {
        setLikeStatusOfReviews({})
      }
    }).catch((err) => {
      setLoading(false)
      setLikeStatusOfReviews({})
      console.debug('err', err)
    })
  }

  const handleSetFilterShown = () => setFilterShown(false)

  return (
    <div
      className="md:container mx-auto lg:block"
      onClick={handleSetFilterShown}
    >
      {(data?.totalReviews || !isEmpty(data?.data))
        ? (
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-start md:items-center md:justify-between">
            {filter && <ReviewListFilter ratingLevel={ratingLevel} setRatingLevel={onChangeRatingLevel} />}
            {review && (
              <Link href={createOrUpdateReviewUrl} passHref>
                <a
                  className="bg-gamefiGreen-700 md:self-end text-gamefiDark-900 py-2 px-6 rounded-sm clipped-t-r hover:opacity-90 cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="uppercase font-bold text-[13px] leading-[150%] tracking-[0.02em] text-[#0D0F15] not-italic font-mechanic">
                    Write my review
                  </span>
                </a>
              </Link>
            )}
          </div>
        )
        : null
      }
      {isEmpty(data?.data) && !data?.totalReviews && (
        <div className="flex flex-col w-full items-center mt-4">
          <Link href={createOrUpdateReviewUrl} passHref>
            <a
              className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1 mt-6 no-underline"
              style={{ textDecoration: 'none' }}
            >
              <div className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-[13px]">
                Write first review
              </div>
            </a>
          </Link>
        </div>
      )}

      <div className="mt-6 relative">
        <div className="relative mb-4">
          {isEmpty(data.data)
            ? (
              <div className="flex flex-col w-full items-center">
                <span className="text-sm font-normal opacity-50 mt-[14px] mb-4">No review available</span>
                <Image src={require('@/assets/images/hub/no-review.png')} width={93} height={75} alt="no-review" />
              </div>
            )
            : data.data.map((item, i) => {
              return <ReviewListItem key={i} data={item} index={item.id} defaultLikeStatus={likeStatusOfReviews?.[item.id] ?? ''} currentResource={currentResource} />
            })
          }
        </div>
        {pagination && (
          <Pagination
            page={+data.page}
            pageLast={data.pageLast}
            setPage={setPage}
            className="w-full justify-end mb-8"
          />
        )}
        {viewAll && (
          <a
            href={viewAllReviewsPath}
            className="bg-[#21232A] flex justify-center items-center w-full h-14 rounded cursor-pointer hover:opacity-95"
          >
            <span className="capitalize mr-3 font-medium text-sm not-italic">View All</span>
            <Image width={12} height={12} src={require('@/assets/images/hub/arrow-down.svg')} alt="down"></Image>
          </a>
        )}
        {loadMore && (
          <div className="flex mt-8 w-full justify-center items-center">
            <div
              className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1"
              onClick={() => setPage(`${Number(page) + 1}`)}
            >
              <span className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-16 rounded leading-5 uppercase font-bold text-[13px]">
                Load More
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewList
