import { ObjectType } from '@/common/types'
import clsx from 'clsx'
import ButtonBase from 'components/Base/Buttons/ButtonBase'
import Modal from 'components/Base/Modal'
import { useBalanceToken } from 'components/web3/utils'
import React, { useMemo } from 'react'
import styles from './MarketBuyNowModal.module.scss'
import { BeatLoader } from 'react-spinners'
import { BigNumber, utils } from 'ethers'

type Props = {
  open?: boolean;
  onClose?: () => any;
  onSubmit?: () => any;
  isLoadingButton?: boolean;
  disabledButton?: boolean;
  tokenOnSale?: ObjectType;
} & ObjectType;

const BuyNowModal = ({ tokenOnSale, projectInfo, ...props }: Props) => {
  const token = useMemo(() => {
    return { address: tokenOnSale.currency }
  }, [tokenOnSale])

  const { balanceShort, balance, loading: loadingBalance, updateBalance } = useBalanceToken(token as any, projectInfo.network)

  const handleBuyNow = async () => {
    const ok = props.onSubmit && await props.onSubmit()
    if (ok) {
      updateBalance()
    }
  }
  const disabledBuy = !balance || BigNumber.from(balance).lt(tokenOnSale.price)

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Payment</h3>
      <div className='mb-8 '>
        <div className={clsx('grid', styles.formInput)}>
          <label htmlFor="" className='text-sm mb-2 font-casual flex justify-between gap-2 items-center'>
            <span>You will pay</span>
            <span className='text-13px'>(Your Balance: <b>{loadingBalance ? <BeatLoader size={8} /> : `${balanceShort} ${tokenOnSale.symbol}`} </b>)</span>
          </label>
          <input
            type="text"
            className={`font-casual text-sm rounded-sm px-4 py-2 relative ${styles.input}`}
            value={utils.formatEther(tokenOnSale.price || '0')}
            placeholder="Enter Your Offer"
            readOnly
          />
          <span></span>
        </div>
      </div>
      <div className='flex justify-end gap-8'>
        <button className='uppercase text-white/50 font-bold' onClick={props.onClose}>Cancel</button>
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
