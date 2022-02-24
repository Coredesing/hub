import { ObjectType } from '@/utils/types'
import clsx from 'clsx'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import Modal from '@/components/Base/Modal'
import { useMyBalance } from '@/components/web3/utils'
import React, { useMemo } from 'react'
import styles from './MarketBuyNowModal.module.scss'
import { BeatLoader } from 'react-spinners'
import { BigNumber, utils } from 'ethers'
import Input from '@/components/Base/Input'

type Props = {
  open?: boolean;
  onClose?: () => any;
  onSubmit?: () => any;
  isLoadingButton?: boolean;
  disabledButton?: boolean;
  tokenOnSale?: ObjectType;
} & ObjectType;

const BuyNowModal = ({ tokenOnSale, projectInfo, myBalance, ...props }: Props) => {

  const handleBuyNow = async () => {
    const ok = props.onSubmit && await props.onSubmit()
    if (ok) {
      myBalance?.updateBalance()
    }
  }
  const disabledBuy = !myBalance?.balance || !tokenOnSale.price || BigNumber.from(myBalance?.balance).lt(tokenOnSale.price)

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Payment</h3>
      <div className='mb-8 '>
        <div className={clsx('grid', styles.formInput)}>
          <label htmlFor="" className='text-sm mb-2 font-casual flex justify-between gap-2 items-center'>
            <span>You will pay</span>
            <span className='text-13px'>(Your Balance: <b>{myBalance?.loading ? <BeatLoader size={8} color='#fff' /> : `${myBalance?.balanceShort || '0'} ${tokenOnSale.symbol || ''}`} </b>)</span>
          </label>
          <Input placeholder="Enter Receiver Address" classes={{ input: 'font-casual text-sm rounded-sm px-4 py-2', formInput: 'w-full' }} value={utils.formatEther(tokenOnSale.price || '0')} readOnly />
        </div>
      </div>
      <div className='flex justify-end gap-8'>
        <button className='uppercase text-white/50 font-bold text-13px' onClick={props.onClose}>Cancel</button>
        <ButtonBase
          disabled={props.disabledButton || disabledBuy}
          isLoading={props.isLoadingButton}
          color='green'
          onClick={handleBuyNow}
          className={clsx('uppercase', styles.btnOffer)}
        >
          Buy now
        </ButtonBase>
      </div>
    </div>
  </Modal>
}

export default BuyNowModal
