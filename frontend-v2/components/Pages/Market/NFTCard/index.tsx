import Link from 'next/link'
import Image from 'next/image'
import { networkImage } from '../utils'
import { BigNumber, ethers } from 'ethers'
import { getCurrencyByTokenAddress } from '@/components/web3'
import ImageLoader from '@/components/Base/ImageLoader'
import { formatNumber } from '@/utils'

type Props = {
  item: any;
  showOffer?: boolean;
  showListing?: boolean;
}

const NFTCard = ({ item, ...props }: Props) => {
  return (
    <div className="rounded overflow-hidden clipped-b-l p-px">
      <div className='clipped-b-l bg-gamefiDark-630/30 hover:bg-gamefiDark-630 h-full rounded relative'>
        {
          typeof item.isFirstEdition === 'boolean' &&
          (item.isFirstEdition || (!item.collection_info?.sale_over && !item.isFirstEdition)) &&
          <div
            className={`absolute left-0 top-0 py-1 p-px pr-5 font-semibold bg-gamefiDark-900 ${item.isFirstEdition ? 'text-gamefiGreen-700' : 'text-orange-400'}`}
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
            {item.isFirstEdition
              ? <div className='flex items-center gap-2'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_3228_16362)">
                    <path d="M8 2L9.854 5.94953L14 6.58297L11 9.65804L11.708 14L8 11.9508L4.292 14L5 9.65804L2 6.58297L6.146 5.94953L8 2Z" stroke="#FFBF23" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  </g>
                  <defs>
                    <clipPath id="clip0_3228_16362">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>First Edition</span>
              </div>
              : <div className='flex items-center gap-2'>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.89982 2L2 5H5" stroke="#6CDB00" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  <path d="M2.67473 5.23567C3.35065 3.93356 4.48023 2.92421 5.8499 2.39848C7.21956 1.87274 8.73439 1.86705 10.108 2.38249C11.4815 2.89792 12.6187 3.89875 13.3044 5.19576C13.99 6.49276 14.1768 7.99605 13.8292 9.42138C13.4816 10.8467 12.6239 12.0953 11.4182 12.9311C10.2124 13.7669 8.74222 14.132 7.28556 13.9573C5.8289 13.7826 4.48672 13.0803 3.51279 11.9831C2.53886 10.8859 2.00068 9.46986 2 8.00276" stroke="#6CDB00" strokeWidth="2" strokeMiterlimit="10" />
                </svg>
                <span>ReSale</span>
              </div>}
          </div>
        }
        <div className="w-full p-1">
          <div className="bg-black flex items-center justify-center p-4 cursor-pointer w-full" style={{ aspectRatio: '1' }}>
            <Link href={`/marketplace/${item?.slug}/${item?.token_id ?? item?.id}`} passHref>
              <ImageLoader src={item?.token_info?.image || item?.token_info?.icon} className="w-full h-full object-contain" style={{ maxHeight: '240px' }} />
              {/* <img src={item?.token_info?.image || item?.token_info?.icon || gamefiBox.src} alt={item?.token_info?.title} className="w-full object-cover" /> */}
            </Link>
          </div>
        </div>
        <div className="w-full px-5 pt-5 pb-2">
          <div className="mb-2">
            <Link href={`/marketplace/collection/${item?.slug}`} passHref>
              <a className="flex align-middle items-center cursor-pointer hover:underline">
                <span className="w-7 h-7 relative mr-2 rounded-full overflow-hidden bg-white/95 grid place-items-center" style={{ padding: '3px' }}>
                  <img src={item?.collection_info?.logo} className='object-contain w-full h-full' alt="collection"></img>
                </span>
                <span className="font-semibold opacity-50 uppercase text-sm">{item?.collection_info?.name}</span>
              </a>
            </Link>
          </div>
          <div>
            <Link href={`/marketplace/${item?.slug}/${item?.token_id ?? item?.id}`} passHref>
              <a className="font-bold text-xl tracking-wide cursor-pointer hover:underline">
                #{formatNumber(item?.token_info?.name || (item?.token_id ?? item?.id), 3) || '-/-'}
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
                    <div className="text-gamefiGreen-700 text-base font-medium ml-2"><span className='sm:text-xl'>{ethers.utils.formatEther(item?.raw_amount || '0')}</span> {item.currencySymbol || getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}</div>
                  </div>
                </div>
                : <></>
            }
            {
              props.showOffer && BigNumber.from(item?.highest_offer || '0').gt(0)
                ? <div>
                  <p className="font-semibold text-sm opacity-50 uppercase">Highest Offer</p>
                  <div className="flex items-center">
                    <div className="w-4 h-4"><Image src={networkImage(item?.network)} alt="network"></Image></div>
                    <div className="text-gamefiGreen-700 text-base font-medium ml-2"><span className='sm:text-xl'>{ethers.utils.formatEther(item?.highest_offer || '0')}</span> {item.currencySymbol || getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}</div>
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
