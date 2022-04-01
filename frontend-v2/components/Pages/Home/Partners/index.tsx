import { useRef, useState } from 'react'
import Image from 'next/image'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import { Pagination } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'
import arrowLeft from 'assets/images/icons/arrow-left.png'
import arrowRight from 'assets/images/icons/arrow-right.png'

const Partners = () => {
  const [plugins] = useState([new Pagination({
    type: 'bullet',
    renderBullet: () => {
      return '<div class="h-[2px] w-[100px] bg-gamefiDark-400"></div>'
    }
  })])

  const refSlider = useRef(null)
  const prev = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.prev().catch(() => {})
  }
  const next = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.next().catch(() => {})
  }

  return (
    <div className="px-4 lg:px-16 md:container mx-auto pt-20 pb-14">
      <div className="mx-auto relative" style={{ maxWidth: '600px' }}>
        <Image src={require('assets/images/backedby.png')} alt=""></Image>
        <div className="font-casual text-base -mt-8 text-white/80 text-center max-w-lg mx-auto">
        GameFi.org is honored and thrilled to be backed by leading Venture Capitals in blockchain industry.
        </div>
      </div>
      <div className="container mx-auto xl:px-16 grid grid-cols-2 md:grid-cols-4 items-center justify-center mt-8 max-w-6xl">
        <div><Image src={require('assets/images/brands/Animoca.png')} alt="Animoca" ></Image></div>
        <div><Image src={require('assets/images/brands/DaoMaker.png')} alt="DaoMaker" ></Image></div>
        <div><Image src={require('assets/images/brands/MorningStar.png')} alt="MorningStar" ></Image></div>
        <div><Image src={require('assets/images/brands/Polygon.png')} alt="Polygon" ></Image></div>
      </div>
      <div className="flex flex-col items-center mt-14">
        <div className="font-bold text-2xl uppercase">Our Portfolio</div>
        <div className="font-casual text-base text-white/80 text-center max-w-2xl mx-auto">
        All projects launched on GameFi.org are scrutinized and hand-picked.
          <br />
        They all aim at long-term development and ensure benefits for GameFi users.
        </div>
      </div>
      <div className="flex mt-8 gap-4">
        <div className="hidden sm:block">
          <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev}/>
        </div>
        <Flicking circular={true} className="flex-1" plugins={plugins} align="center" ref={refSlider} interruptable={true}>
          <div className="w-full mb-8">
            <div className="grid grid-cols-3 max-w-xl mx-auto md:hidden">
              <div><Image src={require('assets/images/brands/1.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/2.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/3.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/4.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/5.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/6.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/7.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/8.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/9.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/10.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/11.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/12.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/13.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/14.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/15.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/16.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/17.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/18.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center">
              <div><Image src={require('assets/images/brands/1.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/2.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/3.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/4.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <div><Image src={require('assets/images/brands/5.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/6.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/7.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/8.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/9.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <div><Image src={require('assets/images/brands/10.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/11.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/12.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/13.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <div><Image src={require('assets/images/brands/14.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/15.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/16.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/17.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/18.png')} alt=""></Image></div>
            </div>
          </div>
          <div className="w-full mb-8">
            <div className="grid grid-cols-3 max-w-xl mx-auto md:hidden">
              <div><Image src={require('assets/images/brands/19.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/20.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/21.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/22.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/23.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/24.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/25.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/25.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/26.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/27.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/28.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/29.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/30.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/31.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/32.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/33.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/34.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center">
              <div><Image src={require('assets/images/brands/19.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/20.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/21.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/22.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/23.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <div><Image src={require('assets/images/brands/24.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/25.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/26.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/27.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <div><Image src={require('assets/images/brands/28.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/29.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/30.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/31.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/32.png')} alt=""></Image></div>
            </div>
            <div className="hidden md:flex mx-auto justify-center mt-4">
              <div><Image src={require('assets/images/brands/33.png')} alt=""></Image></div>
              <div><Image src={require('assets/images/brands/34.png')} alt=""></Image></div>
            </div>
          </div>
          <ViewportSlot>
            <div className="flicking-pagination !relative flex items-center justify-center gap-1"></div>
          </ViewportSlot>
        </Flicking>
        <div className="hidden sm:block">
          <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next}/>
        </div>
      </div>

    </div>
  )
}

export default Partners
