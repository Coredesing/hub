import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { fetcher } from '@/utils'
import useConnectWallet from '@/hooks/useConnectWallet'
import ReviewGroupActionLike from '@/components/Base/Review/GroupAction/Like'
import ReviewGroupActionDislike from '@/components/Base/Review/GroupAction/Dislike'
import ReviewGroupActionComment from '@/components/Base/Review/GroupAction/Comment'
import styles from '@/components/Base/Review/review.module.scss'

type ReviewGroupActionProps = {
  pageSource?: string;
  id?: string;
  comment?: boolean;
  defaultLikeStatus?: string;
  onChangeStatus?: (type: string, value: string) => void;
  likeCount?: number;
  notShowCount?: boolean;
  dislikeCount?: number;
  commentCount?: number;
  currentResource: 'guilds' | 'hub';
}

const ReviewGroupAction = ({ likeCount, dislikeCount, commentCount, pageSource, id, comment = false, defaultLikeStatus, onChangeStatus, currentResource, notShowCount }: ReviewGroupActionProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [likeStatus, setLikeStatus] = useState(defaultLikeStatus)
  const [defaultLikeCount, setDefaultLikeCount] = useState(likeCount || 0)
  const [defaultDislikeCount, setDefaultDislikeCount] = useState(dislikeCount || 0)

  const { connectWallet } = useConnectWallet()
  const isLike = likeStatus === 'like'
  const isDislike = likeStatus === 'dislike'

  useEffect(() => {
    setLikeStatus(defaultLikeStatus)
  }, [defaultLikeStatus])

  const onSubmit = (type) => () => {
    connectWallet().then((res: any) => {
      if (res.error) {
        setLoading(false)
        console.debug(res.error)
        toast.error('Could not create the comment')
        return
      }

      let typeAPi: string
      if (likeStatus && ((isLike && type === 'like') || (isDislike && type === 'dislike'))) {
        setLikeStatus('')
        typeAPi = 'unlike'
      } else {
        setLikeStatus(type)
        typeAPi = 'like'
      }

      setLoading(true)
      const { walletAddress, signature } = res
      fetcher(`/api/hub/likes/${typeAPi}`, {
        method: 'POST',
        body: JSON.stringify({
          objectId: id,
          objectType: pageSource,
          status: type
        }),
        headers: {
          'X-Signature': signature,
          'X-Wallet-Address': walletAddress
        }
      }).then(({ err }) => {
        setLoading(false)
        if (err) {
          // toast.error('something went wrong')
        } else {
          if (!notShowCount) {
            if (typeAPi === 'like') {
              if (type === 'like') {
                setDefaultLikeCount(defaultLikeCount + 1)
                if (isDislike) setDefaultDislikeCount(defaultDislikeCount - 1)
              } else {
                setDefaultDislikeCount(defaultDislikeCount + 1)
                if (isLike) setDefaultLikeCount(defaultLikeCount - 1)
              }
            } else {
              if (type === 'like') {
                setDefaultLikeCount(defaultLikeCount - 1)
              } else setDefaultDislikeCount(defaultDislikeCount - 1)
            }
          }
          onChangeStatus && onChangeStatus('review', typeAPi === 'like' ? type : '')
          router.replace(router.asPath)
        }
      }).catch((err) => {
        setLoading(false)
        toast.error('something went wrong')
        console.debug('err', err)
      })
    }).catch(err => {
      setLoading(false)
      console.debug(err)
    })
  }

  const openReviewDetail = () => {
    const { slug } = router.query

    router.push(`/${currentResource}/[slug]/reviews/[id]`, `/${currentResource}/${slug}/reviews/${id}`)
  }

  return (
    <div className={`${styles.group_action} flex gap-2 justify-between md:justify-start relative`}>
      <button
        className={`flex items-center justify-center w-full md:w-[145px] px-1 h-10 ${isLike ? 'bg-gamefiGreen-700' : 'bg-[#2A2D36]'} hover:opacity-80 rounded-sm`}
        disabled={loading}
        onClick={onSubmit('like')}
      >
        <ReviewGroupActionLike selected={isLike} activeColor={'#000000'} inactiveColor={'#ffffff'} size={16} />
        <span className={`${styles.text} ${isLike ? 'text-black' : 'text-white'} ml-3 font-semibold leading-5 capitalize font-casual`}>
          {defaultLikeCount || 'Like'}
        </span>
      </button>
      <button
        className={`flex items-center justify-center w-full md:w-[145px] px-1 h-10 ${isDislike ? 'bg-gamefiGreen-700' : 'bg-[#2A2D36]'} hover:opacity-80 rounded-sm`}
        disabled={loading}
        onClick={onSubmit('dislike')}
      >
        <ReviewGroupActionDislike selected={isDislike} activeColor={'#000000'} inactiveColor={'#ffffff'} size={16} />
        <span className={`${styles.text} ${isDislike ? 'text-black' : 'text-white'} ml-3 font-semibold leading-5 capitalize font-casual`}>
          {defaultDislikeCount || 'Dislike'}
        </span>
      </button>
      {comment && (
        <button
          className="flex items-center justify-center w-full md:w-[145px] px-1 h-10 bg-[#2A2D36] hover:opacity-80 rounded-sm"
          onClick={openReviewDetail}
        >
          <ReviewGroupActionComment selected={false} activeColor={'#000000'} inactiveColor={'#ffffff'} size={16} />
          <span className={`${styles.text} 'text-white ml-3 font-semibold leading-5 capitalize font-casual`}>
            {commentCount || 'Comments'}
          </span>
        </button>
      )}
    </div >
  )
}

export default ReviewGroupAction
