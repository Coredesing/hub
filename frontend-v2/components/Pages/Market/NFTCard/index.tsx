import Link from 'next/link'
import Image from 'next/image'
import { networkImage } from '../utils'
import { ethers } from 'ethers'
import { getCurrencyByTokenAddress } from '@/components/web3'
import ImageLoader from '@/components/Base/ImageLoader'
import { formatNumber } from '@/utils'
import { useMediaQuery } from 'react-responsive'

type Props = {
  item: any;
  showOffer?: boolean;
  showListing?: boolean;
}

const NFTCard = ({ item, ...props }: Props) => {
  const isSmScreen = useMediaQuery({ maxWidth: '640px' })

  return (
    <div className="w-full rounded overflow-hidden hover:bg-gamefiGreen-700 hover:shadow hover:shadow-gamefiGreen-700 clipped-b-l p-px ">
      <div className='clipped-b-l bg-gamefiDark-650 rounded relative'>
        {
          typeof item.isFirstEdition === 'boolean' &&
          <div className={`absolute left-0 top-0 py-1 px-5 font-semibold bg-gamefiDark-900 ${item.isFirstEdition ? 'text-gamefiGreen-700' : 'text-orange-400'}`} style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
            {item.isFirstEdition ? 'First Edition' : 'ReSale'}
          </div>
        }
        <div className="w-full">
          <div className="bg-gamefiDark-650 flex items-center justify-center p-4 cursor-pointer w-full" style={{ aspectRatio: '1', height: isSmScreen ? '215px' : '280px' }}>
            <Link href={`/market/${item?.slug}/${item?.token_id || item?.id}`} passHref>
              <ImageLoader src={item?.token_info?.image || item?.token_info?.icon} className="w-full h-full object-contain" />
              {/* <img src={item?.token_info?.image || item?.token_info?.icon || gamefiBox.src} alt={item?.token_info?.title} className="w-full object-cover" /> */}
            </Link>
          </div>
        </div>
        <div className="bg-gamefiDark-650 w-full px-5 pt-5 pb-2">
          <div className="mb-2">
            <Link href={`/market/collection/${item?.slug}`} passHref>
              <a className="flex align-middle items-center cursor-pointer hover:underline">
                <span className="w-6 h-6 relative mr-2 rounded-full overflow-hidden"><img src={item?.collection_info?.logo} alt="collection"></img></span>
                <span className="font-semibold opacity-50 uppercase text-sm">{item?.collection_info?.name}</span>
              </a>
            </Link>
          </div>
          <div>
            <Link href={`/market/${item?.slug}/${item?.token_id || item?.id}`} passHref>
              <a className="font-bold text-xl tracking-wide cursor-pointer hover:underline">
                #{formatNumber(item?.token_info?.name || item?.token_id || item?.id, 3) || '-/-'}
              </a>
            </Link>
          </div>
          <div className="mt-4 mb-2 flex justify-between">
            {
              props.showListing
                ? <div>
                  <p className="font-semibold text-sm opacity-50 uppercase">Listing Price</p>
                  <div className="flex items-center">
                    <div className="w-4 h-4"><Image src={networkImage(item?.network)} alt="network"></Image></div>
                    <div className="text-gamefiGreen-700 sm:text-xl text-base font-medium ml-2">{ethers.utils.formatEther(item?.raw_amount || '0')} {item.currencySymbol || getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}</div>
                  </div>
                </div>
                : <></>
            }
            {
              props.showOffer
                ? <div>
                  <p className="font-semibold text-sm opacity-50 uppercase">Highest Offer</p>
                  <div className="flex items-center">
                    <div className="w-4 h-4"><Image src={networkImage(item?.network)} alt="network"></Image></div>
                    <div className="text-gamefiGreen-700 sm:text-xl text-base font-medium ml-2">{ethers.utils.formatEther(item?.highest_offer || '0')} {item.currencySymbol || getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}</div>
                  </div>
                </div>
                : <></>
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default NFTCard
