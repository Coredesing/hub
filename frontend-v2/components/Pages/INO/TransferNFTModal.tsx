import clsx from 'clsx';
import ButtonBase from 'components/Base/Buttons/ButtonBase';
import Modal from 'components/Base/Modal';
import styles from './TransferNFTModal.module.scss';

type Props = {
  open?: boolean;
  onClose?: () => any;
}

const TransferNFTModal = (props: Props) => {

  const onTransfer = () => {

  }

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Transfer your NFT</h3>
      <div className={clsx('mb-8', styles.formInput)}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Receive Address</label>
        <input type="text" className={`font-casual text-sm rounded-sm px-4 py-2 relative ${styles.input}`} />
        <span></span>
      </div>
      <div className='flex justify-end gap-8'>
        <button className='uppercase text-white/50 font-bold'>Cancel</button>
        <ButtonBase color='green' onClick={onTransfer} className={clsx("uppercase", styles.btnTransfer)}>
          TRansfer
        </ButtonBase>
      </div>
    </div>
  </Modal>;
};

export default TransferNFTModal;
