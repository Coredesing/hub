import { useMemo, useState } from 'react'
import get from 'lodash.get'
import clsx from 'clsx'
import { fetcher } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const Item = ({ data }) => {
  const { account: walletId } = useMyWeb3()
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  const { name, reward, description, link, buttonLabel, isCompleted, action } =
    useMemo(() => {
      const rewardQuantity = get(data, 'rewards[0].quantity')
      const isCompleted = get(data, 'isCompleted')
      const resetAt = get(data, 'resetAt')
      return {
        isCompleted,
        name: get(data, 'name'),
        reward: `${
          rewardQuantity >= 0 ? `+${rewardQuantity}` : rewardQuantity
        } ${get(data, 'rewards[0].name')}`,
        description: get(data, 'description'),
        link: get(data, 'link'),
        buttonLabel: isCompleted
          ? resetAt
            ? `Reset in ${new Date(resetAt).toLocaleString()}`
            : 'Completed'
          : get(data, 'buttonLabel'),
        action: get(data, 'conditions.[0].action', {})
      }
    }, [data])

  const doAction = () => {
    if (!walletId || !action || isLoading || isCompleted) return
    if (link) {
      const payload = {
        walletId,
        actionId: action._id
      }
      window.open(`${link}?state=${Buffer.from(JSON.stringify(payload)).toString('base64')}`)
      return
    }
    setLoading(true)
    fetcher('/api/account/ranks/eventCollect', {
      method: 'POST',
      body: JSON.stringify({
        walletId,
        origin: window.location.origin,
        action: action._id,
        amount: action.includeAmount ? 10 : null
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
      <div className="bg-[#383A43] min-h-[146px] relative">
        <div className="absolute top-0 left-0 bg-[#15171E] clipped-b-r-full w-20 h-5">
          <span className="uppercase font-mechanic font-bold text-[13px] leading-[100%] text-[#7BF404]">
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
            isCompleted || isLoading
              ? 'bg-[#383A43] cursor-not-allowed'
              : 'bg-[#7BF404] cursor-pointer hover:opacity-80'
          )}
        >
          <span
            className={clsx(
              'font-bold text-[13px] leading-[150%] uppercase tracking-[0.02em]',
              isCompleted ? 'text-white/20' : 'text-[#0D0F15]'
            )}
          >
            {buttonLabel || name || 'Do this task'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default Item
