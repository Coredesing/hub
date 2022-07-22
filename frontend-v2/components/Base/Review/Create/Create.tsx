import { useState, useEffect, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import isEmpty from 'lodash.isempty'
import get from 'lodash.get'
import { fetcher } from '@/utils'
import { normalize } from '@/graphql/utils'
import useConnectWallet from '@/hooks/useConnectWallet'
import useHubProfile from '@/hooks/useHubProfile'
import { REVIEWS_STATUS } from '@/components/Base/Review/constants'
import Loading from '@/components/Pages/Hub/Loading'
import ReviewRatingAction from '@/components/Base/Review/Rating/Action'
import ReviewCreateProsAndCons, { MIN_LENGTH_PROS_CONS } from '@/components/Base/Review/Create/ProsAndCons'

const handleProsAndCons = data => {
  return data.reduce((t, v) => {
    const value = v?.trim()

    if (value) {
      t.push({ text: value })
    }

    return t
  }, [])
}

const buildCheckpoints = (currentResource) => {
  const checkPoints = []

  switch (currentResource) {
  case 'aggregator':
    checkPoints.push('Rate this project is required')
    break
  case 'guild':
    checkPoints.push('Rate this guild is required')
    break
  }

  checkPoints.push('At least 10 and max 100 characters are required in Title', 'At least 50 characters are required in Review')

  return checkPoints
}

interface ReviewCreateProps {
  data: any;
  currentResource: 'guild' | 'aggregator';
}

const ReviewCreate = ({ data, currentResource }: ReviewCreateProps) => {
  const [pros, setPros] = useState([''])
  const [cons, setCons] = useState([''])
  const [currentReview, setCurrentReview] = useState(null)
  const [currentRate, setCurrentRate] = useState('')
  const { register, formState: { errors, isSubmitted }, setError, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const router = useRouter()
  const { slug } = router.query
  const CHECKPOINTS = buildCheckpoints(currentResource)

  const { id, name } = data
  const { accountHub } = useHubProfile()

  const MIN_LENGTH_TITLE = 10
  const MAX_LENGTH_TITLE = 100

  const MIN_LENGTH_REVIEW = 10

  const { connectWallet } = useConnectWallet()
  useEffect(() => {
    if (isEmpty(accountHub)) {
      resetForm()
      return
    }

    setLoading(true)

    let query
    switch (currentResource) {
    case 'aggregator':
      query = 'GET_REVIEW_AND_RATE_BY_USER_ID_FOR_AGGREGATOR'
      break
    case 'guild':
      query = 'GET_REVIEW_AND_RATE_BY_USER_ID_FOR_GUILD'
      break
    }

    fetcher('/api/hub/reviews', {
      method: 'POST',
      body: JSON.stringify({
        variables: {
          userId: accountHub.id,
          slug
        },
        query: query
      })
    }).then((res) => {
      setLoading(false)

      if (!isEmpty(res)) {
        const data = normalize(res.data)
        const review = get(data, 'reviews[0]', {})
        if (!isEmpty(review)) {
          setCurrentReview(review)
          if (!isEmpty(review.pros)) setPros(review.pros.map(v => v.text))
          if (!isEmpty(review.cons)) setCons(review.cons.map(v => v.text))
          setValue('title', review.title)
          setValue('review', review.review)
          setDisabledSubmit(review.status === REVIEWS_STATUS.PENDING)
        }
        const rate = get(data, 'rates[0].rate', '')
        if (rate) {
          setCurrentRate(rate)
        }
      }
    }).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub, slug])

  const resetForm = () => {
    setValue('title', '')
    setValue('review', '')
    setCurrentReview(null)
    setCurrentRate('')
    setPros([''])
    setCons([''])
  }

  const onSubmit = status => data => {
    if (data.title.trim().length < MIN_LENGTH_TITLE || data.title.trim().length > MAX_LENGTH_TITLE) {
      setError('title', { message: 'error' })
      return
    }

    if (data.review.trim().length < MIN_LENGTH_REVIEW) {
      setError('review', { message: 'error' })
      return
    }

    if ([...pros, ...cons].some(v => v?.trim() && v.trim().length < MIN_LENGTH_PROS_CONS)) {
      return toast.error('please check for errors!')
    }

    if (!currentRate) {
      return toast.error('please rate this game!')
    }

    setLoading(true)
    connectWallet().then((res: any) => {
      if (res.error) {
        setLoading(false)
        console.debug(res.error)
        toast.error('Could not create the review')
        return
      }

      const { walletAddress, signature } = res
      const createOrUpdateReviewUrl = currentReview ? `/api/hub/reviews/${currentReview.id}` : '/api/hub/reviews/createReview'
      const createOrUpdateReviewBody = {
        ...data,
        status,
        pros: handleProsAndCons(pros),
        cons: handleProsAndCons(cons)
      }
      createOrUpdateReviewBody[currentResource] = id
      const createRateUrl = '/api/hub/reviews/createRate'
      const createRateBody = {
        rate: currentRate
      }
      createRateBody[currentResource] = id

      const createOrUpdateReviewFetcher = fetcher(createOrUpdateReviewUrl, {
        method: currentReview ? 'PUT' : 'POST',
        body: JSON.stringify(createOrUpdateReviewBody),
        headers: {
          'X-Signature': signature,
          'X-Wallet-Address': walletAddress
        }
      })

      const createRateFetcher = fetcher(createRateUrl, {
        method: 'POST',
        body: JSON.stringify(createRateBody),
        headers: {
          'X-Signature': signature,
          'X-Wallet-Address': walletAddress
        }
      })

      const createOrUpdateFetchers = [createOrUpdateReviewFetcher, createRateFetcher]

      Promise.all(createOrUpdateFetchers).then((value) => {
        setLoading(false)

        if (!value || value.some(v => v.error)) {
          toast.error('Could not create the review')
        } else {
          toast.success(status === REVIEWS_STATUS.DRAFT ? 'Save draft successfully' : 'Submit review successfully')
          router.push(`/account/review?status=${status}`)
        }
      }).catch((err) => {
        setLoading(false)
        toast.error('Could not create the review')
        console.debug('err', err)
      })
    }).catch(err => {
      setLoading(false)
      console.debug(err)
    })
  }

  const handleSubmitDraft = () => {
    handleSubmit(onSubmit(REVIEWS_STATUS.DRAFT))()
  }

  const handleSubmitDone = () => {
    handleSubmit(onSubmit(REVIEWS_STATUS.PENDING))()
  }

  const back = () => {
    switch (currentResource) {
    case 'aggregator':
      router.push(`/hub/${slug}?tab=2`).finally(() => { })
      break
    case 'guild':
      router.back()
      break
    }
  }

  const handleSetCurrentRate = (v: SetStateAction<string>) => () => {
    setCurrentRate(v)
  }

  return (
    <div className="md:grid grid-rows md:grid-cols-8 md:gap-4 xl:gap-7 mb-4">
      {loading && <Loading />}
      <div className="col-span-12 md:col-span-5 mb-4">
        <div className="uppercase font-bold text-2xl mb-9">
          You are reviewing <span className="text-gamefiGreen-700">{name}</span>
        </div>
        <div>
          <div className="mb-8">
            <div
              style={{ background: 'linear-gradient(90.55deg, #303035 0.3%, rgba(48, 48, 53, 0) 90.04%)' }}
              className="p-7 radius-1 flex justify-between items-center text-[13px] flex-col sm:flex-row"
            >
              <div className="font-bold text-center sm:text-left flex-1 mb-3 sm:mb-0">RATE THIS PROJECT</div>
              <div className="flex justify-end items-center flex-wrap">
                <div className="pr-6 font-casual text-white/30 hidden sm:block">Click to rate</div>
                <ReviewRatingAction rate={currentRate} callBack={handleSetCurrentRate} disabled={loading} />
              </div>
            </div>
            {isSubmitted && !currentRate && (
              <div className="mt-2 text-normal text-red-500 ">{CHECKPOINTS[0]}</div>
            )}
          </div>

          <form className="w-full m-auto pb-4">
            <div className="mb-6">
              <div className="text-sm mb-2 font-casual text-gamefiDark-350 text-[13px]">Title *</div>
              <input
                className="bg-[#303035] border border-[#3C3C42] placeholder-white placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-2 w-full focus-visible:border-gamefiDark-350"
                name="title"
                placeholder="Summarise your experience in one phrase"
                autoFocus
                maxLength={100}
                {...register('title', { required: true, minLength: MIN_LENGTH_TITLE, maxLength: MAX_LENGTH_TITLE })}
              />
              {errors.title && (
                <div className="mt-2 text-normal text-red-500 ">{CHECKPOINTS[1]}</div>
              )}
            </div>

            <div className="mb-6">
              <div className="text-sm mb-2 font-casual text-gamefiDark-350 text-[13px]">Review *</div>
              <textarea
                className="bg-[#303035] border border-[#3C3C42] placeholder-white placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-2 w-full focus-visible:border-gamefiDark-350"
                name="review"
                rows={12}
                cols={10}
                placeholder="Tell your personal experience with this game"
                {...register('review', { required: true, minLength: MIN_LENGTH_REVIEW })}
              />
              {errors.review && (
                <div className="mt-2 text-normal text-red-500 ">{CHECKPOINTS[2]}</div>
              )}
            </div>
          </form>

          <div className="mb-14">
            <ReviewCreateProsAndCons data={pros} title="pros" onChange={setPros} />
            <ReviewCreateProsAndCons data={cons} title="cons" onChange={setCons} />
          </div>

          <div className="flex justify-end h-9">
            <button
              className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-700 hover:text-gamefiGreen-200 clipped-b-l py-2 px-7 rounded leading-5 font-bold text-sm"
              onClick={back}
            >
              Cancel
            </button>
            <button
              className="w-36 bg-gamefiGreen-700 clipped-b-l p-px rounded cursor-pointer mr-3 h-9 disabled:cursor-not-allowed"
              onClick={handleSubmitDraft}
              disabled={disabledSubmit}
            >
              <div className="flex align-center justify-center h-full font-mechanic bg-gamefiDark-900 text-gamefiGreen-700 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-[13px]">
                save draft
              </div>
            </button>
            <button
              disabled={disabledSubmit}
              className="w-36 uppercase overflow-hidden px-8 bg-gamefiGreen-700 text-gamefiDark-900 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer rounded-sm clipped-t-r disabled:cursor-not-allowed"
              onClick={handleSubmitDone}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:col-span-3">
        <div className="uppercase font-bold text-2xl mb-8">Checkpoints</div>
        {CHECKPOINTS.map(v => (
          <div className="flex mb-4" key={v}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z" fill="#484A50" />
            </svg>
            <div className="ml-2 text-[13px] font-casual">
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewCreate
