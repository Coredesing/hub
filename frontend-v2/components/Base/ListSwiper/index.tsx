import React, { useState } from 'react'
import { useEffect } from 'react'
import style from './style.module.scss'
import Image from 'next/image'

type Props = {
  children: any,
  transition?: string,
  showItemsNumber?: number,
  step?: number
}

export const SwiperItem = ({ children, width }: any) => {
  return <div className={style.swiperItem} style={{ width: width }}>
    <div className="w-full">
      { children }
    </div>
  </div>
}

const ListSwiper = ({ children, transition = '0.3s', showItemsNumber = 1, step = 1 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = 0
    }

    if (newIndex >= React.Children.count(children) - showItemsNumber) {
      newIndex = React.Children.count(children) - showItemsNumber
    }

    setActiveIndex(newIndex)
  }

  return (
    <>
      <div className="md:text-lg 2xl:text-3xl uppercase font-bold">
        Hot Collection
      </div>
      <div className="w-full relative bg-gamefiDark-600" style={{height: '4px'}}>
        <div className="absolute bottom-0 right-0 dark:bg-gamefiDark-900 clipped-t-l-full-sm" style={{height: '3px', width: 'calc(100% - 60px)'}}></div>
        <div className="absolute top-0 right-0 h-1 bg-gamefiGreen w-28"></div>
      </div>
      <div className="relative mt-14">
        <div className={style.carousel}>
          <div className={style.inner} style={{ transform: `translateX(-${activeIndex / showItemsNumber * 100}%)`, transition: `transform ${transition}` }}>
            {React.Children.map(children, (child, index) => React.cloneElement(child, { width: `${100 / showItemsNumber}%` }))}
          </div>
        </div>
        <button className="absolute -left-12 top-0 bottom-0" onClick={() => updateIndex(activeIndex - step)}>
          <svg width="32" height="122" viewBox="0 0 32 122" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 61.5H2.5" stroke="white" strokeMiterlimit="10"/>
            <path d="M9.5 68.5L2.5 61.5L9.5 54.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path opacity="0.4" d="M31 23.5L20 34.5" stroke="#A0A4B2"/>
            <path d="M31 0.5V8.5" stroke="white"/>
            <path opacity="0.4" d="M31 99L20 88" stroke="#A0A4B2"/>
            <path d="M31 122V114" stroke="white"/>
          </svg>
        </button>
        <button className="absolute -right-12 top-0 bottom-0" onClick={() => updateIndex(activeIndex + step)}>
          <svg width="32" height="122" viewBox="0 0 32 122" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 60.5L29.5 60.5" stroke="white" strokeMiterlimit="10"/>
            <path d="M22.5 53.5L29.5 60.5L22.5 67.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path opacity="0.4" d="M1 98.5L12 87.5" stroke="#A0A4B2"/>
            <path d="M1 121.5L1 113.5" stroke="white"/>
            <path opacity="0.4" d="M1 23L12 34" stroke="#A0A4B2"/>
            <path d="M1 0L0.999999 8" stroke="white"/>
          </svg>
        </button>
      </div>
    </>
  )
}

export default ListSwiper