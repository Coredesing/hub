import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useScreens } from '../utils'
import Countdown from '@/components/Pages/IGO/Card/Countdown'

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

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (countdownStatus) {
      return
    }
    const interval = setInterval(() => {
      if (distance < 0) {
        if (item.campaign_status.toLowerCase() === 'swap' || item.campaign_status.toLowerCase() === 'filled') {
          setCountdownStatus('Buying Time')
          return
        }

        setCountdownStatus(item.campaign_status)
        return
      }

      setDistance(new Date(item.start_time * 1000).getTime() - new Date().getTime())
      setDays(distance > 0 ? ('0' + Math.floor(distance / (1000 * 60 * 60 * 24)).toString()).slice(-2) : '00')
      setHours(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString()).slice(-2) : '00')
      setMinutes(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()).slice(-2) : '00')
      setSeconds(distance > 0 ? ('0' + Math.floor((distance % (1000 * 60)) / 1000).toString()).slice(-2) : '00')
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [item.start_time, distance, countdownStatus, item.campaign_status])

  return (
    <div className={`rounded overflow-hidden border border-transparent hover:opacity-80 ${props.className}`} style={{ maxWidth: (screens.md || screens.lg || screens.xl) ? '350px' : '100%' }}>
      <div className="w-full relative">
        <div className="absolute h-6 w-2/5 inline-flex align-middle items-center top-0 left-0 uppercase text-xs text-left bg-black clipped-b-r-full">
          <Image src={require('@/assets/images/icons/lock.svg')} alt="lock"></Image>
          <span className="ml-2 font-medium tracking-widest">{poolStatus(item.is_private)}</span>
        </div>
        <div className="cursor-pointer">
          <Link href={`/igo/${item.id}`} passHref>
            <img src={item?.banner} alt="" style={{ width: '100%', objectFit: 'cover', aspectRatio: '16/9' }} />
          </Link>
        </div>
      </div>
      <div className="bg-gamefiDark-650 w-full clipped-b-l">
        <div className="w-full flex items-center justify-center border-b border-gamefiDark-600" style={{ height: '80px' }}>
          <Link href={`/igo/${item.id}`} passHref>
            <a className="text-center font-semibold text-lg cursor-pointer hover:underline">
              {item?.title || ''}
            </a>
          </Link>
        </div>
        {
          !item?.start_time && ['tba', 'upcoming'].includes(item.campaign_status?.toLowerCase()) && <div className="py-3 w-full flex flex-col items-center justify-center">
            <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Starts In</div>
            <div className="mt-2 font-medium">TBA</div>
          </div>
        }
        {
          item.finish_time && item.campaign_status?.toLowerCase() === 'swap' && <div className="py-3 w-full flex flex-col items-center justify-center">
            <div className="text-xs font-semibold text-white/50 uppercase">Swap Ends In</div>
            <div className="mt-2">
              <Countdown to={item?.finish_time}></Countdown>
            </div>
          </div>
        }
        {
          item.buy_type?.toLowerCase() === 'whitelist' &&
        item.campaign_status?.toLowerCase() === 'upcoming' &&
        now.getTime() >= new Date(Number(item.start_join_pool_time) * 1000).getTime() &&
        now.getTime() < new Date(Number(item.end_join_pool_time) * 1000).getTime() &&
        <div className="py-3 w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Ends In</div>
          <div className="mt-2">
            <Countdown to={item?.end_join_pool_time}></Countdown>
          </div>
        </div>
        }
        {
          item.buy_type?.toLowerCase() === 'whitelist' &&
        now.getTime() < new Date(Number(item.start_join_pool_time) * 1000).getTime() &&
        <div className="py-3 w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Starts In</div>
          <div className="mt-2">
            <Countdown to={item?.start_join_pool_time}></Countdown>
          </div>
        </div>
        }
        {now.getTime() > new Date(Number(item.end_join_pool_time) * 1000).getTime() &&
      now.getTime() <= new Date(Number(item.start_time) * 1000).getTime() &&
        <div className="py-3 w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Buying Phase Starts In</div>
          <div className="mt-2">
            <Countdown to={item?.start_time}></Countdown>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default CardItem
