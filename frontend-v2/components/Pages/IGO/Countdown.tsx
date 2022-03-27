import React, { useEffect, useState } from 'react'

const Countdown = ({ title, to }: { title: string; to: string | number }) => {
  const [distance, setDistance] = useState(0)
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(new Date(Number(to) * 1000).getTime() - new Date().getTime())

      setDays(distance > 0 ? ('0' + Math.floor(distance / (1000 * 60 * 60 * 24)).toString()).slice(-2) : '00')
      setHours(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()).slice(-2) : '00')
      setMinutes(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()).slice(-2) : '00')
      setSeconds(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60)) / 1000).toString()).slice(-2) : '00')
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [distance, to])

  return (
    <div className="flex gap-6 items-center justify-center w-full p-4 bg-black rounded-sm font-semibold uppercase">
      {title && <div className="inline-flex gap-1 items-center text-sm">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.3" cx="6" cy="6" r="6" fill="#72F34B"/>
          <circle opacity="0.4" cx="6.00007" cy="6.00007" r="4.28571" fill="#72F34B"/>
          <circle cx="6.00014" cy="6.00014" r="2.57143" fill="#72F34B"/>
        </svg>
        {title}
      </div>}
      <div className="flex gap-4 items-center justify-center">
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
