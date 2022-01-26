import clsx from 'clsx'
import ButtonBase from 'components/Base/Buttons/ButtonBase'
import Modal from 'components/Base/Modal'
import { useState } from 'react'
import styles from './TransferNFTModal.module.scss'

type Props = {
  open?: boolean;
  onClose?: () => any;
  onSubmit?: (receiver: string) => any;
  isLoadingButton?: boolean;
  disabledButton?: boolean;
}

const TransferNFTModal = (props: Props) => {
  const [receiver, setReceiver] = useState('')
  const onChangeReceiver = (e: any) => {
    const val = e.target.value
    setReceiver(val)
  }

  const handleTransfer = () => {
    props.onSubmit && props.onSubmit(receiver)
  }

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Transfer your NFT</h3>
      <div className={clsx('mb-8', styles.formInput)}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Receive Address</label>
        <input
          type="text"
          className={`font-casual text-sm rounded-sm px-4 py-2 relative ${styles.input}`}
          onChange={onChangeReceiver}
          value={receiver}
          placeholder="Enter Receiver Address"
        />
        <span></span>
      </div>
      <div className='flex justify-end gap-8'>
        <button className='uppercase text-white/50 font-bold' onClick={props.onClose}>Cancel</button>
        <ButtonBase disabled={props.disabledButton} isLoading={props.isLoadingButton} color='green' onClick={handleTransfer} className={clsx('uppercase', styles.btnTransfer)}>
          Transfer
        </ButtonBase>
      </div>
    </div>
  </Modal>
}

export default TransferNFTModal
