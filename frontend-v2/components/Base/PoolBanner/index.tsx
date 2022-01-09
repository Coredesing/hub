/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const PoolBanner = (props: any) => {
  const { item } = props

  const [distance, setDistance] = useState(0)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(new Date(item.start_time * 1000).getTime() - new Date().getTime())
      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
    }, 1000)

    return (() => {
      clearInterval(interval)
    })
  })

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col">
          <div className="w-full h-full">
            <img src={item.banner} alt="banner" className="w-full"></img>
            <div className="w-full h-24 flex align-middle items-center justify-center uppercase font-bold bg-gamefiYellow">
              <div>Lorem ipsum dolor sit amet</div>
            </div>
          </div>
        </div>
        <div className="w-full relative text-gamefiYellow">
          {item.start_time ? (
            <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute mt-1">
              <div className="uppercase font-semibold text-sm 2xl:text-base">Countdown to IGO date</div>
              <div className="uppercase font-bold mt-2 flex">
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{days}</div>
                  <div className="text-xs 2xl:text-sm uppercase">days</div>
                </div>
                <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">:</span>
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{hours}</div>
                  <div className="text-xs 2xl:text-sm uppercase">hrs</div>
                </div>
                
                <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">:</span>
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{minutes}</div>
                  <div className="text-xs 2xl:text-sm uppercase">min</div>
                </div>
                
                <span className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">:</span>
                <div className="flex flex-col text-center w-10">
                  <div className="text-2xl leading-4 2xl:text-3xl 2xl:leading-6">{seconds}</div>
                  <div className="text-xs 2xl:text-sm uppercase">sec</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col align-middle items-center justify-center absolute">
              <div className="uppercase font-bold text-2xl 2xl:text-3xl">TBA</div>
            </div>
          )}
          <Image src={require('assets/images/countdown-box-yellow.png')} alt="countdown" className="w-full h-auto"></Image>
        </div>
      </div>
    </>
  )
}

export default PoolBanner