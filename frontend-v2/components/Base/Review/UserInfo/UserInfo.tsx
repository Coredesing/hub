import { useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import get from 'lodash.get'
import { printNumber, shorten } from '@/utils'
import ReviewAvatar from '@/components/Base/Review/Avatar'
import styles from '@/components/Base/Review/review.module.scss'

const ReviewUserInfo = ({ user, className = '' }) => {
  const router = useRouter()

  const openUserProfile = () => {
    const userId = get(user, 'id')
    if (!userId) return
    router.push('/user/[id]', `/user/${userId}`)
  }

  const fullName = useMemo(() => {
    let fullName = ''
    const firstName = get(user, 'firstName')
    const lastName = get(user, 'lastName')
    const walletAddress = get(user, 'walletAddress')
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
  }, [user])

  const rankAndLevel = useMemo(() => {
    let _text = ''
    if (user?.rank) {
      _text += user.rank
    }
    if (user?.level) {
      if (user?.rank) {
        _text += ` - Level ${user.level}`
      }
    }

    return _text || ''
  }, [user.level, user.rank])

  return (
    <div className={clsx(styles.alert, 'h-auto', className)}>
      <div className="flex w-full mb-4 sm:mb-8 items-center">
        <div className="block w-fit h-fit rounded mr-3 overflow-hidden cursor-pointer" onClick={openUserProfile}>
          <ReviewAvatar url={get(user, 'avatar.url')} />
        </div>
        <div className="flex flex-col">
          <div
            className={`${styles.username} font-casual mt-0 cursor-pointer hover:underline py-1`}
            onClick={openUserProfile}
          >
            {fullName && (fullName.length > 9 ? shorten(fullName || '', 15) : fullName)}
          </div>
          <div className={`${styles.rank} font-casual mt-3 md:min-w-[128px]`}>{rankAndLevel}</div>
        </div>
      </div>
      <div className="flex justify-between md:flex-col mb-6 sm:mb-0">
        <div className="flex items-center w-full sm:mb-2 font-casual">
          <Image src={require('@/assets/images/hub/bubble.svg')} alt="bubble" />
          <span className="font-casual font-medium text-sm text-white ml-[10px] mr-1">
            {printNumber(user?.reviewCount || '0')}
          </span>
          {(user?.reviewCount || '0') > 1 ? 'Reviews' : 'Review'}
        </div>
      </div>
    </div>
  )
}

export default ReviewUserInfo
