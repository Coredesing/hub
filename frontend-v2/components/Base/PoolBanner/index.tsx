/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const PoolBanner = (props: any) => {
  const { item, color } = props

  const [distance, setDistance] = useState(0)
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(new Date(item.start_time * 1000).getTime() - new Date().getTime())
      setDays(('0' + Math.floor(distance / (1000 * 60 * 60 * 24)).toString()).slice(-2))
      setHours(('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()).slice(-2))
      setMinutes(('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()).slice(-2))
      setSeconds(('0' + Math.floor((distance % (1000 * 60)) / 1000).toString()).slice(-2))
    }, 1000)

    return (() => {
      clearInterval(interval)
    })
  }, [item.start_time, distance])

  const poolStatus = (status: any) => {
    switch(status) {
      case 0:
      default:
        return 'public'
      case 1:
        return 'private'
      case 2:
        return 'community'
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col clipped-b-l">
          <div className="w-full h-full relative">
          <div className="absolute h-7 flex align-middle items-center justify-center top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-left bg-gamefiDark-900 w-36 clipped-b-r-full">
            <Image src={require('assets/images/icons/lock.svg')} alt="lock"></Image>
            <span className="ml-2 font-bold">{poolStatus(item.is_private)}</span>
          </div>
            <img src={item.banner} alt="banner" className="w-full"></img>
            <div className={`w-full h-24 flex align-middle items-center justify-center uppercase font-bold md:text-lg xl:text-2xl bg-${color || 'gamefiGreen'}`}>
              <div className={`px-8 overflow-hidden overflow-ellipsis ${!color || color === 'gamefiGreen' ? 'text-gamefiDark-900' : 'text-white'}`}>{item.title}</div>
            </div>
          </div>
        </div>
        <div className={`w-full relative text-${color || 'gamefiGreen'}`}>
          {item.start_time ? (
            <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute mt-1">
              <div className="uppercase font-semibold text-sm 2xl:text-base">Countdown to IGO date</div>
              <div className="uppercase font-bold mt-2 flex tracking-widest">
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{days}</div>
                  <div className="text-xs 2xl:text-sm uppercase">days</div>
                </div>
                <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6 mx-1">:</span>
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{hours}</div>
                  <div className="text-xs 2xl:text-sm uppercase">hrs</div>
                </div>
                
                <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6 mx-1">:</span>
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{minutes}</div>
                  <div className="text-xs 2xl:text-sm uppercase">min</div>
                </div>
                
                <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6 mx-1">:</span>
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{seconds}</div>
                  <div className="text-xs 2xl:text-sm uppercase">sec</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute">
              <div className="uppercase font-bold text-2xl 2xl:text-3xl">Coming Soon</div>
            </div>
          )}
          <Image src={require(`assets/images/countdown-box-${color || 'gamefiGreen'}.png`)} alt="countdown" className="w-full h-auto"></Image>
        </div>
      </div>
    </>
  )
}

export default PoolBanner