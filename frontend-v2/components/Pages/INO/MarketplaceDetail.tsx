import clsx from 'clsx';
import { ObjectType } from 'common/types';
import ButtonBase from 'components/Base/Buttons/ButtonBase';
import PoolDetail from 'components/Base/PoolDetail';
import { TabPanel, Tabs } from 'components/Base/Tabs';
import { useMyWeb3 } from 'components/web3/context';
import React, { useState } from 'react';
import { formatNumber, shortenAddress } from 'utils';
import BannerImagePool from './BannerImagePool';
import styles from './MarketplaceDetail.module.scss';
import SellNFTModal from './SellNFTModal';
import TransferNFTModal from './TransferNFTModal';
import WrapperPoolDetail from './WrapperPoolDetail';

type Props = {
  projectInfo: ObjectType;
  tokenInfo: ObjectType;
} & ObjectType;

const MarketplaceDetail = ({ tokenInfo, projectInfo }: Props) => {
  console.log('props', tokenInfo)
  console.log('props', projectInfo)
  const { account } = useMyWeb3()
  const [openTransferModal, setOpenTransferModal] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)

  const onChangeTab = (val: any) => {
    setCurrentTab(val)
  }

  return <WrapperPoolDetail>
    <TransferNFTModal open={openTransferModal} onClose={() => setOpenTransferModal(false)} />
    <SellNFTModal open />
    <PoolDetail
      bodyBannerContent={<BannerImagePool src={tokenInfo.image} />}
      bodyDetailContent={<>
        <h2 className="font-semibold text-4xl mb-2 uppercase"> {tokenInfo.title || tokenInfo.name || `#${formatNumber(tokenInfo.id, 3)}`}</h2>
        <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
        <div className='grid grid-cols-2 gap-3 mb-10'>
          <div className='flex gap-2 items-center'>
            <img src={projectInfo.logo} alt="" className='w-11 h-11 rounded-full bg-black' />
            <div>
              <label htmlFor="" className="block font-bold text-white/50 text-13px uppercase">Creator</label>
              <span className="block text-base font-casual">{projectInfo.name}</span>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <img src={projectInfo.logo} alt="" className='w-11 h-11 rounded-full bg-black' />
            <div>
              <label htmlFor="" className="block font-bold text-white/50 text-13px uppercase">Owner</label>
              <span className="block text-base font-casual">{shortenAddress(projectInfo.token_address, '.', 6)}</span>
            </div>
          </div>
        </div>
        <div className={clsx('px-5 py-4 mb-2', styles.box, styles.boxCPTopRight)}>
          <h3 className='text-center text-sm font-casual mb-4'>Sell the item at a fixed price or as an auction</h3>
          <div className='flex gap-2 justify-center'>
            <button className={clsx(styles.btnClipPathBottomLeft, styles.btn, styles.btnBordered, 'bg-black uppercase h-9 rounded-sm text-13px font-bold')}>
              Fixed Price
            </button>
            <button className={clsx(styles.btnClipPathTopRight, styles.btn, 'uppercase h-9 rounded-sm text-13px font-bold text-black bg-gamefiGreen-700')}>
              Auction
            </button>
          </div>
        </div>
        <div className={clsx('px-5 py-4', styles.box, styles.boxCPBottomLeft)}>
          <h3 className='text-center text-sm font-casual mb-4'>Or you can send the item to another wallet</h3>
          <div className='flex justify-center'>
            <button onClick={() => setOpenTransferModal(true)} className={clsx(styles.btnClipPathTopRightBottomLeft, styles.btn, styles.btnBordered, 'bg-black uppercase h-9 rounded-sm text-13px font-bold')}>
              Transfer
            </button>
          </div>
        </div>
      </>}
      footerContent={<>
        <Tabs
          titles={[
            'Information',
            'Attributes',
            'Offers',
            'Activities'
          ]}
          currentValue={currentTab}
          onChange={onChangeTab}
        />
        <div className='pt-8'>
          <TabPanel value={currentTab} index={0}>
            <div className='grid gap-2'>
              <div className='grid gap-2' style={{ gridTemplateColumns: '170px auto' }}>
                <label htmlFor="" className='font-bold text-sm font-casual'>Contract Address</label>
                <div className='font-casual text-sm text-gamefiGreen-700'>
                  {projectInfo.token_address}
                </div>
              </div>
              <div className='grid gap-2' style={{ gridTemplateColumns: '170px auto' }}>
                <label htmlFor="" className='font-bold text-sm font-casual'>Token ID</label>
                <div className='font-casual text-sm'>
                  #{formatNumber(tokenInfo.id, 3)}
                </div>
              </div>
              <div className='grid gap-2' style={{ gridTemplateColumns: '170px auto' }}>
                <label htmlFor="" className='font-bold text-sm font-casual'>Description</label>
                <div className='font-casual text-sm'>
                  {tokenInfo.description}
                </div>
              </div>
            </div>
          </TabPanel>
        </div>

      </>}
    />
  </WrapperPoolDetail>;
};

export default MarketplaceDetail;
