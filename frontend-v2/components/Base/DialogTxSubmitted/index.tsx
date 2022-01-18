import React from 'react';
import { getTXLink, getNetworkInfo } from '@/utils/network';
import Modal from '@/components/Base/Modal';
const closeIcon = '/images/icons/close.svg';


type Props = {
  open: boolean;
  onClose?: () => void;
  networkName?: string;
  transaction?: string;
}

const DialogTxSubmitted = ({ open, ...props }: Props) => {

  const handleClose = () => {
    props.onClose && props.onClose();
  };
  const info = getNetworkInfo(props.networkName as string);
  const transactionLink = getTXLink({
    appChainID: info.id,
    transactionHash: props.transaction,
  })

  return (
    <Modal
      show={open}
      toggle={handleClose}
      className={"bg-slate-800"}
    >
      <div className='p-9'>
        <h3 className='text-3xl font-bold text-center mb-4'>Transaction Submitted</h3>
        <h5 className='text-center text-xl font-semibold mb-2'>Tx Hash</h5>
        <p className='bg-gamefiDark-400 text-white text-sm p-1 text-center mb-2 rounded font-semibold'>{props.transaction}</p>
        <div className='grid justify-center'>
          <a href={transactionLink} target="_blank" className={"block font-semibold bg-gamefiGreen-700 text-black p-2 rounded text-center w-fit hover:underline"}>
            View on {info.explorerName}
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(DialogTxSubmitted);