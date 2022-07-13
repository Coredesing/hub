import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fetcher } from '@/utils'
import styles from './review.module.scss'
import { useRouter } from 'next/router'
import useConnectWallet from '@/hooks/useConnectWallet'
interface ButtonIconPropData {
  selected: boolean;
  activeColor: string;
  inactiveColor: string;
  size: string | number;
}

const Like = ({ selected, activeColor, inactiveColor, size }: ButtonIconPropData) => {
  return (
    <svg style={{
      height: size,
      width: size,
      display: 'block',
      // transition: 'color 0.5s ease-in-out, fill 0.5s ease-in-out',
      color: selected ? activeColor : inactiveColor,
      fill: 'transparent'
    }} viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 17.25H1.25V9H5" strokeWidth="1.5" strokeMiterlimit="10" />
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 9L7.25 0.75C7.84674 0.75 8.41903 0.987053 8.84099 1.40901C9.26295 1.83097 9.5 2.40326 9.5 3V7.5H15.125C15.4494 7.50001 15.7699 7.57017 16.0647 7.70565C16.3594 7.84114 16.6213 8.03875 16.8326 8.28495C17.0438 8.53114 17.1993 8.82009 17.2884 9.132C17.3775 9.4439 17.3981 9.77139 17.3487 10.092L16.541 15.342C16.4594 15.8728 16.1906 16.3569 15.7831 16.7069C15.3757 17.0568 14.8566 17.2494 14.3195 17.25H5V9Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}

const DisLike = ({ selected, activeColor, inactiveColor, size }: ButtonIconPropData) => {
  return (
    <svg style={{
      height: size,
      width: size,
      display: 'block',
      // transition: 'color 0.5s ease-in-out, fill 0.5s ease-in-out',
      color: selected ? activeColor : inactiveColor,
      fill: 'transparent'
    }} viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 0.75L1.25 0.75L1.25 9L5 9" strokeWidth="1.5" strokeMiterlimit="10" />
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 9L7.25 17.25C7.84674 17.25 8.41903 17.0129 8.84099 16.591C9.26295 16.169 9.5 15.5967 9.5 15L9.5 10.5L15.125 10.5C15.4494 10.5 15.7699 10.4298 16.0647 10.2943C16.3594 10.1589 16.6213 9.96125 16.8326 9.71505C17.0438 9.46886 17.1993 9.17991 17.2884 8.868C17.3775 8.5561 17.3981 8.22861 17.3487 7.908L16.541 2.658C16.4594 2.12718 16.1905 1.64306 15.7831 1.29314C15.3757 0.943213 14.8566 0.750563 14.3195 0.75L5 0.750001L5 9Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}

const Comment = ({ selected, activeColor, inactiveColor, size }: ButtonIconPropData) => {
  return (
    <svg style={{
      height: size,
      width: size,
      display: 'block',
      // transition: 'color 0.5s ease-in-out, fill 0.5s ease-in-out',
      color: selected ? activeColor : inactiveColor,
      fill: 'transparent'
    }} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path stroke={selected ? '#000000' : '#ffffff'} d="M16.3125 1.6875H1.6875C1.0665 1.6875 0.5625 2.1915 0.5625 2.8125V11.8125C0.5625 12.4335 1.0665 12.9375 1.6875 12.9375H5.0625V17.4375L10.3129 12.9375H16.3125C16.9335 12.9375 17.4375 12.4335 17.4375 11.8125V2.8125C17.4375 2.1915 16.9335 1.6875 16.3125 1.6875Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}

export { Like, DisLike, Comment }

type GroupActionProps = {
  pageSource?: string;
  id?: string;
  comment?: boolean;
  notShowCount?: boolean;
  defaultLikeStatus?: string;
  onChangeStatus?: (type: string, value: string) => void;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
}

export default function GroupAction ({ likeCount, dislikeCount, commentCount, pageSource, id, comment = false, defaultLikeStatus, onChangeStatus, notShowCount }: GroupActionProps) {
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
          // router.replace(router.asPath)
        }
      }).catch((err) => {
        setLoading(false)
        toast.error('something went wrong')
        console.debug('err', err)
      })
    }).catch(err => {
      setLoading(false)
      console.debug(err)
      // toast.error(err?.toString() || 'Could not sign the authentication message')
    })
  }

  const openReviewDetail = () => {
    const { slug } = router.query

    router.push('/hub/[slug]/reviews/[id]', `/hub/${slug}/reviews/${id}`)
  }

  return (
    <div className={`${styles.group_action} flex gap-2 justify-between md:justify-start relative`}>

      <button disabled={loading} onClick={onSubmit('like')} className={`flex items-center justify-center w-full md:w-[145px] px-1 h-10 ${isLike ? 'bg-gamefiGreen-700' : 'bg-[#2A2D36]'} hover:opacity-80 rounded-sm`}>
        <Like selected={isLike} activeColor={'#000000'} inactiveColor={'#ffffff'} size={16}></Like>
        <span className={`${styles.text} ${isLike ? 'text-black' : 'text-white'} ml-3 font-semibold leading-5 capitalize font-casual`}>{defaultLikeCount || 'Like'}</span>
      </button>
      <button disabled={loading} onClick={onSubmit('dislike')} className={`flex items-center justify-center w-full md:w-[145px] px-1 h-10 ${isDislike ? 'bg-gamefiGreen-700' : 'bg-[#2A2D36]'} hover:opacity-80 rounded-sm`}>
        <DisLike selected={isDislike} activeColor={'#000000'} inactiveColor={'#ffffff'} size={16}></DisLike>
        <span className={`${styles.text} ${isDislike ? 'text-black' : 'text-white'} ml-3 font-semibold leading-5 capitalize font-casual`}>{defaultDislikeCount || 'Dislike'}</span>
      </button>
      {
        comment && <button onClick={openReviewDetail} className={'flex items-center justify-center w-full md:w-[145px] px-1 h-10 bg-[#2A2D36] hover:opacity-80 rounded-sm'}>
          <Comment selected={false} activeColor={'#000000'} inactiveColor={'#ffffff'} size={16}></Comment>
          <span className={`${styles.text} 'text-white ml-3 font-semibold leading-5 capitalize font-casual`}>{commentCount || 'Comments'}</span>
        </button>
      }
    </div >
  )
}
