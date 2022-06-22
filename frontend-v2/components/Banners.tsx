import { useMemo } from 'react'
import { useAppContext } from '../context'
import { useRouter } from 'next/router'
import banner from '@/assets/images/banner.png'
import banner3 from '@/assets/images/banner3.jpg'
import { gtagEvent } from '@/utils'

const banners = {
  default: {
    deadline: new Date('2022-07-30T00:00:00Z'),
    img: banner,
    link: 'https://gamefi.org/guilds',
    text: 'GameFi.org Guilds',
    id: 'guilds'
  },
  '/': {
    deadline: new Date('2022-06-28T14:00:00Z'),
    img: banner3,
    link: 'https://gamefi.org/hub',
    text: 'GameFi.org Games',
    id: 'league-of-gamefi'
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

  return bannerShow && <div className="mx-auto relative mb-4 sm:mb-16">
    <a href={banner.link} target="_blank" rel="noreferrer" onClick={() => {
      gtagEvent('banner_click', {
        id: banner.id,
        link: banner.link,
        text: banner.text
      })
    }}>
      <img src={banner.img.src} alt={banner.text} className="mx-auto aspect-[970/90] max-h-[90px]" />
    </a>
  </div>
}

export default Banners
