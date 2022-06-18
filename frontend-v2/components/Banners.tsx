import { useMemo } from 'react'
import { useAppContext } from '../context'
import { useRouter } from 'next/router'
import banner from '@/assets/images/banner.png'
import banner2 from '@/assets/images/banner2.png'

const banners = {
  default: {
    deadline: new Date('2022-07-30T00:00:00Z'),
    img: banner,
    link: 'https://gamefi.org/guilds',
    text: 'GameFi.org Guilds'
  },
  '/': {
    deadline: new Date('2022-06-21T14:00:00Z'),
    img: banner2,
    link: 'https://gamefi.org/ino/befitter-ino-public',
    text: 'beFitter INO Public'
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
    <a href={banner.link} target="_blank" rel="noreferrer">
      <img src={banner.img.src} alt={banner.text} className="mx-auto aspect-[970/90] max-h-[90px]" />
    </a>
  </div>
}

export default Banners
