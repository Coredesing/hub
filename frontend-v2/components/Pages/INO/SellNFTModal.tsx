import clsx from 'clsx';
import ButtonBase from 'components/Base/Buttons/ButtonBase';
import Dropdown from 'components/Base/Dropdown';
import Modal from 'components/Base/Modal';
import styles from './SellNFTModal.module.scss';
import martketStyles from './MarketplaceDetail.module.scss';
import Input from 'components/Base/Input';

type Props = {
  open?: boolean;
  onClose?: () => any;
}

const SellNFTModal = (props: Props) => {

  const onTransfer = () => {

  }

  const tags = ['Category a', 'Category b', 'category c'];

  return <Modal show={props.open} toggle={props.onClose}>
    <div className={styles.content}>
      <h3 className='font-bold text-2xl mb-7 uppercase'>Sell Your NFT</h3>
      <div className={clsx('mb-8 flex items-center gap-3 justify-between')}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Select Sell Method</label>
        <div className='flex gap-2 justify-end'>
          <button className={clsx(martketStyles.btn, martketStyles.btnClipPathBottomLeft, 'bg-black text-13px font-bold text-white/50')}>
            Auction
          </button>
          <button className={clsx(martketStyles.btn, martketStyles.btnClipPathTopRight, 'bg-gamefiGreen-700 text-13px font-bold text-black')}>
            Fixed Price
          </button>
        </div>
      </div>
      <div className={clsx('mb-8 flex items-center gap-3 justify-between')}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Total Price</label>
        <div className='flex gap-2'>
          <Input classes={{ input: "font-casual text-sm rounded-sm px-4 py-2", formInput: 'w-40' }} />
          <Dropdown items={[{ value: 'BNB', key: 'BNB', label: 'BNB' }]} />
        </div>
      </div>
      <div className={'mb-8 flex justify-between'}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Fee</label>
        <div className='grid gap-1 justify-end'>
          <span className='block text-right text-base font-medium font-casual'>0.5 BNB</span>
          <span className='block text-right font-casual text-white/50 text-xs'>1% of the total sale will be paid to GameFi as a Platform fee.</span>
        </div>
      </div>
      <div className={clsx('mb-8 flex gap-3 justify-between items-center', styles.formInput)}>
        <label htmlFor="" className='text-sm block mb-2 font-casual'>Expiration Date</label>
        <div>
          <Input classes={{ input: "font-casual text-sm rounded-sm px-4 py-2", formInput: 'w-92' }} placeholder="Not more than 30 days" />
        </div>
      </div>
      <div className="divider bg-white/20 w-full mt-8 mb-4" style={{ height: '1px' }}></div>
      <div>
        <label htmlFor="" className='block font-bold text-lg mb-4'>Choose Categogy (3/3)</label>
        <div className={clsx('flex gap-2 bg-white/10 flex-wrap rounded-sm border border-white/25 p-1 items-center', styles.tagsBox)}>
          {
            tags.map((t) => <span key={t} className={clsx('flex items-center px-2 py-1 bg-white/25 rounded-sm font-casual', styles.tag)}>
              <label htmlFor="">Shoot</label>
              <span className='cursor-pointer ml-2'>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0.5L0.5 7.5" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M0.5 0.5L7.5 7.5" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </span>)
          }
        </div>
      </div>
      <div className="divider bg-white/20 w-full my-4" style={{ height: '1px' }}></div>
      <div className='mb-8'>
        <label htmlFor="" className='block font-bold text-lg mb-4'>Description</label>
        <div className={clsx('w-full h-24 bg-slate-600 rounded-sm', styles.descBox)}></div>
      </div>
      <div className='flex justify-end gap-8'>
        <ButtonBase color='green' onClick={onTransfer} className={clsx("uppercase", styles.btnSubmit)}>
          Submit
        </ButtonBase>
      </div>
    </div>
  </Modal>;
};

export default SellNFTModal;
