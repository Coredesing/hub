import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from 'components/Layout'
import clsx from "clsx";
import { getTimelineOfPool } from "utils/pool";
import { formatHumanReadableTime, isImageFile, isVideoFile, shortenAddress } from '@/utils/index'
import {
    APP_NETWORKS_SUPPORT,
} from "@/constants/network";
import useKyc from "@/hooks/useKyc";
import useTokenAllowance from "@/hooks/useTokenAllowance";
import useTokenApprove from "@/hooks/useTokenApprove";
import { HashLoader } from "react-spinners";
import { TokenType } from "common/types";
import { ButtonBase } from "@/components/Base/Buttons";
import CountDownTimeV1, { CountDownTimeType as CountDownTimeTypeV1 } from "@/components/Base/CountDownTime";
import Link from "next/link";
import { TIERS } from "@/constants";
import BigNumber from 'bignumber.js';
import { ObjectType } from "common/types";
import Erc20Abi from 'abi/Erc20.json';
import { getNetworkInfo } from "@/utils/network";
import AuctionBoxModal from "@/components/Pages/Auction/AuctionBoxModal";
import AuctionPoolAbi from '@/abi/AuctionPool.json';
import useAuctionBox from '@/hooks/useAuctionBox';
import { utils } from "ethers";
import { getSymbolCurrency } from "utils/wallet";
import { getContract } from "utils/web3";
import useContract from "@/hooks/useContract";
import isNumber from 'is-number'
import { useMyWeb3 } from "@/components/web3/context";
import { GetStaticProps } from "next";
import useGetPoolDetail from "@/hooks/useGetPoolDetail";
import { TabPanel, Tabs } from "@/components/Base/Tabs";
import { BulletListIcon, GridIcon, MediumIcon, TelegramIcon, TwitterIcon } from "components/Base/Icon";
import { useAppContext } from "@/context";
import { Table, TableCellHead, TableHead, TableRow, TableBody, TableCell } from "components/Base/Table";
import PoolDetail from "components/Base/PoolDetail";
import DialogTxSubmitted from "@/components/Base/DialogTxSubmitted";
import Pagination from "@/components/Base/Pagination";

const PageContent = ({ id, poolInfo, ...props }: any) => {
    const tiersState = useAppContext()?.tiers;
    const { account: connectedAccount, chainID, network, ...context } = useMyWeb3();
    const [currencyPool, setCurrencyPool] = useState<TokenType & ObjectType<any> | undefined>();
    const [lastBidder, setLastBidder] = useState<null | { wallet: string, amount: string, currency: string }>(null);
    const [resetLastBidder, setResetLastBidder] = useState(true);
    const [rateEachBid, setRateEachBid] = useState<string>('');
    const { contract: contractAuctionPool } = useContract(AuctionPoolAbi, poolInfo?.campaign_hash);
    const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' });
    const { checkingKyc, isKYC } = useKyc(connectedAccount, (isNumber(poolInfo?.kyc_bypass) && !poolInfo?.kyc_bypass));
    const [allowNetwork, setAllowNetwork] = useState<{ ok: boolean, [k: string]: any }>({ ok: false });
    const [boxTypeSelected, setSelectBoxType] = useState<{ [k: string]: any }>({});
    useEffect(() => {
        const networkInfo = APP_NETWORKS_SUPPORT[Number(chainID)];
        if (!networkInfo || !poolInfo?.network_available) {
            return;
        }
        const ok = String(networkInfo.shortName).toLowerCase() === (poolInfo.network_available || "").toLowerCase();
        if (!ok) {
            // dispatch(pushMessage(`Please switch to ${(poolInfo.network_available || '').toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy Mystery Box.`))
        } else {
            // dispatch(pushMessage(''));
        }
        setAllowNetwork(
            {
                ok,
                ...networkInfo,
            }
        );
    }, [poolInfo, chainID]);

    useEffect(() => {
        if (!connectedAccount) return;
        tiersState.actions.getUserTier(connectedAccount);
    }, [connectedAccount])

    const onSetCountdown = useCallback(() => {
        if (poolInfo) {
            const timeLine = getTimelineOfPool(poolInfo);
            if (timeLine.startBuyTime > Date.now()) {
                setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Auction Starts In', isUpcomingAuction: true });
            }
            else if (timeLine.finishTime > Date.now()) {
                setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Auction Ends In', isAuction: true });
            }
            else {
                setCountdown({ date1: 0, date2: 0, title: 'Auction Ended', isFinished: true });
            }
        }
    }, [poolInfo]);

    useEffect(() => {
        if (poolInfo) {
            onSetCountdown();
        }
    }, [poolInfo])

    useEffect(() => {
        if (poolInfo?.acceptedTokensConfig?.length) {
            const handleSetToken = async () => {
                try {
                    const infoToken = poolInfo.acceptedTokensConfig[0]
                    infoToken.neededApprove = !(new BigNumber(infoToken.address).isZero());
                    if (infoToken.neededApprove) {
                        const networkInfo = getNetworkInfo(poolInfo.network_available);
                        const erc20Contract = getContract(infoToken.address, Erc20Abi, { network: { chainId: networkInfo.id as any, name: networkInfo.name } });
                        const decimals = erc20Contract ? await erc20Contract.decimals() : null;
                        infoToken.decimals = decimals;
                    }
                    setCurrencyPool(infoToken);
                } catch (error) {
                    console.log('error', error)
                }
            }
            handleSetToken();
        }
    }, [poolInfo])

    useEffect(() => {
        if (contractAuctionPool && resetLastBidder) {
            const getLastBidder = async () => {
                try {
                    const result = await contractAuctionPool.lastBidder();
                    if (!new BigNumber(result.wallet).isZero()) {
                        setLastBidder({
                            wallet: result.wallet,
                            currency: result.token,
                            amount: utils.formatEther(result.amount),
                        })
                    }
                    setResetLastBidder(false);
                } catch (error) {

                }
            }
            getLastBidder();
        }
    }, [contractAuctionPool, resetLastBidder])


    useEffect(() => {
        if (contractAuctionPool) {
            contractAuctionPool.minBidIncrementPerMile().then((num: any) => {
                setRateEachBid(+(+num / 1000).toFixed(2) + '');
            })
        }
    }, [contractAuctionPool])

    // const [subBoxes, setSubBoxes] = useState<{ [k: string]: any }[]>([]);

    useEffect(() => {
        if (poolInfo && poolInfo.boxTypesConfig?.length) {
            const boxes = poolInfo.boxTypesConfig.map((b: any, subBoxId: number) => ({ ...b, subBoxId }));
            setSelectBoxType(boxes[0]);
            // setSubBoxes(boxes)
        }
    }, [poolInfo])

    const [openModalPlaceBidBox, setOpenModalPlaceBidBox] = useState(false);
    const [openModalTx, setOpenModalTx] = useState(false);
    const onShowModalPlaceBidBox = () => {
        setOpenModalPlaceBidBox(true);
    }
    const onCloseModalPlaceBidBox = useCallback(() => {
        setOpenModalPlaceBidBox(false);
    }, []);

    const { auctionBox, auctionLoading, auctionSuccess, auctionTxHash } = useAuctionBox({
        poolId: poolInfo.id,
        poolAddress: poolInfo.campaign_hash,
        currencyInfo: currencyPool,
        subBoxId: boxTypeSelected?.subBoxId as number,
    });

    useEffect(() => {
        if (auctionTxHash) {
            setOpenModalTx(true);
        }
    }, [auctionTxHash])
    useEffect(() => {
        if (auctionSuccess) {
            onCloseModalPlaceBidBox();
            setResetLastBidder(true);
            getTotalBidHistories();
        }
    }, [auctionSuccess]);

    const onPlaceBid = useCallback(async (numberBox: number, captcha: string) => {
        auctionBox(numberBox, captcha);
    }, [poolInfo, connectedAccount, currencyPool]);

    const renderMsg = () => {
        // if (!connectedAccount) return (<WrapperAlert>
        //     Please connect to wallet
        // </WrapperAlert>)
        // if (
        //     connectedAccount && poolInfo.min_tier > 0 && !loadingUserTier && isNumber(userTier) && (userTier < poolInfo.min_tier)
        // ) {
        //     return <WrapperAlert>
        //         <span>You haven't achieved min rank ({TIERS[poolInfo.min_tier]?.name}) to apply for Whitelist yet. To upgrade your Rank, please click <Link to="/account?tab=rank" className="text-weight-600 text-white link">here</Link></span></WrapperAlert>
        // }
    }

    const [isApproving, setIsApproving] = useState(false);

    const { retrieveTokenAllowance, tokenAllowanceLoading } = useTokenAllowance();

    const { approveToken /*tokenApproveLoading, transactionHash*/ } =
        useTokenApprove(
            currencyPool,
            connectedAccount,
            poolInfo.campaign_hash,
            false
        );
    const [isApprovedToken, setTokenApproved] = useState<boolean | undefined>(
        undefined
    );

    const handleTokenApprove = async () => {
        try {
            if (isApproving) return;
            setIsApproving(true);
            await approveToken();
            if (poolInfo.campaign_hash && connectedAccount && currencyPool) {
                const numAllowance = await retrieveTokenAllowance(
                    currencyPool,
                    connectedAccount,
                    poolInfo.campaign_hash
                );
                setTokenApproved(new BigNumber(numAllowance).gt(0));
                setIsApproving(false);
            }
        } catch (err) {
            console.log('err', err)
            setIsApproving(false);
        }
    };

    const getTokenAllowance = useCallback(async () => {
        if (poolInfo.campaign_hash && connectedAccount && currencyPool?.neededApprove) {
            const numAllowance = await retrieveTokenAllowance(
                currencyPool,
                connectedAccount,
                poolInfo.campaign_hash
            );
            setTokenApproved(new BigNumber(numAllowance).gt(0));
        }
    }, [
        connectedAccount,
        currencyPool,
        poolInfo.campaign_hash,
        retrieveTokenAllowance,
    ]);

    useEffect(() => {
        connectedAccount &&
            poolInfo.campaign_hash &&
            getTokenAllowance();
    }, [connectedAccount, poolInfo.campaign_hash, getTokenAllowance]);

    const perPageBidHistory = 10;
    const [filterBidHistory, setFilterBidHistory] = useState<{ from?: number, page?: number, perPage: number }>({ perPage: perPageBidHistory, page: 1 })
    const [bidHistores, setBidHistories] = useState<ObjectType<any>[]>([]);
    const [cachedSymbolCurrency, setCachedSymbolCurrency] = useState<ObjectType<string>>({});
    const [totalBidHistories, setTotalBidHistories] = useState(0);
    const [totalVolumeBid, setTotalTotalVolume] = useState('');
    const [loadingGetBidHistory, setLoadingBidHistory] = useState(false);
    useEffect(() => {
        if (totalBidHistories) {
            if (totalBidHistories <= perPageBidHistory) {
                setFilterBidHistory({ from: 0, page: 1, perPage: perPageBidHistory, })
            } else {
                setFilterBidHistory({ from: totalBidHistories - perPageBidHistory, page: 1, perPage: perPageBidHistory, })
            }
        }
    }, [totalBidHistories])
    const getListBidHistories = async () => {
        try {
            if (!filterBidHistory) return;
            setLoadingBidHistory(true);
            const result = await contractAuctionPool.bidHistory(filterBidHistory.from, filterBidHistory.perPage);
            const leng = result[0].length;
            const arr: ObjectType<any>[] = [];
            const keys = ['address', 'currency', 'amount', 'created_at'];
            for (let i = leng - 1; i >= 0; i--) {
                const obj: ObjectType<any> = {};
                for (const prop in result) {
                    obj[keys[prop as unknown as number]] = result[prop][i].toString();
                    if (+prop === 1) {
                        if (!cachedSymbolCurrency[obj.currency]) {
                            const networkInfo = getNetworkInfo(poolInfo.network_available);
                            try {
                                const symbol = await getSymbolCurrency(obj.currency, { appChainId: networkInfo.id, connectorName: networkInfo.name });
                                obj.symbol = symbol;
                                setCachedSymbolCurrency(s => ({ ...s, [obj.currency]: symbol }));
                            } catch (error) {
                            }
                        } else {
                            obj.symbol = cachedSymbolCurrency[obj.currency];
                        }
                    }
                }
                arr.push(obj);
            }
            setBidHistories(arr);
            setLoadingBidHistory(false);
        } catch (error) {
            console.log('error', error);
            setLoadingBidHistory(false);
        }
    }
    useEffect(() => {
        if (!contractAuctionPool || !poolInfo || !filterBidHistory.hasOwnProperty('from')) return;
        getListBidHistories()
    }, [contractAuctionPool, filterBidHistory, poolInfo])

    const getTotalBidHistories = async () => {
        try {
            const totalNumberBid = await contractAuctionPool.numberOfBid();
            setTotalBidHistories(+totalNumberBid)
            const totalVolume = await contractAuctionPool.totalBid();
            setTotalTotalVolume(utils.formatEther(totalVolume))
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        if (!contractAuctionPool || !poolInfo) return;
        getTotalBidHistories();
    }, [contractAuctionPool, poolInfo]);

    const onChangePageBidHistory = (page: number) => {
        if (filterBidHistory?.page === page) return;
        let from = totalBidHistories - (perPageBidHistory * page);
        let perPage = perPageBidHistory;
        if (from < 0) {
            perPage = perPage + from;
            from = 0;
        }
        setFilterBidHistory({ page, from, perPage });
    }
    const disabledBuyNow = !allowNetwork.ok || !isKYC || auctionLoading || !connectedAccount || tiersState?.state?.loading || !isNumber(tiersState?.state?.data?.tier) || (poolInfo?.min_tier > 0 && (tiersState?.state?.data?.tier < poolInfo.min_tier));
    const isShowBtnApprove = allowNetwork.ok && countdown?.isAuction && connectedAccount && !tokenAllowanceLoading && isApprovedToken !== undefined && !isApprovedToken && currencyPool?.neededApprove;
    const isShowBtnBuy = connectedAccount && !checkingKyc && countdown.isAuction && isApprovedToken;
    const getRules = (rule = "") => {
        if (typeof rule !== "string") return [];
        return rule.split("\n").filter((r) => r.trim());
    };
    const [currentTab, setCurrentTab] = useState(0);
    const onChangeTab = (val: any) => {
        setCurrentTab(val);
    }

    const showTypes = { table: 'table', grid: 'grid' };
    const [showTypeSerieContent, setShowTypeSerieContent] = useState<typeof showTypes[keyof typeof showTypes]>(showTypes.table);
    const onSelectShowSerieContent = (type: typeof showTypes[keyof typeof showTypes]) => {
        setShowTypeSerieContent(type);
    }
    return (
        <>
            <DialogTxSubmitted
                transaction={auctionTxHash}
                open={openModalTx}
                onClose={() => setOpenModalTx(false)}
                networkName={allowNetwork.shortName}
            />
            <AuctionBoxModal
                open={openModalPlaceBidBox}
                onClose={onCloseModalPlaceBidBox}
                onClick={onPlaceBid}
                poolInfo={poolInfo}
                token={currencyPool}
                auctionLoading={auctionLoading}
                lastBidder={lastBidder}
                rateEachBid={rateEachBid}
                currencyPool={currencyPool}
            />
            <PoolDetail
                bodyBannerContent={<>
                    {isImageFile(poolInfo.banner) && <img className="w-full h-full object-contain" src={poolInfo.banner} />}
                    {isVideoFile(poolInfo.banner) && <>
                        <div className="wrapperVideo">
                            <div className="uncontrol"></div>
                            <div className="onload">
                                <HashLoader loading={true} color={'#72F34B'} />
                            </div>
                            <div className="video">
                                <video
                                    preload="auto"
                                    autoPlay
                                    loop
                                    muted
                                >
                                    <source src={poolInfo.banner} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </>
                    }
                </>}
                bodyDetailContent={<>
                    <h2 className="font-semibold text-4xl mb-2 uppercase">{poolInfo.title || poolInfo.name}</h2>
                    <div className="creator flex items-center gap-1">
                        <img src={poolInfo.token_images} className="icon rounded-full w-5 -h-5" alt="" />
                        <span className="text-white/70 uppercase text-sm">{poolInfo.symbol}</span>
                    </div>
                    <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
                    <div>
                        <div className="flex gap-4 mb-8">
                            <div className="grid gap-2">
                                <span className="uppercase text-xs text-gray-300">SUPPORTED</span>
                                <div className="flex items-center gap-2">
                                    <img src={poolInfo.token_images} className="icon rounded-full w-4 -h-4" alt="" />
                                    <span className="uppercase font-semibold text-white text-base">{poolInfo.symbol}</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <span className="uppercase text-xs text-gray-300">Min Rank</span>
                                <div className="flex items-center gap-2">
                                    <img src={poolInfo.token_images} className="icon rounded-full w-4 -h-4" alt="" />
                                    <span className="uppercase font-semibold text-white text-base">{poolInfo.symbol}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            {
                                !lastBidder && <div className="grid gap-1">
                                    <span className="font-semibold text-white text-base uppercase">starting price</span>
                                    <div className="flex items-center gap-2">
                                        {(currencyPool?.icon || currencyPool?.name) && <img src={currencyPool?.icon || `/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} className="icon rounded-full w-5 -h-5" alt="" />}
                                        <span className="uppercase font-bold text-white text-2xl">{+currencyPool?.price || ''} {currencyPool?.name}</span>
                                    </div>
                                </div>
                            }

                            {
                                lastBidder && <div className="grid gap-1">
                                    <span className="font-semibold text-white text-base uppercase">Highest Bid</span>
                                    <div className="flex items-center gap-2">
                                        {(currencyPool?.icon || currencyPool?.name) && <img src={currencyPool?.icon || `/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} className="icon rounded-full w-5 -h-5" alt="" />}
                                        <span className="uppercase font-bold text-white text-2xl">{+lastBidder?.amount || ''} {currencyPool?.name}</span>
                                    </div>
                                </div>
                            }

                        </div>
                        <div>
                            <div className="mt-10">
                                {!countdown.isFinished && countdown.date1 && countdown.date2 &&
                                    <CountDownTimeV1 time={countdown} onFinish={onSetCountdown} title={countdown.title} />}
                            </div>
                            {
                                isShowBtnApprove &&
                                <ButtonBase
                                    color="green"
                                    isLoading={isApproving}
                                    disabled={isApproving}
                                    onClick={handleTokenApprove}
                                    className={clsx("w-full mt-4")}
                                >
                                    Approve
                                </ButtonBase>
                            }
                            {
                                isShowBtnBuy &&
                                <ButtonBase
                                    color="green"
                                    isLoading={auctionLoading}
                                    disabled={disabledBuyNow}
                                    onClick={onShowModalPlaceBidBox}
                                    className={clsx("w-full mt-4")}>
                                    Place a Bid
                                </ButtonBase>
                            }
                            {
                                countdown.isFinished &&
                                <ButtonBase
                                    color="grey"
                                    className={clsx("w-full mt-4")}>
                                    Auction End
                                </ButtonBase>
                            }
                        </div>

                    </div>
                </>}
                footerContent={<>
                    <Tabs
                        titles={[
                            'Rule Introduction',
                            'Box Infomation',
                            'Series Content',
                            'Bid History',
                        ]}
                        currentValue={currentTab}
                        onChange={onChangeTab}
                    />
                    <div className="mt-6 mb-10">
                        <TabPanel value={currentTab} index={0}>
                            <div className="desc mb-6">
                                <ul className={"grid gap-2 font-casual text-sm"}>
                                    {getRules(poolInfo.rule).map((rule, idx) => (
                                        <li key={idx}>
                                            {idx + 1}. {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={"grid gap-4"}>
                                <div className="item-group flex gap-10 items-center font-casual  text-sm">
                                    <label className="text-white" htmlFor="">Website</label>
                                    <div className="flex">
                                        <a href="https://gamefi.org" target={"_blank"} className="flex gap-1 bg-white/10 rounded px-2 py-1 text-white">
                                            gamefi.org
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#6CDB00" />
                                                <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#6CDB00" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="item-group flex gap-10 items-center font-casual text-sm">
                                    <label className="text-white" htmlFor="">Social</label>
                                    <div className="flex gap-2">
                                        <a href=""><TelegramIcon /></a>
                                        <a href=""><TwitterIcon /></a>
                                        <a href=""><MediumIcon color="white" /></a>
                                    </div>
                                </div>
                                <a href="" className="flex gap-1 items-center text-gamefiGreen-700 font-semibold bg-white/10 rounded px-3 py-2 w-fit text-sm font-casual">
                                    Full Research
                                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <mask id="path-1-inside-1_1201_9307" fill="white">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" />
                                        </mask>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" fill="#6CDB00" />
                                        <path d="M0.191283 0.200811L1.09646 1.06288L1.09646 1.06287L0.191283 0.200811ZM1.1147 0.200811L2.01988 -0.661254L2.01988 -0.661254L1.1147 0.200811ZM0.191283 1.17041L-0.713894 2.03247L0.191283 1.17041ZM3.42281 4.56355L4.32799 5.42561L5.14899 4.56355L4.32799 3.70148L3.42281 4.56355ZM0.191246 7.95672L1.09642 8.81879L0.191246 7.95672ZM0.191246 8.92632L-0.713933 9.78838L-0.71393 9.78839L0.191246 8.92632ZM1.11466 8.92632L2.01984 9.78838H2.01984L1.11466 8.92632ZM4.78775 5.06953L3.92051 4.16932L3.90113 4.18799L3.88258 4.20747L4.78775 5.06953ZM4.80837 5.0488L3.90319 4.18673L3.90316 4.18676L4.80837 5.0488ZM4.99888 4.53152L3.75007 4.58608L3.75014 4.58758L4.99888 4.53152ZM4.80833 4.07833L3.90314 4.94039L3.90315 4.9404L4.80833 4.07833ZM4.78867 4.05852L3.88349 4.92058L3.90119 4.93916L3.91963 4.957L4.78867 4.05852ZM4.19128 0.200811L5.09646 1.06288L5.09646 1.06287L4.19128 0.200811ZM5.1147 0.200811L6.01988 -0.661254V-0.661254L5.1147 0.200811ZM4.19128 1.17041L3.28611 2.03247L4.19128 1.17041ZM7.42281 4.56355L8.32798 5.42561L9.14899 4.56355L8.32798 3.70148L7.42281 4.56355ZM4.19125 7.95672L3.28607 7.09466L3.28607 7.09466L4.19125 7.95672ZM4.19125 8.92632L3.28607 9.78838L3.28607 9.78839L4.19125 8.92632ZM5.11466 8.92632L4.20949 8.06425L4.20948 8.06426L5.11466 8.92632ZM8.78775 5.06953L7.92051 4.16932L7.90113 4.18799L7.88258 4.20747L8.78775 5.06953ZM8.80837 5.0488L7.90319 4.18674L7.90316 4.18676L8.80837 5.0488ZM8.99888 4.53152L7.75007 4.58608L7.75014 4.58758L8.99888 4.53152ZM8.80833 4.07833L9.71351 3.21627L9.71345 3.21621L8.80833 4.07833ZM8.78867 4.05852L7.88349 4.92058L7.9012 4.93918L7.91966 4.95703L8.78867 4.05852ZM1.09646 1.06287C0.858842 1.31238 0.447138 1.31237 0.209523 1.06287L2.01988 -0.661254C1.27227 -1.44625 0.0337131 -1.44625 -0.713895 -0.661252L1.09646 1.06287ZM1.09646 0.308344C1.30123 0.523354 1.30123 0.847864 1.09646 1.06288L-0.713893 -0.661254C-1.42865 0.0892511 -1.42865 1.28197 -0.713894 2.03247L1.09646 0.308344ZM4.32799 3.70148L1.09646 0.308344L-0.713894 2.03247L2.51763 5.42561L4.32799 3.70148ZM1.09642 8.81879L4.32799 5.42561L2.51763 3.70148L-0.713931 7.09466L1.09642 8.81879ZM1.09642 8.06426C1.30119 8.27927 1.30119 8.60378 1.09642 8.81879L-0.713931 7.09466C-1.42869 7.84516 -1.42869 9.03788 -0.713933 9.78838L1.09642 8.06426ZM0.209486 8.06425C0.447101 7.81476 0.858803 7.81475 1.09642 8.06425L-0.71393 9.78839C0.033678 10.5734 1.27224 10.5734 2.01984 9.78838L0.209486 8.06425ZM3.88258 4.20747L0.209485 8.06425L2.01984 9.78838L5.69293 5.9316L3.88258 4.20747ZM3.90316 4.18676C3.90877 4.18087 3.91456 4.17505 3.92051 4.16932L5.655 5.96975C5.67491 5.95057 5.69443 5.93093 5.71357 5.91084L3.90316 4.18676ZM3.75014 4.58758C3.74429 4.45721 3.78802 4.30766 3.90319 4.18673L5.71354 5.91086C6.09945 5.50566 6.27019 4.97807 6.24762 4.47545L3.75014 4.58758ZM3.90315 4.9404C3.80132 4.83347 3.7552 4.70331 3.75007 4.58608L6.24769 4.47695C6.22817 4.03016 6.05501 3.57485 5.7135 3.21627L3.90315 4.9404ZM3.91963 4.957C3.91398 4.95153 3.90848 4.94599 3.90314 4.94039L5.71351 3.21628C5.69527 3.19712 5.67666 3.17837 5.65771 3.16004L3.91963 4.957ZM0.209523 1.06287L3.88349 4.92058L5.69385 3.19646L2.01988 -0.661254L0.209523 1.06287ZM5.09646 1.06287C4.85884 1.31238 4.44714 1.31237 4.20952 1.06287L6.01988 -0.661254C5.27227 -1.44625 4.03371 -1.44625 3.2861 -0.661252L5.09646 1.06287ZM5.09646 0.308344C5.30123 0.523353 5.30123 0.847864 5.09646 1.06288L3.28611 -0.661255C2.57135 0.0892513 2.57135 1.28197 3.28611 2.03247L5.09646 0.308344ZM8.32798 3.70148L5.09646 0.308344L3.28611 2.03247L6.51763 5.42561L8.32798 3.70148ZM5.09642 8.81879L8.32798 5.42561L6.51763 3.70148L3.28607 7.09466L5.09642 8.81879ZM5.09642 8.06426C5.30119 8.27927 5.30119 8.60378 5.09642 8.81879L3.28607 7.09466C2.57131 7.84516 2.57131 9.03788 3.28607 9.78838L5.09642 8.06426ZM4.20948 8.06426C4.4471 7.81475 4.8588 7.81475 5.09642 8.06425L3.28607 9.78839C4.03368 10.5734 5.27224 10.5734 6.01984 9.78838L4.20948 8.06426ZM7.88258 4.20747L4.20949 8.06425L6.01984 9.78838L9.69293 5.9316L7.88258 4.20747ZM7.90316 4.18676C7.90877 4.18087 7.91456 4.17505 7.92051 4.16932L9.655 5.96975C9.67491 5.95057 9.69443 5.93093 9.71357 5.91084L7.90316 4.18676ZM7.75014 4.58758C7.74429 4.45721 7.78802 4.30766 7.90319 4.18674L9.71354 5.91086C10.0994 5.50566 10.2702 4.97808 10.2476 4.47545L7.75014 4.58758ZM7.90315 4.94039C7.80132 4.83347 7.7552 4.70331 7.75007 4.58608L10.2477 4.47695C10.2282 4.03016 10.055 3.57486 9.71351 3.21627L7.90315 4.94039ZM7.91966 4.95703C7.91397 4.95152 7.90848 4.94599 7.90321 4.94045L9.71345 3.21621C9.69527 3.19712 9.67668 3.17838 9.65768 3.16001L7.91966 4.95703ZM4.20952 1.06287L7.88349 4.92058L9.69385 3.19646L6.01988 -0.661254L4.20952 1.06287Z" fill="#6CDB00" mask="url(#path-1-inside-1_1201_9307)" />
                                    </svg>
                                </a>
                            </div>
                        </TabPanel>
                        <TabPanel value={currentTab} index={1}>

                        </TabPanel>
                        <TabPanel value={currentTab} index={2}>
                            <div className="relative">
                                <div className="view-mode flex gap-5" style={{ position: 'absolute', right: '15px', top: '18px' }}>
                                    <span>View</span>
                                    <span className="cursor-pointer">
                                        <BulletListIcon color={showTypeSerieContent === showTypes.table ? "#6CDB00" : "#6C6D71"} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.table)} />
                                    </span>
                                    <span className="cursor-pointer">
                                        <GridIcon color={showTypeSerieContent === showTypes.grid ? "#6CDB00" : "#6C6D71"} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.grid)} />
                                    </span>
                                </div>
                                <div className="mb-3">
                                    {showTypeSerieContent === showTypes.table &&
                                        <Table >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCellHead>
                                                        Name
                                                    </TableCellHead>
                                                    <TableCellHead>
                                                        Amount
                                                    </TableCellHead>
                                                    <TableCellHead>
                                                        Rarity
                                                    </TableCellHead>
                                                    <TableCellHead>
                                                        Description
                                                    </TableCellHead>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    poolInfo.seriesContentConfig.map((b, id) => <TableRow key={id}>
                                                        <TableCell>
                                                            <div className="flex gap-3 items-center uppercase text-sm font-semibold">
                                                                <img src={b.icon} alt="" className="w-12 h-14" />
                                                                <span>{b.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {b.amount}
                                                        </TableCell>
                                                        <TableCell>
                                                            {b.rate}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <span
                                                                    className="break-words break-all text-ellipsis overflow-hidden text-sm"
                                                                    style={{
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                    }}>
                                                                    {b.description} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy ...
                                                                </span>
                                                                <span
                                                                    className="text-gamefiGreen font-casual font-semibold ml-1 cursor-pointer text-sm"
                                                                >
                                                                    Read more
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>)
                                                }
                                            </TableBody>
                                        </Table>
                                    }
                                    {
                                        showTypeSerieContent === showTypes.grid && 
                                        <div className="grid gap-2 justify-center" style={{paddingTop: '55px', gridTemplateColumns: 'repeat(auto-fill, 260px)'}}>
                                            {poolInfo.seriesContentConfig.map((p, id) => (<div key={id} className=" bg-gamefiDark-400" style={{minHeight: '500px', background: '#23252B'}}>
                                                <div className="w-full h-56 p-2">
                                                    <img src={p.banner} alt="" className="w-full h-full object-contain"/>
                                                </div>
                                            </div>))}
                                        </div>
                                    }
                                </div>
                            </div>

                        </TabPanel>
                        <TabPanel value={currentTab} index={3}>
                            <div className="w-full flex gap-20 mb-8" >
                                <div>
                                    <span className="block uppercase font-light text-base mb-1">AUCTION ENTRIES</span>
                                    <h3 className="font-bold text-3xl">{totalBidHistories}</h3>
                                </div>
                                <div>
                                    <span className="block uppercase font-light text-base mb-1">TOTAL VOLUME</span>
                                    <h3 className="font-bold text-3xl">{totalVolumeBid} {currencyPool?.name}</h3>
                                </div>
                            </div>
                            <Table className="mb-3">
                                <TableHead>
                                    <TableRow>
                                        <TableCellHead>
                                            BID Activities
                                        </TableCellHead>
                                        <TableCellHead>
                                            Price
                                        </TableCellHead>
                                        <TableCellHead>
                                            Date
                                        </TableCellHead>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        bidHistores.map((b, id) => <TableRow key={id}>
                                            <TableCell>
                                                <span className="font-semibold text-sm">
                                                    {shortenAddress(b.address, '*', 6)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {utils.formatEther(b.amount)} {b.symbol}
                                            </TableCell>
                                            <TableCell>
                                                {formatHumanReadableTime(+b.created_at * 1000, Date.now())}
                                            </TableCell>
                                        </TableRow>)
                                    }
                                </TableBody>
                            </Table>
                            <Pagination
                                totalPage={Math.ceil(totalBidHistories / perPageBidHistory)}
                                currentPage={filterBidHistory.page}
                                onChange={onChangePageBidHistory}
                            />

                        </TabPanel>
                    </div>
                </>}
            />
        </>
    );
}

const AuctionBox = (props: any) => {
    const { params } = props;
    const { loading, poolInfo } = useGetPoolDetail({ id: params?.id });

    return <Layout title="GameFi Aggregator">
        {
            loading ? <h1 className="text-white">Loading...</h1> : (
                !poolInfo ?
                    <h1 className="text-white">Page not found</h1> :
                    <PageContent poolInfo={poolInfo} />
            )
        }
    </Layout>
}

export default AuctionBox;

export async function getStaticPaths() {
    return {
        paths: [
            { params: { id: '' } },
        ],
        fallback: true,
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    try {
        return {
            props: { params: context.params }
        }
    } catch (error) {
        return { props: {} }
    }

}