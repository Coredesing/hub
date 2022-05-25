import { Pagination } from '@egjs/flicking-plugins'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGuildDetailContext } from '../utils'

import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'
import { useMediaQuery } from 'react-responsive'

const Gallery = () => {
  const { guildData } = useGuildDetailContext()
  const isMobile = useMediaQuery({ maxWidth: '1000px' })

  const ref = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [plugins] = useState([
    new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[1px] w-[20px] lg:w-[50px] lg:mx-1 bg-gamefiDark-400"></div>'
      }
    })
  ])

  const prev = () => {
    if (!ref.current) {
      return
    }

    ref.current.prev().catch(() => {})
  }
  const next = () => {
    if (!ref.current) {
      return
    }

    ref.current.next().catch(() => {})
  }

  return (
    guildData.gallery?.length > 0 && <div className="w-full">
      <div className="w-full flex justify-center mb-8 px-4 lg:px-16">
        <div className="hidden lg:block lg:w-[400px]"><Image src={require('@/assets/images/guilds/gallery.png')} alt=""></Image></div>
        <div className="lg:hidden"><Image src={require('@/assets/images/guilds/gallery-mobile.png')} alt=""></Image></div>
      </div>
      <div className="w-full relative">
        <Flicking
          circular={true}
          plugins={plugins}
          className="w-full"
          align="center"
          panelsPerView={isMobile ? 1 : -1}
          ref={ref}
          onChanged={e => {
            setCurrentIndex(e.index)
            console.log(e)
          }}
        >
          {guildData.gallery.map((item, index) => <div key={`guild-gallery-${item.id}`} className="w-2/3 mb-12">
            <img src={item.media?.url} alt="" className={`w-full px-2 aspect-[16/9] overflow-hidden object-cover ${currentIndex === index ? '' : 'opacity-40'}`}></img>
            {currentIndex === index && <div
              className="flex items-center gap-2 w-full h-[9px] text-[13px] font-casual px-2 mt-3"
            >
              <div className="guild-gallery-description-transition w-16 h-full bg-gamefiGreen clipped-b-r"></div>
              <span className="guild-gallery-description-transition w-full line-clamp-1">{item.description || ''}</span>
            </div>}
          </div>)}
          <ViewportSlot>
            <div className="flicking-pagination !relative flex items-center justify-center gap-1"></div>
            <div></div>
          </ViewportSlot>
        </Flicking>
        <div className="hidden lg:block absolute z-[1] top-[50%] right-[10%]">
          <div className="flex items-center gap-2">
            <button onClick={prev}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.3" d="M33.75 2.5L16.25 20L33.75 37.5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M23.75 2.5L6.25 20L23.75 37.5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </button>
            <span className="text-[36px] font-bold">{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1 || '00'}</span>
            <button onClick={next}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.3" d="M6.25 2.5L23.75 20L6.25 37.5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M16.25 2.5L33.75 20L16.25 37.5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery
