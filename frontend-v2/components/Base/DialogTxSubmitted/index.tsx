import React from 'react'
import Modal from '@/components/Base/Modal'
import { getNetworkByAlias, getTXLink } from '@/components/web3'

type Props = {
  open: boolean;
  onClose?: () => void;
  networkName?: string;
  transaction?: string;
}

const DialogTxSubmitted = ({ open, ...props }: Props) => {
  const handleClose = () => {
    props.onClose && props.onClose()
  }
  const info = getNetworkByAlias(props.networkName)
  const transactionLink = getTXLink(props.networkName, props.transaction)

  return (
    <Modal
      show={open}
      toggle={handleClose}
      className={'bg-slate-800'}
    >
      <div className='p-9'>
        <h3 className='text-3xl font-bold text-center mb-4'>Transaction Submitted</h3>
        <h5 className='text-center text-xl font-semibold mb-2'>Tx Hash</h5>
        <p className='bg-gamefiDark-400 text-white text-sm p-1 text-center mb-2 rounded font-semibold'>{props.transaction}</p>
        <div className='grid justify-center'>
          <a href={transactionLink} target="_blank" className={'block font-semibold bg-gamefiGreen-700 text-black p-2 rounded text-center w-fit hover:underline'} rel="noreferrer">
            View on {info?.name} Scan
          </a>
        </div>
      </div>
    </Modal>
  )
}

export default React.memo(DialogTxSubmitted)
