import React, { useState, useMemo } from 'react'
import { fetcher, gtagEvent, pad } from '@/utils'
import get from 'lodash.get'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useMyWeb3 } from '@/components/web3/context'
import { useCountdown } from '@/components/Pages/Hub/Countdown'
import styles from './tasks.module.scss'

const SocialItem = ({ data }) => {
  const { account: walletId } = useMyWeb3()
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  const resetAt = get(data, 'resetAt')
  const { countdown, ended } = useCountdown({ deadline: resetAt || new Date() })

  const {
    name,
    link,
    buttonLabel,
    label,
    icon,
    isCompleted,
    nameSocial,
    action
  } = useMemo(() => {
    const rewardQuantity = get(data, 'rewards[0].quantity')
    const isCompleted = get(data, 'isCompleted')

    const countdownText = `${pad(countdown.hours)}H : ${pad(
      countdown.minutes
    )}M : ${pad(countdown.seconds)}S`
    const currentSocial = [{
      name: 'Twitter',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C15.4 3.3 14.8 3.4 14.1 3.5C14.8 3.1 15.3 2.5 15.5 1.7C14.9 2.1 14.2 2.3 13.4 2.5C12.8 1.9 11.9 1.5 11 1.5C9.3 1.5 7.8 3 7.8 4.8C7.8 5.1 7.8 5.3 7.9 5.5C5.2 5.4 2.7 4.1 1.1 2.1C0.8 2.6 0.7 3.1 0.7 3.8C0.7 4.9 1.3 5.9 2.2 6.5C1.7 6.5 1.2 6.3 0.7 6.1C0.7 7.7 1.8 9 3.3 9.3C3 9.4 2.7 9.4 2.4 9.4C2.2 9.4 2 9.4 1.8 9.3C2.2 10.6 3.4 11.6 4.9 11.6C3.8 12.5 2.4 13 0.8 13C0.5 13 0.3 13 0 13C1.5 13.9 3.2 14.5 5 14.5C11 14.5 14.3 9.5 14.3 5.2C14.3 5.1 14.3 4.9 14.3 4.8C15 4.3 15.6 3.7 16 3Z" fill="white" />
      </svg>
    }, {
      name: 'Telegram',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_542_547)">
          <path d="M15.9683 1.68422C15.9557 1.62517 15.9276 1.57057 15.8868 1.52608C15.846 1.48158 15.794 1.44883 15.7363 1.43122C15.526 1.3893 15.3084 1.40484 15.1063 1.47622C15.1063 1.47622 1.08725 6.51422 0.286252 7.07222C0.114252 7.19322 0.056252 7.26222 0.027252 7.34422C-0.110748 7.74422 0.320252 7.91722 0.320252 7.91722L3.93325 9.09422C3.99426 9.10522 4.05701 9.10145 4.11625 9.08322C4.93825 8.56422 12.3863 3.86122 12.8163 3.70322C12.8843 3.68322 12.9343 3.70322 12.9163 3.75222C12.7443 4.35222 6.31025 10.0712 6.27525 10.1062C6.25818 10.1205 6.2448 10.1387 6.23627 10.1592C6.22774 10.1798 6.2243 10.2021 6.22625 10.2242L5.88925 13.7522C5.88925 13.7522 5.74725 14.8522 6.84525 13.7522C7.62425 12.9732 8.37225 12.3272 8.74525 12.0142C9.98725 12.8722 11.3243 13.8202 11.9013 14.3142C11.9979 14.4083 12.1125 14.4819 12.2383 14.5305C12.3641 14.5792 12.4985 14.6018 12.6333 14.5972C12.7992 14.5767 12.955 14.5062 13.0801 14.3952C13.2051 14.2841 13.2934 14.1376 13.3333 13.9752C13.3333 13.9752 15.8943 3.70022 15.9793 2.31722C15.9873 2.18222 16.0003 2.10022 16.0003 2.00022C16.0039 1.89392 15.9931 1.78762 15.9683 1.68422Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_542_547">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>

    }].find(v => get(data, 'name').includes(v.name))
    return {
      isCompleted,
      nameSocial: get(data, 'nameSocial') ? `@${get(data, 'nameSocial').username}` : '',
      label: currentSocial.name,
      icon: currentSocial.icon,
      name: `Sync with ${currentSocial.name}`,
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
    <div className="items-center grid grid-cols-8 mb-3 md:mb-3 gap-7">
      <div className="font-semibold font-casual text-sm col-span-2 hidden md:block">{label}</div>
      <div className="col-span-8 md:col-span-6">

        <button
          // href={isCompleted ? 'javascript:void(0);' : link}
          // target={isCompleted ? '_self' : '_blank'}
          // rel="noreferrer"
          onClick={() => {
            doAction()
            gtagEvent('catventure_social_connect', { type: label.toLowerCase() })
          }}
          className={clsx(
            styles[label],
            'w-full h-[34px] flex items-center rounded-sm overflow-hidden',
            (isCompleted || isLoading || !action?._id)
              ? 'cursor-not-allowed bg-gamefiDark-400 border-gamefiDark-400 shadow-none'
              : 'cursor-pointer hover:opacity-80'
          )}
        >
          <div className={clsx(
            'w-[44px] flex justify-center h-full items-center',
            (isCompleted || isLoading || !action?._id)
              ? 'bg-inherit !shadow-none cursor-not-allowed border-none'
              : ''
          )}>
            {icon}
          </div>
          <div className="justify-center flex flex-1">

            <span
              className={clsx(
                'font-bold text-[13px] leading-[150%] tracking-[0.02em]',
                isCompleted || !action?._id ? 'text-white' : 'text-white'
              )}
            >
              {nameSocial || buttonLabel || name || ''}
            </span>
          </div>
          <div className={clsx('w-[30px]', isCompleted ? 'block' : 'invisible')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0C3.15 0 0 3.15 0 7C0 10.85 3.15 14 7 14C10.85 14 14 10.85 14 7C14 3.15 10.85 0 7 0ZM6.125 9.975L3.15 7L4.375 5.775L6.125 7.525L9.625 4.025L10.85 5.25L6.125 9.975Z" fill="white" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

export default SocialItem
