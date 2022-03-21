import clsx from 'clsx'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import Dropdown from '@/components/Base/Dropdown'
import Modal from '@/components/Base/Modal'
import styles from './SellNFTModal.module.scss'
import martketStyles from './MarketplaceDetail.module.scss'
// import Input from '@/components/Base/Input'
import { ObjectType } from '@/utils/types'
import { useState } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import { FormInputNumber } from '@/components/Base/FormInputNumber'
import BigNumberJs from 'bignumber.js'

type Props = {
  open?: boolean;
  onClose?: () => any;
  method?: string;
  isLoadingButton?: boolean;
  disabledButton?: boolean;
  onListingNFT: (price: string, tokenAddress: string) => any;
  onApproveMarket: () => any;
  [k: string]: any;
}

const SellNFTModal = ({ open, onClose, method, currencies = [], isLoadingButton, disabledButton, onListingNFT, onApproveMarket, isApprovedMarketplace }: Props) => {
  // const isAuction = method === 'auction'
  const isFixedPrice = method === 'fixed-price'
  const { account } = useMyWeb3()
  const [currency, setCurrency] = useState<ObjectType>({})
  const [auctionPrice, setAuctionPrice] = useState('0')
  // const [expire, setExpire] = useState(0)
  const [feeAuction, setFeeAuction] = useState(0)
  const feePlatform = 0.01

  // NFT's owner approve to marketplace
  const handleApproveToken = async () => {
    try {
      const ok = await onApproveMarket()
      if (ok) {
        onClose && onClose()
      }
    } catch (error) {
      console.debug('error', error)
    }
  }

  const onChangePriceAuction = (e: any) => {
    const val = e.target.value
    setAuctionPrice(val)
    if (!val) {
      setFeeAuction(0)
      return
    }
    const fee = +(new BigNumberJs(val).multipliedBy(feePlatform).toFixed(2))
    setFeeAuction(fee)
  }

  // const onChangeExpire = (e: any) => {
  //   setExpire(e.target.value);
  // }

  const handleListingNFT = () => {
    onListingNFT(auctionPrice, currency.address)
  }

  const onChangeCurrency = (val: ObjectType) => {
    setCurrency(val)
  }

  const isAllowedApprove = !!account && !isApprovedMarketplace
  // const tags = ['Category a', 'Category b', 'category c'];

  return <Modal show={open} toggle={onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Sell Your NFT</h3>
      <div className={clsx('mb-8 flex items-center gap-3 justify-between')}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Select Sell Method</label>
        <div className='flex gap-2 justify-end'>
          {/* <button
            className={clsx(martketStyles.btn, martketStyles.btnClipPathBottomLeft, 'text-13px font-bold uppercase', {
              'bg-black': !isAuction,
              'text-white/50': !isAuction,
              'bg-gamefiGreen-700': isAuction,
              'text-black': isAuction
            })}>
            Auction
          </button> */}
          <button
            className={clsx(martketStyles.btn, martketStyles.btnClipPathTopRight, 'text-13px font-bold uppercase', {
              'bg-black': !isFixedPrice,
              'text-white/50': !isFixedPrice,
              'bg-gamefiGreen-700': isFixedPrice,
              'text-black': isFixedPrice
            })}>
            Fixed Price
          </button>
        </div>
      </div>
      <div>

      </div>
      <div className={clsx('mb-8 flex sm:items-center gap-3 justify-between')}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Total Price</label>
        <div className='flex gap-2 flex-col sm:flex-row'>
          <div className={clsx(styles.formInput, 'w-40')}>
            <FormInputNumber
              className={`font-casual text-sm rounded-sm px-4 py-2 relative ${styles.input}`}
              placeholder="Enter Price"
              onChange={onChangePriceAuction}
              value={auctionPrice}
              allowZero
              minLength={10}
            />
            <span></span>
          </div>
          {/* <Input classes={{ input: 'font-casual text-sm rounded-sm px-4 py-2', formInput: 'w-40' }} onChange={onChangePriceAuction} value={auctionPrice} /> */}
          <Dropdown onChange={onChangeCurrency} items={currencies} selected={currency} propLabel='name' propValue='address' propIcon='icon' classes={{ wrapperDropdown: `${styles.wrapperDropdown} rounded-sm` }} />
        </div>
      </div>
      <div className={'mb-8 flex justify-between'}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Fee</label>
        <div className='grid gap-1 justify-end'>
          <span className='block text-right text-base font-medium font-casual'>{feeAuction} {currency.name}</span>
          <span className='block text-right font-casual text-white/50 text-xs'>1% of the total sales will be paid to GameFi.org as a Platform fee.</span>
        </div>
      </div>
      {/* <div className={clsx('mb-8 flex gap-3 justify-between items-center', styles.formInput)}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Expiration Date</label>
        <div>
          <Input classes={{ input: "font-casual text-sm rounded-sm px-4 py-2", formInput: 'w-92' }} placeholder="Not more than 30 days" onChange={onChangeExpire} value={expire} />
        </div>
      </div> */}
      <div className="divider bg-white/20 w-full mt-8 mb-4" style={{ height: '1px' }}></div>
      {/* <div>
        <label htmlFor="" className='block font-bold text-lg mb-4'>Choose Categogy (3/3)</label>
        <div className={clsx('flex gap-2 bg-white/10 flex-wrap rounded-sm border border-white/25 p-1 items-center', styles.tagsBox)}>
          {
            tags.map((t) => <span key={t} className={clsx('flex items-center px-2 py-1 bg-white/25 rounded-sm font-casual', styles.tag)}>
              <label htmlFor="">Shoot</label>
              <span className='cursor-pointer ml-2'>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0.5L0.5 7.5" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.5 0.5L7.5 7.5" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>)
          }
        </div>
      </div> */}
      {/* <div className="divider bg-white/20 w-full my-4" style={{ height: '1px' }}></div> */}
      {/* <div className='mb-8'>
        <label htmlFor="" className='block font-bold text-lg mb-4'>Description</label>
        <textarea className={clsx('w-full h-24 bg-slate-600 rounded-sm', styles.descBox)}></textarea>
      </div> */}
      <div className='flex justify-end gap-8'>
        {
          isAllowedApprove &&
          <ButtonBase
            isLoading={disabledButton}
            disabled={disabledButton}
            color='green'
            onClick={handleApproveToken}
            className={clsx('uppercase', styles.btnSubmit)}>
            Approve
          </ButtonBase>
        }
        {
          isApprovedMarketplace &&
          <ButtonBase
            color='green'
            onClick={handleListingNFT}
            className={clsx('uppercase', styles.btnSubmit)}
            isLoading={isLoadingButton}
            disabled={disabledButton || !currency.address}>
            Submit
          </ButtonBase>
        }

      </div>
    </div>
  </Modal>
}

export default SellNFTModal
