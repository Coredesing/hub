import twitter from '@/components/Pages/Adventure/images/twitter.svg'
import telegram from '@/components/Pages/Adventure/images/telegram.svg'
import { useMemo } from 'react'
import clsx from 'clsx'

const SocialTaskButton = ({ data }) => {
  const imgSource = useMemo(() => {
    if (data?.socialInfo?.socialType === 'twitter') return twitter.src
    if (data?.socialInfo?.socialType === 'telegram') return telegram.src
  }, [data?.socialInfo?.socialType])

  return (
    <a
      href={data?.stages?.[0]?.isCompleted ? null : (data?.socialInfo?.url || null)}
      target="_blank" rel="noreferrer"
      className={clsx('flex items-center rounded-sm w-fit', data?.stages?.[0]?.isCompleted ? 'bg-gamefiDark-600 cursor-not-allowed' : 'bg-[#3AACFF] cursor-pointer')}
    >
      <img className="pl-2" src={imgSource} alt="social" />
      <div className="flex justify-center items-center w-[195px] h-[28px]">
        <span className="font-casual text-[12px] leading-[100%] text-white">
          {data?.name}
        </span>
      </div>
    </a>
  )
}

export default SocialTaskButton
