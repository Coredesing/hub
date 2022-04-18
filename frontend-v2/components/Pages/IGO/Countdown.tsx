import { intervalToDuration } from 'date-fns'
import React, { useEffect, useState } from 'react'

const Countdown = ({ title, to }: { title: string; to: string | number }) => {
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  useEffect(() => {
    const interval = setInterval(() => {
      const duration = intervalToDuration({
        start: new Date(Number(to) * 1000),
        end: new Date()
      })
      setDays(duration.days < 10 ? `0${duration.days}` : `${duration.days}`)
      setHours(duration.hours < 10 ? `0${duration.hours}` : `${duration.hours}`)
      setMinutes(duration.minutes < 10 ? `0${duration.minutes}` : `${duration.minutes}`)
      setSeconds(duration.seconds < 10 ? `0${duration.seconds}` : `${duration.seconds}`)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [to])

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-center w-full p-4 bg-black rounded-sm font-semibold uppercase">
      {title && <div className="inline-flex gap-1 items-center text-sm">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.3" cx="6" cy="6" r="6" fill="#72F34B"/>
          <circle opacity="0.4" cx="6.00007" cy="6.00007" r="4.28571" fill="#72F34B"/>
          <circle cx="6.00014" cy="6.00014" r="2.57143" fill="#72F34B"/>
        </svg>
        {title}
      </div>}
      <div className="flex gap-2 lg:gap-4 items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl leading-6 tracking-wide">{days}</div>
          <div className="text-xs leading-4 tracking-wide">Days</div>
        </div>
        <span className="text-2xl">:</span>
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl leading-6 tracking-wide">{hours}</div>
          <div className="text-xs leading-4 tracking-wide">Hours</div>
        </div>
        <span className="text-2xl">:</span>
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl leading-6 tracking-wide">{minutes}</div>
          <div className="text-xs leading-4 tracking-wide">Minutes</div>
        </div>
        <span className="text-2xl">:</span>
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl leading-6 tracking-wide">{seconds}</div>
          <div className="text-xs leading-4 tracking-wide">Seconds</div>
        </div>
      </div>
    </div>
  )
}

export default Countdown
