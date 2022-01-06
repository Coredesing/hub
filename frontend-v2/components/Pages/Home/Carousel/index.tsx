/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Image from 'next/image'
import { Carousel } from 'react-responsive-carousel'

type Item = {
  id?: any,
  title?: string,
  img?: string,
  favorites?: number,
  type?: string,
  description?: string
}
type Props = {
  items?: Item[]
}

const GameCarousel = ( { items }: Props ) => {

  return (
    <Carousel
      showStatus={false}
      showIndicators={false}
      autoPlay={true}
      stopOnHover={true}
      showThumbs={true}
      thumbWidth={150}
      swipeable={true}
      dynamicHeight={true}
      infiniteLoop={true}

      renderThumbs={() => {
        return items && items.length > 1 && items.map((item) => {
          return <img key={item.title} src={item.img} alt="img" />
        })
      }}
      renderArrowPrev={(onClickHandler, hasPrev, label) => {
        return (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            style={{ position: 'absolute', zIndex: '2', top: 'calc(50% - 12px)', cursor: 'pointer', left: '0', opacity: !hasPrev && '50%' }}
          >
            <Image src={require('assets/images/icons/arrow-left.svg')} alt="left"/>
          </button>
        )
      }
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            style={{ position: 'absolute', zIndex: '2', top: 'calc(50% - 12px)', cursor: 'pointer', right: '0', opacity: !hasNext && '50%' }}
          >
            <Image src={require('assets/images/icons/arrow-right.svg')} alt="right"/>
          </button>
        )
      }
    >
      {items.map(item => (
        <div key={item.title} className="px-14 mx-auto grid grid-cols-12 gap-4">
          <div className="col-span-7 xl:col-span-8 relative">
            <div className="absolute z-10 top-0 left-0 uppercase font-medium tracking-widest md:text-xs xl:text-sm text-left bg-gamefiDark-900 w-1/2 md:pb-1 lg:pb-2 clipped-b-r-full"><span className="text-gamefiGreen-500">Featured</span> games</div>
            <img src={item.img} alt="img" className='clipped-t-r-lg'/>
          </div>
          <div className="col-span-5 xl:col-span-4 2xl:pt-14 w-full px-4">
            <div className="lg:text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">{item.title}</div>
            <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
              <div className="flex align-middle items-center text-sm">
                <Image src={require('assets/images/icons/heart.svg')} alt="heart"/>
                <p className="ml-2 tracking-widest text-gray-200">{item.favorites}</p>
              </div>
              <div className="flex align-middle items-center ml-4">
                <Image src={require('assets/images/icons/game-console.svg')} alt="game-console"/>
                <p className="ml-2 tracking-widest uppercase text-gray-200">{item.type}</p>
              </div>
            </div>
            <div className="mt-3 xl:mt-5">
              <p className="text-left leading-5 md:text-xs lg:text-base text-gray-300 max-h-24 overflow-y-scroll">{item.description}</p>
            </div>
            <div className="mt-3 xl:mt-5">
              <button className="bg-gamefiGreen-500 text-gamefiDark-900 py-2 px-6 flex align-middle items-center rounded-xs clipped-t-r hover:opacity-90">
                <div className="mr-2 uppercase font-bold text-xs">View more</div>
                <Image src={require('assets/images/icons/arrow-right-dark.svg')} alt="right" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  )
}

export default GameCarousel