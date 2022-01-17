import React, { useState } from 'react'
import { useEffect } from 'react'
import style from './style.module.scss'

type Props = {
  children: any,
  transition?: string,
  showItemsNumber?: number,
  step?: number
}

export const SwiperItem = ({ children, width }: any) => {
  return <div className={style.swiperItem} style={{ width: width }}>
    { children }
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
      </div>
      <div className={style.carousel}>
        <div className={style.inner} style={{ transform: `translateX(-${activeIndex / showItemsNumber * 100}%)`, transition: `transform ${transition}` }}>
          {React.Children.map(children, (child, index) => React.cloneElement(child, { width: `${100 / showItemsNumber}%` }))}
        </div>
        <div className="mt-4">
          <button onClick={() => updateIndex(activeIndex - step)}>Prev</button>
          <button onClick={() => updateIndex(activeIndex + step)}>Next</button>
        </div>
      </div>
    </>
  )
}

export default ListSwiper