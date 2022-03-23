import React, { ReactElement, useState } from 'react'
import style from './style.module.scss'
import { useSwipeable } from 'react-swipeable'
import { ObjectType } from '@/utils/types'
import { ScrollingCarousel } from '@trendyol-js/react-carousel'

type Props = {
  children: any;
  transition?: string;
  showItemsNumber?: number;
  step?: number;
  hasHeader?: boolean;
  title?: string;
} & ObjectType

type Page = {
  fromIndex: number;
  toIndex: number;
  page: number;
}

export const SwiperItem = ({ children, width, ...props }: any) => {
  const _style = {
    ...(props.style || {}),
    width: width
  }
  return <div className={`${style.swiperItem} ${props.className || ''}`} style={_style}>
    {children}
  </div>
}

const ListSwiper = ({ ...props }: Props) => {
  const [activeIndex, setActiveIndex] = useState({ from: 0, to: props.step - 1 })
  const totalItems = React.Children.count(props.children)

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = 0
    }

    if (newIndex >= totalItems - props.showItemsNumber) {
      newIndex = totalItems - props.showItemsNumber
    }

    setActiveIndex({
      from: newIndex,
      to: newIndex + props.step - 1 >= totalItems ? totalItems - 1 : newIndex + props.step - 1
    })
  }

  const pages = () => {
    const pages: Page[] = []

    for (let i = 0; i < totalItems; i += props.step) {
      pages.push({
        fromIndex: i,
        toIndex: i + props.step >= totalItems ? totalItems - 1 : i + props.step - 1,
        page: Math.floor(i / props.step) + 1
      } as Page)
    }
    return pages
  }

  const handlerSwiper = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex.from + props.step),
    onSwipedRight: () => updateIndex(activeIndex.from - props.step),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  })

  return (
    <>
      {
        props.hasHeader
          ? <>
            <div className="md:text-lg 2xl:text-3xl uppercase font-bold">
              {props.title || ''}
            </div>
            <div className="w-full relative bg-gamefiDark-600" style={{ height: '1px' }}>
              <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px', marginTop: '0', marginLeft: '0' }}></div>
              {
                props.showItemsNumber === props.step
                  ? <div className="absolute top-0 right-0 w-1/5 grid grid-flow-col gap-2 bg-gamefiDark-900" style={{ height: '1px' }}>
                    {pages && pages().length
                      ? pages().map((page: Page) => (
                        <div key={page.page} className={`h-full ${activeIndex.to >= page.fromIndex && activeIndex.to <= page.toIndex ? 'bg-gamefiGreen-700' : 'bg-white'}`}></div>
                      ))
                      : <></>}
                  </div>
                  : <></>
              }
            </div>
          </>
          : <></>
      }
      <div {...handlerSwiper} className="relative mt-14 w-full md:px-0 px-12">
        <div className={style.carousel}>
          <div className={style.inner} style={{ transform: `translateX(-${activeIndex.from / props.showItemsNumber * 100}%)`, transition: `transform ${props.transition}`, display: `${totalItems < props.showItemsNumber ? 'flex' : ''}`, ...(props.style || {}) }}>
            {React.Children.map(props.children, (child) => {
              const _props = { ...(child.props || {}), width: child.props?.width || `${100 / props.showItemsNumber}%` }
              return React.cloneElement(child, _props)
            })}
          </div>
        </div>
        <button className={`absolute left-0 md:-left-12 top-0 bottom-0 ${activeIndex.from <= 0 ? 'opacity-20' : ''}`} onClick={() => updateIndex(activeIndex.from - props.step)}>
          <svg width="32" height="122" viewBox="0 0 32 122" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 61.5H2.5" stroke="white" strokeMiterlimit="10" />
            <path d="M9.5 68.5L2.5 61.5L9.5 54.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square" />
            <path opacity="0.4" d="M31 23.5L20 34.5" stroke="#A0A4B2" />
            <path d="M31 0.5V8.5" stroke="white" />
            <path opacity="0.4" d="M31 99L20 88" stroke="#A0A4B2" />
            <path d="M31 122V114" stroke="white" />
          </svg>
        </button>
        <button className={`absolute right-0 md:-right-12 top-0 bottom-0 ${activeIndex.to >= totalItems - 1 ? 'opacity-20' : ''}`} onClick={() => updateIndex(activeIndex.from + props.step)}>
          <svg width="32" height="122" viewBox="0 0 32 122" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 60.5L29.5 60.5" stroke="white" strokeMiterlimit="10" />
            <path d="M22.5 53.5L29.5 60.5L22.5 67.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square" />
            <path opacity="0.4" d="M1 98.5L12 87.5" stroke="#A0A4B2" />
            <path d="M1 121.5L1 113.5" stroke="white" />
            <path opacity="0.4" d="M1 23L12 34" stroke="#A0A4B2" />
            <path d="M1 0L0.999999 8" stroke="white" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default ListSwiper

export const CarouselList = ({
  childrens
}: { childrens: ReactElement[] }) => {
  return <ScrollingCarousel
    className={style.carouselList}
    leftIcon={<div className="w-10 h-full grid items-center">
      <button className={' '} >
        <svg width="32" height="122" viewBox="0 0 32 122" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.5 61.5H2.5" stroke="white" strokeMiterlimit="10" />
          <path d="M9.5 68.5L2.5 61.5L9.5 54.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square" />
          <path opacity="0.4" d="M31 23.5L20 34.5" stroke="#A0A4B2" />
          <path d="M31 0.5V8.5" stroke="white" />
          <path opacity="0.4" d="M31 99L20 88" stroke="#A0A4B2" />
          <path d="M31 122V114" stroke="white" />
        </svg>
      </button>
    </div>}
    rightIcon={<div className="w-10 h-full grid items-center justify-end">
      <button>
        <svg width="32" height="122" viewBox="0 0 32 122" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 60.5L29.5 60.5" stroke="white" strokeMiterlimit="10" />
          <path d="M22.5 53.5L29.5 60.5L22.5 67.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square" />
          <path opacity="0.4" d="M1 98.5L12 87.5" stroke="#A0A4B2" />
          <path d="M1 121.5L1 113.5" stroke="white" />
          <path opacity="0.4" d="M1 23L12 34" stroke="#A0A4B2" />
          <path d="M1 0L0.999999 8" stroke="white" />
        </svg>
      </button>
    </div>}
  >
    {childrens}
  </ScrollingCarousel>
}
