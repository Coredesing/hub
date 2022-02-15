import React, { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/Base/Modal'
import clsx from 'clsx'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import { useMyWeb3 } from '@/components/web3/context'
import { debounce } from '@/utils/index'
import { BigNumber, utils } from 'ethers'
import Recaptcha from '@/components/Base/Recaptcha'
import { ObjectType } from '@/utils/types'
import { useMyBalance } from '@/components/web3/utils'
import { BeatLoader } from 'react-spinners'
import useBuyBox from '@/hooks/useBuyBox'
import DialogTxSubmitted from '@/components/Base/DialogTxSubmitted'

type Props = {
  open?: boolean;
  onClose?: () => any;
  boxTypeBuy: ObjectType;
  amountBoxBuy: number;
  currencyInfo: ObjectType;
  poolInfo: ObjectType;
  [k: string]: any;
}

const BuyBoxModal = ({ open, onClose, boxTypeBuy, amountBoxBuy, currencyInfo, poolInfo, eventId }: Props) => {
  const { account } = useMyWeb3()

  const { balanceShort, loading, balance } = useMyBalance(currencyInfo as any, poolInfo.network_available)

  // const { balanceShort, loading, balance } = useBalanceToken(BigNumber.from(currencyInfo?.address || 0).isZero() ? undefined : currencyInfo as any, poolInfo.network_available)
  const [isVerified, setVerify] = useState<string | null>('')
  const totalBuy = currencyInfo?.price ? BigNumber.from(amountBoxBuy).mul(utils.parseEther(currencyInfo?.price)).toString() : 0
  const recaptchaRef: any = React.useRef()
  const onRefreshRecaptcha = debounce(() => {
    if (!isVerified) return
    if (typeof recaptchaRef?.current?.resetCaptcha === 'function') {
      recaptchaRef.current.resetCaptcha()
      setVerify('')
    }
  }, 5000)

  const { buyBox, loading: loadingBuyBox, txHash } = useBuyBox({
    poolId: poolInfo.id,
    eventId,
    currencyInfo,
    poolAddress: poolInfo.campaign_hash,
    subBoxId: boxTypeBuy.subBoxId,
    priceOfBox: currencyInfo.price,
  })
  const insufficientBalance = !balance || BigNumber.from(balance).lt(totalBuy)
  const onBuyBox = () => {
    if (insufficientBalance) return
    onRefreshRecaptcha()
    buyBox(amountBoxBuy, isVerified)
  }

  const onChangeRecapcha = (value: string | null) => {
    setVerify(value)
  }

  const [openTxModal, setOpenTxModal] = useState(false)
  useEffect(() => {
    if (txHash) {
      setOpenTxModal(true)
    }
  }, [txHash])

  const disabledBuy = insufficientBalance || !isVerified || loadingBuyBox

  return (
    <>
      <DialogTxSubmitted
        transaction={txHash}
        open={openTxModal}
        onClose={() => setOpenTxModal(false)}
        networkName={poolInfo.network_available}
      />
      <Modal show={open} toggle={onClose}>
        <div className='px-8 pt-11 pb-8' style={{ background: 'rgb(31 31 35)' }}>
          <h3 className='uppercase text-2xl font-bold mb-4'>Confirmation Buy Boxes </h3>
          <div className='flex justify-between mb-6'>
            <label className='text-base font-casual'>Box Type</label>
            <div className='flex items-center gap-2'>
              <img src={boxTypeBuy?.icon} alt="" style={{ maxWidth: '80px', maxHeight: '30px' }} className='w-full h-full object-contain' />
              <span className='font-bold'>
                {boxTypeBuy?.name}
              </span>
            </div>
          </div>
          <div className='flex justify-between mb-6'>
            <label className='text-base font-casual'>Amount</label>
            <span className='font-semibold text-base'>{amountBoxBuy}</span>
          </div>
          <div className='flex justify-between mb-6'>
            <label className='text-base font-casual'>Your balance</label>
            <span className='font-semibold text-base'>{loading ? <BeatLoader size={10} color='white' /> : +balanceShort || 0} {currencyInfo?.name}</span>
          </div>
          <div className='flex justify-between mb-4'>
            <label className='text-base font-casual'>Total</label>
            <span className='font-semibold text-base'>{utils.formatEther(totalBuy)} {currencyInfo?.name}</span>
          </div>
          {insufficientBalance && <div className='text-red-600 text-lg mb-4'>
            insufficient balance
          </div>}
          <div>
            <Recaptcha onChange={onChangeRecapcha} ref={recaptchaRef} />
          </div>
          <div className='grid justify-center'>
            <ButtonBase
              color={'green'}
              onClick={onBuyBox}
              disabled={disabledBuy}
              isLoading={loadingBuyBox}
              className={clsx('mt-4 uppercase w-40 ')}>
              Buy Box
            </ButtonBase>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BuyBoxModal
