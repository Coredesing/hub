import React, { useEffect, useState } from 'react'
import { intervalToDuration } from 'date-fns'

const Countdown = ({ to, className }: { to: string | number; className?: string }) => {
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
    <div className={`flex font-medium ${className}`}>
      <div className="text-center">{days}d</div>
      <span className="mx-1">:</span>
      <div className="text-center">{hours}h</div>
      <span className="mx-1">:</span>
      <div className="text-center">{minutes}m</div>
      <span className="mx-1">:</span>
      <div className="text-center">{seconds}s</div>
    </div>
  )
}

export default Countdown
