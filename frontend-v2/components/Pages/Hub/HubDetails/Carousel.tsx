import { useState, useRef, useEffect } from 'react'
import Flicking from '@egjs/react-flicking'
import { isVideoFile, isImageFile, imageCMS } from '@/utils'
import { Sync, AutoPlay } from '@egjs/flicking-plugins'
import '@egjs/flicking/dist/flicking.css'
import get from 'lodash.get'

const Carousel = ({ items, length, className }: { items: any[]; length: any; className: string }) => {
  const flicking0 = useRef()
  const flicking1 = useRef()

  const [plugins, setPlugins] = useState([])

  useEffect(() => {
    setPlugins([
      new Sync({
        type: 'index',
        synchronizedFlickingOptions: [
          {
            flicking: flicking0.current,
            isSlidable: true
          },
          {
            flicking: flicking1.current,
            isClickable: true,
            activeClass: 'border-gamefiGreen-500'
          }
        ]
      }),
      new AutoPlay({ duration: 10000, direction: 'NEXT', stopOnHover: true })
    ])
  }, [])

  return (
    <>
      <Flicking
        ref={flicking0}
        className={`mb-4 w-full ${className || ''}`}
        bounce={5}
        plugins={plugins}
        preventClickOnDrag={false}
      >
        {items &&
          items.map((item, i) => {
            if (isImageFile(imageCMS(item.url))) {
              return (
                <img
                  key={i}
                  src={imageCMS(item.url)}
                  className="w-full aspect-[16/9]"
                  alt=""
                />
              )
            }

            if (isVideoFile(imageCMS(item.url))) {
              return (
                <video
                  className="w-full aspect-[16/9] object-contain bg-black"
                  key={i}
                  src={imageCMS(item.url)}
                  preload="auto"
                  autoPlay
                  muted
                  controls
                  controlsList="nodownload"
                  poster={imageCMS(get(item, 'videoThumbnail.data.attributes.url') || items[1].url)}
                ></video>
              )
            }

            return null
          })}
      </Flicking>

      <Flicking
        ref={flicking1}
        moveType="freeScroll"
        bound={true}
        preventClickOnDrag={false}
        bounce={5}
      >
        {items &&
          items.map((item, i) => (
            <div
              key={i}
              className="p-[2px] rounded border-2 border-transparent cursor-pointer"
            >
              {isVideoFile(imageCMS(item.url)) && (
                <div className="relative">
                  <img
                    src={imageCMS(get(item, 'videoThumbnail.data.attributes.url') || items?.[length]?.url)}
                    className="rounded w-40 aspect-[16/9]"
                    alt=""
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center">
                    <svg
                      width="70"
                      height="70"
                      viewBox="0 0 70 70"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="35"
                        cy="35"
                        r="35"
                        fill="black"
                        fillOpacity="0.5"
                      ></circle>
                      <path
                        d="M30.2333 23.3833C30.0724 23.2626 29.881 23.1891 29.6806 23.171C29.4802 23.153 29.2788 23.1911 29.0989 23.281C28.9189 23.371 28.7676 23.5093 28.6618 23.6805C28.556 23.8516 28.5 24.0488 28.5 24.25V43.75C28.5 43.9512 28.556 44.1484 28.6618 44.3195C28.7676 44.4907 28.9189 44.629 29.0989 44.719C29.2788 44.8089 29.4802 44.847 29.6806 44.829C29.881 44.8109 30.0724 44.7374 30.2333 44.6167L46.2333 34.8667C46.3679 34.7658 46.4771 34.6349 46.5523 34.4845C46.6275 34.3341 46.6667 34.1682 46.6667 34C46.6667 33.8318 46.6275 33.6659 46.5523 33.5155C46.4771 33.3651 46.3679 33.2342 46.2333 33.1333L30.2333 23.3833Z"
                        fill="white"
                        fillOpacity="0.5"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
              {isImageFile(imageCMS(item.url)) && (
                <img
                  src={imageCMS(item.url)}
                  className="rounded w-40 aspect-[16/9]"
                  alt=""
                />
              )}
            </div>
          ))}
      </Flicking>
    </>
  )
}

export default Carousel
