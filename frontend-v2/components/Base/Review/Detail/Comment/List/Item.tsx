import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import get from 'lodash.get'
import ReviewAvatar from '@/components/Base/Review/Avatar'
import ReviewGroupAction from '@/components/Base/Review/GroupAction'
import ReviewStatistics from '@/components/Base/Review/Statistics'
import styles from '@/components/Base/Review/review.module.scss'

const DEFAULT_HEIGHT_BEFORE_SHOW_MORE = 168

function isOverDefaultHeight (id) {
  const el = document.getElementById(id)
  const divHeight = el.offsetHeight

  return divHeight >= DEFAULT_HEIGHT_BEFORE_SHOW_MORE
}

interface ReviewDetailCommentItemProps {
  data: any;
  index: number;
  defaultLikeStatus: string;
  currentResource: 'guilds' | 'hub';
}

const ReviewDetailCommentItem = ({ data, index, defaultLikeStatus, currentResource }: ReviewDetailCommentItemProps) => {
  const [isOver, setIsOverDefaultHeight] = useState(false)

  const router = useRouter()

  const comment = data?.comment || ''
  const author = data.user?.data?.attributes

  const [isShowMore, setIsShowMore] = useState(false)

  useEffect(() => {
    const _isOver = isOverDefaultHeight(`commentContent_${index}`)
    setIsOverDefaultHeight(_isOver)
  }, [index])

  const openUserProfile = () => {
    const userId = get(data, 'user.data.id')

    if (!userId) {
      return
    }

    router.push('/user/[id]', `/user/${userId}`)
  }

  const fullName = useMemo(() => {
    let fullName = ''
    const firstName = get(author, 'firstName')
    const lastName = get(author, 'lastName')
    const walletAddress = get(author, 'walletAddress')
    if (firstName) {
      fullName += firstName
    }
    if (lastName) {
      fullName += ` ${lastName}`
    }
    fullName = fullName.trim()
    if (!fullName) {
      fullName = `Anonymous-${walletAddress?.slice(-5)}`
    }

    return fullName
  }, [author])

  const rankAndLevel = useMemo(() => {
    let _text = ''
    if (author?.rank) {
      _text += author.rank
    }
    if (author?.level) {
      if (author?.rank) {
        _text += ` - Level ${author.level}`
      }
    }

    return _text || ''
  }, [author.level, author.rank])

  return (
    <div className={`${styles.comment} flex flex-col mb-2 p-6`}>
      <div className={`${styles.comment} flex items-center`}>
        <div className="block w-fit h-fit rounded overflow-hidden mr-3 cursor-pointer" onClick={openUserProfile}>
          <ReviewAvatar url={get(data, 'user.data.attributes.avatar.data.attributes.url')}/>
        </div>
        <div className="ml-3">
          <p className={`${styles.username} cursor-pointer hover:underline`} onClick={openUserProfile}>{fullName}</p>
          <p className={`${styles.rank} mt-3`}>{rankAndLevel}</p>
        </div>
      </div>

      <div id={`commentContent_${index}`} style={{ wordBreak: 'break-word' }} className={clsx(styles.content, 'mt-4 font-casual whitespace-pre-wrap', isShowMore ? 'max-h-fit' : 'max-h-[168px]')}>
        {comment}
        {!isShowMore && isOver && <div className={`${styles.blur}`}></div>}
      </div>
      {!isShowMore && isOver && <div
        className="w-fit self-end capitalize font-semibold text-gamefiGreen-500 text-sm leading-5 cursor-pointer hover:underline hover:opacity-95 mt-1 font-casual"
        onClick={() => setIsShowMore(true)}
      >Read More</div>}

      <div className={`${styles.divide} mt-2 mb-4 md:mb-6`}></div>

      <div className="flex flex-col md:flex-row justify-between">
        <ReviewStatistics like={get(data, 'likeCount')} dislike={get(data, 'dislikeCount')} comment={get(data, 'commentCount')} />
        <ReviewGroupAction
          likeCount={get(data, 'likeCount')}
          dislikeCount={get(data, 'dislikeCount')}
          commentCount={get(data, 'commentCount')}
          id={data.id}
          pageSource="comment"
          defaultLikeStatus={defaultLikeStatus}
          currentResource={currentResource}
        />
      </div>
    </div>
  )
}

export default ReviewDetailCommentItem
