import { useMemo } from 'react'
import { useAppContext } from '../context'
import banner from '@/assets/images/banner.png'

const Banners = () => {
  const { now } = useAppContext()
  const bannerShow = useMemo(() => {
    const bannerDeadline = new Date('2022-05-13T00:00:00Z')
    return bannerDeadline > now
  }, [now])

  return bannerShow && <div className="mx-auto relative mb-4 sm:mb-16">
    <a href="https://gamefi.org/igo/131" target="_blank" rel="noreferrer">
      <img src={banner.src} alt="" className="mx-auto aspect-[970/90] max-h-[90px]" />
    </a>
  </div>
}

export default Banners
