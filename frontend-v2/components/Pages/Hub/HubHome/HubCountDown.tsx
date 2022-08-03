import { useCountdown } from '@/components/Pages/Hub/Countdown'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './home.module.scss'
import bgImage from '@/assets/images/hub/countdownBg.png'
import { GAME_HUB_GG_CALENDAR_EVENT, GAME_HUB_START_TIME } from '@/utils/constants'
import { pad } from '@/utils'

const SMALL_CONTENT_HEIGHT = 500

const HubCountdown = ({ onEnded }) => {
  const [isSmallHeight, setIsSmallHeight] = useState(true)
  const [deadline, setDeadline] = useState(new Date())
  const { countdown, ended } = useCountdown({
    deadline
  })

  const onWindowResizeHandler = () => {
    setIsSmallHeight(window.innerHeight < SMALL_CONTENT_HEIGHT)
  }

  useEffect(() => {
    ended && onEnded && onEnded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended])

  useEffect(() => {
    if (GAME_HUB_START_TIME) {
      setDeadline(new Date(GAME_HUB_START_TIME))
    } else {
      onEnded && onEnded()
    }

    setIsSmallHeight(window.innerHeight < SMALL_CONTENT_HEIGHT)

    window.addEventListener('resize', onWindowResizeHandler)

    return () => {
      window.removeEventListener('resize', onWindowResizeHandler)
    }
  }, [onEnded])

  return (
    <div
      id="HubCountdown"
      className={
        'relative flex justify-center lg:w-full w-screen h-[calc(100%-64px)] lg:h-screen'
      }
    >
      <div className="absolute bottom-0 flex flex-col w-[1050px] h-[536px] self-end">
        <div
          className={clsx(styles.countdown, 'w-full h-full')}
          style={{ backgroundImage: `url(${bgImage.src})` }}
        ></div>
      </div>

      <div
        className={clsx(
          'absolute left-0 w-full h-auto flex flex-col',
          !isSmallHeight ? 'top-[140px]' : 'top-[72px]'
        )}
      >
        <h2 className="text-center font-casual font-medium lg:text-[19px] text-sm lg:leading-[28px] leading-[21px] text-white uppercase">
          New Game Hub Is Coming Soon
        </h2>

        <div className="w-fit block gap-2 text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#6CDB00] to-[#A2DB00] text-[48px] lg:text-[64px] lg:leading-[82px] leading-[62px] mx-auto">
          {`${countdown.days > 0 ? `${pad(countdown.days)}D :` : ''} ${pad(countdown.hours)}H : ${pad(countdown.minutes)}M : ${pad(
            countdown.seconds
          )}S`}
        </div>

        <a
          target="_blank"
          rel="noreferrer"
          href={GAME_HUB_GG_CALENDAR_EVENT || ''}
          className="bg-[#6CDB00] w-fit mx-auto mt-6 px-16 lg:px-10 py-2 clipped-t-r rounded-sm hover:opacity-90"
        >
          <span className="uppercase font-mechanic font-bold text-[14px] leading-[150%] tracking-[0.02em] text-[#0D0F15]">
            Remind me
          </span>
        </a>
      </div>
    </div>
  )
}

export default HubCountdown
