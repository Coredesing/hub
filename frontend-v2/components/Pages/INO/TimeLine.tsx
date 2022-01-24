import { ObjectType } from '@/common/types'
import { formatNumber } from '@/utils/index'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import styles from './Timeline.module.scss'

type Props = {
  timelines: ObjectType<{
    title: string;
    desc: string;
    current?: boolean;
  }>
}

const TimeLine = ({ timelines }: Props) => {
  const currentTimeline = useMemo(() => {
    const num = Object.keys(timelines).reverse()[0]
    return +num || 0
  }, [timelines])

  return <div className='flex'>
    {
      Object.keys(timelines).map((id) => (<div className={clsx(styles.timeline, styles.lineBright, {
        [styles.active]: +id <= currentTimeline || timelines[id].current,
        [styles.lineBrightActive]: +id < currentTimeline

      })} key={timelines[id].title}>
        <div className='relative w-fit z-50'>
          <span
            className={clsx('text-black font-bold w-9 h-9 rounded-full bg-gamefiGreen-700 flex justify-center items-center',
              {
                [styles.circleLight]: timelines[id].current
              }
            )}>{formatNumber(id as any)}</span>
        </div>
        <div className='mt-10'>
          <h3 className='text-base font-semibold mb-2 text-white/70'>{timelines[id].title}</h3>
          <div className="desc pr-10 text-white" style={{ width: `calc(1080px / ${Object.keys(timelines).length})` }}>
            {timelines[id].desc}
          </div>
        </div>
      </div>))
    }
  </div>
}

export default TimeLine
