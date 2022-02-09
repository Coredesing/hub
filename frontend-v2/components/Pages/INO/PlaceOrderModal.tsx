import React, { useState } from 'react'
import Modal from '@/components/Base/Modal'
import { FormInputNumber } from '@/components/Base/FormInputNumber'
import styles from './PlaceOrderModal.module.scss'
import clsx from 'clsx'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import { useOrderBox } from '@/hooks/useOrderBox'
import { useMyWeb3 } from '@/components/web3/context'
import toast from 'react-hot-toast'

type Props = {
  open?: boolean;
  onClose?: () => any;
  poolId: number | string;
  [k: string]: any;
}

const PlaceOrderModal = ({ open, onClose, poolId, getBoxOrderd }: Props) => {
  const { account } = useMyWeb3()
  const { orderBox, loading: loadingOrderBox } = useOrderBox(poolId, account)
  const [numberBox, setNumberBox] = useState(0)
  const onChangeNumberBox = (event: any) => {
    const { value } = event.target
    setNumberBox(value ? +value : 0)
  }

  const onPlaceOrder = async () => {
    try {
      if (+numberBox <= 0) {
        toast.error('Amount must be greater than zero')
        return
      }
      await orderBox(numberBox)
      setNumberBox(0)
      getBoxOrderd && getBoxOrderd()
      onClose && onClose()
    } catch (error) {

    }
  }
  return <Modal show={open} toggle={onClose}>
    <div className='px-8 pt-11 pb-8' style={{ background: 'rgb(31 31 35)' }}>
      <h3 className='uppercase text-2xl font-bold mb-4'>Buy Boxes </h3>
      <div>
        <h4 className='font-casual text-sm text-white/70 mb-2'>Number of boxes you want to buy? (Maximum: 10)</h4>
        <FormInputNumber value={numberBox} isPositive isInteger onChange={onChangeNumberBox} max={10} className={clsx(styles.input, 'text-sm font-casual')} placeholder="Amout. Eg: 50" />
      </div>
      <div className='grid justify-center'>
        <ButtonBase
          color={'green'}
          onClick={onPlaceOrder}
          disabled={loadingOrderBox}
          isLoading={loadingOrderBox}
          className={clsx('mt-4 uppercase w-40 ')}>
          Place Order
        </ButtonBase>
      </div>
    </div>
  </Modal>
}

export default PlaceOrderModal
