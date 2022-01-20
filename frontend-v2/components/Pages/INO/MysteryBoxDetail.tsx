import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { HashLoader } from 'react-spinners'
import PoolDetail from 'components/Base/PoolDetail'
import { isImageFile, isVideoFile } from '@/utils/index'
import clsx from 'clsx';
import styles from './MysteryBoxDetail.module.scss'
import { ButtonBase } from 'components/Base/Buttons'
import CountDownTimeV1 from 'components/Base/CountDownTime'
import { TabPanel, Tabs } from 'components/Base/Tabs'
import PresaleBoxAbi from '@/components/web3/abis/PreSaleBox.json';
import { Contract, BigNumber } from 'ethers'
import { ObjectType } from '@/common/types'
import TokenItem from './TokenItem'
import BoxTypeItem from './BoxTypeItem'
import DetailPoolItem from './DetailPoolItem'
import RuleIntroduce from './RuleIntroduce'
import SerieContent from './SerieContent'
import { useMyWeb3 } from 'components/web3/context'
import axios from '@/utils/axios';
import { useCheckJoinPool, useJoinPool } from '@/hooks/useJoinPool'
import Alert from 'components/Base/Alert'
import { TIERS } from '@/constants';
import InfoBoxOrderItem from './InfoBoxOrderItem';
import BannerImagePool from './BannerImagePool';
import AscDescAmount from './AscDescAmount';

const MysteryBoxDetail = ({ poolInfo }: any) => {
    const eventId = 0;
    const { account } = useMyWeb3();
    const [boxTypes, setBoxTypes] = useState<any[]>([]);
    const [boxSelected, setBoxSelected] = useState<ObjectType>({});
    const [currencySelected, setCurrencySelected] = useState<ObjectType>({});
    const [myBoxOrdered, setMyBoxOrdered] = useState(0);
    const [currentTab, setCurrentTab] = useState(0)
    const listTokens = useMemo(() => {
        const arr = poolInfo.acceptedTokensConfig || [];
        setCurrencySelected(arr[0] || {});
        return arr;
    }, [poolInfo])

    useEffect(() => {
        const boxes = poolInfo.boxTypesConfig || [];
        if (poolInfo.campaign_hash) {
            const contractPresale = new Contract(poolInfo.campaign_hash, PresaleBoxAbi);
            Promise.
                all(boxes.map((b, subBoxId) => new Promise(async (res, rej) => {
                    try {
                        const response = await contractPresale.subBoxes(eventId, subBoxId);
                        const result = {
                            maxSupply: response.maxSupply || 0,
                            totalSold: response.totalSold || 0,
                        }
                        res({ ...b, subBoxId, ...result });
                    } catch (error) {
                        rej(error)
                    }
                })))
                .then((boxes) => {
                    setBoxTypes(boxes);
                    setBoxSelected(boxes[0])
                })
                .catch(err => {
                    console.log('err', err)
                })
        } else {
            setBoxTypes(boxes);
            setBoxSelected(boxes[0])
        }
    }, [poolInfo]);

    const onSelectCurrency = (t: ObjectType) => {
        if (t.address === currencySelected.address) return;
        setCurrencySelected(t);
    }

    const onSelectBoxType = (b: ObjectType) => {
        if (b.id === boxSelected.id) return;
        setBoxSelected(b);
    }

    const onChangeTab = (val: any) => {
        setCurrentTab(val)
    }

    const getBoxOrderd = useCallback(async () => {
        if (!account) {
            setMyBoxOrdered(0);
            return
        }
        try {
            const res = await axios.get(`/pool/${poolInfo?.id}/nft-order?wallet_address=${account}`);
            const amount = res.data.data?.amount;
            setMyBoxOrdered(amount);
        } catch (error) {
            console.log('error', error)
        }
    }, [account, poolInfo])

    useEffect(() => {
        getBoxOrderd();
    }, [getBoxOrderd]);
    const { isJoinPool, loading: loadingCheckJPool } = useCheckJoinPool(poolInfo?.id, account);
    const { joinPool, loading: loadingJPool, success: isJoinSuccess } = useJoinPool(poolInfo?.id, account);

    return (
        <>
            {/* <DialogTxSubmitted
                transaction={auctionTxHash}
                open={openModalTx}
                onClose={() => setOpenModalTx(false)}
                networkName={allowNetwork.shortName}
            />
            */}

            <div className={clsx('rounded mb-5', styles.headPool)}>
                <Alert className='mb-10'>
                    Congratulations! You have successfully applied whitelist and can buy Mystery boxes from <b>Phase 1</b>
                </Alert>
                <div className={'grid grid-cols-2'}>
                    <div className={clsx('flex', styles.headInfoBoxOrder)}>
                        <InfoBoxOrderItem label='Registered Users' value={poolInfo.totalOrder || 0} />
                        <InfoBoxOrderItem label='Ordered Boxes' value={poolInfo.totalRegistered || 0} />
                        <InfoBoxOrderItem label='Your Ordered' value={myBoxOrdered} />
                    </div>
                    <div className={clsx('bg-black flex justify-center items-center gap-2', styles.headCountdown)} >
                        <div className={clsx('font-bold text-sm uppercase', styles.titleCountdown)}>
                            Whitelist opens in
                        </div>
                        <div className={clsx(styles.countdown)} >
                            <CountDownTimeV1 time={{ date1: Date.now(), date2: Date.now() + 10 * 5000 }} className="bg-transparent" background='bg-transparent' />
                        </div>
                    </div>
                </div>

            </div>
            <PoolDetail
                bodyBannerContent={<BannerImagePool src={poolInfo.banner} />}
                bodyDetailContent={<>
                    <h2 className="font-semibold text-4xl mb-2 uppercase">{poolInfo.title || poolInfo.name}</h2>
                    <div className="creator flex items-center gap-1">
                        <img src={poolInfo.token_images} className="icon rounded-full w-5 -h-5" alt="" />
                        <span className="text-white/70 uppercase text-sm">{poolInfo.symbol}</span>
                    </div>
                    <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
                    <div className='mb-4'>
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <img src={currencySelected?.icon} className="icon rounded-full w-5 -h-5" alt="" />
                                <span className="uppercase font-bold text-white text-2xl">{Number(currencySelected?.price) || ''} {currencySelected?.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6 mb-8">
                        <DetailPoolItem label='TOTAL SALE' value='5,000 Boxes' />
                        <DetailPoolItem label='SUPPORTED'
                            icon={require(`assets/images/icons/${poolInfo.network_available}.svg`)}
                            value={poolInfo.network_available} />
                        <DetailPoolItem label='Min Rank'
                            value={poolInfo.min_tier > 0 ? TIERS[poolInfo.min_tier].name : 'No Required'} />
                    </div>
                    <div className='mb-8'>
                        <div> <h4 className='font-bold text-base mb-1 uppercase'>Currency</h4> </div>
                        <div className='flex gap-1'>
                            {listTokens.map((t) => <TokenItem key={t.address} item={t} onClick={onSelectCurrency} selected={currencySelected?.address === t.address} />)}
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div> <h4 className='font-bold text-base mb-1 uppercase'>Type</h4></div>
                        <div className='flex gap-2'>
                            {boxTypes.map((b) => <BoxTypeItem key={b.id} item={b} onClick={onSelectBoxType} selected={boxSelected.id === b.id} />)}
                        </div>
                    </div>
                    <div className='mb-8'>
                        <AscDescAmount />
                    </div>
                    <div>
                        <ButtonBase
                            color={(isJoinPool || isJoinSuccess) ? 'blue' : 'green'}
                            isLoading={loadingJPool || loadingCheckJPool}
                            disabled={isJoinPool || isJoinSuccess || loadingCheckJPool || loadingJPool}
                            onClick={joinPool}
                            className={clsx('w-full mt-4 uppercase clipped-t-r ')}>
                            {
                                (isJoinPool || isJoinSuccess) ? 'Applied Whitelist' : 'Apply Whitelist'
                            }
                        </ButtonBase>
                    </div>
                </>}
                footerContent={<>
                    <Tabs
                        titles={[
                            'Rule Introduction',
                            'Box Infomation',
                            'Series Content',
                        ]}
                        currentValue={currentTab}
                        onChange={onChangeTab}
                    />
                    <div className="mt-6 mb-10">
                        <TabPanel value={currentTab} index={0}>
                            <RuleIntroduce poolInfo={poolInfo} />
                        </TabPanel>
                        <TabPanel value={currentTab} index={1}>

                        </TabPanel>
                        <TabPanel value={currentTab} index={2}>
                            <SerieContent poolInfo={poolInfo} />
                        </TabPanel>
                    </div>
                </>}
            />
        </>
    )
}

export default MysteryBoxDetail