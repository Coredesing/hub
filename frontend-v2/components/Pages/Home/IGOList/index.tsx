import React, { useRef } from 'react'
import { useScreens } from '../utils'
import Image from 'next/image'
import CardItem from './CardItem'
import Flicking from '@egjs/react-flicking'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'

const IGOList = ({ listUpcoming, loading }) => {
  const screens = useScreens()
  const refSlider = useRef(null)

  return (listUpcoming && listUpcoming.length > 0
    ? <>
      <div className="md:px-4 lg:px-16 mx-auto bg-black mt-20 pb-32">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
              Upcoming IGOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('@/assets/images/under-stroke-green.svg')} alt="understroke"></Image>
          </div>
        </div>
        {
          screens.mobile || screens.tablet
            ? <div className="mt-14">
              <Flicking circular={true} className="w-full" align="center" ref={refSlider} interruptable={true}>
                {listUpcoming.map(item => (
                  <div key={item.id} className="w-2/3 px-3"><CardItem item={item}></CardItem></div>
                ))}
              </Flicking>
            </div>
            : <div className="mx-auto md:container 2xl:px-16">
              <div className={`text-center justify-center ${listUpcoming.length <= 3 ? 'flex' : 'grid grid-cols-3'} gap-4 xl:gap-6 mt-14`}>
                {listUpcoming.map(item => (
                  <CardItem key={`igo-${item.id}`} item={item} className="max-w-[400px]"></CardItem>
                ))}
              </div>
              {
                loading
                  ? <div className="loader-wrapper mx-auto mt-14">
                    <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  Loading...
                  </div>
                  : <></>
              }
            </div>
        }
      </div>
    </>
    : <></>
  )
}

export default IGOList
