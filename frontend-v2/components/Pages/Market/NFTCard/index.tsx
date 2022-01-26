import Link from 'next/link'
import Image from 'next/image'
import { networkImage } from '../utils'
import { BigNumber, ethers } from 'ethers'
import { getCurrencyByTokenAddress } from 'components/web3'

type Props = {
  item: any,
  showOffer?: boolean,
  showListing?: boolean
}

const NFTCard = ({ item, ...props }: Props) => {
  return (
    <div className="w-full rounded overflow-hidden">
      <div className="w-full">
        <div className="bg-black flex items-center justify-center p-4" style={{ width: 'full', aspectRatio: '1' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item?.token_info?.image || item?.token_info?.icon} alt={item?.token_info?.title} className="w-full object-cover" />
        </div>
      </div>
      <div className="bg-gamefiDark-650 w-full clipped-b-l px-5 pt-5 pb-2">
        <div className="mb-2">
          <Link href="#" passHref>
            <a className="flex align-middle items-center cursor-pointer hover:underline">
              <span className="w-6 h-6 relative mr-2 rounded-full overflow-hidden"><img src={item?.collection_info?.logo} alt="collection"></img></span>
              <span className="font-semibold opacity-50 uppercase text-sm">{item?.collection_info?.name}</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href="#" passHref>
            <a className="font-bold text-xl tracking-wide cursor-pointer hover:underline">
              #{item?.token_info?.id || 0}
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
                  <div className="text-gamefiGreen-700 text-xl font-medium ml-2">{ethers.utils.formatEther(item?.raw_amount || '0')} {getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}</div>
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
                  <div className="text-gamefiGreen-700 text-xl font-medium ml-2">{ethers.utils.formatEther(item?.highest_offer || '0')} {getCurrencyByTokenAddress(item?.currency, item?.network)?.symbol}</div>
                </div>
              </div>
              : <></>
          }
        </div>
      </div>
    </div>
  )
}

export default NFTCard
