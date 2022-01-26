import { ObjectType } from '@/common/types'
import clsx from 'clsx'
import ButtonBase from 'components/Base/Buttons/ButtonBase'
import Modal from 'components/Base/Modal'
import { useBalanceToken } from 'components/web3/utils'
import React, { ReactNode, useMemo, useState } from 'react'
import styles from './MakeOfferModal.module.scss'
import { BeatLoader } from 'react-spinners'
import { BigNumber, utils } from 'ethers'

type Props = {
  open?: boolean;
  onClose?: () => any;
  onSubmit?: (offerPrice: string, value: string) => any;
  isLoadingButton?: boolean;
  disabledButton?: boolean;
  tokenOnSale?: ObjectType;
} & ObjectType;

const MakeOfferModal = ({ tokenOnSale, projectInfo, lastOffer, ...props }: Props) => {
  const token = useMemo(() => {
    return { address: tokenOnSale.currency }
  }, [tokenOnSale])

  const { balanceShort, balance, loading: loadingBalance, updateBalance } = useBalanceToken(token as any, projectInfo.network)
  const [offerPrice, setOfferPrice] = useState('')
  const [notiMsg, setNotiMsg] = useState<{ type: 'info' | 'error', msg: string | ReactNode }>({ type: 'info', msg: '' })

  const onChangeOfferPrice = (e: any) => {
    const val = e.target.value
    setOfferPrice(val)
    const valEther = utils.parseEther(val || '0')
    if (BigNumber.from(balance).lt(valEther)) {
      setNotiMsg({ type: 'error', msg: 'Insufficient balance' })
    } else if (lastOffer) {
      if (BigNumber.from(valEther).gt(lastOffer.raw_amount)) {
        const numExceed = utils.formatEther(BigNumber.from(valEther).sub(lastOffer.raw_amount));
        setNotiMsg({ type: 'info', msg: <p>You already placed an offer for this hero with {utils.formatEther(lastOffer.raw_amount)} ${tokenOnSale.symbol}. This offer will need {numExceed} {tokenOnSale.symbol} more.</p> })
      } else {
        const numReturned = BigNumber.from(lastOffer.raw_amount).sub(valEther);
        if (+val && numReturned) {
          setNotiMsg({ type: 'info', msg: <p>You had an offer at higher price of <span className='text-gamefiGreen-700'>{utils.formatEther(lastOffer.raw_amount)} {tokenOnSale.symbol}</span>. By placing this new offer, <span className='text-gamefiGreen-700'>{numReturned} {tokenOnSale.symbol}</span> will be returned to your address.</p> });
        } else {
          setNotiMsg({ type: 'info', msg: <p>You already placed an offer for this hero with <span className='text-gamefiGreen-700'>{utils.formatEther(lastOffer.raw_amount)} {tokenOnSale.symbol}</span>.</p> })
        }
      }
    }
  }

  const handleOffer = async () => {
    let valueOffer = BigNumber.from(utils.parseEther(offerPrice))
    let currentOffer = valueOffer
    if (lastOffer) {
      const lastPriceOffer = BigNumber.from(lastOffer.raw_amount)
      if (lastPriceOffer.lt(currentOffer)) {
        valueOffer = currentOffer.sub(lastPriceOffer)
      } else {
        valueOffer = BigNumber.from(0)
      }
    }
    if (BigNumber.from(balance).lt(utils.parseEther(offerPrice))) return
    const ok = props.onSubmit && await props.onSubmit(valueOffer.toString(), valueOffer.toString())
    if (ok) {
      updateBalance()
    }
  }

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Transfer your NFT</h3>
      <div className='mb-8 '>
        <div className={clsx('grid', styles.formInput)}>
          <label htmlFor="" className='text-sm mb-2 font-casual flex justify-between gap-2 items-center'>
            <span>You will offer</span>
            <span className='text-13px'>(Your Balance: <b>{loadingBalance ? <BeatLoader size={8} /> : `${balanceShort} ${tokenOnSale.symbol}`} </b>)</span>
          </label>
          <input
            type="text"
            className={`font-casual text-sm rounded-sm px-4 py-2 relative ${styles.input}`}
            onChange={onChangeOfferPrice}
            value={offerPrice}
            placeholder="Enter Your Offer"
          />
          <span></span>
        </div>
        {
          notiMsg.msg && <div className={clsx('mt-7 text-sm font-casual', {
            'text-red-700': notiMsg.type === 'error',
          })}>
            {notiMsg.msg}
          </div>
        }
      </div>
      <div className='flex justify-end gap-8'>
        <button className='uppercase text-white/50 font-bold' onClick={props.onClose}>Cancel</button>
        <ButtonBase disabled={props.disabledButton} isLoading={props.isLoadingButton} color='green' onClick={handleOffer} className={clsx("uppercase", styles.btnOffer)}>
          Make Offer
        </ButtonBase>
      </div>
    </div>
  </Modal>
}

export default MakeOfferModal;
