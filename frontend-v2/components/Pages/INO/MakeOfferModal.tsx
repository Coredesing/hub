import { ObjectType } from '@/utils/types'
import clsx from 'clsx'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import Modal from '@/components/Base/Modal'
import React, { ReactNode, useEffect, useState } from 'react'
import styles from './MakeOfferModal.module.scss'
import { BeatLoader } from 'react-spinners'
import { BigNumber, utils } from 'ethers'
import { FormInputNumber } from '@/components/Base/FormInputNumber'

type Props = {
  open?: boolean;
  onClose?: () => any;
  onSubmit?: (offerPrice: string, value: string) => any;
  isLoadingButton?: boolean;
  disabledButton?: boolean;
  tokenOnSale?: ObjectType;
} & ObjectType;

const MakeOfferModal = ({ tokenOnSale, lastOffer, myBalance, ...props }: Props) => {
  const [offerPrice, setOfferPrice] = useState('')
  const [notiMsg, setNotiMsg] = useState<{ type: 'info' | 'error'; msg: string | ReactNode }>({ type: 'info', msg: '' })
  useEffect(() => {
    setNotiMsg({ type: 'info', msg: lastOffer ? <p>You already placed an offer with <span className='text-gamefiGreen-700'>{utils.formatEther(lastOffer.amount)} {lastOffer?.symbol || ''}</span>.</p> : '' })
  }, [lastOffer, tokenOnSale?.symbol])

  const onChangeOfferPrice = (e: any) => {
    try {
      const val = e.target.value
      setOfferPrice(val)
      const valEther = utils.parseEther(val || '0')
      if (BigNumber.from(myBalance?.balance || 0).lt(valEther)) {
        setNotiMsg({ type: 'error', msg: 'Insufficient balance' })
      } else if (lastOffer) {
        if (BigNumber.from(valEther).gt(lastOffer.amount)) {
          const numExceed = utils.formatEther(BigNumber.from(valEther).sub(lastOffer.amount))
          setNotiMsg({ type: 'info', msg: <p>You already placed an offer with <span className='text-gamefiGreen-700'>{utils.formatEther(lastOffer.amount)} {tokenOnSale.symbol}</span>. This offer will need <span className='text-gamefiGreen-700'>{numExceed} {tokenOnSale.symbol}</span> more.</p> })
        } else {
          const numReturned = BigNumber.from(lastOffer.amount).sub(valEther)
          if (numReturned.eq(0)) {
            setNotiMsg({ type: 'error', msg: <p>You already placed an offer with {utils.formatEther(lastOffer.amount)} {tokenOnSale.symbol}</p> })
            return
          }
          if (+val && numReturned) {
            const valueReturned = utils.formatEther(numReturned)
            setNotiMsg({
              type: 'info',
              msg: <p>You had an offer at higher price of <span className='text-gamefiGreen-700'>{utils.formatEther(lastOffer.amount)} {tokenOnSale.symbol}</span>. By placing this new offer, <span className='text-gamefiGreen-700'>{valueReturned} {tokenOnSale.symbol}</span> will be returned to your address.</p>
            })
          } else {
            setNotiMsg({ type: 'info', msg: <p>You already placed an offer with <span className='text-gamefiGreen-700'>{utils.formatEther(lastOffer.amount)} {tokenOnSale.symbol}</span>.</p> })
          }
        }
      } else {
        setNotiMsg({ type: 'info', msg: '' })
      }
    } catch (error) {
      console.debug('error', error)
    }
  }

  const handleOffer = async () => {
    if (BigNumber.from(utils.parseEther(offerPrice || '0')).isZero()) return
    let valueOffer = BigNumber.from(utils.parseEther(offerPrice))
    const currentOffer = valueOffer
    if (lastOffer) {
      const lastPriceOffer = BigNumber.from(lastOffer.amount)
      if (lastPriceOffer.lt(currentOffer)) {
        valueOffer = currentOffer.sub(lastPriceOffer)
      } else {
        valueOffer = BigNumber.from(0)
      }
    }
    if (BigNumber.from(myBalance?.balance || 0).lt(utils.parseEther(offerPrice))) return
    const ok = props.onSubmit && await props.onSubmit(currentOffer.toString(), valueOffer.toString())
    if (ok) {
      myBalance?.updateBalance()
      setOfferPrice('')
    }
  }

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Make Offer</h3>
      <div className='mb-8 '>
        <div className={clsx('grid')}>
          <label htmlFor="" className='text-sm mb-2 font-casual flex justify-between gap-2 items-center'>
            <span>You will offer</span>
            <span className='text-13px'>(Your Balance: <b>{myBalance?.loading ? <BeatLoader size={8} color='#fff' /> : `${myBalance?.balanceShort || ''} ${tokenOnSale.symbol}`} </b>)</span>
          </label>
          <div className={styles.formInput}>
            <FormInputNumber
              className={`font-casual text-sm rounded-sm px-4 py-2 relative ${styles.input}`}
              placeholder="Enter Your Offer"
              onChange={onChangeOfferPrice}
              value={offerPrice}
              allowZero
              minLength={10}
            />
            <span></span>
          </div>
        </div>
        <div className='mt-7' style={{ minHeight: '44px' }}>
          {
            notiMsg.msg && <div className={clsx('text-sm font-casual', {
              'text-red-700': notiMsg.type === 'error'
            })}>
              {notiMsg.msg}
            </div>
          }
        </div>
      </div>
      <div className='flex justify-end gap-8'>
        <button className='uppercase text-white/50 font-bold text-13px' onClick={props.onClose}>Cancel</button>
        <ButtonBase
          disabled={props.disabledButton || BigNumber.from(utils.parseEther(offerPrice || '0')).isZero() || !!(notiMsg.type === 'error' && notiMsg.msg)}
          isLoading={props.isLoadingButton}
          color='green'
          onClick={() => {
            handleOffer()
          }}
          className={clsx('uppercase', styles.btnOffer)}
        >
          Make Offer
        </ButtonBase>
      </div>
    </div>
  </Modal>
}

export default MakeOfferModal
