import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useScreens } from '../utils'

type Props = {
  item: any;
  showOffer?: boolean;
  showListing?: boolean;
  className?: string;
}

const poolStatus = (status: any) => {
  switch (status) {
  case 1:
    return 'private'
  case 3:
    return 'community'
  case 0:
  default:
    return 'public'
  }
}

const CardItem = ({ item, ...props }: Props) => {
  const [distance, setDistance] = useState(0)
  const [days, setDays] = useState('00')
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')
  const [countdownStatus, setCountdownStatus] = useState('')

  const screens = useScreens()

  useEffect(() => {
    if (countdownStatus) {
      return
    }
    const interval = setInterval(() => {
      setDistance(new Date(item.start_time * 1000).getTime() - new Date().getTime())
      setDays(distance > 0 ? ('0' + Math.floor(distance / (1000 * 60 * 60 * 24)).toString()).slice(-2) : '00')
      setHours(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()).slice(-2) : '00')
      setMinutes(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()).slice(-2) : '00')
      setSeconds(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60)) / 1000).toString()).slice(-2) : '00')
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [item.start_time, distance, countdownStatus])

  return (
    <div className={`rounded overflow-hidden border border-transparent hover:border-gamefiGreen-700 hover:shadow hover:shadow-gamefiGreen-700 ${props.className}`} style={{ maxWidth: (screens.md || screens.lg || screens.xl) ? '350px' : '100%' }}>
      <div className="w-full relative">
        <div className="absolute h-6 w-2/5 inline-flex align-middle items-center top-0 left-0 uppercase text-xs text-left bg-black clipped-b-r-full">
          <Image src={require('assets/images/icons/lock.svg')} alt="lock"></Image>
          <span className="ml-2 font-medium tracking-widest">{poolStatus(item.is_private)}</span>
        </div>
        <div className="cursor-pointer">
          <img src={item?.banner} alt="" style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/3' }} />
        </div>
      </div>
      <div className="bg-gamefiDark-650 w-full clipped-b-l pb-2">
        <div className="w-full flex items-center justify-center border-b border-gamefiDark-600" style={{ height: '80px' }}>
          <Link href={`https://hub.gamefi.org/#/buy-token/${item.id}`} passHref>
            <a className="text-center font-semibold text-lg cursor-pointer hover:underline">
              {item?.title || ''}
            </a>
          </Link>
        </div>
        <div className="mt-4 mb-2 flex justify-between">
          <div className="w-full h-full flex flex-col align-middle items-center justify-center mt-1">
            <div className="uppercase font-bold text-xs text-gray-500">Countdown to IGO date</div>
            <div className="mt-2 flex font-medium">
              <div className="text-center">{days}d</div>
              <span className="mx-1">:</span>
              <div className="text-center">{hours}h</div>
              <span className="mx-1">:</span>
              <div className="text-center">{minutes}m</div>
              <span className="mx-1">:</span>
              <div className="text-center">{seconds}s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardItem
