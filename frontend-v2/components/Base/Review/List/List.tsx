import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { fetcher } from '@/utils'
import useHubProfile from '@/hooks/useHubProfile'
import Pagination from '@/components/Pages/Hub/Pagination'
import ReviewListFilter from '@/components/Base/Review/List/Filter'
import ReviewListItem from '@/components/Base/Review/List/Item'
import toast from 'react-hot-toast'
import Loading from '@/components/Pages/Hub/Loading'
interface ReviewListProps {
  data: any;
  pagination?: any;
  pageCountReviews?: number;
  viewAll?: boolean;
  filter?: boolean;
  loadMore?: boolean;
  review?: any;
  currentResource: 'guilds' | 'hub';
}

const ReviewList = ({ data, pagination = false, viewAll = false, filter = false, loadMore = false, review = true, currentResource, pageCountReviews }: ReviewListProps) => {
  const router = useRouter()
  const [, setFilterShown] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [likeStatusOfReviews, setLikeStatusOfReviews] = useState({})
  const [pageSize] = useState<number>(5)
  const [ratingLevel, setRatingLevel] = useState<string>(data.ratingLevel)
  const [userRank] = useState<string>(data.userRank)
  const [listReview, setListReview] = useState<any[]>(data?.data || [])
  const [loading, setLoading] = useState(false)
  const [firstCome, setFirstCome] = useState<boolean>(true)
  const { accountHub } = useHubProfile()

  const { slug } = router.query
  const createOrUpdateReviewUrl = `/${currentResource}/${slug}/reviews/createOrUpdate`

  // const params = useMemo(() => {
  //   const params = new URLSearchParams()

  //   if (page) {
  //     params.set('page', page)
  //   }

  //   if (pageSize) {
  //     params.set('page_size', pageSize)
  //   }

  //   if (ratingLevel) {
  //     params.set('rating_level', ratingLevel)
  //   }

  //   if (userRank) {
  //     params.set('user_rank', userRank)
  //   }

  //   return `${params}`
  // }, [page, pageSize, ratingLevel, userRank])

  // useEffect(() => {
  //   if (router.query.tab === 'reviews' || router.query?.tab?.[0] === 'reviews') {
  //     setLoading(true)
  //     switch (currentResource) {
  //     case 'hub':
  //       router.replace(`/${currentResource}/${slug}/reviews${params ? `?${params}` : ''}`).finally(() => {
  //         setLoading(false)
  //       })
  //       break
  //     case 'guilds':
  //       router.replace(`/${currentResource}/${slug}?tab=reviews${params ? `&${params}` : ''}`).finally(() => {
  //         setLoading(false)
  //       })
  //       break

  //     default:
  //       break
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params])

  useEffect(() => {
    if (router.query?.tab?.[0] !== 'reviews') {
      return
    }
    if (firstCome) {
      setFirstCome(false)
      return
    }
    getListReviews()

    // setLoading(true)
    // router.replace(`/hub/${router.query.slug}/reviews${params ? `?${params}` : ''}`).finally(() => {
    // setLoading(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ratingLevel, userRank])

  const getListReviews = () => {
    const reviewFilterValue: any = { aggregator: { slug: { eq: slug } }, status: { eq: 'published' } }
    if (ratingLevel) {
      reviewFilterValue.author = {
        ...(reviewFilterValue.author || {}),
        rates: {
          rate: { eq: +ratingLevel },
          aggregator: { slug: { eq: slug } }
        }
      }
    }
    if (userRank) {
      reviewFilterValue.author = {
        ...(reviewFilterValue.author || {}),
        rank: { eq: userRank }
      }
    }
    setLoading(true)
    fetcher('/api/hub/reviews/list', { method: 'POST', body: JSON.stringify({ variables: { slug, reviewFilterValue, paginationArg: { pageSize, page } } }) }).then((result) => {
      setLoading(false)
      const reviews = get(result, 'data.reviews.data', [])
      if (result?.error) {
        toast.error('please try again!')
        return
      }
      if (!isEmpty(reviews)) {
        const formatData = reviews.map((e: { attributes: any; id: number }) => {
          const { author = {}, publishedAt, rate, review, title, likeCount, dislikeCount, commentCount } = e?.attributes || {}
          const { level, rank, repPoint, firstName, lastName, avatar, walletAddress, reviewCount, rates } = author?.data?.attributes || {}
          return {
            id: e.id || '',
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
        if (page === 1) {
          setListReview(formatData)
          return
        }
        setListReview([...listReview, ...formatData])
      } else {
        setListReview([])
      }
    }).catch((err) => {
      setLoading(false)
      toast.error('please try again!')
      console.debug('err', err)
    })
  }

  const handleLoadMore = () => {
    // const p = (!page || +page > pageCountReviews) ? '1' : page
    setPage(Number(page) + 1)
  }

  const handleSetRatingLevel = (v: React.SetStateAction<string>) => {
    setPage(1)
    setRatingLevel(v)
  }

  // const handleSetsUserRank = (v: React.SetStateAction<string>) => {
  //   setPage(1)
  //   setUserRank(v)
  // }

  let viewAllReviewsPath
  switch (currentResource) {
  case 'hub':
    viewAllReviewsPath = `/${currentResource}/${slug}/reviews`
    break
  case 'guilds':
    viewAllReviewsPath = `/${currentResource}/${slug}?tab=reviews&page=1`
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
      className="md:container mx-auto lg:block mt-4"
      onClick={handleSetFilterShown}
    >
      {(data?.totalReviews || !isEmpty(listReview))
        ? (
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-start md:items-center md:justify-between">
            {filter && <ReviewListFilter
              ratingLevel={ratingLevel}
              setRatingLevel={handleSetRatingLevel}
            />}
            {review && <Link href={createOrUpdateReviewUrl} passHref>
              <a
                className="bg-gamefiGreen-700 md:self-end text-gamefiDark-900 py-2 px-6 rounded-sm clipped-t-r hover:opacity-90 cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                <span className="uppercase font-bold text-[13px] leading-[150%] tracking-[0.02em] text-[#0D0F15] not-italic font-mechanic">
                  Write my review
                </span>
              </a>
            </Link>
            }
          </div>
        )
        : null
      }
      {
        isEmpty(listReview) && !data?.totalReviews && <div className='flex flex-col w-full items-center mt-4'>
          <Link href={createOrUpdateReviewUrl} passHref>
            <a className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1 mt-6 no-underline" style={{ textDecoration: 'none' }}>
              <div className='font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-[13px]'>
                Write first review
              </div>
            </a>
          </Link>
        </div>
      }

      <div className="mt-6 relative">
        <div className="relative mb-4">
          {!isEmpty(listReview)
            ? listReview.map((item, i) => {
              return <ReviewListItem currentResource={currentResource} key={i} data={item} index={item.id} defaultLikeStatus={likeStatusOfReviews?.[item.id] ?? ''} />
            })
            : <div className='flex flex-col w-full items-center'>
              <span className='text-sm font-normal opacity-50 mt-[14px] mb-4'>No review available</span>
              <Image src={require('@/assets/images/hub/no-review.png')} width={93} height={75} alt="no-review" />
            </div>
          }
        </div>
        {pagination && <Pagination
          page={+data.page}
          pageLast={data.pageLast}
          setPage={setPage}
          className="w-full justify-end mb-8"
        />}
        {viewAll &&
          <a href={viewAllReviewsPath} className='bg-[#21232A] flex justify-center items-center w-full h-14 rounded cursor-pointer hover:opacity-95'>
            <span className='capitalize mr-3 font-medium text-sm not-italic'>View All</span>
            <Image width={12} height={12} src={require('@/assets/images/hub/arrow-down.svg')} alt='down'></Image>
          </a>}
        {(loadMore && pageCountReviews > +page) && <div className='flex mt-8 w-full justify-center items-center'>
          <div className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1" onClick={handleLoadMore}>
            <span className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-16 rounded leading-5 uppercase font-bold text-[13px]">
              Load More
            </span>
          </div>
        </div>}
      </div>
      {loading && <Loading />}
    </div>
  )
}

export default ReviewList
