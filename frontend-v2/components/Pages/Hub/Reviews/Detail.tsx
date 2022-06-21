import React, { useEffect, useMemo, useState } from 'react'
import UserInfo from '@/components/Pages/Hub/Reviews/UserInfo'
import GroupAction from '@/components/Pages/Hub/Reviews/GroupAction'
import styles from './review.module.scss'
import { printNumber, fetcher } from '@/utils'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import ItemComment from '@/components/Pages/Hub/Reviews/ItemComment'
import Star from '@/components/Pages/Hub/Reviews/Star'
import clsx from 'clsx'
import { useMediaQuery } from 'react-responsive'
import Loading from '@/components/Pages/Hub/Loading'
import { useRouter } from 'next/router'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import useConnectWallet from '@/hooks/useConnectWallet'
import useHubProfile from '@/hooks/useHubProfile'
import Avatar from '@/components/Pages/Hub/Reviews/Avatar'

const MIN_HEIGHT_TEXTAREA = 64
const MAX_HEIGHT_TEXTAREA = 224
const STARS = [1, 2, 3, 4, 5]

function Divide () {
  return (
    <div className={`${styles.divide}`}></div>
  )
}

function ProsAndCons ({ pros = [], cons = [] }) {
  return (
    <div className='mb-7'>
      {pros.map(e => {
        return (
          <div key={`prop_${e.id}`} className='flex mb-4'>
            <div className='w-4 h-4 mt-1'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z" fill="#36C40C" />
              </svg>
            </div>
            <p className={`${styles.pros_text} font-casual ml-[10px] w-full`}>{e.text}</p>
          </div>
        )
      })}
      {cons.map(e => {
        return (
          <div key={`prop_${e.id}`} className='flex mb-4'>
            <div className='w-4 h-4 mt-1'>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM12 9H4V7H12V9Z" fill="#FF3838" />
              </svg>
            </div>
            <p className={`${styles.pros_text} font-casual ml-[10px]`}>{e.text}</p>
          </div>
        )
      })}
    </div>
  )
}

function calcHeight (value) {
  const numberOfLineBreaks = (value.match(/\n/g) || []).length

  const newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2
  if (newHeight < MIN_HEIGHT_TEXTAREA) {
    return MIN_HEIGHT_TEXTAREA
  }
  if (newHeight > MAX_HEIGHT_TEXTAREA) {
    return MAX_HEIGHT_TEXTAREA
  }
  return newHeight
}

export default function Detail ({ data }) {
  const router = useRouter()
  const [page, setPage] = useState<string>('')
  const [isShowCommentAction, setIsShowCommentAction] = useState<boolean>(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [likeStatusOfReview, setLikeStatusOfReview] = useState('')
  const [likeStatusOfComment, setLikeStatusOfComment] = useState({})
  const [isFocusCommentInput, setIsFocusCommentInput] = useState<boolean>(false)

  const isMDScreen = useMediaQuery({ minWidth: '960px' })

  const { connectWallet } = useConnectWallet()
  const setTextAreaHeight = () => {
    const el = document.getElementById('commentTextarea')
    el.style.height = calcHeight(comment).toString() + 'px'
  }
  const { accountHub } = useHubProfile()
  const params = useMemo(() => {
    const _params = new URLSearchParams()
    if (page) {
      _params.set('page', page)
    }

    return _params.toString()
  }, [page])

  useEffect(() => {
    setLoading(true)
    router.push(`/hub/${router.query.slug}/reviews/${router.query.id}${params ? `?${params}` : ''}`).finally(() => {
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const handleCreateComment = (response) => {
    const { walletAddress, signature } = response
    fetcher('/api/hub/createComment', {
      method: 'POST',
      body: JSON.stringify({ comment, review: data?.id }),
      headers: {
        'X-Signature': signature,
        'X-Wallet-Address': walletAddress
      }
    }).then(({ err }) => {
      setLoading(false)
      if (err) {
        toast.error('Could not create the comment')
      } else {
        toast.success('success')
        setComment('')
        router.replace(router.asPath)
      }
    }).catch((err) => {
      setLoading(false)
      toast.error('Could not create the comment')
      console.debug('err', err)
    })
  }

  useEffect(() => {
    if (!isEmpty(accountHub)) {
      getLikesByUser()
    } else {
      setLikeStatusOfReview('')
      setLikeStatusOfComment({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub])

  const getLikesByUser = () => {
    setLoading(true)
    fetcher('/api/hub/likes/getLikesByUserId', { method: 'POST', body: JSON.stringify({ variables: { userId: accountHub?.id } }) }).then((result) => {
      setLoading(false)
      if (!isEmpty(result)) {
        const handleData = result?.data?.likes?.data?.reduce((total, v) => {
          const like = v.attributes
          if (like.objectType === 'review') {
            if (like.objectId === +router.query.id) {
              total.statusOfReview = like.status
            }
          } else {
            total.listLikeComment[like.objectId] = like.status
          }
          return total
        }, { statusOfReview: '', listLikeComment: {} })
        setLikeStatusOfReview(handleData.statusOfReview)
        setLikeStatusOfComment(handleData.listLikeComment)
      }
    }).catch((err) => {
      setLoading(false)
      console.debug('err', err)
    })
  }

  const handleFocusCommentInput = () => {
    setIsShowCommentAction(true)
    setIsFocusCommentInput(true)
  }

  const handleOnBlurCommentInput = () => {
    setIsFocusCommentInput(false)
  }

  const handleOnChangeComment = (e) => {
    setComment(e.target.value)
  }

  const handleOnChangeStatus = (type, value) => {
    router.replace(router.asPath).finally(() => {
      if (type === 'review') {
        setLikeStatusOfReview(value)
      }
    })
  }

  const handleCancel = () => {
    setComment('')
  }

  const onSubmit = () => {
    setLoading(true)
    // callWidthRest({ ...data, status, aggregator: id, pros: handleProsAndCons(pros), cons: handleProsAndCons(cons) }).then(({ err }) => {
    connectWallet().then((res: any) => {
      if (res.error) {
        setLoading(false)
        console.debug(res.error)
        toast.error('Could not create the comment')
        return
      }
      handleCreateComment(res)
    }).catch(err => {
      setLoading(false)
      console.debug(err)
      // toast.error(err?.toString() || 'Could not sign the authentication message')
    })
  }

  const likeCountText = useMemo(() => {
    const totalLike = data.likeCount
    if (!totalLike) return ''

    if (totalLike === 1) {
      return likeStatusOfReview === 'like' ? 'You liked this.' : '1 other liked this.'
    }

    if (totalLike >= 2) {
      return likeStatusOfReview === 'like' ? `You and ${printNumber(totalLike - 1)} others liked this.` : `${printNumber(totalLike)} others liked this.`
    }
  }, [data.likeCount, likeStatusOfReview])

  const userRate = useMemo(() => {
    return get(data, 'user.rates.data.[0].attributes.rate') || 0
  }, [data])
  return (
    <div className="review_detail flex flex-col md:flex-row">
      <UserInfo user={data.user} className='md:w-1/4' />
      <div className="flex-1 flex flex-col mt-4 sm:mt-0">
        <div className="flex mb-5">
          <p className="text-2xl font-bold uppercase font-mechanic">REVIEW <a href={`/hub/${router.query.slug}`} target="_blank" rel="noreferrer"><span className='text-gamefiGreen-500 font-mechanic cursor-pointer hover:underline'>{data.gameName || ''}</span></a></p>
        </div>

        <div className={`${styles.rating_bar} h-14 w-full flex items-center mb-10 px-[18px] justify-between md:justify-start`}>
          <div className='flex gap-2'>
            {
              STARS.map(level => {
                return <Star key={`acc_review_rate_${level}`} selected={userRate >= level} size={'20px'}></Star>
              })
            }
          </div>
          {data.publishedAt && <div className={clsx(styles.published_date, 'font-casual md:justify-between')}>{isMDScreen ? `Published ${format(new Date(data.publishedAt), 'd LLL, yyyy - hh:mm:ss OOO')}` : format(new Date(data.publishedAt), 'd LLL, yyyy')}</div>}
        </div>
        <div className={`${styles.content} font-casual whitespace-pre-line text-base font-normal text-white mb-10`}>{data.review}</div>

        {(data?.pros?.length || data?.cons?.length)
          ? <div>
            <div className='uppercase font-bold text-base text-white mb-6 font-mechanic'>Pros and Cons</div>
            <ProsAndCons pros={data.pros} cons={data.cons} />
          </div>
          : null}

        <Divide />

        <div className='flex flex-col py-2 md:py-4 md:flex-row md:gap-0 gap-2 md:justify-between md:items-center'>
          <p className={`${styles.total_like}`}>{likeCountText}</p>
          <GroupAction id={data.id} pageSource="review" defaultLikeStatus={likeStatusOfReview} onChangeStatus={handleOnChangeStatus} />
        </div>

        <Divide />

        <div className='font-bold text-base uppercase text-white mt-10 mb-8 font[Rajdhani]'>{`COMMENTS (${printNumber(data?.totalComment)})`}</div>
        <div className={`${styles.input_comment} flex flex-col px-6 py-6 mb-2 relative`}>
          {loading && <Loading />}
          <div className="flex w-full">
            <div className='block w-fit h-fit rounded mr-3 overflow-hidden'>
              <Avatar url={get(accountHub, 'avatar.url')} />
            </div>
            <textarea
              id='commentTextarea'
              className={`${styles.input} ring-0 pt-5 h-16 flex-1 placeholder:font-semibold placeholder:text-sm hover:placeholder:text-white placeholder:font-['Poppins'] font-['Poppins']`}
              placeholder={isFocusCommentInput ? '' : 'Write your comment'}
              onChange={handleOnChangeComment}
              onFocus={handleFocusCommentInput}
              onBlur={handleOnBlurCommentInput}
              onKeyUp={setTextAreaHeight}
              value={comment}></textarea>
          </div>
          {
            isShowCommentAction && <div className='flex gap-2 self-end mt-6'>
              <button className='h-9 w-24 text-gamefiGreen-500 hover:opacity-95' onClick={handleCancel}>Cancel</button>
              <div className='flex group'>
                <button
                  disabled={!comment?.length}
                  onClick={onSubmit}
                  className={`${styles.button_submit} h-9 w-36 bg-gamefiGreen-700 group-hover:opacity-95 text-black font-bold uppercase text-sm disabled:cursor-not-allowed`}>
                  Submit
                </button>
                <svg className='h-9 fill-gamefiGreen-700 group-hover:opacity-95' viewBox="0 0 10 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0L10 7.5V34C10 35.1046 9.10457 36 8 36H0V0Z" />
                </svg>
              </div>
            </div>
          }
        </div>

        {
          data?.comments.map((e, index) => <ItemComment key={`comment_${index}`} data={e} index={index} defaultLikeStatus={likeStatusOfComment?.[e.id] ?? ''} />)
        }

        {get(data, 'totalComment', 0) > (get(data, 'comments', []).length) && <div className='flex mt-8 w-full justify-center items-center mb-4'>
          <div className="hidden sm:inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1" onClick={() => setPage(`${Number(page || 1) + 1}`)}>
            <span className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-16 rounded leading-5 uppercase font-bold text-[13px]">
              Load More
            </span>
          </div>
        </div>}
      </div>
    </div>
  )
}
