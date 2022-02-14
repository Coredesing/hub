import { ObjectType } from '@/utils/types'
import { formatNumber } from '@/utils/index'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import styles from './Timeline.module.scss'
import { useMediaQuery } from 'react-responsive'

type Props = {
  timelines: ObjectType<{
    title: string;
    desc: string;
    current?: boolean;
  }>;
}

const TimeLine = ({ timelines }: Props) => {
  const isLgScreen = useMediaQuery({ maxWidth: '1024px' })

  const currentTimeline = useMemo(() => {
    const num = Object.keys(timelines).reverse().find(k => timelines[k].current)
    return +num || 0
  }, [timelines])
  return <div className='flex lg:flex-row lg:ml-2 ml-8 flex-col lg: mt-12'>
    {
      Object.keys(timelines).map((id) => (<div className={clsx('lg:block flex', styles.timeline, styles.lineBright, {
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
        <div className='lg:mt-10 lg:ml-0 ml-8'>
          <h3 className={clsx('text-base font-semibold mb-2', {
            'text-white/70' : !timelines[id].current,
            'text-gamefiGreen-700': timelines[id].current
          })}>{timelines[id].title}</h3>
          <div className="desc pr-10 text-white"
            style={isLgScreen ? { width: '100%', height: '150px' } : { width: `calc(1080px / ${Object.keys(timelines).length})` }}
          >
            {timelines[id].desc}
          </div>
        </div>
      </div>))
    }
  </div>
}

export default TimeLine
