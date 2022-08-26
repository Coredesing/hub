import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../context'
import { useRouter } from 'next/router'
import banner from '@/assets/images/ads/catventure.png'
import banner2 from '@/assets/images/banner2.png'
import orbitau from '@/assets/images/ads/orbitau.png'
import gunstar from '@/assets/images/ads/gunstar.png'
import nextwar from '@/assets/images/ads/nextwar.png'
import { gtagEvent } from '@/utils'

const banners = {
  default: {
    deadline: new Date('2022-09-10T13:00:00Z'),
    img: banner,
    link: 'https://gamefi.org/happy-gamefiversary',
    text: 'GameFi.org Happy Gamefiversary - Catventure in the Multiverse',
    id: 'happy-gamefiversary'
  },
  '/': {
    deadline: new Date('2022-07-20T14:00:00Z'),
    img: banner2,
    link: 'https://gamefi.org/igo/xana',
    text: 'XANA IGO',
    id: 'xana-igo'
  },
  '/igo': {
    deadline: new Date('2022-07-20T14:00:00Z'),
    img: banner2,
    link: 'https://gamefi.org/igo/xana',
    text: 'XANA IGO',
    id: 'xana-igo'
  },
  '/hub': {
    deadline: new Date('2022-07-28T14:00:00Z'),
    id: 'sponsor-games',
    isMultiple: true,
    interval: 1500, // 1 second
    items: [
      {
        id: 'sponsor-orbitau',
        img: orbitau,
        link: 'https://gamefi.org/hub/orbitau',
        text: 'GameFi.org Games'
      },
      {
        id: 'sponsor-gunstar',
        img: gunstar,
        link: 'https://gamefi.org/hub/gunstar-metaverse',
        text: 'GameFi.org Games'
      },
      {
        id: 'sponsor-nextwar',
        img: nextwar,
        link: 'https://gamefi.org/hub/the-next-war',
        text: 'GameFi.org Games'
      }
    ]
  }
}

const Banners = () => {
  const { now } = useAppContext()
  const router = useRouter()
  const banner = useMemo(() => {
    if (!banners[router.route]) {
      return banners.default
    }

    if (banners[router.route].deadline < now) {
      return banners.default
    }

    return banners[router.route]
  }, [router.route, now])

  const bannerShow = useMemo(() => {
    return banner.deadline > now
  }, [now, banner])

  // For multiple banners
  const [currentBanner, setCurrentBanner] = useState(null)
  useEffect(() => {
    if (!bannerShow || !banner?.isMultiple) return

    let index = 0
    setCurrentBanner(banner.items[0])
    const interval = setInterval(function () {
      index = index >= banner.items.length - 1 ? 0 : index + 1
      setCurrentBanner(banner.items[index])
    }, banner.interval)

    return () => {
      interval && clearInterval(interval)
    }
  }, [banner, bannerShow])

  return bannerShow && <div className="mx-auto relative mb-4 sm:mb-16">
    {
      banner.isMultiple
        ? <a href={currentBanner?.link} target="_blank" rel="noreferrer" onClick={() => {
          gtagEvent('banner_click', {
            id: currentBanner?.id,
            link: currentBanner?.link,
            text: currentBanner?.text
          })
        }}>
          <img src={currentBanner?.img?.src} alt={currentBanner?.text} className="mx-auto aspect-[970/90] max-h-[90px]" />
        </a>
        : <a href={banner.link} target="_blank" rel="noreferrer" onClick={() => {
          gtagEvent('banner_click', {
            id: banner.id,
            link: banner.link,
            text: banner.text
          })
        }}>
          <img src={banner.img.src} alt={banner.text} className="mx-auto aspect-[970/90] max-h-[90px]" />
        </a>
    }
  </div>
}

export default Banners
