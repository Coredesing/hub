import React, { useEffect, useState } from 'react'

const Countdown = ({ to }: { to: string | number }) => {
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
    <div className="flex font-medium">
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
