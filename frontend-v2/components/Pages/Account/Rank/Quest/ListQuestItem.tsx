import { useMemo, useState } from 'react'
import get from 'lodash.get'
import clsx from 'clsx'
import { fetcher, pad } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useCountdown } from '@/components/Pages/Hub/Countdown'

const Item = ({ data }) => {
  const { account: walletId } = useMyWeb3()
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  const resetAt = get(data, 'resetAt')
  const { countdown, ended } = useCountdown({ deadline: resetAt || new Date() })

  const {
    name,
    reward,
    description,
    link,
    buttonLabel,
    isCompleted,
    action,
    banner
  } = useMemo(() => {
    const rewardQuantity = get(data, 'rewards[0].quantity')
    const isCompleted = get(data, 'isCompleted')

    const countdownText = `${pad(countdown.hours)}H : ${pad(
      countdown.minutes
    )}M : ${pad(countdown.seconds)}S`
    return {
      isCompleted,
      name: get(data, 'name'),
      reward: `${rewardQuantity >= 0 ? `+${rewardQuantity}` : ''} ${get(
        data,
        'rewards[0].name',
        ''
      )}`,
      description: get(data, 'description'),
      link: get(data, 'link'),
      buttonLabel: isCompleted
        ? resetAt
          ? `Reset in ${countdownText}`
          : 'Completed'
        : get(data, 'buttonLabel'),
      action: get(data, 'conditions.[0].action', {}),
      banner: get(data, 'banner')
    }
  }, [countdown.hours, countdown.minutes, countdown.seconds, data, resetAt])

  const doAction = () => {
    if (
      !walletId ||
      !action?._id ||
      isLoading ||
      isCompleted ||
      (resetAt && !ended)
    ) {
      return
    }
    if (link) {
      const payload = {
        walletId,
        actionId: action._id
      }
      const authWindow = window.open(
        `${link}?state=${Buffer.from(JSON.stringify(payload)).toString(
          'base64'
        )}`,
        '',
        'width=800,height=600'
      )
      const interval = setInterval(() => {
        if (authWindow.closed) {
          router.reload()
          clearInterval(interval)
        }
      }, 1000)

      return
    }
    setLoading(true)
    fetcher('/api/account/ranks/eventCollect', {
      method: 'POST',
      body: JSON.stringify({
        walletId,
        origin: window.location.origin,
        action: action._id
      })
    })
      .catch(() => {
        toast.error('Failed!')
      })
      .finally(() => {
        setTimeout(() => {
          router.reload()
        }, 1000)
      })
  }

  return (
    <div className="flex flex-col justify-between flex-1">
      <div
        className="bg-[#383A43] min-h-[200px] md:min-h-[146px] relative bg-cover"
        style={banner ? { backgroundImage: `url(${banner})` } : {}}
      >
        <div className="absolute top-0 left-0 bg-[#15171E] clipped-b-r-full w-24 h-6 pl-[10px] flex items-center">
          <span className="uppercase font-mechanic font-bold text-[16px] leading-[100%] text-[#7BF404]">
            {reward}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 py-6 px-5 bg-[#272930]">
        <div className="mb-6 font-casual font-medium text-base leading-[150%] text-white">
          {description}
        </div>
        <button
          // href={isCompleted ? 'javascript:void(0);' : link}
          // target={isCompleted ? '_self' : '_blank'}
          // rel="noreferrer"
          onClick={doAction}
          className={clsx(
            'w-full rounded-sm clipped-b-r h-[30px] flex justify-center items-center',
            isCompleted || isLoading || !action?._id
              ? 'bg-[#383A43] cursor-not-allowed'
              : 'bg-[#7BF404] cursor-pointer hover:opacity-80'
          )}
        >
          <span
            className={clsx(
              'font-bold text-[13px] leading-[150%] uppercase tracking-[0.02em]',
              isCompleted || !action?._id ? 'text-white/20' : 'text-[#0D0F15]'
            )}
          >
            {buttonLabel || name || ''}
          </span>
        </button>
      </div>
    </div>
  )
}

export default Item
