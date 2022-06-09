import Link from 'next/link'
import Image from 'next/image'
import Countdown from '@/components/Pages/IGO/Card/Countdown'
import { poolStatus } from '@/utils/pool'
import { useAppContext } from '@/context'

type Props = {
  item: any;
  showOffer?: boolean;
  showListing?: boolean;
  className?: string;
}

const CardItem = ({ item, ...props }: Props) => {
  const { now } = useAppContext()

  return (
    <div className={`w-full rounded overflow-hidden border border-transparent hover:opacity-80 ${props.className}`}>
      <div className="w-full relative">
        <div className="absolute h-6 w-2/5 inline-flex align-middle items-center top-0 left-0 pl-0.5 uppercase text-xs text-left bg-black clipped-b-r-full">
          <Image src={poolStatus(item.is_private).icon} alt="lock"></Image>
          <span className="ml-2 font-medium tracking-widest">{poolStatus(item.is_private).title}</span>
        </div>
        <div className="cursor-pointer">
          <Link href={`/igo/${item.slug || item.id}`} passHref>
            <img src={item?.banner} alt="" style={{ width: '100%', objectFit: 'cover', aspectRatio: '16/9' }} />
          </Link>
        </div>
      </div>
      <div className="bg-gamefiDark-650 w-full clipped-b-l">
        <div className="w-full flex items-center justify-center border-b border-gamefiDark-600" style={{ height: '80px' }}>
          <Link href={`/igo/${item.slug || item.id}`} passHref>
            <a className="text-center font-semibold text-lg cursor-pointer hover:underline">
              {item?.title || ''}
            </a>
          </Link>
        </div>
        {
          !item?.start_join_pool_time && !item?.start_time && ['tba', 'upcoming'].includes(item.campaign_status?.toLowerCase()) && <div className="py-3 w-full flex flex-col items-center justify-center">
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
        now?.getTime() >= new Date(Number(item.start_join_pool_time) * 1000).getTime() &&
        now?.getTime() < new Date(Number(item.end_join_pool_time) * 1000).getTime() &&
        <div className="py-3 w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Ends In</div>
          <div className="mt-2">
            <Countdown to={item?.end_join_pool_time}></Countdown>
          </div>
        </div>
        }
        {
          item.buy_type?.toLowerCase() === 'whitelist' &&
        now?.getTime() < new Date(Number(item.start_join_pool_time) * 1000).getTime() &&
        <div className="py-3 w-full flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-white/50 uppercase">Whitelist Starts In</div>
          <div className="mt-2">
            <Countdown to={item?.start_join_pool_time}></Countdown>
          </div>
        </div>
        }
        {now?.getTime() > new Date(Number(item.end_join_pool_time) * 1000).getTime() &&
      now?.getTime() <= new Date(Number(item.start_time) * 1000).getTime() &&
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
